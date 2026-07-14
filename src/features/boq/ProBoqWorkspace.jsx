import { useMemo, useState } from 'react'
import {
  CaretLeft,
  CaretUp,
  FileArrowUp,
  ClockCounterClockwise,
  PaperPlaneTilt,
  Plus,
  Trash,
} from '@phosphor-icons/react'
import Button from '../../components/ui/Button'
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
    <header className="ui-workspace-header fixed left-1/2 top-0 z-[90] w-full max-w-[390px] -translate-x-1/2">
      <div className="ui-workspace-header-inner">
        <div className="flex items-center justify-between py-1">
          <button type="button" onClick={onBack} className="flex min-w-0 items-center gap-4">
            <span className="grid size-6 shrink-0 place-items-center rounded">
              <CaretLeft size={24} />
            </span>
            <span className="min-w-0 text-left">
              <span className="typo-section-title ui-section-title block truncate">{title}</span>
              <span className="typo-caption ui-muted block truncate">{subtitle}</span>
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
      <p className={`typo-card-title ${tone}`}>{value}</p>
      <p className="typo-caption ui-muted mt-2">{label}</p>
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
  const [replyDraft, setReplyDraft] = useState('')
  const [boqViewTab, setBoqViewTab] = useState('room')
  const [inlineEditingItemId, setInlineEditingItemId] = useState(null)
  const [inlineNewRoomId, setInlineNewRoomId] = useState(null)
  const [inlineNewRoomOpen, setInlineNewRoomOpen] = useState(false)
  const [inlineRoomDraft, setInlineRoomDraft] = useState({ name: '', note: '' })
  const [pendingDeleteItemId, setPendingDeleteItemId] = useState(null)
  const [inlineNewDraft, setInlineNewDraft] = useState({
    item: '',
    category: '',
    type: 'none',
    notes: '',
    quantity: 1,
    unit: '',
    rate: 0,
    vendor: '',
    vendorQuantity: 1,
    vendorUnit: '',
    vendorRate: 0,
    markupPercent: 0,
  })

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
  const missingRateCount = boqItems.filter((item) => !(Number(item.rate) > 0)).length
  const missingVendorCount = boqItems.filter((item) => !item.vendor?.trim()).length
  const openRemarkCount = flaggedItems.reduce((count, item) => (
    count + (item.clientQuestions || []).filter((question) => question.status !== 'resolved').length
  ), 0)
  const canMarkReady = Boolean(boqItems.length && roomSummaries.length && !missingRateCount)
  const readyChecklist = [
    {
      label: 'Rooms structured',
      detail: `${roomSummaries.length} room${roomSummaries.length === 1 ? '' : 's'} in this quotation`,
      complete: roomSummaries.length > 0,
    },
    {
      label: 'Line items priced',
      detail: missingRateCount ? `${missingRateCount} item${missingRateCount === 1 ? '' : 's'} missing rates` : `${boqItems.length} priced item${boqItems.length === 1 ? '' : 's'}`,
      complete: boqItems.length > 0 && missingRateCount === 0,
    },
    {
      label: 'Vendor references',
      detail: missingVendorCount ? `${missingVendorCount} item${missingVendorCount === 1 ? '' : 's'} without vendor` : 'Vendor costs captured',
      complete: missingVendorCount === 0,
      optional: true,
    },
  ]
  const statusTone = {
    draft: 'bg-[#eef7f1] text-[#267449]',
    ready: 'bg-[#e9f2ff] text-[#2f5f9f]',
    shared: 'bg-[#fff3dd] text-[#a86a00]',
    changesRequested: 'bg-[#fff3dd] text-[#a86a00]',
    revised: 'bg-[#e9f2ff] text-[#2f5f9f]',
    approved: 'bg-[#eef7f1] text-[#267449]',
  }[boqMeta.status] || 'bg-[#eef7f1] text-[#267449]'
  const statusNarrative = {
    draft: canMarkReady
      ? 'The quotation is editable. Mark it ready when you want to lock the current version before sending.'
      : 'Add priced room line items before this quotation can be marked ready.',
    ready: `Ready to send${boqMeta.readyAt ? ` since ${formatBoqHistoryDate(boqMeta.readyAt)}` : ''}. The homeowner has not received this version yet.`,
    shared: `Sent to homeowner${boqMeta.sharedAt ? ` on ${formatBoqHistoryDate(boqMeta.sharedAt)}` : ''}. Waiting for approval or remarks.`,
    changesRequested: `${openRemarkCount || flaggedItems.length} homeowner remark${(openRemarkCount || flaggedItems.length) === 1 ? '' : 's'} need review before resubmitting.`,
    revised: 'Revision is back with the homeowner. Keep the changed particulars visible until they approve.',
    approved: 'Homeowner approved this quotation. Move it into Finance when you are ready.',
  }[boqMeta.status] || 'Keep the quotation updated before sharing it with the homeowner.'

  const rightActions = (
    <>
      <Button
        type="button"
        variant="outline"
        size="small"
        icon={FileArrowUp}
        onClick={() => setScreen('import')}
        className="size-9 rounded-[14px] border-[#dbe6df] text-[#173324]"
        aria-label="Import BOQ"
      />
      <Button
        type="button"
        variant="outline"
        size="small"
        icon={ClockCounterClockwise}
        onClick={() => setScreen('history')}
        className="size-9 rounded-[14px] border-[#dbe6df] text-[#173324]"
        aria-label="View BOQ history"
      />
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

  const renderHome = () => (
    <section className="mx-auto w-full max-w-[390px] pb-[134px] pt-[56px]">
      <Header title="BOQ / Quotation" subtitle={project?.scope || 'Project quotation'} onBack={onBack} right={rightActions} />

      <div className="ui-screen-content">
        <section className="space-y-3 border-b border-[#dce7df] pb-5">
          <div className="rounded-[18px] border border-[#dbe6df] bg-white p-3 shadow-[0_10px_22px_rgba(16,36,24,0.06)]">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <p className={`typo-caption inline-flex rounded-full px-2 py-1 uppercase ${statusTone}`}>{boqStatusLabels[boqMeta.status] || 'Draft'}</p>
                <p className="typo-section-title mt-2 text-black">{project?.name || 'Sharma 3BHK Renovation'}</p>
                <p className="typo-meta mt-1 text-[#5f7467]">{project?.clientName} | {project?.location}</p>
              </div>
              <p className="typo-caption shrink-0 text-[#7b7b7b]">v{boqMeta.version}</p>
            </div>
            <p className="typo-body mt-3 text-[#5f7467]">{statusNarrative}</p>
          </div>

          <div className="grid grid-cols-3 overflow-hidden rounded-[18px] border border-[#ececec] bg-white">
            <Metric label="BOQ Total" value={formatLakhs(grandTotal / 100000)} tone="text-[#267449]" />
            <Metric label="Line items" value={String(boqItems.length)} />
            <Metric label="GST est." value={formatLakhs(gstAmount / 100000)} tone={boqMeta.gstEnabled ? 'text-[#a86a00]' : 'text-black'} />
          </div>

          {boqMeta.status !== 'approved' ? (
            <div className="py-1">
              <div className="flex items-center justify-between gap-3">
                <p className="typo-section-title text-black">Readiness</p>
                <span className={`typo-caption rounded-full px-2 py-1 ${canMarkReady ? 'bg-[#eef7f1] text-[#267449]' : 'bg-[#fff3dd] text-[#a86a00]'}`}>
                  {canMarkReady ? 'Can mark ready' : 'Needs pricing'}
                </span>
              </div>
              <div className="mt-2 space-y-1">
                {readyChecklist.map((check) => (
                  <div key={check.label} className="flex items-center gap-2">
                    <span className={`size-2 shrink-0 rounded-full ${check.complete ? 'bg-[#5fc18a]' : check.optional ? 'bg-[#efb24d]' : 'bg-[#c34545]'}`} />
                    <p className="typo-meta min-w-0 truncate text-black">
                      <span className="typo-body-strong">{check.label}</span>
                      <span className="text-[#6f7c74]"> · {check.detail}{check.optional && !check.complete ? ' / optional' : ''}</span>
                    </p>
                  </div>
                ))}
              </div>
            </div>
          ) : null}
        </section>

        <div role="tablist" aria-label="BOQ view selector" className="ui-view-tabs mt-5 grid grid-cols-3">
          {[
            ['room', 'By room'],
            ['activity', 'By activity'],
            ['summary', 'Summary'],
          ].map(([key, label]) => (
            <button
              key={key}
              type="button"
              role="tab"
              aria-selected={boqViewTab === key}
              aria-controls={`boq-view-panel-${key}`}
              id={`boq-view-tab-${key}`}
              onClick={() => setBoqViewTab(key)}
              className={`ui-view-tab typo-label w-full px-0 py-3 transition-colors ${
                boqViewTab === key
                  ? 'text-[#102418]'
                  : 'text-[#6f7d74]'
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        {boqViewTab === 'room' ? (
          <section id="boq-view-panel-room" role="tabpanel" aria-labelledby="boq-view-tab-room" className="mt-5">
            <div className="flex items-center justify-between gap-3 border-b border-[#e6ece8] pb-3">
              <div>
                <p className="typo-section-title text-black">Room BOQs</p>
                <p className="typo-meta mt-0.5 text-[#7b7b7b]">SOW rooms appear here automatically; add BOQ-only areas if pricing needs extra buckets.</p>
              </div>
              <Button type="button" variant="primary" size="small" onClick={startInlineNewRoom} className="typo-caption shrink-0">
                Add room
              </Button>
            </div>

            {inlineNewRoomOpen ? (
              <InlineRoomForm />
            ) : null}

            {roomSummaries.length ? (
              <div className="divide-y divide-[#eef2ef]">
                {roomSummaries.map((room) => {
                  const expanded = selectedRoomId === room.id
                  const currentRoomItems = boqItems.filter((item) => item.roomId === room.id || item.space === room.name)
                  return (
                    <article key={room.id} className="py-3">
                      <div className="flex items-start justify-between gap-2">
                        <button type="button" onClick={() => toggleInlineRoom(room)} className="flex min-w-0 flex-1 items-center justify-between gap-3 text-left">
                          <div className="min-w-0">
                            <div className="flex items-center gap-2">
                              <p className="typo-body-strong text-black">{room.name}</p>
                              {room.source === 'sow' ? (
                                <span className="typo-caption rounded-full bg-[#e9f2ff] px-2 py-1 text-[#2f5f9f]">From SOW</span>
                              ) : null}
                              {room.openQuestionCount ? (
                                <span className="typo-caption rounded-full bg-[#fff3dd] px-2 py-1 text-[#a86a00]">{room.openQuestionCount} notes</span>
                              ) : null}
                            </div>
                            <p className="typo-meta mt-0.5 text-[#7b7b7b]">{room.itemCount} line items</p>
                            {room.note ? <p className="typo-meta mt-0.5 text-[#9a9a9a]">{room.note}</p> : null}
                          </div>
                          <div className="flex shrink-0 items-center gap-2">
                            <p className="typo-body-strong text-[#267449]">{formatRupees(room.total)}</p>
                            <CaretUp size={14} className={`text-[#9a9a9a] transition-transform ${expanded ? '' : 'rotate-180'}`} />
                          </div>
                        </button>
                      </div>

                      {expanded ? (
                        <div className="mt-2 space-y-2">
                          {currentRoomItems.map((item) => {
                            const editing = inlineEditingItemId === item.id
                            return (
                              <article key={item.id} className="overflow-hidden rounded-[14px] border border-[#dfe9e3] bg-white">
                                <LineItemCard
                                  item={item}
                                  editing={editing}
                                  onToggle={() => {
                                    setInlineEditingItemId(editing ? null : item.id)
                                    setInlineNewRoomId(null)
                                    setPendingDeleteItemId(null)
                                  }}
                                />
                                {editing ? <InlineLineItemForm room={room} item={item} /> : null}
                              </article>
                            )
                          })}

                          {inlineNewRoomId === room.id ? (
                            <InlineLineItemForm room={room} draft={inlineNewDraft} onDraftChange={setInlineNewDraft} />
                          ) : null}

                          <button type="button" onClick={() => startInlineNewItem(room.id)} className="flex w-full items-center justify-between rounded-[14px] border border-dashed border-[#9fc9b1] bg-[#f7fffa] px-3 py-2 text-left text-[#173324]">
                            <span>
                              <span className="typo-body-strong block">Add line item</span>
                              <span className="typo-meta mt-0.5 block text-[#5f7467]">Particular, rate, vendor.</span>
                            </span>
                            <span className="grid size-7 shrink-0 place-items-center rounded-full bg-[#173324] text-white">
                              <Plus size={15} />
                            </span>
                          </button>
                        </div>
                      ) : null}
                    </article>
                  )
                })}
              </div>
            ) : !inlineNewRoomOpen ? (
              <Button
                type="button"
                variant="ghost"
                fullWidth
                onClick={startInlineNewRoom}
                className="mt-2 h-auto justify-start rounded-[16px] border border-dashed border-[#9fc9b1] bg-[#f7fffa] px-3 py-3 text-left text-[#173324] hover:bg-[#f2fbf6]"
              >
                <span className="flex w-full items-center justify-between gap-3">
                  <span className="min-w-0">
                    <span className="typo-body-strong block">Add first room</span>
                    <span className="typo-meta mt-0.5 block text-[#5f7467]">Living room, kitchen, bedroom, foyer, or custom area.</span>
                  </span>
                  <span className="grid size-8 shrink-0 place-items-center rounded-full bg-[#173324] text-white">
                    <Plus size={16} />
                  </span>
                </span>
              </Button>
            ) : null}
          </section>
        ) : null}

        {boqViewTab === 'activity' ? (
          <section id="boq-view-panel-activity" role="tabpanel" aria-labelledby="boq-view-tab-activity" className="mt-5">
            <div className="flex items-center justify-between border-b border-[#e6ece8] pb-3">
              <p className="typo-section-title text-black">By activity</p>
              <p className="typo-meta text-[#7b7b7b]">Category totals</p>
            </div>
            <div className="divide-y divide-[#eef2ef]">
              {Object.entries(boqItems.reduce((acc, item) => {
                acc[item.category || 'General'] = (acc[item.category || 'General'] || 0) + getBoqItemAmount(item)
                return acc
              }, {})).map(([category, amount]) => (
                <div key={category} className="flex items-center justify-between py-3">
                  <p className="typo-body-strong text-black">{category}</p>
                  <p className="typo-body-strong text-[#267449]">{formatRupees(amount)}</p>
                </div>
              ))}
            </div>
          </section>
        ) : null}

        {boqViewTab === 'summary' ? (
          <section id="boq-view-panel-summary" role="tabpanel" aria-labelledby="boq-view-tab-summary" className="mt-5">
            <p className="typo-section-title text-black">Billing summary</p>
            <div className="mt-3 space-y-2 rounded-[18px] border border-[#e8efe9] bg-white p-3">
              <div className="flex justify-between"><span className="typo-body text-[#5f7467]">Subtotal</span><span className="typo-body-strong text-black">{formatRupees(totalAmount)}</span></div>
              <div className="flex justify-between"><span className="typo-body text-[#5f7467]">GST 18%</span><span className="typo-body-strong text-black">{formatRupees(gstAmount)}</span></div>
              <div className="flex justify-between border-t border-[#ececec] pt-2"><span className="typo-body-strong text-black">Grand total</span><span className="typo-body-strong text-[#267449]">{formatRupees(grandTotal)}</span></div>
            </div>
          </section>
        ) : null}

        {flaggedItems.length ? (
          <section className="mt-7 border-t border-[#dce7df] pt-5">
            <div className="flex items-center justify-between gap-3">
              <p className="typo-section-title text-black">Homeowner remarks</p>
              <button type="button" onClick={() => setScreen('changes')} className="typo-label uppercase text-[#267449]">Review all</button>
            </div>
            <div className="mt-3 divide-y divide-[#eef2ef] border-y border-[#eef2ef]">
              {flaggedItems.slice(0, 3).map((item) => (
                <button key={item.id} type="button" onClick={() => openItem(item)} className="flex w-full items-start justify-between gap-3 py-3 text-left">
                  <div className="min-w-0">
                    <p className="typo-body text-black">{item.item}</p>
                    <p className="typo-meta mt-1 text-[#7b7b7b]">{item.space}</p>
                  </div>
                  <span className="typo-caption rounded-full bg-[#fff3dd] px-2 py-1 text-[#a86a00]">
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
        <Button
          type="button"
          onClick={() => {
            if (boqMeta.status === 'changesRequested') {
              setScreen('changes')
              return
            }
            if (boqMeta.status === 'ready' || boqMeta.status === 'shared' || boqMeta.status === 'revised') {
              actions.shareBoqQuotation()
              return
            }
            actions.markBoqReady()
          }}
          disabled={!canMarkReady && boqMeta.status === 'draft'}
          fullWidth
          trailingIcon={PaperPlaneTilt}
          className="typo-body-strong"
        >
          {boqMeta.status === 'changesRequested'
            ? 'Review client remarks'
            : boqMeta.status === 'ready'
              ? 'Send quotation'
              : boqMeta.status === 'shared'
                ? 'Share again'
                : boqMeta.status === 'revised'
                  ? 'Send revised quotation'
                  : 'Mark ready'}
        </Button>
      </div>
    </section>
  )

  const renderHistory = () => (
    <section className="mx-auto w-full max-w-[390px] pb-[72px] pt-[56px]">
      <Header title="BOQ history" subtitle="Sent quotations" onBack={() => setScreen('home')} />
      <div className="ui-screen-content">
        <BoqHistoryList title="Sent so far" entries={visibleHistoryEntries} onOpen={(entry) => setSelectedHistoryId(entry.id)} emptyLabel="No quotation history yet." />
      </div>
    </section>
  )

  const renderRoom = () => (
    <section className="mx-auto w-full max-w-[390px] pb-[132px] pt-[56px]">
      <Header title={selectedRoom?.name || 'Room BOQ'} subtitle={selectedRoom?.note || 'Particulars for this room'} onBack={() => setScreen('home')} />
      <div className="ui-screen-content">
        <div className="border-b border-[#ececec] pb-4">
          <p className="typo-caption uppercase text-[#5f7467]">Room BOQ</p>
          <p className="typo-page-title mt-2 text-black">{formatRupees(selectedRoom?.total || 0)}</p>
          <p className="typo-body mt-2 text-[#5f7467]">{selectedRoom?.itemCount || 0} particulars in this room. Homeowner remarks stay attached to each particular.</p>
        </div>

        <div className="mt-4 space-y-3">
          {roomItems.map((item) => {
            const editing = selectedItemId === item.id
            return (
              <article key={item.id} className="rounded-[18px] border border-[#e3ebe5] bg-white p-3">
                <button type="button" onClick={() => setSelectedItemId(editing ? null : item.id)} className="flex w-full items-start justify-between gap-3 text-left">
                  <div className="min-w-0">
                    <p className="typo-body-strong text-black">{item.item}</p>
                    <p className="typo-meta mt-1 text-[#7b7b7b]">{item.category} / {item.quantity} {item.unit}</p>
                  </div>
                  <p className="typo-body-strong shrink-0 text-[#267449]">{formatRupees(getBoqItemAmount(item))}</p>
                </button>

                {editing ? (
                  <div className="mt-4 space-y-3 border-t border-[#edf1ee] pt-4">
                    {[
                      ['Particulars', 'item'],
                      ['Category', 'category'],
                      ['Type', 'type'],
                      ['Details', 'notes'],
                      ['Qty', 'quantity'],
                      ['Unit', 'unit'],
                      ['Rate', 'rate'],
                      ['Vendor name', 'vendor'],
                      ['Vendor qty', 'vendorQuantity'],
                      ['Vendor unit', 'vendorUnit'],
                      ['Vendor rate', 'vendorRate'],
                      ['Markup', 'markupPercent'],
                    ].map(([label, key]) => (
                      <label key={key} className="block">
                        <span className="typo-label uppercase text-[#5f7467]">{label}</span>
                        <input
                          value={item?.[key] ?? ''}
                          onChange={(event) => actions.updateBoqItem(item.id, {
                              [key]: ['rate', 'vendorRate', 'markupPercent', 'vendorQuantity', 'quantity'].includes(key) ? Number(event.target.value) || 0 : event.target.value,
                            })}
                          className="ui-input-base typo-body mt-2 w-full border border-[#dbe6df] text-black outline-none"
                        />
                      </label>
                    ))}
                    <div className="grid grid-cols-2 gap-2">
                      <Button type="button" size="small" onClick={() => setSelectedItemId(null)}>Save</Button>
                      <Button type="button" size="small" variant="outline" onClick={() => setSelectedItemId(null)} className="border-[#e0e0e0] text-black">Discard</Button>
                    </div>
                  </div>
                ) : null}
              </article>
            )
          })}
        </div>
      </div>
      <div className="fixed bottom-0 left-1/2 z-[95] w-full max-w-[390px] -translate-x-1/2 border-t border-[#e0e0e0] bg-white px-4 pb-5 pt-3">
        <Button
          type="button"
          fullWidth
          leadingIcon={Plus}
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
        >
          Add line item
        </Button>
      </div>
    </section>
  )

  const renderItem = () => (
    <section className="mx-auto w-full max-w-[390px] pb-[132px] pt-[56px]">
      <Header title={selectedItem?.item || 'Particular'} subtitle={selectedRoom?.name || 'Room BOQ'} onBack={() => setScreen('room')} />
      <div className="ui-screen-content">
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
              <span className="typo-label uppercase text-[#5f7467]">{label}</span>
              <input
                value={selectedItem?.[key] ?? ''}
                onChange={(event) => actions.updateBoqItem(selectedItem.id, {
                  [key]: ['rate', 'vendorRate', 'markupPercent'].includes(key) ? Number(event.target.value) || 0 : event.target.value,
                })}
                className="ui-input-base typo-body mt-2 w-full border border-[#dbe6df] text-black outline-none"
              />
            </label>
          ))}
          <label className="block">
            <span className="typo-label uppercase text-[#5f7467]">Notes</span>
            <textarea
              value={selectedItem?.notes || ''}
              onChange={(event) => actions.updateBoqItem(selectedItem.id, { notes: event.target.value })}
              className="ui-textarea-base typo-body mt-2 min-h-24 w-full resize-none border border-[#dbe6df] text-black outline-none"
            />
          </label>
        </div>

        <BoqQuestionThread questions={selectedItem?.clientQuestions || []} title="Homeowner remarks" />

        {latestOpenQuestion ? (
          <section className="border-t border-[#ececec] py-4">
            <div className="px-4">
              <p className="typo-section-title text-black">Reply to latest note</p>
              <textarea
                value={replyDraft}
                onChange={(event) => setReplyDraft(event.target.value)}
                className="ui-textarea-base typo-body mt-3 min-h-20 w-full resize-none border border-[#dbe6df] text-black outline-none"
              />
              <Button
                type="button"
                onClick={() => {
                  actions.replyBoqQuestion(selectedItem.id, latestOpenQuestion.id, replyDraft)
                  setReplyDraft('')
                }}
                disabled={!replyDraft.trim()}
                fullWidth
                className="mt-3"
              >
                Save reply
              </Button>
            </div>
          </section>
        ) : null}
      </div>
      <div className="fixed bottom-0 left-1/2 z-[95] w-full max-w-[390px] -translate-x-1/2 border-t border-[#e0e0e0] bg-white px-4 pb-5 pt-3">
        <Button type="button" fullWidth onClick={() => setScreen('room')}>
          Done editing particular
        </Button>
      </div>
    </section>
  )

  const renderImport = () => (
    <section className="mx-auto w-full max-w-[390px] pb-[132px] pt-[56px]">
      <Header title="Import BOQ" subtitle="Excel or CSV" onBack={() => setScreen('home')} />
      <div className="ui-screen-content">
        <p className="typo-body text-[#5f7467]">Download the BOQ template, fill room-wise particulars with the same headers, then upload it back here.</p>

        <Button type="button" variant="outline" fullWidth className="mt-4 border-black text-black">
          Download BOQ template
        </Button>

        <button
          type="button"
          onClick={() => actions.stageBoqImport({ fileName: 'BOQ_Sharma_v2.xlsx', rows: boqImportPreviewRows })}
          className="mt-4 flex w-full items-center justify-center rounded-[20px] border border-dashed border-[#dbe6df] px-5 py-10 text-center"
        >
          <div>
            <p className="typo-section-title text-black">Tap to upload your Excel</p>
            <p className="typo-body mt-2 text-[#5f7467]">Each row becomes a particular inside its room BOQ.</p>
          </div>
        </button>

        {(boqMeta.pendingImportRows || []).length ? (
          <section className="mt-5 border-t border-[#ececec] pt-4">
            <div className="flex items-center justify-between gap-3">
              <p className="typo-section-title text-black">Import preview</p>
              <p className="typo-meta text-[#7b7b7b]">{boqMeta.importFileName}</p>
            </div>
            <div className="mt-3 space-y-3">
              {boqImportPreviewRows.map((row) => (
                <div key={`${row.space}-${row.item}`} className="border-b border-[#f2f2f2] pb-3">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="typo-body text-black">{row.item}</p>
                      <p className="typo-meta mt-1 text-[#7b7b7b]">{row.space} / {row.category} / {row.quantity} {row.unit}</p>
                    </div>
                    <p className="typo-body-strong shrink-0 text-[#267449]">{formatRupees((Number(row.quantity) || 0) * row.rate)}</p>
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
            <Button type="button" fullWidth onClick={() => { actions.confirmBoqImport(); setScreen('home') }}>
              Confirm import
            </Button>
            <Button type="button" variant="outline" fullWidth onClick={() => actions.clearBoqImport()} className="border-[#e0e0e0] text-black">
              Re-upload
            </Button>
          </div>
        ) : null}
      </div>
    </section>
  )

  const renderChanges = () => (
    <section className="mx-auto w-full max-w-[390px] pb-[132px] pt-[56px]">
      <Header title="Client feedback" subtitle="Flagged particulars" onBack={() => setScreen('home')} />
      <div className="ui-screen-content">
        <p className="typo-body text-[#5f7467]">The homeowner has marked individual particulars for review. Update those particulars, reply where needed, then resubmit the quotation.</p>
        {boqMeta.clientFeedback ? (
          <div className="mt-4 border-t border-[#ececec] pt-4">
            <p className="typo-label uppercase text-[#a86a00]">Sent to designer</p>
            <p className="typo-body mt-2 whitespace-pre-line text-black">{boqMeta.clientFeedback.body}</p>
          </div>
        ) : null}
      </div>
      <BoqParticularList items={flaggedItems} onOpenItem={openItem} emptyLabel="No flagged particulars right now." />
      <div className="fixed bottom-0 left-1/2 z-[95] w-full max-w-[390px] -translate-x-1/2 border-t border-[#e0e0e0] bg-white px-4 pb-5 pt-3">
        <Button type="button" fullWidth onClick={() => { actions.resubmitBoqQuotation(); setScreen('home') }}>
          Resubmit quotation
        </Button>
      </div>
    </section>
  )

  const renderApproved = () => (
    <section className="mx-auto w-full max-w-[390px] pb-[132px] pt-[56px]">
      <Header title="BOQ / Quotation" subtitle="Approved quotation" onBack={onBack} />
      <div className="ui-screen-content">
        <div className="border-b border-[#ececec] pb-4 text-center">
          <p className="typo-page-title text-black">Quotation approved</p>
          <p className="typo-body mt-2 text-[#5f7467]">The homeowner approved the room-wise quotation. You can now create the invoice schedule in Finance.</p>
        </div>
        <div className="border-b border-[#ececec] py-4">
          <p className="typo-label uppercase text-[#5f7467]">Grand total</p>
          <p className="typo-page-title mt-2 text-black">{formatRupees(grandTotal)}</p>
          {boqMeta.approvedAt ? <p className="typo-body mt-2 text-[#5f7467]">Approved on {formatBoqHistoryDate(boqMeta.approvedAt)}</p> : null}
        </div>
        <BoqRoomListSection title="Signed room BOQs" rooms={boqRooms} items={boqItems} onOpenRoom={openRoom} />
        <div className="border-t border-[#ececec] py-4">
          <div className="px-4">
            <p className="typo-section-title text-black">Create invoice schedule?</p>
            <p className="typo-body mt-2 text-[#5f7467]">Choose how this approved quotation should move into Finance.</p>
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
                      <p className="typo-body-strong">{title}</p>
                      <p className="typo-body mt-1">{detail}</p>
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
        <Button
          type="button"
          fullWidth
          onClick={() => {
            actions.createFinanceScheduleFromBoq(financeMode)
            onOpenFinance?.()
          }}
        >
          {financeMode === 'auto' ? 'Create invoice schedule' : 'Open Finance'}
        </Button>
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
      <div className="ui-screen-content">
        <p className="typo-body text-[#5f7467]">This signed version is kept as a read-only record for the team.</p>
      </div>
      <BoqHistoryDetailBody snapshot={selectedHistory} />
    </section>
  )

  if (selectedHistory) {
    return <main className="ui-screen-base ui-feature-surface min-h-dvh w-full overflow-x-hidden bg-white text-black">{renderHistoryDetail()}</main>
  }

  if (screen === 'import') {
    return <main className="ui-screen-base ui-feature-surface min-h-dvh w-full overflow-x-hidden bg-white text-black">{renderImport()}</main>
  }

  const resetInlineNewDraft = () => setInlineNewDraft({
    item: '',
    category: '',
    type: 'none',
    notes: '',
    quantity: 1,
    unit: '',
    rate: 0,
    vendor: '',
    vendorQuantity: 1,
    vendorUnit: '',
    vendorRate: 0,
    markupPercent: 0,
  })

  const resetInlineRoomDraft = () => setInlineRoomDraft({ name: '', note: '' })

  const startInlineNewRoom = () => {
    setInlineNewRoomOpen(true)
    setSelectedRoomId(null)
    setInlineEditingItemId(null)
    setInlineNewRoomId(null)
    resetInlineNewDraft()
  }

  const saveInlineNewRoom = () => {
    const name = inlineRoomDraft.name.trim()
    if (!name) return
    actions.addBoqRoom({
      name,
      note: inlineRoomDraft.note.trim(),
    })
    setInlineNewRoomOpen(false)
    resetInlineRoomDraft()
  }

  const toggleInlineRoom = (room) => {
    setSelectedRoomId((current) => (current === room.id ? null : room.id))
    setInlineNewRoomOpen(false)
    setInlineEditingItemId(null)
    setInlineNewRoomId(null)
    setPendingDeleteItemId(null)
    resetInlineNewDraft()
  }

  const startInlineNewItem = (roomId) => {
    setSelectedRoomId(roomId)
    setInlineEditingItemId(null)
    setInlineNewRoomId(roomId)
    setPendingDeleteItemId(null)
    resetInlineNewDraft()
  }

  const InlineRoomForm = () => (
    <div className="border-t border-[#f2f2f2] py-2">
      <div className="rounded-[14px] border border-[#dbe6df] bg-[#fbfffd] p-2">
        <div className="flex items-center justify-between gap-2">
          <div>
            <p className="typo-body-strong text-black">New room / area</p>
            <p className="typo-meta text-[#6f7c74]">Line items will sit inside this bucket.</p>
          </div>
        </div>

        <div className="mt-2 grid grid-cols-1 gap-2">
          <label className="block">
            <span className="typo-caption text-[#5f7467]">Room or area name</span>
            <input
              value={inlineRoomDraft.name}
              onChange={(event) => setInlineRoomDraft((current) => ({ ...current, name: event.target.value }))}
              placeholder="Kitchen"
              className="ui-input-base typo-meta mt-1 w-full border border-[#dbe6df] bg-white text-black outline-none focus:border-[#173324]"
            />
          </label>
          <label className="block">
            <span className="typo-caption text-[#5f7467]">Room note</span>
            <input
              value={inlineRoomDraft.note}
              onChange={(event) => setInlineRoomDraft((current) => ({ ...current, note: event.target.value }))}
              placeholder="Optional scope note"
              className="ui-input-base typo-meta mt-1 w-full border border-[#dbe6df] bg-white text-black outline-none focus:border-[#173324]"
            />
          </label>
        </div>

        <div className="mt-2 grid grid-cols-2 gap-2">
          <Button
            type="button"
            onClick={saveInlineNewRoom}
            disabled={!inlineRoomDraft.name.trim()}
            variant="primary"
            size="small"
            className="typo-body-strong w-full"
          >
            Save room
          </Button>
          <Button
            type="button"
            variant="outline"
            size="small"
            onClick={() => {
              setInlineNewRoomOpen(false)
              resetInlineRoomDraft()
            }}
            className="typo-body-strong w-full border-[#e0e0e0]"
          >
            Cancel
          </Button>
        </div>
      </div>
    </div>
  )

  const saveInlineNewItem = (room) => {
    if (!inlineNewDraft.item.trim()) return
    actions.addBoqItem({
      ...inlineNewDraft,
      roomId: room.id,
      space: room.name,
      item: inlineNewDraft.item.trim(),
      category: inlineNewDraft.category.trim() || 'General',
      unit: inlineNewDraft.unit.trim() || 'unit',
      vendorUnit: inlineNewDraft.vendorUnit.trim() || inlineNewDraft.unit.trim() || 'unit',
    })
    setInlineNewRoomId(null)
    resetInlineNewDraft()
  }

  const deleteInlineItem = (item) => {
    if (!item) return
    actions.deleteBoqItem(item.id)
    setPendingDeleteItemId(null)
    setInlineEditingItemId(null)
  }

  const LineItemCard = ({ item, editing, onToggle }) => {
    const clientAmount = getBoqItemAmount(item)
    const vendorAmount = (Number(item.vendorQuantity ?? item.quantity) || 0) * (Number(item.vendorRate) || 0)
    const margin = clientAmount - vendorAmount
    const typeLabel = item.type || 'none'

    return (
      <button type="button" onClick={onToggle} className="w-full px-3 py-2 text-left">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <p className="typo-body-strong text-black">{item.item}</p>
            <p className="typo-meta mt-0.5 truncate text-[#64756c]">
              {item.category || 'General'} / {typeLabel} / {item.quantity || 0} {item.unit || 'unit'} x {formatRupees(item.rate || 0)}
            </p>
          </div>
          <div className="shrink-0 text-right">
            <p className="typo-body-strong text-[#267449]">{formatRupees(clientAmount)}</p>
            <p className={`typo-meta mt-0.5 ${margin >= 0 ? 'text-[#267449]' : 'text-[#c34545]'}`}>{formatRupees(margin)} margin</p>
          </div>
        </div>

        <div className="mt-2 flex items-center justify-between gap-2 rounded-[10px] bg-[#f7fbf8] px-2 py-1.5">
          <div className="min-w-0">
            <p className="typo-meta truncate text-[#5f7467]">{item.vendor || 'Vendor TBD'} / cost {formatRupees(vendorAmount)}</p>
            {item.notes ? <p className="typo-meta mt-0.5 line-clamp-1 text-[#8a9891]">{item.notes}</p> : null}
          </div>
          <span className={`typo-caption shrink-0 rounded-full px-2 py-1 ${editing ? 'bg-black text-white' : 'bg-white text-[#173324]'}`}>
            {editing ? 'Editing' : 'Edit'}
          </span>
        </div>
      </button>
    )
  }

  const InlineLineItemForm = ({ room, item = null, draft = null, onDraftChange = null }) => {
    const isNew = !item
    const source = isNew ? draft : item
    const updateField = (key, value) => {
      const nextValue = ['rate', 'vendorRate', 'markupPercent', 'vendorQuantity', 'quantity'].includes(key)
        ? Number(value) || 0
        : value
      if (isNew) {
        onDraftChange((current) => ({ ...current, [key]: nextValue }))
        return
      }
      actions.updateBoqItem(item.id, { [key]: nextValue })
    }

    const Field = ({ label, field, className = '', type = 'text' }) => (
      <label className={`block ${className}`}>
        <span className="typo-caption text-[#5f7467]">{label}</span>
        <input type={type} value={source?.[field] ?? ''} onChange={(event) => updateField(field, event.target.value)} className="ui-input-base typo-meta mt-1 w-full border border-[#dbe6df] bg-white text-black outline-none focus:border-[#173324]" />
      </label>
    )

    return (
      <div className="border-t border-[#edf1ee] bg-[#fbfffd] p-2">
        <div className="rounded-[14px] border border-[#dbe6df] bg-white p-2">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="typo-body-strong text-black">{isNew ? 'New line item' : 'Edit line item'}</p>
              <p className="typo-meta text-[#6f7c74]">Client + vendor values.</p>
            </div>
          </div>

          <div className="mt-2 grid grid-cols-2 gap-2">
            <Field label="Particulars" field="item" className="col-span-2" />
            <Field label="Category" field="category" />
            <label className="block">
              <span className="typo-caption text-[#5f7467]">Type</span>
              <select value={source.type || 'none'} onChange={(event) => updateField('type', event.target.value)} className="ui-select-base typo-meta mt-1 w-full border border-[#dbe6df] bg-white text-black outline-none focus:border-[#173324]">
                <option value="none">None</option>
                <option value="ready-made">Ready-made</option>
                <option value="custom">Custom</option>
                <option value="supply only">Supply only</option>
              </select>
            </label>
            <label className="col-span-2 block">
              <span className="typo-caption text-[#5f7467]">Details</span>
              <textarea value={source.notes || ''} onChange={(event) => updateField('notes', event.target.value)} className="ui-textarea-base typo-meta mt-1 min-h-12 w-full resize-none border border-[#dbe6df] bg-white text-black outline-none focus:border-[#173324]" />
            </label>
          </div>

          <div className="mt-2 rounded-[12px] bg-[#f7fbf8] p-2">
            <p className="typo-caption text-[#5f7467]">Client</p>
            <div className="mt-1.5 grid grid-cols-3 gap-2">
              <Field label="Qty" field="quantity" />
              <Field label="Unit" field="unit" />
              <Field label="Rate" field="rate" />
            </div>
          </div>

          <div className="mt-2 rounded-[12px] bg-[#fffaf2] p-2">
            <p className="typo-caption text-[#9a7b42]">Vendor</p>
            <div className="mt-1.5 grid grid-cols-2 gap-2">
              <Field label="Vendor name" field="vendor" className="col-span-2" />
              <Field label="Vendor qty" field="vendorQuantity" />
              <Field label="Vendor unit" field="vendorUnit" />
              <Field label="Vendor rate" field="vendorRate" />
              <Field label="Markup" field="markupPercent" />
            </div>
          </div>

          {pendingDeleteItemId === item?.id ? (
            <div className="mt-2 rounded-[12px] border border-[#f0d1d1] bg-[#fff8f8] p-2">
              <p className="typo-meta text-[#a64848]">Delete this line item?</p>
              <div className="mt-2 grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setPendingDeleteItemId(null)}
                  className="typo-body-strong h-9 rounded-full border border-[#e0e0e0] bg-white text-black"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={() => deleteInlineItem(item)}
                  className="typo-body-strong flex h-9 items-center justify-center gap-1 rounded-full bg-[#c34545] text-white"
                >
                  <Trash size={14} />
                  Delete item
                </button>
              </div>
            </div>
          ) : (
            <div className={`mt-2 grid gap-2 ${isNew ? 'grid-cols-2' : 'grid-cols-3'}`}>
              <button type="button" onClick={() => { if (isNew) { saveInlineNewItem(room) } else { setPendingDeleteItemId(null); setInlineEditingItemId(null) } }} className="typo-body-strong h-9 rounded-full bg-black text-white">Save</button>
              <button type="button" onClick={() => { if (isNew) { setInlineNewRoomId(null); resetInlineNewDraft() } else { setPendingDeleteItemId(null); setInlineEditingItemId(null) } }} className="typo-body-strong h-9 rounded-full border border-[#e0e0e0] bg-white text-black">Discard</button>
              {!isNew ? (
              <button
                type="button"
                onClick={() => setPendingDeleteItemId(item.id)}
                className="typo-body-strong flex h-9 items-center justify-center gap-1 rounded-full border border-[#f0d1d1] bg-white text-[#a64848]"
                aria-label="Delete line item"
              >
                <Trash size={14} />
                Delete
              </button>
              ) : null}
            </div>
          )}
        </div>
      </div>
    )
  }

  if (screen === 'history') {
    return <main className="ui-screen-base ui-feature-surface min-h-dvh w-full overflow-x-hidden bg-white text-black">{renderHistory()}</main>
  }

  if (screen === 'changes') {
    return <main className="ui-screen-base ui-feature-surface min-h-dvh w-full overflow-x-hidden bg-white text-black">{renderChanges()}</main>
  }

  if (screen === 'room' && selectedRoom) {
    return <main className="ui-screen-base ui-feature-surface min-h-dvh w-full overflow-x-hidden bg-white text-black">{renderRoom()}</main>
  }

  if (screen === 'item' && selectedItem) {
    return <main className="ui-screen-base ui-feature-surface min-h-dvh w-full overflow-x-hidden bg-white text-black">{renderItem()}</main>
  }

  return (
    <main className="ui-screen-base ui-feature-surface min-h-dvh w-full overflow-x-hidden bg-white text-black">
      {boqMeta.status === 'approved' ? renderApproved() : renderHome()}
    </main>
  )
}

export default ProBoqWorkspace
