import { useState } from 'react'
import {
  ArrowRight,
  Buildings,
  CaretDown,
  CaretLeft,
  CheckCircle,
  FileArrowDown,
  House,
  PencilSimpleLine,
  Plus,
  ArrowCounterClockwise,
  Trash,
} from '@phosphor-icons/react'
import { useSharedProject } from '../collaboration/mockProjectStore'
import { sowTemplates } from './sowData'
import {
  buildAiGeneratedDocument,
  getSowAmendmentOptions,
  sowAiSteps,
  sowStatusLabels,
} from './sowFlowUtils'
import Button from '../../components/ui/Button'

const templateIcons = {
  House,
  Building: Buildings,
  Pencil: PencilSimpleLine,
}

function formatStamp(value) {
  if (!value) return 'Pending'
  return new Date(value).toLocaleString('en-IN', {
    day: '2-digit',
    month: 'short',
    hour: 'numeric',
    minute: '2-digit',
  })
}

function StickyHeader({ title, subtitle, onBack, actions = null }) {
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
          <div className="flex items-center gap-2">
            {actions}
          </div>
        </div>
      </div>
    </header>
  )
}

function SOWSection({ index, title, open, onToggle, badge, bodyClassName = 'border-t border-[#ececec] px-4 py-4', children }) {
  return (
    <article className="ui-card overflow-hidden">
      <button type="button" onClick={onToggle} className="flex w-full items-center justify-between px-4 py-3 text-left">
        <span className="flex min-w-0 items-center gap-3">
          <span className="typo-caption grid size-6 shrink-0 place-items-center rounded-lg bg-[#f4fbf7] text-[#267449]">{index}</span>
          <span className="typo-card-title ui-section-title truncate">{title}</span>
        </span>
        <span className="flex shrink-0 items-center gap-2">
          {badge ? <span className="typo-caption rounded-full bg-[#fff3dd] px-2 py-1 uppercase text-[#a86a00]">{badge}</span> : null}
          <CaretDown size={14} className={`transition-transform ${open ? 'rotate-180' : ''}`} />
        </span>
      </button>
      {open ? <div className={bodyClassName}>{children}</div> : null}
    </article>
  )
}

function InlineField({ label, value, onChange }) {
  return (
    <label className="block border-b border-[#ededed] pb-3 last:border-b-0 last:pb-0">
      <span className="typo-utility uppercase text-[#71837a]">{label}</span>
      <input
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="typo-data-value mt-1 w-full rounded-[16px] border border-transparent bg-[#f7fbf8] px-3 py-2 text-black outline-none focus:border-[#dbe6df]"
      />
    </label>
  )
}

function OtpRow({ digits, setDigits }) {
  const updateDigit = (index, value) => {
    const next = value.replace(/\D/g, '').slice(-1)
    setDigits((current) => current.map((digit, digitIndex) => (digitIndex === index ? next : digit)))
  }

  return (
    <div className="grid grid-cols-6 gap-2">
      {digits.map((digit, index) => (
        <input
          key={index}
          value={digit}
          inputMode="numeric"
          maxLength={1}
          onChange={(event) => updateDigit(index, event.target.value)}
          className="typo-page-title h-12 rounded-[14px] border border-[#dfdfdf] bg-white text-center text-black outline-none focus:border-black"
        />
      ))}
    </div>
  )
}

function SignatureCard({ label, name, state, stamp }) {
  return (
    <article className="rounded-[18px] border border-[#e2e2e2] bg-white p-3">
      <p className="typo-caption uppercase text-[#7b7b7b]">{label}</p>
      <p className="typo-card-title mt-2 text-black">{name}</p>
      <p className={`typo-caption mt-3 ${state === 'Signed' ? 'text-[#267449]' : 'text-[#777777]'}`}>{state}</p>
      <p className="typo-meta mt-1 text-[#8a8a8a]">{stamp}</p>
    </article>
  )
}

