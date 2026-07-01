import { useMemo, useState } from 'react'
import { CaretLeft, FileArrowDown } from '@phosphor-icons/react'
import { useSharedProject } from '../collaboration/mockProjectStore'
import { BoqHistoryDetailBody, BoqHistoryList } from '../boq/BoqHistoryViews'
import { BoqParticularList, BoqQuestionThread, BoqRoomListSection } from '../boq/BoqRoomSections'
import { formatBoqHistoryDate } from '../boq/boqHistoryUtils'
import { buildBoqRoomSummaries, boqStatusLabels, formatRupees, getBoqItemAmount } from '../boq/boqUtils'

function Header({ title, subtitle, onBack }) {
  return (
    <header className="fixed left-1/2 top-0 z-[90] w-full max-w-[390px] -translate-x-1/2 border-b border-[#e0e0e0] bg-[rgba(255,255,255,0.72)] backdrop-blur-[16px]">
      <div className="px-4 py-3">
        <div className="flex items-center justify-between py-1">
          <button type="button" onClick={onBack} className="flex min-w-0 items-center gap-4">
            <span className="grid size-6 shrink-0 place-items-center rounded">
              <CaretLeft size={24} />
            </span>
            <span className="min-w-0 text-left">
              <span className="typo-section-title block truncate text-black">{title}</span>
              <span className="typo-caption block truncate text-[#999999]">{subtitle}</span>
            </span>
          </button>
          <button type="button" className="grid size-8 place-items-center rounded-xl border border-[#dbe6df] bg-white text-black">
            <FileArrowDown size={15} />
          </button>
        </div>
      </div>
    </header>
  )
}

