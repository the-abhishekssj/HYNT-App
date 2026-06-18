import { useMemo, useState } from 'react'
import {
  ArrowsDownUp,
  CaretLeft,
  CaretUp,
  DownloadSimple,
  FileArrowUp,
  FilePdf,
  PaperPlaneTilt,
  Plus,
  CopySimple,
  X,
} from '@phosphor-icons/react'
import { useSharedProject } from '../collaboration/mockProjectStore'
import { BoqHistoryDetailBody, BoqHistoryList } from './BoqHistoryViews'
import { BoqParticularList, BoqQuestionThread, BoqRoomListSection } from './BoqRoomSections'
import { formatBoqHistoryDate } from './boqHistoryUtils'
import {
  boqImportPreviewRows,
  boqStatusLabels,
  buildBoqRoomSummaries,
  formatLakhs,
  formatRupees,
  getBoqItemAmount,
} from './boqUtils'

function Header({ title, subtitle, onBack, right }) {
  return (
    <header className="fixed left-1/2 top-0 z-[90] w-full max-w-[390px] -translate-x-1/2 border-b border-[#e0e0e0] bg-[rgba(255,255,255,0.72)] backdrop-blur-[16px]">
      <div className="px-4 py-3">
        <div className="flex items-center justify-between py-1">
          <button type="button" onClick={onBack} className="flex min-w-0 items-center gap-4">
            <span className="grid size-6 shrink-0 place-items-center rounded">
              <CaretLeft size={24} />
            </span>
            <span className="min-w-0 text-left">
              <span className="type-section-title block truncate text-black">{title}</span>
              <span className="type-caption block truncate text-[#999999]">{subtitle}</span>
            </span>
          </button>
          <div className="flex items-center gap-2">{right}</div>
        </div>
      </div>
    </header>
  )
}

function Metric({ label, value, tone = 'text-black' }) {
  return (
    <div className="border-r border-[#ececec] px-3 py-4 text-left last:border-r-0">
      <p className={`type-card-title ${tone}`}>{value}</p>
      <p className="type-caption mt-2 text-[#7b7b7b]">{label}</p>
    </div>
  )
}

function RoomEditorDrawer({
  open,
  mode,
  room,
  roomName,
  roomNote,
  onChangeName,
  onChangeNote,
  onClose,
  onSave,
  onDuplicate,
  onMoveUp,
  onMoveDown,
  canMoveUp,
  canMoveDown,
}) {
  return (
    <div className={`fixed inset-0 z-[120] transition ${open ? 'pointer-events-auto' : 'pointer-events-none'}`}>
      <button
        type="button"
        onClick={onClose}
        className={`absolute inset-0 bg-[rgba(12,12,12,0.18)] transition ${open ? 'opacity-100' : 'opacity-0'}`}
        aria-label="Close room editor"
      />
      <aside className={`absolute right-0 top-0 h-full w-[88%] max-w-[340px] border-l border-[#dfe8e2] bg-white transition-transform duration-200 ${open ? 'translate-x-0' : 'translate-x-full'}`}>
        <div className="flex h-full flex-col">
          <div className="flex items-center justify-between border-b border-[#ececec] px-4 py-4">
            <div>
              <p className="type-section-title text-black">{mode === 'create' ? 'Add room BOQ' : 'Edit room BOQ'}</p>
              <p className="type-caption mt-1 text-[#7b7b7b]">{mode === 'create' ? 'Create a room shell, then add particulars inside it.' : 'Rename, reorder, or duplicate this room.'}</p>
            </div>
            <button type="button" onClick={onClose} className="grid size-8 place-items-center rounded-full border border-[#e4e4e4] text-[#4f4f4f]">
              <X size={14} />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto px-4 py-5">
            <div className="space-y-4">
              <label className="block">
                <span className="type-label uppercase text-[#5f7467]">Room name</span>
                <input value={roomName} onChange={(event) => onChangeName(event.target.value)} className="type-body mt-2 h-11 w-full rounded-[16px] border border-[#dbe6df] px-3 text-black outline-none" />
              </label>
              <label className="block">
                <span className="type-label uppercase text-[#5f7467]">Room note</span>
                <textarea value={roomNote} onChange={(event) => onChangeNote(event.target.value)} className="type-body mt-2 min-h-24 w-full resize-none rounded-[16px] border border-[#dbe6df] px-3 py-3 text-black outline-none" />
              </label>
            </div>

            {mode === 'edit' && room ? (
              <section className="mt-6 border-t border-[#ececec] pt-4">
                <p className="type-section-title text-black">Room actions</p>
                <div className="mt-3 space-y-2">
                  <button type="button" onClick={onDuplicate} className="type-body flex w-full items-center justify-between border-b border-[#f2f2f2] py-3 text-left text-black">
                    <span>Duplicate room BOQ</span>
                    <CopySimple size={14} />
                  </button>
                  <button type="button" onClick={onMoveUp} disabled={!canMoveUp} className="type-body flex w-full items-center justify-between border-b border-[#f2f2f2] py-3 text-left text-black disabled:text-[#b0b0b0]">
                    <span>Move room up</span>
                    <CaretUp size={14} />
                  </button>
                  <button type="button" onClick={onMoveDown} disabled={!canMoveDown} className="type-body flex w-full items-center justify-between py-3 text-left text-black disabled:text-[#b0b0b0]">
                    <span>Move room down</span>
                    <ArrowsDownUp size={14} />
                  </button>
                </div>
              </section>
            ) : null}
          </div>

          <div className="border-t border-[#ececec] px-4 pb-5 pt-3">
            <button type="button" onClick={onSave} disabled={!roomName.trim()} className="type-body-strong h-11 w-full rounded-full bg-black text-white disabled:bg-[#d9d9d9] disabled:text-[#777777]">
              {mode === 'create' ? 'Create room BOQ' : 'Save room changes'}
            </button>
          </div>
        </div>
      </aside>
    </div>
  )
}

