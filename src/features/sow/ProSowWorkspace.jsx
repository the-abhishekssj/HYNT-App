import { useState } from 'react'
import {
  ArrowRight,
  Buildings,
  CaretDown,
  CaretLeft,
  CheckCircle,
  FileArrowDown,
  House,
  NotePencil,
  PencilSimpleLine,
  Plus,
  Trash,
} from '@phosphor-icons/react'
import { useSharedProject } from '../collaboration/mockProjectStore'
import { sowTemplates } from './sowData'

const templateIcons = {
  House,
  Building: Buildings,
  Pencil: PencilSimpleLine,
}

const statusLabels = {
  draft: 'Draft',
  'client-review': 'With client',
  remarks: 'Remarks',
  'revision-ready': 'Revision ready',
  executed: 'Executed',
}

function SOWSection({ index, title, open, onToggle, badge, children }) {
  return (
    <article className="overflow-hidden rounded-2xl border border-[#dbe6df] bg-white shadow-[0_10px_26px_rgba(24,40,31,0.04)]">
      <button type="button" onClick={onToggle} className="flex w-full items-center justify-between pl-3 pr-4 py-3.5 text-left">
        <span className="flex min-w-0 items-center gap-3">
          <span className="type-caption grid size-6 shrink-0 place-items-center rounded-lg border border-[#d9e6de] bg-[#f4fbf7] text-[#267449]">{index}</span>
          <span className="type-card-title truncate text-[#102418]">{title}</span>
        </span>
        <span className="flex shrink-0 items-center gap-2">
          {badge ? <span className="type-caption rounded-full bg-[#e7f5ec] px-2 py-1 uppercase text-[#267449]">{badge}</span> : null}
          <CaretDown size={14} className={`transition-transform ${open ? 'rotate-180' : ''}`} />
        </span>
      </button>
      {open ? <div className="border-t border-[#eaeaea] px-4 py-4">{children}</div> : null}
    </article>
  )
}

function StickyHeader({ title, subtitle, onBack, actionLabel, onAction }) {
  return (
    <header className="fixed left-1/2 top-0 z-[90] w-full max-w-[390px] -translate-x-1/2 border-b border-[#dfe8e2] bg-[rgba(251,255,252,0.88)] backdrop-blur-[16px]">
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
          {actionLabel ? (
            <button type="button" onClick={onAction} className="type-label shrink-0 rounded-full border border-[#dbe6df] bg-white px-3 py-2 text-black">
              {actionLabel}
            </button>
          ) : (
            <button type="button" className="grid size-8 shrink-0 place-items-center rounded-xl border border-[#dbe6df] bg-white text-black">
              <FileArrowDown size={15} />
            </button>
          )}
        </div>
      </div>
    </header>
  )
}

function InlineField({ label, value, onChange }) {
  return (
    <label className="block border-b border-[#ededed] pb-3 last:border-b-0 last:pb-0">
      <span className="type-utility uppercase text-[#71837a]">{label}</span>
      <input
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="type-data-value mt-1 w-full rounded-xl border border-transparent bg-[#f7fbf8] px-3 py-2 text-black outline-none focus:border-[#dbe6df]"
      />
    </label>
  )
}