function ProSowWorkspace({ project, onBack, entry = 'existing', initialView }) {
  const projectId = project?.id || 'p-1'
  const { sow, activity, actions } = useSharedProject(projectId)
  const [view, setView] = useState(initialView || (entry === 'create' ? 'template' : 'draft'))
  const [showExecutedDetails, setShowExecutedDetails] = useState(false)
  const [selectedTemplateId, setSelectedTemplateId] = useState('residential')
  const [openSections, setOpenSections] = useState({
    overview: false,
    scope: false,
    exclusions: false,
    timeline: false,
    budget: false,
    payment: false,
    terms: false,
    signatures: false,
  })
  const [designerOtp, setDesignerOtp] = useState(['', '', '', '', '', ''])
  const [aiStepIndex, setAiStepIndex] = useState(0)
  const [aiReply, setAiReply] = useState('')
  const [aiAnswers, setAiAnswers] = useState({})
  const [amendmentDraft, setAmendmentDraft] = useState({
    optionId: 'room-kitchen',
    newValue: '',
    reason: '',
  })

  const selectedTemplate = sowTemplates.find((template) => template.id === selectedTemplateId) || sowTemplates[0]
  const document = sow?.document
  const openRemarks = sow?.remarks?.filter((remark) => remark.status === 'open') || []
  const latestResponses = sow?.responses || []
  const pendingAmendments = sow?.amendments?.filter((amendment) => amendment.status === 'pending') || []
  const amendmentOptions = document ? getSowAmendmentOptions(document) : []
  const selectedAmendmentOption = amendmentOptions.find((option) => option.id === amendmentDraft.optionId) || amendmentOptions[0] || null
  const aiComplete = aiStepIndex >= sowAiSteps.length
  const aiPreviewDocument = sow ? buildAiGeneratedDocument({ document, project, answers: aiAnswers }) : null
  const effectiveView = sow?.status === 'executed' && view === 'draft' ? 'executed' : view

  const toggleSection = (key) => setOpenSections((current) => ({ ...current, [key]: !current[key] }))

  const updateDocument = (key, value) => actions.updateSowDocument({ [key]: value })

  const updateListItem = (key, index, value) => {
    const nextItems = [...document[key]]
    nextItems[index] = value
    actions.updateSowDocument({ [key]: nextItems })
  }

  const removeListItem = (key, index) => {
    actions.updateSowDocument({ [key]: document[key].filter((_, itemIndex) => itemIndex !== index) })
  }

  const addListItem = (key, value) => actions.updateSowDocument({ [key]: [...document[key], value] })

  const updateRoom = (roomId, field, value) => {
    actions.updateSowDocument({
      rooms: document.rooms.map((room) => (
        room.id === roomId ? { ...room, [field]: value } : room
      )),
    })
  }

  const addRoom = () => {
    actions.updateSowDocument({
      rooms: [
        ...document.rooms,
        {
          id: `room-${Date.now()}`,
          name: 'New room',
          scope: 'Add the room-wise scope here.',
        },
      ],
    })
  }

  const removeRoom = (roomId) => {
    actions.updateSowDocument({
      rooms: document.rooms.filter((room) => room.id !== roomId),
    })
  }

  const createDraft = () => {
    actions.createSow(selectedTemplateId)
    setView('draft')
  }

  const openAmendmentComposer = () => {
    const option = amendmentOptions[0]
    setAmendmentDraft({
      optionId: option?.id || '',
      newValue: option?.currentValue || '',
      reason: '',
    })
    setView('amendment')
  }

  const setAmendmentOption = (optionId) => {
    const option = amendmentOptions.find((item) => item.id === optionId)
    setAmendmentDraft({
      optionId,
      newValue: option?.currentValue || '',
      reason: '',
    })
  }

  const submitAmendment = () => {
    if (!selectedAmendmentOption || !amendmentDraft.newValue.trim() || !amendmentDraft.reason.trim()) return
    actions.createSowAmendment({
      sectionKey: selectedAmendmentOption.patch.type === 'room-scope' ? 'rooms' : selectedAmendmentOption.patch.key,
      sectionTitle: selectedAmendmentOption.sectionTitle,
      targetId: selectedAmendmentOption.patch.targetId || null,
      patch: selectedAmendmentOption.patch,
      oldValue: selectedAmendmentOption.currentValue,
      newValue: amendmentDraft.newValue,
      reason: amendmentDraft.reason,
    })
    setView('executed')
  }

  const approveRemark = (remark) => {
    if (remark.sectionKey === 'rooms' && remark.targetId) {
      actions.updateRoomScope(remark.targetId, remark.body)
    }
    if (remark.sectionKey === 'budget') {
      const match = remark.body.match(/(\d+\s?L|\d[\d,]+)/i)
      if (match) actions.updateSowDocument({ totalValueLabel: match[1].replace(/\s+/g, '') })
    }
    actions.respondToRemark(remark.id, 'approve', 'Accepted. The requested change has been reflected in the revised SOW.')
  }

  const rejectRemark = (remark) => {
    actions.respondToRemark(remark.id, 'reject', 'Not accepted for this revision. The current scope/value has been retained with a professional note.')
  }

  const submitAiReply = () => {
    const step = sowAiSteps[aiStepIndex]
    if (!step || !aiReply.trim()) return
    setAiAnswers((current) => ({ ...current, [step.id]: aiReply.trim() }))
    setAiReply('')
    setAiStepIndex((current) => current + 1)
  }

  const applyAiDraft = () => {
    if (!aiPreviewDocument) return
    actions.applyGeneratedSowDocument(aiPreviewDocument, 'AI generated and applied a refreshed SOW draft')
    setView('draft')
  }

  const verifyDesignerOtp = () => {
    if (designerOtp.some((digit) => !digit)) return
    actions.signDesigner()
    setView('draft')
  }

  const renderTemplateScreen = () => (
    <section className="mx-auto w-full max-w-[390px] pb-[132px] pt-[56px]">
      <StickyHeader title="New SOW" subtitle="Choose a starting point" onBack={sow ? () => setView('draft') : onBack} />

      <div className="ui-screen-content">
        <section className="pb-5">
          <p className="typo-caption uppercase text-[#6e907d]">Template picker</p>
          <h1 className="typo-page-title mt-2 text-black">Choose the structure you want to begin with.</h1>
          <p className="typo-body mt-2 text-[#6f6f6f]">Pick a template to start. Standard clauses stay pre-filled, and you can customize everything after.</p>
        </section>

        <div className="space-y-2">
          {sowTemplates.map((template) => {
            const Icon = templateIcons[template.icon] || House
            const selected = selectedTemplateId === template.id
            return (
              <button
                key={template.id}
                type="button"
                onClick={() => setSelectedTemplateId(template.id)}
                className={`w-full rounded-[18px] border p-4 text-left transition active:scale-[0.99] ${selected ? 'border-[#173324] bg-[#fbfffd] shadow-[0_10px_24px_rgba(16,36,24,0.07)]' : 'border-[#dfe8e2] bg-white'}`}
              >
                <div className="flex items-start justify-between gap-3">
                  <span className={`grid size-11 place-items-center rounded-[14px] border ${selected ? 'border-[#cde7d7] bg-[#eef9f2] text-[#123d28]' : 'border-[#dfe8e2] bg-[#f7faf8] text-[#52665b]'}`}>
                    <Icon size={20} weight={selected ? 'fill' : 'regular'} />
                  </span>
                  <span className={`typo-caption rounded-full px-2 py-1 uppercase ${selected ? 'bg-[#e7f5ed] text-[#267449]' : 'bg-[#f2f5f3] text-[#6f7d74]'}`}>
                    {template.id === 'residential' ? 'Homes' : template.id === 'commercial' ? 'Commercial' : 'Custom'}
                  </span>
                </div>
                <p className="typo-section-title mt-4 text-[#102418]">{template.name}</p>
                <p className="typo-meta mt-1 text-[#5f7467]">{template.subtitle}</p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {template.tags.map((tag) => (
                    <span key={tag} className="typo-caption rounded-full border border-[#dbe6df] bg-white px-3 py-1 uppercase text-[#607269]">
                      {tag}
                    </span>
                  ))}
                </div>
              </button>
            )
          })}
        </div>
      </div>

      <div className="fixed bottom-0 left-1/2 z-[95] w-full max-w-[390px] -translate-x-1/2 border-t border-[#e0e0e0] bg-white px-4 pb-5 pt-3">
        <Button type="button" fullWidth trailingIcon={ArrowRight} onClick={createDraft}>
          Use {selectedTemplate.name} template
        </Button>
      </div>
    </section>
  )

  const renderDraftScreen = () => (
    <section className="mx-auto w-full max-w-[390px] pb-[148px] pt-[56px]">
      <StickyHeader
        title="Scope of Work"
        subtitle={`Revision ${sow.revision}`}
        onBack={onBack}
        actions={(
          <>
            <button type="button" onClick={actions.resetDemo} className="grid size-8 place-items-center rounded-xl border border-[#dbe6df] bg-white text-black" aria-label="Reset SOW">
              <ArrowCounterClockwise size={15} />
            </button>
            <button type="button" onClick={() => setOpenSections((current) => ({ ...current, overview: true, scope: true }))} className="typo-label rounded-full border border-[#dbe6df] bg-white px-3 py-2 text-black">
              Edit
            </button>
          </>
        )}
      />

      <div className="ui-screen-content">
        <section className="pb-5">
          <div className="flex items-center justify-between gap-3">
            <div className="min-w-0">
              <p className="typo-section-title truncate text-[#102418]">{document.projectName}</p>
              <p className="typo-body mt-1 truncate text-[#5f7467]">{document.clientName} | {document.location}</p>
            </div>
            <span className="typo-caption shrink-0 rounded-full bg-[#eef7f1] px-3 py-1 uppercase text-[#267449]">{sowStatusLabels[sow.status] || 'Draft'}</span>
          </div>

          <div className="mt-4 grid grid-cols-3 gap-2">
            <div className="rounded-[18px] border border-[#dce7f3] bg-white px-3 py-3">
              <p className="typo-utility text-[#73849d]">Value</p>
              <p className="typo-card-title mt-2 text-[#102418]">INR {document.totalValueLabel}</p>
            </div>
            <div className="rounded-[18px] border border-[#dbe6df] bg-white px-3 py-3">
              <p className="typo-utility text-[#73867c]">Duration</p>
              <p className="typo-card-title mt-2 text-[#102418]">{document.durationLabel}</p>
            </div>
            <div className="rounded-[18px] border border-[#efe2c8] bg-white px-3 py-3">
              <p className="typo-utility text-[#987f53]">Open remarks</p>
              <p className="typo-card-title mt-2 text-[#102418]">{openRemarks.length}</p>
            </div>
          </div>
          {sow.aiGeneratedAt ? (
            <p className="typo-meta mt-3 text-[#5f7467]">Last AI pass: {formatStamp(sow.aiGeneratedAt)}</p>
          ) : null}
        </section>

        <div className="space-y-3 py-5">
          <SOWSection index="1" title="Project overview" open={openSections.overview} onToggle={() => toggleSection('overview')}>
            <div className="space-y-3">
              <InlineField label="Project" value={document.projectName} onChange={(value) => updateDocument('projectName', value)} />
              <InlineField label="Client" value={document.clientName} onChange={(value) => updateDocument('clientName', value)} />
              <InlineField label="Location" value={document.location} onChange={(value) => updateDocument('location', value)} />
              <InlineField label="Type" value={document.projectType} onChange={(value) => updateDocument('projectType', value)} />
              <InlineField label="Start" value={document.startMonth} onChange={(value) => updateDocument('startMonth', value)} />
              <InlineField label="Handover" value={document.handoverMonth} onChange={(value) => updateDocument('handoverMonth', value)} />
            </div>
          </SOWSection>

          <SOWSection index="2" title="Scope - room wise" open={openSections.scope} onToggle={() => toggleSection('scope')} badge={openRemarks.some((remark) => remark.sectionKey === 'rooms') ? 'Remark' : undefined} bodyClassName="border-t border-[#ececec] px-0 py-3">
            <div className="space-y-3">
              {document.rooms.map((room) => (
                <div key={room.id} className="border-b border-[#edf2ef] pb-3 last:border-b-0 last:pb-0">
                  <div className="mb-1.5 flex items-center justify-between gap-2 px-4">
                    <p className="typo-card-title min-w-0 flex-1 truncate text-[#102418]">{room.name}</p>
                    <button type="button" onClick={() => removeRoom(room.id)} className="grid size-7 place-items-center rounded-full border border-[#e8c3c3] bg-white text-[#c34545]" aria-label="Remove room">
                      <Trash size={14} />
                    </button>
                  </div>
                  <textarea
                    value={room.scope}
                    onChange={(event) => actions.updateRoomScope(room.id, event.target.value)}
                    className="ui-textarea-base typo-body mx-4 min-h-[58px] w-[calc(100%-32px)] resize-none border border-[#dbe6df] bg-[#fbfffd] text-[#102418] outline-none"
                  />
                </div>
              ))}
              <div className="px-4">
                <Button type="button" size="small" variant="outline" fullWidth leadingIcon={Plus} onClick={addRoom} className="border-[#e0e0e0] text-black">Add room</Button>
              </div>
            </div>
          </SOWSection>

          <SOWSection index="3" title="Exclusions" open={openSections.exclusions} onToggle={() => toggleSection('exclusions')} badge={openRemarks.some((remark) => remark.sectionKey === 'exclusions') ? 'Remark' : undefined}>
            <div className="space-y-3">
              <div className="rounded-[18px] border border-[#efe2c8] bg-[#fff9ef] p-3">
                <p className="typo-caption uppercase text-[#9f8350]">Designer managed</p>
                <p className="typo-body mt-1 text-black">The homeowner can question exclusions, but the pro controls the boundary of scope.</p>
              </div>
              {document.exclusions.map((item, index) => (
                <div key={`${item}-${index}`} className="flex items-start gap-2">
                  <textarea
                    value={item}
                    onChange={(event) => updateListItem('exclusions', index, event.target.value)}
                    className="ui-textarea-base typo-body min-h-16 flex-1 border border-[#dbe6df] bg-[#f7fbf8] text-[#102418] outline-none"
                  />
                  <button type="button" onClick={() => removeListItem('exclusions', index)} className="grid size-10 shrink-0 place-items-center rounded-xl border border-[#e1b8b8] bg-white text-[#c34545]" aria-label="Remove exclusion">
                    <Trash size={16} />
                  </button>
                </div>
              ))}
              <Button type="button" size="small" variant="outline" fullWidth leadingIcon={Plus} onClick={() => addListItem('exclusions', 'New designer-managed exclusion')} className="border-[#e0e0e0] text-black">Add exclusion</Button>
            </div>
          </SOWSection>

          <SOWSection index="4" title="Timeline" open={openSections.timeline} onToggle={() => toggleSection('timeline')} badge={openRemarks.some((remark) => remark.sectionKey === 'timeline') ? 'Remark' : undefined}>
            <div className="space-y-3">
              <InlineField label="Start" value={document.startMonth} onChange={(value) => updateDocument('startMonth', value)} />
              <InlineField label="Duration" value={document.durationLabel} onChange={(value) => updateDocument('durationLabel', value)} />
              <InlineField label="Handover" value={document.handoverMonth} onChange={(value) => updateDocument('handoverMonth', value)} />
            </div>
          </SOWSection>

          <SOWSection index="5" title="Budget estimate" open={openSections.budget} onToggle={() => toggleSection('budget')} badge={openRemarks.some((remark) => remark.sectionKey === 'budget') ? 'Remark' : undefined}>
            <div className="space-y-3">
              <InlineField label="Total value" value={document.totalValueLabel} onChange={(value) => updateDocument('totalValueLabel', value)} />
              <InlineField label="Structure" value={document.paymentStructure} onChange={(value) => updateDocument('paymentStructure', value)} />
              <InlineField label="GST" value={document.gstLabel} onChange={(value) => updateDocument('gstLabel', value)} />
            </div>
          </SOWSection>

          <SOWSection index="6" title="Payment terms" open={openSections.payment} onToggle={() => toggleSection('payment')} badge={openRemarks.some((remark) => remark.sectionKey === 'payment') ? 'Remark' : undefined}>
            <div className="space-y-3">
              {document.paymentTerms.map((term, index) => (
                <div key={`${term}-${index}`} className="flex items-start gap-2">
                  <textarea
                    value={term}
                    onChange={(event) => updateListItem('paymentTerms', index, event.target.value)}
                    className="ui-textarea-base typo-body min-h-16 flex-1 border border-[#dbe6df] bg-[#f7fbf8] text-[#102418] outline-none"
                  />
                  <button type="button" onClick={() => removeListItem('paymentTerms', index)} className="grid size-10 shrink-0 place-items-center rounded-xl border border-[#e1b8b8] bg-white text-[#c34545]" aria-label="Remove payment term">
                    <Trash size={16} />
                  </button>
                </div>
              ))}
              <Button type="button" size="small" variant="outline" fullWidth leadingIcon={Plus} onClick={() => addListItem('paymentTerms', 'New payment term')} className="border-[#e0e0e0] text-black">Add payment term</Button>
            </div>
          </SOWSection>

          <SOWSection index="7" title="Terms & notes" open={openSections.terms} onToggle={() => toggleSection('terms')} badge={openRemarks.some((remark) => remark.sectionKey === 'terms') ? 'Remark' : undefined}>
            <div className="space-y-3">
              {document.termsNotes.map((term, index) => (
                <div key={`${term}-${index}`} className="flex items-start gap-2">
                  <textarea
                    value={term}
                    onChange={(event) => updateListItem('termsNotes', index, event.target.value)}
                    className="ui-textarea-base typo-body min-h-16 flex-1 border border-[#dbe6df] bg-[#f7fbf8] text-[#102418] outline-none"
                  />
                  <button type="button" onClick={() => removeListItem('termsNotes', index)} className="grid size-10 shrink-0 place-items-center rounded-xl border border-[#e1b8b8] bg-white text-[#c34545]" aria-label="Remove term">
                    <Trash size={16} />
                  </button>
                </div>
              ))}
              <Button type="button" size="small" variant="outline" fullWidth leadingIcon={Plus} onClick={() => addListItem('termsNotes', 'New term or execution note')} className="border-[#e0e0e0] text-black">Add term or note</Button>
            </div>
          </SOWSection>

          <SOWSection index="8" title="Signatures" open={openSections.signatures} onToggle={() => toggleSection('signatures')} badge={openRemarks.some((remark) => remark.sectionKey === 'signatures') ? 'Remark' : undefined}>
            <div className="mb-3 rounded-[18px] border border-[#efe2c8] bg-[#fff9ef] p-3">
              <p className="typo-caption uppercase text-[#9f8350]">OTP verification</p>
              <p className="typo-body mt-1 text-black">Signatures are captured through the OTP step, not by typing into the document.</p>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <SignatureCard label="Designer" name={project?.designerName || 'Riya Desai'} state={sow.designerSigned ? 'Signed' : 'Tap to sign'} stamp={formatStamp(sow.designerSignedAt)} />
              <SignatureCard label="Client" name={document.clientName} state={sow.clientSigned ? 'Signed' : 'Awaiting'} stamp={formatStamp(sow.clientSignedAt)} />
            </div>
          </SOWSection>

          <Button type="button" variant="ghost" fullWidth leadingIcon={Plus} onClick={() => addListItem('termsNotes', 'Custom SOW field - describe the additional clause or deliverable here.')} className="border border-dashed border-[#b8c9be] bg-[#fbfffd] text-[#173324] hover:bg-[#f6fbf8]">Add custom SOW field</Button>

          {activity.length ? (
            <section className="rounded-[20px] border border-[#e1e1e1] bg-white p-4">
              <p className="typo-label uppercase text-[#5f7467]">Project activity</p>
              <div className="mt-3 space-y-2">
                {activity.slice(0, 4).map((item) => (
                  <p key={item.id} className="typo-meta text-[#5f7467]"><span className="typo-weight-bold text-black">{item.actor}</span> {item.text}</p>
                ))}
              </div>
            </section>
          ) : null}
        </div>
      </div>

      <div className="fixed bottom-0 left-1/2 z-[95] w-full max-w-[390px] -translate-x-1/2 border-t border-[#e0e0e0] bg-white px-4 pb-5 pt-3">
        <Button
          type="button"
          fullWidth
          onClick={() => {
            if (!sow.designerSigned) {
              setView('otp')
              return
            }
            actions.sendSow()
          }}
        >
          {sow.designerSigned ? 'Send for review' : 'Verify and sign designer side'}
        </Button>
        <div className="mt-2 grid grid-cols-3 gap-2">
          <Button type="button" size="small" variant="outline" onClick={() => setView('remarks')} className="w-full border-[#e0e0e0] text-[#4b4b4b]">Remarks</Button>
          <Button type="button" size="small" variant="outline" onClick={() => setView('activity')} className="w-full border-[#e0e0e0] text-[#4b4b4b]">Activity</Button>
          <Button type="button" size="small" variant="outline" onClick={() => setView('ai')} className="w-full border-[#e0e0e0] text-[#4b4b4b]">AI draft</Button>
        </div>
      </div>
    </section>
  )

  const renderAiScreen = () => {
    const currentStep = sowAiSteps[aiStepIndex]
    return (
      <section className="mx-auto w-full max-w-[390px] pb-[132px] pt-[56px]">
        <StickyHeader title="AI Generate SOW" subtitle="Guided draft builder" onBack={() => setView('draft')} />

        <div className="ui-screen-content">
          <section className="rounded-[20px] border border-[#dbe6df] bg-white p-4">
            <p className="typo-body text-[#5f7467]">AI already knows the client, location, and base project details. It will confirm the important choices, then build a refined SOW draft in the shared project state.</p>
          </section>

          <section className="mt-4 rounded-[20px] border border-[#dbe6df] bg-white p-4">
            <div className="space-y-4">
              {sowAiSteps.slice(0, Math.min(aiStepIndex + 1, sowAiSteps.length)).map((step) => (
                <article key={step.id} className="space-y-2">
                  <div className="rounded-[16px] border border-[#e8efe9] bg-[#f8fbf9] p-3">
                    <p className="typo-caption uppercase text-[#6f8476]">{step.title}</p>
                    <p className="typo-body mt-2 text-black">{step.prompt}</p>
                  </div>
                  {aiAnswers[step.id] ? (
                    <div className="rounded-[16px] bg-black px-3 py-3 text-right text-white">
                      <p className="typo-body">{aiAnswers[step.id]}</p>
                    </div>
                  ) : null}
                </article>
              ))}
            </div>
          </section>

          {aiComplete && aiPreviewDocument ? (
            <section className="mt-4 rounded-[20px] border border-[#dbe6df] bg-white p-4">
              <p className="typo-section-title text-black">Generated preview</p>
              <p className="typo-body mt-2 text-[#5f7467]">Kitchen scope, exclusions, billing structure, and notes were refreshed from the guided answers.</p>
              <div className="mt-4 space-y-3">
                <div>
                  <p className="typo-label uppercase text-[#5f7467]">Kitchen</p>
                  <p className="typo-body mt-1 text-black">{aiPreviewDocument.rooms.find((room) => room.id === 'kitchen')?.scope || 'No kitchen scope'}</p>
                </div>
                <div>
                  <p className="typo-label uppercase text-[#5f7467]">Payment terms</p>
                  <div className="mt-1 space-y-1">
                    {aiPreviewDocument.paymentTerms.slice(0, 4).map((term) => <p key={term} className="typo-body text-black">{term}</p>)}
                  </div>
                </div>
              </div>
            </section>
          ) : null}
        </div>

        <div className="fixed bottom-0 left-1/2 z-[95] w-full max-w-[390px] -translate-x-1/2 border-t border-[#e0e0e0] bg-white px-4 pb-5 pt-3">
          {aiComplete ? (
            <Button type="button" fullWidth onClick={applyAiDraft}>
              Apply generated SOW
            </Button>
          ) : (
            <>
              <textarea
                value={aiReply}
                onChange={(event) => setAiReply(event.target.value)}
                placeholder={currentStep?.placeholder}
                className="ui-textarea-base typo-body min-h-24 w-full resize-none border border-[#dbe6df] bg-white text-black outline-none"
              />
              <Button type="button" fullWidth onClick={submitAiReply} disabled={!aiReply.trim()} className="mt-3">
                Send answer
              </Button>
            </>
          )}
        </div>
      </section>
    )
  }

  const renderOtpScreen = () => (
    <section className="mx-auto w-full max-w-[390px] pb-[132px] pt-[56px]">
      <StickyHeader title="Sign SOW" subtitle="Designer verification" onBack={() => setView('draft')} />

      <div className="ui-screen-content">
        <article className="rounded-[22px] border border-[#dbe6df] bg-white p-5 text-center">
          <div className="mx-auto grid size-16 place-items-center rounded-[20px] bg-[#f4fbf7] text-black">
            <CheckCircle size={28} weight="fill" />
          </div>
          <h2 className="typo-page-title mt-4 text-black">Verify your identity</h2>
          <p className="typo-body mt-2 text-[#5f7467]">An OTP has been sent to the registered professional number. Verifying it signs the SOW before it is sent to the homeowner.</p>
          <div className="mt-5">
            <OtpRow digits={designerOtp} setDigits={setDesignerOtp} />
          </div>
          <p className="typo-meta mt-4 text-[#7b7b7b]">OTP valid for 10 minutes. This acts as an electronic signature for the professional side.</p>
        </article>
      </div>

      <div className="fixed bottom-0 left-1/2 z-[95] w-full max-w-[390px] -translate-x-1/2 border-t border-[#e0e0e0] bg-white px-4 pb-5 pt-3">
        <Button type="button" fullWidth onClick={verifyDesignerOtp} disabled={designerOtp.some((digit) => !digit)}>
          Verify and sign
        </Button>
      </div>
    </section>
  )

  const renderRemarksScreen = () => {
    const allActioned = (sow.remarks || []).length > 0 && openRemarks.length === 0
    return (
      <section className="mx-auto w-full max-w-[390px] pb-[132px] pt-[56px]">
        <StickyHeader title="Client remarks" subtitle={`${openRemarks.length} open`} onBack={() => setView('draft')} />

        <div className="ui-screen-content">
          <article className="rounded-[20px] border border-[#dbe6df] bg-white p-4">
            <p className="typo-section-title text-black">Action every remark before resubmitting</p>
            <p className="typo-body mt-1 text-[#5f7467]">This follows the HTML review pattern: accept or reject each remark, then resubmit the revision.</p>
          </article>

          <div className="mt-4 space-y-3">
            {(sow.remarks || []).length ? sow.remarks.map((remark) => {
              const response = latestResponses.find((item) => item.remarkId === remark.id)
              return (
                <article key={remark.id} className={`rounded-[20px] border p-4 ${remark.status === 'open' ? 'border-[#efe2c8] bg-white' : 'border-[#dbe6df] bg-white'}`}>
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="typo-label uppercase text-[#5f7467]">{remark.sectionTitle}</p>
                      <p className="typo-body mt-3 text-black">{remark.body}</p>
                    </div>
                    <span className={`typo-caption shrink-0 rounded-full px-2 py-1 uppercase ${remark.status === 'accepted' ? 'bg-[#eaf9f1] text-[#267449]' : remark.status === 'rejected' ? 'bg-[#fdecec] text-[#c34545]' : 'bg-[#fff3dd] text-[#a86a00]'}`}>{remark.status}</span>
                  </div>
                  {response ? (
                    <div className={`mt-3 rounded-[16px] p-3 ${response.decision === 'approve' ? 'bg-[#f4fbf7]' : 'bg-[#fff5f5]'}`}>
                      <p className="typo-caption uppercase text-[#5f7467]">{response.decision === 'approve' ? 'Updated' : 'Rejected'}</p>
                      <p className="typo-body mt-2 text-black">{response.body}</p>
                    </div>
                  ) : (
                    <div className="mt-3 grid grid-cols-2 gap-2">
                      <Button type="button" size="small" onClick={() => approveRemark(remark)}>Accept</Button>
                      <Button type="button" size="small" variant="outline" onClick={() => rejectRemark(remark)} className="border-[#e0e0e0] text-black">Reject</Button>
                    </div>
                  )}
                </article>
              )
            }) : (
              <article className="rounded-[20px] border border-[#e1e1e1] bg-white p-4 text-center">
                <CheckCircle size={24} weight="fill" className="mx-auto text-[#267449]" />
                <p className="typo-card-title mt-3 text-black">No remarks yet</p>
                <p className="typo-body mt-1 text-[#5f7467]">When the homeowner comments in another tab, it will appear here.</p>
              </article>
            )}
          </div>
        </div>

        <div className="fixed bottom-0 left-1/2 z-[95] w-full max-w-[390px] -translate-x-1/2 border-t border-[#e0e0e0] bg-white px-4 pb-5 pt-3">
          <Button type="button" fullWidth onClick={() => { actions.sendSow(); setView('draft') }} disabled={!allActioned}>
            {allActioned ? 'Resubmit to homeowner' : 'Action all remarks first'}
          </Button>
          <p className="typo-meta mt-2 text-center text-[#7b7b7b]">{(sow.remarks || []).length - openRemarks.length} of {(sow.remarks || []).length} remarks actioned</p>
        </div>
      </section>
    )
  }

  const renderActivityScreen = () => (
    <section className="mx-auto w-full max-w-[390px] pb-[132px] pt-[56px]">
      <StickyHeader title="Project activity" subtitle="Shared events" onBack={() => setView('draft')} />
      <div className="ui-screen-content space-y-3">
        {activity.map((item) => (
          <article key={item.id} className="rounded-[20px] border border-[#dbe6df] bg-white p-4">
            <p className="typo-card-title text-black">{item.actor}</p>
            <p className="typo-body mt-1 text-[#5f7467]">{item.text}</p>
          </article>
        ))}
      </div>
    </section>
  )

  const renderExecutedScreen = () => (
    <section className="mx-auto w-full max-w-[390px] pb-[132px] pt-[56px]">
      <StickyHeader
        title="Scope of Work"
        subtitle="Executed document"
        onBack={onBack}
        actions={<button type="button" className="grid size-8 place-items-center rounded-xl border border-[#dbe6df] bg-white text-black"><FileArrowDown size={15} /></button>}
      />

      <div className="ui-screen-content">
        <section className="rounded-[22px] border border-[#dbe6df] bg-white p-5 text-center">
          <div className="mx-auto grid size-16 place-items-center rounded-[20px] bg-[#f4fbf7] text-black">
            <CheckCircle size={28} weight="fill" />
          </div>
          <h1 className="typo-page-title mt-4 text-black">SOW executed</h1>
          <p className="typo-body mt-2 text-[#5f7467]">Both parties have signed. The base document is locked, and any change now moves through a formal amendment.</p>
          <p className="typo-meta mt-3 text-[#7b7b7b]">Revision {sow.revision}</p>
        </section>

        <section className="mt-4 grid grid-cols-2 gap-3">
          <SignatureCard label="Designer" name={project?.designerName || 'Riya Desai'} state="Signed" stamp={formatStamp(sow.designerSignedAt)} />
          <SignatureCard label="Client" name={document.clientName} state="Signed" stamp={formatStamp(sow.clientSignedAt)} />
        </section>

        <section className="mt-4 rounded-[20px] border border-[#efe2c8] bg-[#fff9ef] p-4">
          <p className="typo-section-title text-black">Amendments</p>
          <p className="typo-body mt-1 text-[#5f7467]">Raise a formal amendment when the scope, budget, or terms change after execution.</p>
        </section>

        <section className="mt-4 space-y-3">
          {(sow.amendments || []).length ? sow.amendments.map((amendment) => (
            <article key={amendment.id} className="rounded-[20px] border border-[#dbe6df] bg-white p-4">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="typo-card-title text-black">Amendment v{amendment.version}</p>
                  <p className="typo-meta mt-1 text-[#7b7b7b]">{amendment.sectionTitle}</p>
                </div>
                <span className={`typo-caption rounded-full px-2 py-1 uppercase ${amendment.status === 'approved' ? 'bg-[#eaf9f1] text-[#267449]' : amendment.status === 'rejected' ? 'bg-[#fdecec] text-[#c34545]' : 'bg-[#fff3dd] text-[#a86a00]'}`}>{amendment.status}</span>
              </div>
              <div className="mt-3 rounded-[16px] bg-[#fafafa] p-3">
                <p className="typo-caption uppercase text-[#7b7b7b]">From</p>
                <p className="typo-body mt-1 text-[#8a8a8a]">{amendment.oldValue}</p>
                <p className="typo-caption mt-3 uppercase text-[#7b7b7b]">To</p>
                <p className="typo-body mt-1 text-black">{amendment.newValue}</p>
              </div>
              <p className="typo-body mt-3 text-[#5f7467]">Reason: {amendment.reason}</p>
              {amendment.responseText ? <p className="typo-meta mt-2 text-[#7b7b7b]">{amendment.responseText}</p> : null}
            </article>
          )) : (
            <article className="rounded-[20px] border border-[#e1e1e1] bg-white p-4 text-center">
              <p className="typo-card-title text-black">No amendments yet</p>
              <p className="typo-body mt-1 text-[#5f7467]">Raise one when the executed document needs a formal change.</p>
            </article>
          )}
        </section>

        {pendingAmendments.length ? (
          <section className="mt-4 rounded-[20px] border border-[#dbe6df] bg-white p-4">
            <p className="typo-label uppercase text-[#5f7467]">Pending with homeowner</p>
            <p className="typo-body mt-1 text-[#5f7467]">{pendingAmendments.length} amendment{pendingAmendments.length > 1 ? 's are' : ' is'} waiting for homeowner approval.</p>
          </section>
        ) : null}
        {showExecutedDetails ? (
          <div className="space-y-3 pt-2">
            <SOWSection index="1" title="Project overview" open={openSections.overview} onToggle={() => toggleSection('overview')}>
              <div className="space-y-3">
                {[
                  ['Project', document.projectName],
                  ['Client', document.clientName],
                  ['Location', document.location],
                  ['Type', document.projectType],
                  ['Handover', document.handoverMonth],
                ].map(([label, value]) => (
                  <div key={label} className="flex items-start justify-between gap-4 border-b border-[#ededed] pb-2 last:border-b-0 last:pb-0">
                    <span className="typo-utility uppercase text-[#71837a]">{label}</span>
                    <span className="typo-data-value text-right text-black">{value}</span>
                  </div>
                ))}
              </div>
            </SOWSection>

            <SOWSection index="2" title="Scope - room wise" open={openSections.scope} onToggle={() => toggleSection('scope')}>
              <div className="space-y-3">
                {document.rooms.map((room) => (
                  <article key={room.id} className="border-b border-[#ededed] pb-3 last:border-b-0 last:pb-0">
                    <p className="typo-card-title text-black">{room.name}</p>
                    <p className="typo-body mt-1 text-[#5f7467]">{room.scope}</p>
                  </article>
                ))}
              </div>
            </SOWSection>

            <SOWSection index="3" title="Exclusions" open={openSections.exclusions} onToggle={() => toggleSection('exclusions')}>
              <div className="space-y-2">
                {document.exclusions.map((item, index) => (
                  <div key={`${item}-${index}`} className="typo-body flex items-start gap-2 text-black">
                    <span className="mt-1 size-1.5 rounded-full bg-[#8c8c8c]" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </SOWSection>

            <SOWSection index="4" title="Timeline" open={openSections.timeline} onToggle={() => toggleSection('timeline')}>
              <div className="grid grid-cols-3 gap-2">
                {[
                  ['Start', document.startMonth],
                  ['Duration', document.durationLabel],
                  ['Handover', document.handoverMonth],
                ].map(([label, value]) => (
                  <article key={label} className="rounded-[18px] border border-[#e2e2e2] bg-white px-2 py-3 text-center">
                    <p className="typo-caption uppercase text-[#7b7b7b]">{label}</p>
                    <p className="typo-label mt-2 text-black">{value}</p>
                  </article>
                ))}
              </div>
            </SOWSection>

            <SOWSection index="5" title="Budget estimate" open={openSections.budget} onToggle={() => toggleSection('budget')}>
              <div className="rounded-[18px] border border-[#dce7f3] bg-white px-3 py-3">
                <p className="typo-caption uppercase text-[#73849d]">Total value</p>
                <p className="typo-page-title mt-2 text-black">INR {document.totalValueLabel}</p>
              </div>
            </SOWSection>

            <SOWSection index="6" title="Payment terms" open={openSections.payment} onToggle={() => toggleSection('payment')}>
              <div className="space-y-3">
                {document.stages.map((stage) => (
                  <div key={stage.id} className="flex items-start justify-between gap-4 border-b border-[#ededed] pb-2 last:border-b-0 last:pb-0">
                    <span className="typo-body text-[#102418]">{stage.label}</span>
                    <span className="typo-body-strong text-black">{stage.percentage}%</span>
                  </div>
                ))}
              </div>
            </SOWSection>
          </div>
        ) : null}

        <button
          type="button"
          onClick={() => setShowExecutedDetails(!showExecutedDetails)}
          className="typo-body-strong mt-4 flex w-full items-center justify-between rounded-[20px] border border-[#dbe6df] bg-[#f7fbf8] p-4 text-left text-black"
        >
          <span>View executed SOW details</span>
          <span className="typo-meta text-[#267449]">
            {showExecutedDetails ? 'Hide details' : 'Show details'}
          </span>
        </button>
      </div>

      <div className="fixed bottom-0 left-1/2 z-[95] w-full max-w-[390px] -translate-x-1/2 border-t border-[#e0e0e0] bg-white px-4 pb-5 pt-3">
        <Button type="button" variant="outline" fullWidth onClick={openAmendmentComposer} className="border-black text-black">
          Raise amendment
        </Button>
      </div>
    </section>
  )

  const renderAmendmentScreen = () => (
    <section className="mx-auto w-full max-w-[390px] pb-[132px] pt-[56px]">
      <StickyHeader title={`Amendment v${(sow?.amendments?.length || 0) + 1}`} subtitle="Send for homeowner approval" onBack={() => setView('executed')} />

      <div className="ui-screen-content">
        <article className="rounded-[20px] border border-[#dbe6df] bg-white p-4">
          <p className="typo-body text-[#5f7467]">This amendment will be visible to the homeowner in the shared review flow. It only takes effect once they approve it.</p>
        </article>

        <section className="mt-4 rounded-[20px] border border-[#dbe6df] bg-white p-4">
          <label className="block">
            <span className="typo-label uppercase text-[#5f7467]">What is changing</span>
            <select value={amendmentDraft.optionId} onChange={(event) => setAmendmentOption(event.target.value)} className="ui-select-base typo-body mt-2 w-full border border-[#dbe6df] bg-white text-black outline-none">
              {amendmentOptions.map((option) => (
                <option key={option.id} value={option.id}>{option.label}</option>
              ))}
            </select>
          </label>

          {selectedAmendmentOption ? (
            <div className="mt-4 rounded-[18px] bg-[#fafafa] p-3">
              <p className="typo-caption uppercase text-[#7b7b7b]">Current value</p>
              <p className="typo-body mt-2 text-[#7b7b7b] whitespace-pre-wrap">{selectedAmendmentOption.currentValue}</p>
            </div>
          ) : null}

          <label className="mt-4 block">
            <span className="typo-label uppercase text-[#5f7467]">New value</span>
            <textarea
              value={amendmentDraft.newValue}
              onChange={(event) => setAmendmentDraft((current) => ({ ...current, newValue: event.target.value }))}
              className="ui-textarea-base typo-body mt-2 min-h-28 w-full resize-none border border-[#dbe6df] bg-white text-black outline-none"
            />
          </label>

          <label className="mt-4 block">
            <span className="typo-label uppercase text-[#5f7467]">Reason for amendment</span>
            <textarea
              value={amendmentDraft.reason}
              onChange={(event) => setAmendmentDraft((current) => ({ ...current, reason: event.target.value }))}
              placeholder="Describe why this amendment is needed."
              className="ui-textarea-base typo-body mt-2 min-h-24 w-full resize-none border border-[#dbe6df] bg-white text-black outline-none"
            />
          </label>
        </section>
      </div>

      <div className="fixed bottom-0 left-1/2 z-[95] w-full max-w-[390px] -translate-x-1/2 border-t border-[#e0e0e0] bg-white px-4 pb-5 pt-3">
        <Button type="button" fullWidth onClick={submitAmendment} disabled={!amendmentDraft.newValue.trim() || !amendmentDraft.reason.trim()}>
          Send for approval
        </Button>
      </div>
    </section>
  )

  if (!sow) {
    return <main className="ui-screen-base ui-feature-surface min-h-dvh w-full overflow-x-hidden bg-white text-black">{renderTemplateScreen()}</main>
  }

  return (
    <main className="ui-screen-base ui-feature-surface min-h-dvh w-full overflow-x-hidden bg-white text-black">
      {effectiveView === 'template' ? renderTemplateScreen() : null}
      {effectiveView === 'draft' ? renderDraftScreen() : null}
      {effectiveView === 'ai' ? renderAiScreen() : null}
      {effectiveView === 'otp' ? renderOtpScreen() : null}
      {effectiveView === 'remarks' ? renderRemarksScreen() : null}
      {effectiveView === 'activity' ? renderActivityScreen() : null}
      {effectiveView === 'executed' ? renderExecutedScreen() : null}
      {effectiveView === 'amendment' ? renderAmendmentScreen() : null}
    </main>
  )
}

export default ProSowWorkspace