function HomeownerBoqWorkspace({ onBack }) {
  const { project, boqItems, boqMeta, boqRooms, actions } = useSharedProject('p-1')
  const [screen, setScreen] = useState('home')
  const [selectedRoomId, setSelectedRoomId] = useState(null)
  const [selectedItemId, setSelectedItemId] = useState(null)
  const [selectedHistoryId, setSelectedHistoryId] = useState(null)
  const [questionDraft, setQuestionDraft] = useState('')

  const subtotal = useMemo(() => boqItems.reduce((sum, item) => sum + getBoqItemAmount(item), 0), [boqItems])
  const gst = boqMeta.gstEnabled ? Math.round(subtotal * 0.18) : 0
  const grandTotal = subtotal + gst
  const roomSummaries = useMemo(() => buildBoqRoomSummaries(boqRooms, boqItems), [boqRooms, boqItems])
  const selectedRoom = roomSummaries.find((room) => room.id === selectedRoomId) || null
  const selectedItem = boqItems.find((item) => item.id === selectedItemId) || null
  const roomItems = selectedRoom
    ? boqItems.filter((item) => item.roomId === selectedRoom.id || item.space === selectedRoom.name)
    : []
  const openQuestionCount = boqItems.reduce((count, item) => count + (item.clientQuestions || []).filter((question) => question.status !== 'resolved').length, 0)
  const historyEntries = boqMeta.history || []
  const previousSignedEntries = boqMeta.status === 'approved'
    ? historyEntries.filter((entry) => entry.version !== boqMeta.version)
    : historyEntries
  const selectedHistory = historyEntries.find((entry) => entry.id === selectedHistoryId) || null

  const openRoom = (room) => {
    setSelectedRoomId(room.id)
    setSelectedItemId(null)
    setScreen('room')
  }

  const openItem = (item) => {
    setSelectedRoomId(item.roomId)
    setSelectedItemId(item.id)
    setQuestionDraft('')
    setScreen('item')
  }

  const renderHome = (title) => (
    <section className="mx-auto w-full max-w-[390px] pb-[144px] pt-[56px]">
      <Header title={title} subtitle={`${project.name} / ${project.designerName}`} onBack={onBack} />
      <div className="px-4 py-5">
        <div className="border-b border-[#ececec] pb-4">
          <p className="typo-caption uppercase text-[#5f7467]">{boqStatusLabels[boqMeta.status] || 'For approval'}</p>
          <p className="typo-page-title mt-2 text-black">{formatRupees(grandTotal)}</p>
          <p className="typo-body mt-2 text-[#5f7467]">Open any room BOQ, inspect the particulars inside it, and add remarks on the specific particulars you want reviewed.</p>
        </div>

        {boqMeta.status === 'revised' ? (
          <div className="border-b border-[#ececec] py-4">
            <p className="typo-section-title text-black">Updated after your remarks</p>
            <p className="typo-body mt-2 text-[#5f7467]">The professional has revised the quotation. Revisit the room BOQs and approve if it looks right.</p>
          </div>
        ) : null}

        {openQuestionCount ? (
          <div className="border-b border-[#ececec] py-4">
            <p className="typo-section-title text-black">Marked rooms</p>
            <p className="typo-body mt-2 text-[#a86a00]">{openQuestionCount} open remarks are already attached to disputed particulars. Those rooms are highlighted below.</p>
          </div>
        ) : null}

        <BoqRoomListSection title="Room BOQs" rooms={boqRooms} items={boqItems} onOpenRoom={openRoom} emphasis="attention" />
        <BoqHistoryList title="Previously signed BOQs" entries={previousSignedEntries} onOpen={(entry) => setSelectedHistoryId(entry.id)} />
      </div>

      <div className="fixed bottom-0 left-1/2 z-[95] w-full max-w-[390px] -translate-x-1/2 border-t border-[#e0e0e0] bg-white px-4 pb-5 pt-3">
        <button type="button" onClick={() => actions.approveBoqQuotation()} className="typo-body-strong h-11 w-full rounded-full bg-black text-white">
          {boqMeta.status === 'revised' ? 'Approve revised quotation' : 'Approve quotation'}
        </button>
        <button
          type="button"
          onClick={() => actions.requestBoqChangesFromQuestions()}
          disabled={!openQuestionCount}
          className="typo-body-strong mt-2 h-10 w-full rounded-xl border border-[#e0e0e0] bg-white text-black disabled:border-[#ececec] disabled:text-[#9a9a9a]"
        >
          {openQuestionCount ? `Send ${openQuestionCount} marked particular${openQuestionCount > 1 ? 's' : ''}` : 'Mark particulars to request changes'}
        </button>
      </div>
    </section>
  )

  const renderRoom = () => (
    <section className="mx-auto w-full max-w-[390px] pb-[96px] pt-[56px]">
      <Header title={selectedRoom?.name || 'Room BOQ'} subtitle={selectedRoom?.note || 'Quotation particulars'} onBack={() => setScreen('home')} />
      <div className="px-4 py-5">
        <div className="border-b border-[#ececec] pb-4">
          <p className="typo-caption uppercase text-[#5f7467]">Room total</p>
          <p className="typo-page-title mt-2 text-black">{formatRupees(selectedRoom?.total || 0)}</p>
          <p className="typo-body mt-2 text-[#5f7467]">{selectedRoom?.itemCount || 0} particulars in this room. Open any particular to ask for clarification or dispute it.</p>
        </div>
      </div>
      <BoqParticularList items={roomItems} onOpenItem={openItem} />
    </section>
  )

  const renderItem = () => (
    <section className="mx-auto w-full max-w-[390px] pb-[132px] pt-[56px]">
      <Header title={selectedItem?.item || 'Particular'} subtitle={selectedRoom?.name || 'Room BOQ'} onBack={() => setScreen('room')} />
      <div className="px-4 py-5">
        <div className="border-b border-[#ececec] pb-4">
          <p className="typo-page-title text-black">{formatRupees(selectedItem ? getBoqItemAmount(selectedItem) : 0)}</p>
          <p className="typo-body mt-2 text-[#5f7467]">
            {selectedItem?.quantity} {selectedItem?.unit} / {selectedItem?.category} / {formatRupees(selectedItem?.rate || 0)}
          </p>
          {selectedItem?.notes ? <p className="typo-body mt-2 text-[#5f7467]">{selectedItem.notes}</p> : null}
        </div>

        <BoqQuestionThread questions={selectedItem?.clientQuestions || []} title="Remarks on this particular" />

        <section className="border-t border-[#ececec] py-4">
          <div className="px-4">
            <p className="typo-section-title text-black">Add a remark</p>
            <textarea
              value={questionDraft}
              onChange={(event) => setQuestionDraft(event.target.value)}
              className="typo-body mt-3 min-h-24 w-full resize-none rounded-[18px] border border-[#dbe6df] px-4 py-3 text-black outline-none"
            />
            <button
              type="button"
              onClick={() => {
                actions.addBoqQuestion(selectedItem.id, questionDraft)
                setQuestionDraft('')
              }}
              disabled={!questionDraft.trim()}
              className="typo-body-strong mt-3 h-11 w-full rounded-full bg-black text-white disabled:bg-[#d9d9d9] disabled:text-[#777777]"
            >
              Save remark on this particular
            </button>
          </div>
        </section>
      </div>

      <div className="fixed bottom-0 left-1/2 z-[95] w-full max-w-[390px] -translate-x-1/2 border-t border-[#e0e0e0] bg-white px-4 pb-5 pt-3">
        <button type="button" onClick={() => setScreen('room')} className="typo-body-strong h-11 w-full rounded-full bg-black text-white">
          Done
        </button>
      </div>
    </section>
  )

  const renderWaiting = () => (
    <section className="mx-auto w-full max-w-[390px] pb-[120px] pt-[56px]">
      <Header title="Quotation" subtitle="Waiting for revision" onBack={onBack} />
      <div className="px-4 py-10 text-center">
        <p className="typo-page-title text-black">Particulars sent for revision</p>
        <p className="typo-body mt-3 text-[#5f7467]">Your professional is reviewing the marked particulars and will send a revised quotation shortly.</p>
        {boqMeta.clientFeedback ? (
          <div className="mt-6 border-t border-[#ececec] pt-4 text-left">
            <p className="typo-label uppercase text-[#a86a00]">Sent for review</p>
            <p className="typo-body mt-2 whitespace-pre-line text-black">{boqMeta.clientFeedback.body}</p>
          </div>
        ) : null}
        <BoqHistoryList title="Previously signed BOQs" entries={previousSignedEntries} onOpen={(entry) => setSelectedHistoryId(entry.id)} />
      </div>
    </section>
  )

  const renderApproved = () => (
    <section className="mx-auto w-full max-w-[390px] pb-[120px] pt-[56px]">
      <Header title="Quotation" subtitle="Approved" onBack={onBack} />
      <div className="px-4 py-5">
        <div className="border-b border-[#ececec] pb-4 text-center">
          <p className="typo-page-title text-black">Quotation approved</p>
          <p className="typo-body mt-2 text-[#5f7467]">The room-wise BOQ is now approved and signed for the project.</p>
        </div>
        <div className="border-b border-[#ececec] py-4">
          <p className="typo-label uppercase text-[#5f7467]">Total</p>
          <p className="typo-page-title mt-2 text-black">{formatRupees(grandTotal)}</p>
          {boqMeta.approvedAt ? <p className="typo-body mt-2 text-[#5f7467]">Signed on {formatBoqHistoryDate(boqMeta.approvedAt)}</p> : null}
        </div>
        <BoqRoomListSection title="Signed room BOQs" rooms={boqRooms} items={boqItems} onOpenRoom={openRoom} emphasis="attention" />
        <BoqHistoryList title="Previously signed BOQs" entries={previousSignedEntries} onOpen={(entry) => setSelectedHistoryId(entry.id)} />
      </div>
    </section>
  )

  const renderSignedHistory = () => (
    <section className="mx-auto w-full max-w-[390px] pb-[72px] pt-[56px]">
      <Header
        title={selectedHistory?.title || 'Signed BOQ'}
        subtitle={selectedHistory ? `Signed ${formatBoqHistoryDate(selectedHistory.approvedAt)}` : 'Read only'}
        onBack={() => setSelectedHistoryId(null)}
      />
      <div className="px-4 py-5">
        <p className="typo-body text-[#5f7467]">This is a previously signed quotation kept for reference during the project.</p>
      </div>
      <BoqHistoryDetailBody snapshot={selectedHistory} />
    </section>
  )

  if (selectedHistory) {
    return <main className="min-h-dvh w-full overflow-x-hidden bg-white font-['Urbanist'] text-black">{renderSignedHistory()}</main>
  }

  if (screen === 'room' && selectedRoom) {
    return <main className="min-h-dvh w-full overflow-x-hidden bg-white font-['Urbanist'] text-black">{renderRoom()}</main>
  }

  if (screen === 'item' && selectedItem) {
    return <main className="min-h-dvh w-full overflow-x-hidden bg-white font-['Urbanist'] text-black">{renderItem()}</main>
  }

  if (boqMeta.status === 'changesRequested') {
    return <main className="min-h-dvh w-full overflow-x-hidden bg-white font-['Urbanist'] text-black">{renderWaiting()}</main>
  }

  if (boqMeta.status === 'approved') {
    return <main className="min-h-dvh w-full overflow-x-hidden bg-white font-['Urbanist'] text-black">{renderApproved()}</main>
  }

  return (
    <main className="min-h-dvh w-full overflow-x-hidden bg-white font-['Urbanist'] text-black">
      {renderHome(boqMeta.status === 'revised' ? 'Revised quotation' : 'Your quotation')}
    </main>
  )
}

export default HomeownerBoqWorkspace