function ProSowWorkspace({ project, onBack, entry = 'existing', initialView }) {
  const projectId = project?.id || 'p-1'
  const { sow, activity, actions } = useSharedProject(projectId)
  const [view, setView] = useState(initialView || (entry === 'create' ? 'template' : 'draft'))
  const [selectedTemplateId, setSelectedTemplateId] = useState('residential')
  const [openSections, setOpenSections] = useState({
    overview: true,
    scope: true,
    exclusions: false,
    timeline: false,
    budget: false,
    payment: false,
    terms: false,
    signatures: true,
  })

  const selectedTemplate = sowTemplates.find((template) => template.id === selectedTemplateId) || sowTemplates[0]
  const document = sow?.document
  const openRemarks = sow?.remarks?.filter((remark) => remark.status === 'open') || []
  const latestResponses = sow?.responses || []

  const toggleSection = (key) => {
    setOpenSections((current) => ({ ...current, [key]: !current[key] }))
  }

  const updateDocument = (key, value) => {
    actions.updateSowDocument({ [key]: value })
  }

  const updateExclusion = (index, value) => {
    const nextExclusions = [...document.exclusions]
    nextExclusions[index] = value
    actions.updateSowDocument({ exclusions: nextExclusions })
  }

  const updateListItem = (key, index, value) => {
    const nextItems = [...document[key]]
    nextItems[index] = value
    actions.updateSowDocument({ [key]: nextItems })
  }

  const addListItem = (key, value) => {
    actions.updateSowDocument({ [key]: [...document[key], value] })
  }

  const removeListItem = (key, index) => {
    actions.updateSowDocument({ [key]: document[key].filter((_, itemIndex) => itemIndex !== index) })
  }

  const addExclusion = () => {
    actions.updateSowDocument({ exclusions: [...document.exclusions, 'New designer-managed exclusion'] })
  }

  const removeExclusion = (index) => {
    actions.updateSowDocument({ exclusions: document.exclusions.filter((_, itemIndex) => itemIndex !== index) })
  }

  const createDraft = () => {
    actions.createSow(selectedTemplateId)
    setView('draft')
  }

  const approveRemark = (remark) => {
    if (remark.sectionKey === 'rooms' && remark.targetId) {
      actions.updateRoomScope(remark.targetId, `${remark.body}`)
    }
    actions.respondToRemark(remark.id, 'approve', 'Accepted. The requested change has been reflected in the revised SOW.')
  }

  const rejectRemark = (remark) => {
    actions.respondToRemark(remark.id, 'reject', 'Not accepted for this revision. The current scope/value has been retained with a professional note.')
  }

  const renderNoSow = () => (
    <section className="mx-auto w-full max-w-[390px] pb-[132px] pt-[56px]">
      <StickyHeader title="Scope of Work" subtitle="No SOW yet" onBack={onBack} />

      <div className="px-4 py-5">
        <section className="rounded-2xl border border-[#dbe6df] bg-[linear-gradient(180deg,#f4fbf7_0%,#ffffff_100%)] p-5 text-center">
          <div className="mx-auto grid size-14 place-items-center rounded-2xl border border-[#e0e0e0] bg-[#fbfbfb] text-black">
            <NotePencil size={22} />
          </div>
          <h1 className="type-page-title mt-4 text-black">Create the first SOW</h1>
          <p className="type-body mt-2 text-[#5f7467]">This project does not have a Scope of Work yet. Start from a template, edit it, then send it to the homeowner flow.</p>
        </section>

        <section className="mt-4 rounded-2xl border border-[#e1e1e1] bg-white p-4">
          <p className="type-label uppercase text-[#5f7467]">Live demo behavior</p>
          <p className="type-body mt-2 text-[#5f7467]">Open the homeowner flow in another tab. It will wait here until this SOW is sent.</p>
        </section>
      </div>

      <div className="fixed bottom-0 left-1/2 z-[95] w-full max-w-[390px] -translate-x-1/2 border-t border-[#e0e0e0] bg-white px-4 pb-5 pt-3 shadow-[0_-8px_24px_rgba(0,0,0,0.08)]">
        <button type="button" onClick={() => setView('template')} className="type-body-strong flex h-11 w-full items-center justify-center gap-2 rounded-full bg-black text-white">
          Create SOW
          <ArrowRight size={16} />
        </button>
      </div>
    </section>
  )

  const renderTemplateScreen = () => (
    <section className="mx-auto w-full max-w-[390px] pb-[132px] pt-[56px]">
      <StickyHeader title="New SOW" subtitle="Choose a starting point" onBack={sow ? () => setView('draft') : onBack} />

      <div className="px-4 py-5">
        <section className="pb-5">
          <p className="type-caption uppercase text-[#6e907d]">Scope of work</p>
          <h1 className="type-page-title mt-2 text-black">Start with a template that fits the project.</h1>
          <p className="type-body mt-2 text-[#6f6f6f]">This creates a real mock SOW in the shared project state.</p>
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
                className={`w-full rounded-2xl border p-4 text-left ${selected ? 'border-black bg-white' : 'border-[#e1e1e1] bg-[#fbfbfb]'}`}
              >
                <div className="flex items-start justify-between gap-3">
                  <span className="grid size-11 place-items-center rounded-xl border border-[#e0e0e0] bg-white text-black">
                    <Icon size={20} weight={selected ? 'fill' : 'regular'} />
                  </span>
                  <span className="type-caption rounded-full bg-white px-2 py-1 uppercase text-[#777777]">
                    {template.id === 'residential' ? 'Homes' : 'Commercial'}
                  </span>
                </div>
                <p className="type-section-title mt-4 text-black">{template.name}</p>
                <p className="type-meta mt-1 text-[#808080]">{template.subtitle}</p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {template.tags.map((tag) => (
                    <span key={tag} className="type-caption rounded-full border border-[#e1e1e1] bg-white px-3 py-1 uppercase text-[#6f6f6f]">
                      {tag}
                    </span>
                  ))}
                </div>
              </button>
            )
          })}
        </div>
      </div>

      <div className="fixed bottom-0 left-1/2 z-[95] w-full max-w-[390px] -translate-x-1/2 border-t border-[#e0e0e0] bg-white px-4 pb-5 pt-3 shadow-[0_-8px_24px_rgba(0,0,0,0.08)]">
        <button type="button" onClick={createDraft} className="type-body-strong flex h-11 w-full items-center justify-center gap-2 rounded-full bg-black text-white">
          Use {selectedTemplate.name} template
          <ArrowRight size={16} />
        </button>
      </div>
    </section>
  )

  const renderDraftScreen = () => (
    <section className="mx-auto w-full max-w-[390px] pb-[148px] pt-[56px]">
      <StickyHeader title="Scope of Work" subtitle={`Revision ${sow.revision}`} onBack={onBack} actionLabel="Reset" onAction={actions.resetDemo} />

      <div className="px-4 py-5">
        <section className="pb-5">
          <div className="flex items-center justify-between gap-3">
            <div className="min-w-0">
              <p className="type-section-title truncate text-[#102418]">{document.projectName}</p>
              <p className="type-body mt-1 truncate text-[#5f7467]">{document.clientName} | {document.location}</p>
            </div>
            <span className="type-caption shrink-0 rounded-full bg-[#e7f5ec] px-3 py-1 uppercase text-[#267449]">{statusLabels[sow.status] || 'Draft'}</span>
          </div>

          <div className="mt-4 grid grid-cols-3 gap-2">
            <div className="flex min-h-[60px] flex-col items-center justify-center rounded-xl border border-[#dce7f3] bg-[#f4f8ff] px-2.5 py-2.5 text-center">
              <p className="type-utility text-[#73849d]">Value</p>
              <p className="type-card-title mt-1 text-[#102418]">INR {document.totalValueLabel}</p>
            </div>
            <div className="flex min-h-[60px] flex-col items-center justify-center rounded-xl border border-[#dbe6df] bg-[#f4fbf7] px-2.5 py-2.5 text-center">
              <p className="type-utility text-[#73867c]">Duration</p>
              <p className="type-card-title mt-1 text-[#102418]">{document.durationLabel}</p>
            </div>
            <div className="flex min-h-[60px] flex-col items-center justify-center rounded-xl border border-[#efe2c8] bg-[#fff9ef] px-2.5 py-2.5 text-center">
              <p className="type-utility text-[#987f53]">Remarks</p>
              <p className="type-card-title mt-1 text-[#102418]">{openRemarks.length}</p>
            </div>
          </div>
        </section>

        <div className="h-[6px] -mx-4 bg-[#e0e0e0]" />

        <section className="space-y-3 py-5">
          <SOWSection index="1" title="Project overview" open={openSections.overview} onToggle={() => toggleSection('overview')}>
            <div className="space-y-3">
              <InlineField label="Project" value={document.projectName} onChange={(value) => updateDocument('projectName', value)} />
              <InlineField label="Client" value={document.clientName} onChange={(value) => updateDocument('clientName', value)} />
              <InlineField label="Location" value={document.location} onChange={(value) => updateDocument('location', value)} />
              <InlineField label="Type" value={document.projectType} onChange={(value) => updateDocument('projectType', value)} />
              <InlineField label="Handover" value={document.handoverMonth} onChange={(value) => updateDocument('handoverMonth', value)} />
            </div>
          </SOWSection>

          <SOWSection index="2" title="Scope - room wise" open={openSections.scope} onToggle={() => toggleSection('scope')} badge={openRemarks.some((remark) => remark.sectionKey === 'rooms') ? 'Remark' : undefined}>
            <div className="space-y-3">
              {document.rooms.map((room) => (
                <article key={room.id} className="border-b border-[#ededed] pb-3 last:border-b-0 last:pb-0">
                  <p className="type-card-title text-black">{room.name}</p>
                  <textarea
                    value={room.scope}
                    onChange={(event) => actions.updateRoomScope(room.id, event.target.value)}
                    className="type-body mt-2 min-h-20 w-full rounded-2xl border border-[#dbe6df] bg-[#f7fbf8] px-3 py-2 text-[#102418] outline-none"
                  />
                </article>
              ))}
            </div>
          </SOWSection>

          <SOWSection index="3" title="Exclusions" open={openSections.exclusions} onToggle={() => toggleSection('exclusions')} badge={openRemarks.some((remark) => remark.sectionKey === 'exclusions') ? 'Remark' : undefined}>
            <div className="space-y-3">
              <div className="rounded-xl border border-[#efe2c8] bg-[#fff9ef] p-3">
                <p className="type-caption uppercase text-[#9f8350]">Designer managed</p>
                <p className="type-body mt-1 text-black">These define what is intentionally outside the professional scope. Homeowners can remark on them, but the designer owns the final list.</p>
              </div>
              {document.exclusions.map((item, index) => (
                <div key={`${item}-${index}`} className="flex items-start gap-2">
                  <textarea
                    value={item}
                    onChange={(event) => updateExclusion(index, event.target.value)}
                    className="type-body min-h-16 flex-1 rounded-2xl border border-[#dbe6df] bg-[#f7fbf8] px-3 py-2 text-[#102418] outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => removeExclusion(index)}
                    aria-label="Remove exclusion"
                    className="grid size-10 shrink-0 place-items-center rounded-xl border border-[#e1b8b8] bg-white text-[#c34545]"
                  >
                    <Trash size={16} />
                  </button>
                </div>
              ))}
              <button type="button" onClick={addExclusion} className="type-label flex h-10 w-full items-center justify-center gap-2 rounded-xl border border-[#e0e0e0] bg-white text-black">
                <Plus size={15} />
                Add exclusion
              </button>
            </div>
          </SOWSection>

          <SOWSection index="4" title="Timeline" open={openSections.timeline} onToggle={() => toggleSection('timeline')} badge={openRemarks.some((remark) => remark.sectionKey === 'timeline') ? 'Remark' : undefined}>
            <div className="space-y-3">
              <div className="rounded-xl border border-[#efe2c8] bg-[#fff9ef] p-3">
                <p className="type-caption uppercase text-[#9f8350]">Designer managed</p>
                <p className="type-body mt-1 text-black">Timeline commitments are authored by the professional and reviewed by the homeowner.</p>
              </div>
              <InlineField label="Start" value={document.startMonth} onChange={(value) => updateDocument('startMonth', value)} />
              <InlineField label="Duration" value={document.durationLabel} onChange={(value) => updateDocument('durationLabel', value)} />
              <InlineField label="Handover" value={document.handoverMonth} onChange={(value) => updateDocument('handoverMonth', value)} />
            </div>
          </SOWSection>

          <SOWSection index="5" title="Budget estimate" open={openSections.budget} onToggle={() => toggleSection('budget')} badge={openRemarks.some((remark) => remark.sectionKey === 'budget') ? 'Remark' : undefined}>
            <div className="space-y-3">
              <div className="rounded-xl border border-[#efe2c8] bg-[#fff9ef] p-3">
                <p className="type-caption uppercase text-[#9f8350]">Designer managed</p>
                <p className="type-body mt-1 text-black">The homeowner can question the estimate, but only the professional changes the commercial terms.</p>
              </div>
              <InlineField label="Total value" value={document.totalValueLabel} onChange={(value) => updateDocument('totalValueLabel', value)} />
              <InlineField label="Structure" value={document.paymentStructure} onChange={(value) => updateDocument('paymentStructure', value)} />
              <InlineField label="GST" value={document.gstLabel} onChange={(value) => updateDocument('gstLabel', value)} />
            </div>
          </SOWSection>

          <SOWSection index="6" title="Payment terms" open={openSections.payment} onToggle={() => toggleSection('payment')} badge={openRemarks.some((remark) => remark.sectionKey === 'payment') ? 'Remark' : undefined}>
            <div className="space-y-3">
              <div className="rounded-xl border border-[#efe2c8] bg-[#fff9ef] p-3">
                <p className="type-caption uppercase text-[#9f8350]">Designer managed</p>
                <p className="type-body mt-1 text-black">Payment terms are contractual. Homeowner feedback becomes a remark before the designer edits.</p>
              </div>
              {document.paymentTerms.map((term, index) => (
                <div key={`${term}-${index}`} className="flex items-start gap-2">
                  <textarea
                    value={term}
                    onChange={(event) => updateListItem('paymentTerms', index, event.target.value)}
                    className="type-body min-h-16 flex-1 rounded-2xl border border-[#dbe6df] bg-[#f7fbf8] px-3 py-2 text-[#102418] outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => removeListItem('paymentTerms', index)}
                    aria-label="Remove payment term"
                    className="grid size-10 shrink-0 place-items-center rounded-xl border border-[#e1b8b8] bg-white text-[#c34545]"
                  >
                    <Trash size={16} />
                  </button>
                </div>
              ))}
              <button type="button" onClick={() => addListItem('paymentTerms', 'New payment term')} className="type-label flex h-10 w-full items-center justify-center gap-2 rounded-xl border border-[#e0e0e0] bg-white text-black">
                <Plus size={15} />
                Add payment term
              </button>
            </div>
          </SOWSection>

          <SOWSection index="7" title="Terms & notes" open={openSections.terms} onToggle={() => toggleSection('terms')} badge={openRemarks.some((remark) => remark.sectionKey === 'terms') ? 'Remark' : undefined}>
            <div className="space-y-3">
              <div className="rounded-xl border border-[#efe2c8] bg-[#fff9ef] p-3">
                <p className="type-caption uppercase text-[#9f8350]">Designer managed</p>
                <p className="type-body mt-1 text-black">These notes protect execution expectations and are revised by the professional after review.</p>
              </div>
              {document.termsNotes.map((term, index) => (
                <div key={`${term}-${index}`} className="flex items-start gap-2">
                  <textarea
                    value={term}
                    onChange={(event) => updateListItem('termsNotes', index, event.target.value)}
                    className="type-body min-h-16 flex-1 rounded-2xl border border-[#dbe6df] bg-[#f7fbf8] px-3 py-2 text-[#102418] outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => removeListItem('termsNotes', index)}
                    aria-label="Remove term"
                    className="grid size-10 shrink-0 place-items-center rounded-xl border border-[#e1b8b8] bg-white text-[#c34545]"
                  >
                    <Trash size={16} />
                  </button>
                </div>
              ))}
              <button type="button" onClick={() => addListItem('termsNotes', 'New term or execution note')} className="type-label flex h-10 w-full items-center justify-center gap-2 rounded-xl border border-[#e0e0e0] bg-white text-black">
                <Plus size={15} />
                Add term or note
              </button>
            </div>
          </SOWSection>

          <SOWSection index="8" title="Signatures" open={openSections.signatures} onToggle={() => toggleSection('signatures')} badge={openRemarks.some((remark) => remark.sectionKey === 'signatures') ? 'Remark' : undefined}>
            <div className="mb-3 rounded-xl border border-[#efe2c8] bg-[#fff9ef] p-3">
              <p className="type-caption uppercase text-[#9f8350]">Approval controlled</p>
              <p className="type-body mt-1 text-black">Signatures are not edited as text. They change through verification, approval, and execution states.</p>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {[
                ['Designer', 'Riya Desai', sow.designerSigned ? 'Signed' : 'Pending'],
                ['Client', document.clientName, sow.clientSigned ? 'Signed' : 'Waiting'],
              ].map(([label, name, state]) => (
                <article key={label} className="flex min-h-[150px] flex-col justify-between rounded-2xl border border-[#e2e2e2] bg-white p-3">
                  <div>
                    <p className="type-caption uppercase text-[#7b7b7b]">{label}</p>
                    <p className="type-card-title mt-2 text-black">{name}</p>
                  </div>
                  <span className={`type-caption w-fit rounded-full px-2 py-1 uppercase ${state === 'Signed' ? 'bg-[#eaf9f1] text-[#2a9a64]' : 'bg-[#f2f2f2] text-[#777777]'}`}>{state}</span>
                </article>
              ))}
            </div>
          </SOWSection>

          {activity.length ? (
            <section className="rounded-2xl border border-[#e1e1e1] bg-[#fbfbfb] p-4">
              <p className="type-label uppercase text-[#5f7467]">Project activity</p>
              <div className="mt-3 space-y-2">
                {activity.slice(0, 4).map((item) => (
                  <p key={item.id} className="type-meta text-[#5f7467]"><span className="font-bold text-black">{item.actor}</span> {item.text}</p>
                ))}
              </div>
            </section>
          ) : null}
        </section>
      </div>

      <div className="fixed bottom-0 left-1/2 z-[95] w-full max-w-[390px] -translate-x-1/2 border-t border-[#e0e0e0] bg-white px-4 pb-5 pt-3 shadow-[0_-8px_24px_rgba(0,0,0,0.08)]">
        <button
          type="button"
          onClick={() => {
            if (!sow.designerSigned) {
              actions.signDesigner()
              return
            }
            actions.sendSow()
          }}
          className="type-body-strong h-12 w-full rounded-[18px] bg-black px-4 text-white"
        >
          {sow.designerSigned ? 'Send to homeowner' : 'Verify & sign designer side'}
        </button>
        <div className="mt-2 grid grid-cols-3 gap-2">
          <button type="button" onClick={() => setView('remarks')} className="type-body-strong h-10 rounded-xl border border-[#e0e0e0] bg-white text-[#4b4b4b]">Remarks</button>
          <button type="button" onClick={() => setView('draft')} className="type-body-strong h-10 rounded-xl border border-[#e0e0e0] bg-white text-[#4b4b4b]">Save draft</button>
          <button type="button" onClick={() => setView('activity')} className="type-body-strong h-10 rounded-xl border border-[#e0e0e0] bg-white text-[#4b4b4b]">Activity</button>
        </div>
      </div>
    </section>
  )

  const renderRemarksScreen = () => (
    <section className="mx-auto w-full max-w-[390px] pb-[132px] pt-[56px]">
      <StickyHeader title="Client remarks" subtitle={`${openRemarks.length} open`} onBack={() => setView('draft')} />

      <div className="px-4 py-5">
        <article className="rounded-2xl border border-[#dbe6df] bg-[#f4fbf7] p-4">
          <p className="type-section-title text-black">Homeowner feedback</p>
          <p className="type-body mt-1 text-[#5f7467]">Accepting a remark can update the SOW. Rejecting keeps the current revision and sends a note back.</p>
        </article>

        <div className="mt-4 space-y-3">
          {(sow.remarks || []).length ? sow.remarks.map((remark) => {
            const response = latestResponses.find((item) => item.remarkId === remark.id)
            return (
              <article key={remark.id} className="rounded-2xl border border-[#dbe6df] bg-white p-4">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="type-label uppercase text-[#5f7467]">{remark.sectionTitle}</p>
                    <p className="type-body mt-3 text-black">{remark.body}</p>
                  </div>
                  <span className="type-caption shrink-0 rounded-full bg-[#f2f2f2] px-2 py-1 uppercase text-[#6f6f6f]">{remark.status}</span>
                </div>
                {response ? (
                  <div className="mt-3 rounded-xl border border-[#efe2c8] bg-[#fff9ef] p-3">
                    <p className="type-caption uppercase text-[#9f8350]">{response.decision === 'approve' ? 'Accepted' : 'Rejected'}</p>
                    <p className="type-body mt-2 text-black">{response.body}</p>
                  </div>
                ) : (
                  <div className="mt-3 grid grid-cols-2 gap-2">
                    <button type="button" onClick={() => approveRemark(remark)} className="type-label h-10 rounded-xl bg-black text-white">Accept</button>
                    <button type="button" onClick={() => rejectRemark(remark)} className="type-label h-10 rounded-xl border border-[#e0e0e0] bg-white text-black">Reject</button>
                  </div>
                )}
              </article>
            )
          }) : (
            <article className="rounded-2xl border border-[#e1e1e1] bg-white p-4 text-center">
              <CheckCircle size={24} weight="fill" className="mx-auto text-[#267449]" />
              <p className="type-card-title mt-3 text-black">No remarks yet</p>
              <p className="type-body mt-1 text-[#5f7467]">When the homeowner comments in another tab, it will appear here.</p>
            </article>
          )}
        </div>
      </div>

      <div className="fixed bottom-0 left-1/2 z-[95] w-full max-w-[390px] -translate-x-1/2 border-t border-[#e0e0e0] bg-white px-4 pb-5 pt-3 shadow-[0_-8px_24px_rgba(0,0,0,0.08)]">
        <button type="button" onClick={() => setView('draft')} className="type-body-strong h-11 w-full rounded-full bg-black text-white">
          Back to SOW
        </button>
      </div>
    </section>
  )

  const renderActivityScreen = () => (
    <section className="mx-auto w-full max-w-[390px] pb-[132px] pt-[56px]">
      <StickyHeader title="Project activity" subtitle="Shared events" onBack={() => setView('draft')} />
      <div className="space-y-3 px-4 py-5">
        {activity.map((item) => (
          <article key={item.id} className="rounded-2xl border border-[#dbe6df] bg-white p-4">
            <p className="type-card-title text-black">{item.actor}</p>
            <p className="type-body mt-1 text-[#5f7467]">{item.text}</p>
          </article>
        ))}
      </div>
    </section>
  )

  if (!sow && view === 'template') {
    return <main className="min-h-dvh w-full overflow-x-hidden bg-white font-['Urbanist'] text-black">{renderTemplateScreen()}</main>
  }

  if (!sow) {
    return <main className="min-h-dvh w-full overflow-x-hidden bg-white font-['Urbanist'] text-black">{renderNoSow()}</main>
  }

  return (
    <main className="min-h-dvh w-full overflow-x-hidden bg-white font-['Urbanist'] text-black">
      {view === 'template' ? renderTemplateScreen() : null}
      {view === 'draft' ? renderDraftScreen() : null}
      {view === 'remarks' ? renderRemarksScreen() : null}
      {view === 'activity' ? renderActivityScreen() : null}
    </main>
  )
}

export default ProSowWorkspace