function ProBoqWorkspace({ project, onBack, onOpenFinance }) {
  const {
    boqItems,
    boqMeta,
    boqRooms,
    actions,
  } = useSharedProject(project?.id || 'p-1')

  const [screen, setScreen] = useState('home')
  const [selectedRoomId, setSelectedRoomId] = useState(null)
  const [selectedItemId, setSelectedItemId] = useState(null)
  const [selectedHistoryId, setSelectedHistoryId] = useState(null)
  const [financeMode, setFinanceMode] = useState(boqMeta.financeScheduleMode || 'auto')
  const [roomDrawerMode, setRoomDrawerMode] = useState(null)
  const [editingRoomId, setEditingRoomId] = useState(null)
  const [roomDraftName, setRoomDraftName] = useState('')
  const [roomDraftNote, setRoomDraftNote] = useState('')
  const [replyDraft, setReplyDraft] = useState('')

  const totalAmount = useMemo(() => boqItems.reduce((sum, item) => sum + getBoqItemAmount(item), 0), [boqItems])
  const gstAmount = boqMeta.gstEnabled ? Math.round(totalAmount * 0.18) : 0
  const grandTotal = totalAmount + gstAmount
  const roomSummaries = useMemo(() => buildBoqRoomSummaries(boqRooms, boqItems), [boqRooms, boqItems])
  const selectedRoom = roomSummaries.find((room) => room.id === selectedRoomId) || null
  const selectedItem = boqItems.find((item) => item.id === selectedItemId) || null
  const historyEntries = boqMeta.history || []
  const visibleHistoryEntries = boqMeta.status === 'approved'
    ? historyEntries.filter((entry) => entry.version !== boqMeta.version)
    : historyEntries
  const selectedHistory = historyEntries.find((entry) => entry.id === selectedHistoryId) || null
  const roomItems = selectedRoom
    ? boqItems.filter((item) => item.roomId === selectedRoom.id || item.space === selectedRoom.name)
    : []
  const flaggedItems = boqItems.filter((item) => (item.clientQuestions || []).some((question) => question.status !== 'resolved'))
  const latestOpenQuestion = [...(selectedItem?.clientQuestions || [])].reverse().find((question) => question.status !== 'resolved') || null
  const editingRoom = roomSummaries.find((room) => room.id === editingRoomId) || null
  const editingRoomIndex = editingRoom ? roomSummaries.findIndex((room) => room.id === editingRoom.id) : -1

  const rightActions = (
    <>
      <button type="button" onClick={() => setScreen('import')} className="grid size-8 place-items-center rounded-xl border border-[#dbe6df] bg-white text-black">
        <FileArrowUp size={15} />
      </button>
      <button type="button" className="grid size-8 place-items-center rounded-xl border border-[#dbe6df] bg-white text-black">
        <DownloadSimple size={15} />
      </button>
      <button type="button" className="grid size-8 place-items-center rounded-xl border border-[#dbe6df] bg-white text-black">
        <FilePdf size={15} />
      </button>
    </>
  )

  const openRoom = (room) => {
    setSelectedRoomId(room.id)
    setSelectedItemId(null)
    setReplyDraft('')
    setScreen('room')
  }

  const openItem = (item) => {
    setSelectedRoomId(item.roomId)
    setSelectedItemId(item.id)
    setReplyDraft('')
    setScreen('item')
  }

  const openRoomDrawer = (mode, room = null) => {
    setRoomDrawerMode(mode)
    setEditingRoomId(room?.id || null)
    setRoomDraftName(room?.name || '')
    setRoomDraftNote(room?.note || '')
  }

  const closeRoomDrawer = () => {
    setRoomDrawerMode(null)
    setEditingRoomId(null)
    setRoomDraftName('')
    setRoomDraftNote('')
  }

  const renderHome = () => (
    <section className="mx-auto w-full max-w-[390px] pb-[134px] pt-[56px]">
      <Header title="BOQ / Quotation" subtitle={project?.scope || 'Project quotation'} onBack={onBack} right={rightActions} />

      <div className="px-4 py-5">
        <div className="flex items-center justify-between gap-3 border-b border-[#ececec] pb-4">
          <div className="min-w-0">
            <p className="type-caption uppercase text-[#5f7467]">{boqStatusLabels[boqMeta.status] || 'In progress'}</p>
            <p className="type-section-title mt-2 text-black">{project?.name || 'Sharma 3BHK Renovation'}</p>
            <p className="type-body mt-1 text-[#5f7467]">{project?.clientName} | {project?.location}</p>
          </div>
          <p className="type-caption shrink-0 text-[#7b7b7b]">v{boqMeta.version}</p>
        </div>

        <div className="grid grid-cols-3 border-b border-[#ececec]">
          <Metric label="BOQ total" value={formatLakhs(grandTotal / 100000)} tone="text-[#267449]" />
          <Metric label="Rooms" value={String(roomSummaries.length)} />
          <Metric label="Client notes" value={String(flaggedItems.length)} tone={flaggedItems.length ? 'text-[#a86a00]' : 'text-black'} />
        </div>

        <BoqRoomListSection
          title="Room BOQs"
          rooms={boqRooms}
          items={boqItems}
          onOpenRoom={openRoom}
          onEditRoom={(room) => openRoomDrawer('edit', room)}
          emptyLabel="Start by adding a room BOQ, then add particulars inside it."
        />

        {flaggedItems.length ? (
          <section className="border-t border-[#ececec] py-4">
            <div className="flex items-center justify-between gap-3 px-4">
              <p className="type-section-title text-black">Homeowner remarks</p>
              <button type="button" onClick={() => setScreen('changes')} className="type-label uppercase text-[#267449]">Review all</button>
            </div>
            <div className="mt-3">
              {flaggedItems.slice(0, 3).map((item) => (
                <button key={item.id} type="button" onClick={() => openItem(item)} className="flex w-full items-start justify-between gap-3 border-t border-[#f2f2f2] px-4 py-3 text-left">
                  <div className="min-w-0">
                    <p className="type-body text-black">{item.item}</p>
                    <p className="type-meta mt-1 text-[#7b7b7b]">{item.space}</p>
                  </div>
                  <span className="type-caption rounded-full bg-[#fff3dd] px-2 py-1 text-[#a86a00]">
                    {(item.clientQuestions || []).filter((question) => question.status !== 'resolved').length} notes
                  </span>
                </button>
              ))}
            </div>
          </section>
        ) : null}

        <BoqHistoryList title="Signed history" entries={visibleHistoryEntries} onOpen={(entry) => setSelectedHistoryId(entry.id)} />
      </div>

      <div className="fixed bottom-0 left-1/2 z-[95] w-full max-w-[390px] -translate-x-1/2 border-t border-[#e0e0e0] bg-white px-4 pb-5 pt-3">
        <button
          type="button"
          onClick={() => {
            if (boqMeta.status === 'changesRequested') {
              setScreen('changes')
              return
            }
            actions.shareBoqQuotation()
          }}
          className="type-body-strong flex h-11 w-full items-center justify-center gap-2 rounded-full bg-black text-white"
        >
          {boqMeta.status === 'changesRequested' ? 'Review client remarks' : 'Share quotation with homeowner'}
          <PaperPlaneTilt size={16} />
        </button>
        <div className="mt-2 grid grid-cols-2 gap-2">
          <button type="button" onClick={() => openRoomDrawer('create')} className="type-body-strong h-10 rounded-xl border border-[#e0e0e0] bg-white text-black">
            Add room BOQ
          </button>
          <button type="button" onClick={() => setScreen('import')} className="type-body-strong h-10 rounded-xl border border-[#e0e0e0] bg-white text-black">
            Upload Excel
          </button>
        </div>
      </div>
    </section>
  )

  const renderRoom = () => (
    <section className="mx-auto w-full max-w-[390px] pb-[132px] pt-[56px]">
      <Header title={selectedRoom?.name || 'Room BOQ'} subtitle={selectedRoom?.note || 'Particulars for this room'} onBack={() => setScreen('home')} />
      <div className="px-4 py-5">
        <div className="border-b border-[#ececec] pb-4">
          <p className="type-caption uppercase text-[#5f7467]">Room BOQ</p>
          <p className="type-page-title mt-2 text-black">{formatRupees(selectedRoom?.total || 0)}</p>
          <p className="type-body mt-2 text-[#5f7467]">{selectedRoom?.itemCount || 0} particulars in this room. Homeowner remarks stay attached to each particular.</p>
        </div>

        <BoqParticularList items={roomItems} onOpenItem={openItem} />
      </div>
      <div className="fixed bottom-0 left-1/2 z-[95] w-full max-w-[390px] -translate-x-1/2 border-t border-[#e0e0e0] bg-white px-4 pb-5 pt-3">
        <button
          type="button"
          onClick={() => {
            actions.addBoqItem({
              roomId: selectedRoom?.id,
              space: selectedRoom?.name,
              category: 'General',
              item: `New particular ${roomItems.length + 1}`,
              quantity: 1,
              rate: 1000,
              unit: 'unit',
            })
          }}
          className="type-body-strong flex h-11 w-full items-center justify-center gap-2 rounded-full bg-black text-white"
        >
          <Plus size={16} />
          Add particular
        </button>
      </div>
    </section>
  )

  const renderItem = () => (
    <section className="mx-auto w-full max-w-[390px] pb-[132px] pt-[56px]">
      <Header title={selectedItem?.item || 'Particular'} subtitle={selectedRoom?.name || 'Room BOQ'} onBack={() => setScreen('room')} />
      <div className="px-4 py-5">
        <div className="space-y-3">
          {[
            ['Particular', 'item'],
            ['Category', 'category'],
            ['Quantity', 'quantity'],
            ['Unit', 'unit'],
            ['Rate', 'rate'],
            ['Vendor', 'vendor'],
            ['Vendor rate', 'vendorRate'],
            ['Markup %', 'markupPercent'],
          ].map(([label, key]) => (
            <label key={key} className="block">
              <span className="type-label uppercase text-[#5f7467]">{label}</span>
              <input
                value={selectedItem?.[key] ?? ''}
                onChange={(event) => actions.updateBoqItem(selectedItem.id, {
                  [key]: ['rate', 'vendorRate', 'markupPercent'].includes(key) ? Number(event.target.value) || 0 : event.target.value,
                })}
                className="type-body mt-2 h-11 w-full rounded-[16px] border border-[#dbe6df] px-3 text-black outline-none"
              />
            </label>
          ))}
          <label className="block">
            <span className="type-label uppercase text-[#5f7467]">Notes</span>
            <textarea
              value={selectedItem?.notes || ''}
              onChange={(event) => actions.updateBoqItem(selectedItem.id, { notes: event.target.value })}
              className="type-body mt-2 min-h-24 w-full resize-none rounded-[16px] border border-[#dbe6df] px-3 py-3 text-black outline-none"
            />
          </label>
        </div>

        <BoqQuestionThread questions={selectedItem?.clientQuestions || []} title="Homeowner remarks" />

        {latestOpenQuestion ? (
          <section className="border-t border-[#ececec] py-4">
            <div className="px-4">
              <p className="type-section-title text-black">Reply to latest note</p>
              <textarea
                value={replyDraft}
                onChange={(event) => setReplyDraft(event.target.value)}
                className="type-body mt-3 min-h-20 w-full resize-none rounded-[16px] border border-[#dbe6df] px-3 py-3 text-black outline-none"
              />
              <button
                type="button"
                onClick={() => {
                  actions.replyBoqQuestion(selectedItem.id, latestOpenQuestion.id, replyDraft)
                  setReplyDraft('')
                }}
                disabled={!replyDraft.trim()}
                className="type-body-strong mt-3 h-10 w-full rounded-full bg-black text-white disabled:bg-[#d9d9d9] disabled:text-[#777777]"
              >
                Save reply
              </button>
            </div>
          </section>
        ) : null}
      </div>
      <div className="fixed bottom-0 left-1/2 z-[95] w-full max-w-[390px] -translate-x-1/2 border-t border-[#e0e0e0] bg-white px-4 pb-5 pt-3">
        <button type="button" onClick={() => setScreen('room')} className="type-body-strong h-11 w-full rounded-full bg-black text-white">
          Done editing particular
        </button>
      </div>
    </section>
  )

  const renderImport = () => (
    <section className="mx-auto w-full max-w-[390px] pb-[132px] pt-[56px]">
      <Header title="Import BOQ" subtitle="Excel or CSV" onBack={() => setScreen('home')} />
      <div className="px-4 py-5">
        <p className="type-body text-[#5f7467]">Download the BOQ template, fill room-wise particulars with the same headers, then upload it back here.</p>

        <button type="button" className="type-body-strong mt-4 h-11 w-full rounded-full border border-black bg-white text-black">
          Download BOQ template
        </button>

        <button
          type="button"
          onClick={() => actions.stageBoqImport({ fileName: 'BOQ_Sharma_v2.xlsx', rows: boqImportPreviewRows })}
          className="mt-4 flex w-full items-center justify-center rounded-[20px] border border-dashed border-[#dbe6df] px-5 py-10 text-center"
        >
          <div>
            <p className="type-section-title text-black">Tap to upload your Excel</p>
            <p className="type-body mt-2 text-[#5f7467]">Each row becomes a particular inside its room BOQ.</p>
          </div>
        </button>

        {(boqMeta.pendingImportRows || []).length ? (
          <section className="mt-5 border-t border-[#ececec] pt-4">
            <div className="flex items-center justify-between gap-3">
              <p className="type-section-title text-black">Import preview</p>
              <p className="type-meta text-[#7b7b7b]">{boqMeta.importFileName}</p>
            </div>
            <div className="mt-3 space-y-3">
              {boqImportPreviewRows.map((row) => (
                <div key={`${row.space}-${row.item}`} className="border-b border-[#f2f2f2] pb-3">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="type-body text-black">{row.item}</p>
                      <p className="type-meta mt-1 text-[#7b7b7b]">{row.space} / {row.category} / {row.quantity} {row.unit}</p>
                    </div>
                    <p className="type-body-strong shrink-0 text-[#267449]">{formatRupees((Number(row.quantity) || 0) * row.rate)}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>
        ) : null}
      </div>
      <div className="fixed bottom-0 left-1/2 z-[95] w-full max-w-[390px] -translate-x-1/2 border-t border-[#e0e0e0] bg-white px-4 pb-5 pt-3">
        {(boqMeta.pendingImportRows || []).length ? (
          <div className="grid grid-cols-[2fr_1fr] gap-2">
            <button type="button" onClick={() => { actions.confirmBoqImport(); setScreen('home') }} className="type-body-strong h-11 rounded-full bg-black text-white">
              Confirm import
            </button>
            <button type="button" onClick={() => actions.clearBoqImport()} className="type-body-strong h-11 rounded-full border border-[#e0e0e0] bg-white text-black">
              Re-upload
            </button>
          </div>
        ) : null}
      </div>
    </section>
  )

  const renderChanges = () => (
    <section className="mx-auto w-full max-w-[390px] pb-[132px] pt-[56px]">
      <Header title="Client feedback" subtitle="Flagged particulars" onBack={() => setScreen('home')} />
      <div className="px-4 py-5">
        <p className="type-body text-[#5f7467]">The homeowner has marked individual particulars for review. Update those particulars, reply where needed, then resubmit the quotation.</p>
        {boqMeta.clientFeedback ? (
          <div className="mt-4 border-t border-[#ececec] pt-4">
            <p className="type-label uppercase text-[#a86a00]">Sent to designer</p>
            <p className="type-body mt-2 whitespace-pre-line text-black">{boqMeta.clientFeedback.body}</p>
          </div>
        ) : null}
      </div>
      <BoqParticularList items={flaggedItems} onOpenItem={openItem} emptyLabel="No flagged particulars right now." />
      <div className="fixed bottom-0 left-1/2 z-[95] w-full max-w-[390px] -translate-x-1/2 border-t border-[#e0e0e0] bg-white px-4 pb-5 pt-3">
        <button type="button" onClick={() => { actions.resubmitBoqQuotation(); setScreen('home') }} className="type-body-strong h-11 w-full rounded-full bg-black text-white">
          Resubmit quotation
        </button>
      </div>
    </section>
  )

  const renderApproved = () => (
    <section className="mx-auto w-full max-w-[390px] pb-[132px] pt-[56px]">
      <Header title="BOQ / Quotation" subtitle="Approved quotation" onBack={onBack} />
      <div className="px-4 py-5">
        <div className="border-b border-[#ececec] pb-4 text-center">
          <p className="type-page-title text-black">Quotation approved</p>
          <p className="type-body mt-2 text-[#5f7467]">The homeowner approved the room-wise quotation. You can now create the invoice schedule in Finance.</p>
        </div>
        <div className="border-b border-[#ececec] py-4">
          <p className="type-label uppercase text-[#5f7467]">Grand total</p>
          <p className="type-page-title mt-2 text-black">{formatRupees(grandTotal)}</p>
          {boqMeta.approvedAt ? <p className="type-body mt-2 text-[#5f7467]">Approved on {formatBoqHistoryDate(boqMeta.approvedAt)}</p> : null}
        </div>
        <BoqRoomListSection title="Signed room BOQs" rooms={boqRooms} items={boqItems} onOpenRoom={openRoom} />
        <div className="border-t border-[#ececec] py-4">
          <div className="px-4">
            <p className="type-section-title text-black">Create invoice schedule?</p>
            <p className="type-body mt-2 text-[#5f7467]">Choose how this approved quotation should move into Finance.</p>
            <div className="mt-4 space-y-3">
              {[
                ['auto', 'Auto-create from SOW structure', 'Uses 30-30-24-10 and creates four invoices in Finance automatically.'],
                ['manual', 'Create invoices manually', 'Keep the approved total as reference and build invoices yourself in Finance.'],
              ].map(([mode, title, detail]) => (
                <button
                  key={mode}
                  type="button"
                  onClick={() => setFinanceMode(mode)}
                  className={`w-full border-b border-[#ececec] pb-3 text-left last:border-b-0 ${financeMode === mode ? 'text-black' : 'text-[#6f6f6f]'}`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="type-body-strong">{title}</p>
                      <p className="type-body mt-1">{detail}</p>
                    </div>
                    <span className={`mt-1 size-4 rounded-full border ${financeMode === mode ? 'border-black bg-black' : 'border-[#d0d0d0]'}`} />
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
        <BoqHistoryList title="Previously signed BOQs" entries={visibleHistoryEntries} onOpen={(entry) => setSelectedHistoryId(entry.id)} />
      </div>
      <div className="fixed bottom-0 left-1/2 z-[95] w-full max-w-[390px] -translate-x-1/2 border-t border-[#e0e0e0] bg-white px-4 pb-5 pt-3">
        <button
          type="button"
          onClick={() => {
            actions.createFinanceScheduleFromBoq(financeMode)
            onOpenFinance?.()
          }}
          className="type-body-strong h-11 w-full rounded-full bg-black text-white"
        >
          {financeMode === 'auto' ? 'Create invoice schedule' : 'Open Finance'}
        </button>
      </div>
    </section>
  )

  const renderHistoryDetail = () => (
    <section className="mx-auto w-full max-w-[390px] pb-[72px] pt-[56px]">
      <Header
        title={selectedHistory?.title || 'Signed BOQ'}
        subtitle={selectedHistory ? `Approved ${formatBoqHistoryDate(selectedHistory.approvedAt)}` : 'Read only'}
        onBack={() => setSelectedHistoryId(null)}
      />
      <div className="px-4 py-5">
        <p className="type-body text-[#5f7467]">This signed version is kept as a read-only record for the team.</p>
      </div>
      <BoqHistoryDetailBody snapshot={selectedHistory} />
    </section>
  )

  if (selectedHistory) {
    return <main className="min-h-dvh w-full overflow-x-hidden bg-white font-['Urbanist'] text-black">{renderHistoryDetail()}</main>
  }

  if (screen === 'import') {
    return <main className="min-h-dvh w-full overflow-x-hidden bg-white font-['Urbanist'] text-black">{renderImport()}</main>
  }

  if (screen === 'changes') {
    return <main className="min-h-dvh w-full overflow-x-hidden bg-white font-['Urbanist'] text-black">{renderChanges()}</main>
  }

  if (screen === 'room' && selectedRoom) {
    return <main className="min-h-dvh w-full overflow-x-hidden bg-white font-['Urbanist'] text-black">{renderRoom()}</main>
  }

  if (screen === 'item' && selectedItem) {
    return <main className="min-h-dvh w-full overflow-x-hidden bg-white font-['Urbanist'] text-black">{renderItem()}</main>
  }

  return (
    <main className="min-h-dvh w-full overflow-x-hidden bg-white font-['Urbanist'] text-black">
      {boqMeta.status === 'approved' ? renderApproved() : renderHome()}
      <RoomEditorDrawer
        open={Boolean(roomDrawerMode)}
        mode={roomDrawerMode || 'create'}
        room={editingRoom}
        roomName={roomDraftName}
        roomNote={roomDraftNote}
        onChangeName={setRoomDraftName}
        onChangeNote={setRoomDraftNote}
        onClose={closeRoomDrawer}
        onSave={() => {
          if (roomDrawerMode === 'edit' && editingRoom) {
            actions.updateBoqRoom(editingRoom.id, { name: roomDraftName, note: roomDraftNote })
          } else {
            actions.addBoqRoom({ name: roomDraftName, note: roomDraftNote })
          }
          closeRoomDrawer()
        }}
        onDuplicate={() => {
          if (!editingRoom) return
          actions.duplicateBoqRoom(editingRoom.id)
          closeRoomDrawer()
        }}
        onMoveUp={() => {
          if (!editingRoom) return
          actions.moveBoqRoom(editingRoom.id, 'up')
        }}
        onMoveDown={() => {
          if (!editingRoom) return
          actions.moveBoqRoom(editingRoom.id, 'down')
        }}
        canMoveUp={editingRoomIndex > 0}
        canMoveDown={editingRoomIndex !== -1 && editingRoomIndex < roomSummaries.length - 1}
      />
    </main>
  )
}

export default ProBoqWorkspace
