import { useMemo, useState } from 'react'
import {
  ArrowRight,
  Buildings,
  CaretDown,
  CaretLeft,
  FileArrowDown,
  House,
  NotePencil,
} from '@phosphor-icons/react'
import { createInitialSowDocument, sowClientRemarks, sowTemplates } from './sowData'

const templateIcons = {
  House,
  Building: Buildings,
}

function SOWSection({ index, title, open, onToggle, badge, children }) {
  return (
    <article className="overflow-hidden rounded-2xl border border-[#e1e1e1] bg-white">
      <button type="button" onClick={onToggle} className="flex w-full items-center justify-between pl-3 pr-4 py-3 text-left">
        <span className="flex items-center gap-3">
          <span className="grid size-6 place-items-center rounded-lg border border-[#e0e0e0] bg-[#fbfbfb] text-[10px] font-bold text-black">{index}</span>
          <span className="text-[13px] font-bold text-black">{title}</span>
        </span>
        <span className="flex items-center gap-2">
          {badge ? <span className="rounded-full bg-[#f2f2f2] px-2 py-1 text-[10px] font-bold uppercase tracking-[0.08em] text-[#6f6f6f]">{badge}</span> : null}
          <CaretDown size={14} className={`transition-transform ${open ? 'rotate-180' : ''}`} />
        </span>
      </button>
      {open ? <div className="border-t border-[#eaeaea] px-4 py-4">{children}</div> : null}
    </article>
  )
}

function StickyHeader({ title, subtitle, onBack, actionLabel, onAction }) {
  return (
    <header className="fixed left-1/2 top-0 z-[90] w-full max-w-[390px] -translate-x-1/2 border-b border-[#e0e0e0] bg-[rgba(255,255,255,0.72)] backdrop-blur-[16px]">
      <div className="px-4 py-3">
        <div className="flex items-center justify-between py-1">
          <button type="button" onClick={onBack} className="flex items-center gap-4">
            <span className="grid size-6 place-items-center rounded">
              <CaretLeft size={24} />
            </span>
            <span className="text-left">
              <span className="block text-[16px] font-bold leading-6 text-black">{title}</span>
              <span className="block text-[10px] font-medium leading-[15px] text-[#999999]">{subtitle}</span>
            </span>
          </button>
          {actionLabel ? (
            <button type="button" onClick={onAction} className="rounded-full border border-[#e0e0e0] bg-white px-3 py-2 text-[11px] font-bold text-black">
              {actionLabel}
            </button>
          ) : (
            <button type="button" className="grid size-8 place-items-center rounded-xl border border-[#e0e0e0] bg-white text-black">
              <FileArrowDown size={15} />
            </button>
          )}
        </div>
      </div>
    </header>
  )
}

function ProSowWorkspace({ project, onBack, entry = 'existing', initialView }) {
  const [view, setView] = useState(initialView || (entry === 'create' ? 'template' : 'draft'))
  const [selectedTemplateId, setSelectedTemplateId] = useState('residential')
  const [document, setDocument] = useState(() => createInitialSowDocument(project))
  const [status, setStatus] = useState('draft')
  const [designerSigned, setDesignerSigned] = useState(false)
  const [clientSigned, setClientSigned] = useState(false)
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
  const [actionedRemarks, setActionedRemarks] = useState([])
  const [amendments, setAmendments] = useState([
    {
      id: 'a-1',
      title: 'Kitchen finish update',
      oldValue: 'Quartz countertop',
      newValue: 'Granite countertop with chimney provision',
      reason: 'Client requested a harder-wearing finish after review.',
      status: 'active',
    },
  ])

  const remarksById = useMemo(
    () => Object.fromEntries(sowClientRemarks.map((remark) => [remark.id, remark])),
    [],
  )
  const selectedTemplate = sowTemplates.find((template) => template.id === selectedTemplateId) || sowTemplates[0]
  const remarksComplete = actionedRemarks.length === sowClientRemarks.length

  const toggleSection = (key) => {
    setOpenSections((current) => ({ ...current, [key]: !current[key] }))
  }

  const applyKitchenRemark = () => {
    setDocument((current) => ({
      ...current,
      rooms: current.rooms.map((room) => (
        room.id === 'kitchen' ? { ...room, scope: remarksById['kitchen-scope'].proposedScope } : room
      )),
    }))
    setActionedRemarks((current) => (current.includes('kitchen-scope') ? current : [...current, 'kitchen-scope']))
  }

  const rejectBudgetRemark = () => {
    setActionedRemarks((current) => (current.includes('budget-estimate') ? current : [...current, 'budget-estimate']))
  }

  const statusLabel = status === 'draft'
    ? 'Draft'
    : status === 'review'
      ? 'Under review'
      : status === 'pending-signature'
        ? 'Pending signature'
        : 'Executed'

  const renderTemplateScreen = () => (
    <section className="mx-auto w-full max-w-[390px] pb-[132px] pt-[56px]">
      <StickyHeader title="New SOW" subtitle="Choose a starting point" onBack={onBack} />

      <div className="px-4 py-5">
        <section className="pb-5">
          <p className="text-[10px] font-medium uppercase tracking-[0.12em] text-[#999999]">Scope of work</p>
          <h1 className="mt-2 text-[22px] font-extrabold leading-7 text-black">Start with a template that already fits the project.</h1>
          <p className="mt-2 text-[13px] font-medium leading-5 text-[#6f6f6f]">No separate doc-builder look here. This stays inside the same project workspace language.</p>
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
                  <span className="rounded-full bg-white px-2 py-1 text-[10px] font-bold uppercase tracking-[0.08em] text-[#777777]">
                    {template.id === 'residential' ? 'Homes' : 'Commercial'}
                  </span>
                </div>
                <p className="mt-4 text-[16px] font-extrabold leading-6 text-black">{template.name}</p>
                <p className="mt-1 text-[12px] font-medium leading-[18px] text-[#808080]">{template.subtitle}</p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {template.tags.map((tag) => (
                    <span key={tag} className="rounded-full border border-[#e1e1e1] bg-white px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.06em] text-[#6f6f6f]">
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
        <button type="button" onClick={() => setView('draft')} className="flex h-11 w-full items-center justify-center gap-2 rounded-full bg-black text-[14px] font-bold text-white">
          Use {selectedTemplate.name} template
          <ArrowRight size={16} />
        </button>
      </div>
    </section>
  )

  const renderDraftScreen = () => (
    <section className="mx-auto w-full max-w-[390px] pb-[132px] pt-[56px]">
      <StickyHeader
        title="Scope of Work"
        subtitle={`${selectedTemplate.name} template`}
        onBack={() => {
          if (entry === 'create') {
            setView('template')
            return
          }
          onBack()
        }}
      />

      <div className="px-4 py-5">
        <section className="pb-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[18px] font-extrabold leading-6 text-black">{document.projectName}</p>
              <p className="mt-1 text-[12px] font-medium leading-[18px] text-[#6f6f6f]">{document.clientName} | {document.location}</p>
            </div>
            <span className="rounded-full bg-[#f2f2f2] px-3 py-1 text-[10px] font-bold uppercase tracking-[0.08em] text-[#6f6f6f]">{statusLabel}</span>
          </div>

          <div className="mt-4 grid grid-cols-3 gap-2">
            <div className="flex min-h-[56px] flex-col items-center justify-center rounded-xl border border-[#e2e2e2] bg-white px-2.5 py-2 text-center">
              <p className="text-[10px] font-bold leading-[14px] text-[#7b7b7b]">Value</p>
              <p className="mt-0.5 text-[13px] font-extrabold leading-[19px]">INR {document.totalValueLabel}</p>
            </div>
            <div className="flex min-h-[56px] flex-col items-center justify-center rounded-xl border border-[#e2e2e2] bg-white px-2.5 py-2 text-center">
              <p className="text-[10px] font-bold leading-[14px] text-[#7b7b7b]">Duration</p>
              <p className="mt-0.5 text-[13px] font-extrabold leading-[19px]">{document.durationLabel}</p>
            </div>
            <div className="flex min-h-[56px] flex-col items-center justify-center rounded-xl border border-[#e2e2e2] bg-white px-2.5 py-2 text-center">
              <p className="text-[10px] font-bold leading-[14px] text-[#7b7b7b]">Handover</p>
              <p className="mt-0.5 text-[13px] font-extrabold leading-[19px]">{document.handoverMonth}</p>
            </div>
          </div>
        </section>

        <div className="h-[6px] -mx-4 bg-[#e0e0e0]" />

        <section className="space-y-3 py-5">
          <SOWSection index="1" title="Project overview" open={openSections.overview} onToggle={() => toggleSection('overview')}>
            <div className="space-y-3 text-[12px]">
              {[
                ['Project', document.projectName],
                ['Client', document.clientName],
                ['Location', document.location],
                ['Type', document.projectType],
                ['Start', document.startMonth],
                ['Handover', document.handoverMonth],
              ].map(([label, value]) => (
                <div key={label} className="flex items-start justify-between gap-4 border-b border-[#ededed] pb-2 last:border-b-0 last:pb-0">
                  <span className="font-semibold uppercase tracking-[0.08em] text-[#7b7b7b]">{label}</span>
                  <span className="text-right font-medium text-black">{value}</span>
                </div>
              ))}
            </div>
          </SOWSection>

          <SOWSection index="2" title="Scope - room wise" open={openSections.scope} onToggle={() => toggleSection('scope')} badge={actionedRemarks.includes('kitchen-scope') ? 'Updated' : undefined}>
            <div className="space-y-3">
              {document.rooms.map((room) => (
                <article key={room.id} className="border-b border-[#ededed] pb-3 last:border-b-0 last:pb-0">
                  <p className="text-[12px] font-bold text-black">{room.name}</p>
                  <p className="mt-1 text-[11px] leading-5 text-[#6f6f6f]">{room.scope}</p>
                </article>
              ))}
            </div>
          </SOWSection>

          <SOWSection index="3" title="Exclusions" open={openSections.exclusions} onToggle={() => toggleSection('exclusions')}>
            <div className="space-y-2">
              {document.exclusions.map((item) => (
                <div key={item} className="flex items-start gap-2 text-[11px] text-black">
                  <span className="mt-1 size-1.5 rounded-full bg-[#8c8c8c]" />
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </SOWSection>

          <SOWSection index="4" title="Timeline" open={openSections.timeline} onToggle={() => toggleSection('timeline')}>
            <div className="grid grid-cols-3 gap-2 text-center">
              {[
                ['Start', document.startMonth],
                ['Duration', document.durationLabel],
                ['Handover', document.handoverMonth],
              ].map(([label, value]) => (
                <article key={label} className="rounded-xl border border-[#e2e2e2] bg-[#fbfbfb] px-2 py-3">
                  <p className="text-[10px] font-bold uppercase tracking-[0.08em] text-[#7b7b7b]">{label}</p>
                  <p className="mt-2 text-[12px] font-bold text-black">{value}</p>
                </article>
              ))}
            </div>
          </SOWSection>

          <SOWSection index="5" title="Budget estimate" open={openSections.budget} onToggle={() => toggleSection('budget')} badge={actionedRemarks.includes('budget-estimate') ? 'Actioned' : undefined}>
            <div className="space-y-3 text-[12px]">
              <div className="flex items-center justify-between rounded-xl border border-[#e2e2e2] bg-[#fbfbfb] px-3 py-3">
                <span className="font-semibold text-[#6f6f6f]">Total value</span>
                <span className="font-extrabold text-black">INR {document.totalValueLabel}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="font-semibold text-[#6f6f6f]">Structure</span>
                <span className="font-bold text-black">{document.paymentStructure}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="font-semibold text-[#6f6f6f]">GST</span>
                <span className="font-bold text-black">{document.gstLabel}</span>
              </div>
            </div>
          </SOWSection>

          <SOWSection index="6" title="Payment terms" open={openSections.payment} onToggle={() => toggleSection('payment')}>
            <div className="space-y-2 text-[11px] leading-5 text-[#6f6f6f]">
              {document.paymentTerms.map((term) => <p key={term}>{term}</p>)}
            </div>
          </SOWSection>

          <SOWSection index="7" title="Terms & notes" open={openSections.terms} onToggle={() => toggleSection('terms')}>
            <div className="space-y-2 text-[11px] leading-5 text-[#6f6f6f]">
              {document.termsNotes.map((term) => <p key={term}>{term}</p>)}
            </div>
          </SOWSection>

          <SOWSection index="8" title="Signatures" open={openSections.signatures} onToggle={() => toggleSection('signatures')}>
            <div className="grid grid-cols-2 gap-3">
              <article className="rounded-2xl border border-[#e2e2e2] bg-white p-3">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-[0.08em] text-[#7b7b7b]">Designer</p>
                    <p className="mt-2 text-[13px] font-bold text-black">Riya Desai</p>
                  </div>
                  <span className={`rounded-full px-2 py-1 text-[10px] font-bold uppercase tracking-[0.06em] ${designerSigned ? 'bg-[#eaf9f1] text-[#2a9a64]' : 'bg-[#f2f2f2] text-[#777777]'}`}>
                    {designerSigned ? 'Signed' : 'Pending'}
                  </span>
                </div>
                <p className="mt-4 text-[11px] font-medium leading-[18px] text-[#6f6f6f]">{designerSigned ? 'Verified and signed from designer side.' : 'Awaiting OTP verification from the designer.'}</p>
              </article>
              <article className="rounded-2xl border border-[#e2e2e2] bg-white p-3">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-[0.08em] text-[#7b7b7b]">Client</p>
                    <p className="mt-2 text-[13px] font-bold text-black">{document.clientName}</p>
                  </div>
                  <span className={`rounded-full px-2 py-1 text-[10px] font-bold uppercase tracking-[0.06em] ${clientSigned ? 'bg-[#eaf9f1] text-[#2a9a64]' : 'bg-[#f2f2f2] text-[#777777]'}`}>
                    {clientSigned ? 'Signed' : 'Waiting'}
                  </span>
                </div>
                <p className="mt-4 text-[11px] font-medium leading-[18px] text-[#6f6f6f]">{clientSigned ? 'Client has already approved this SOW.' : 'Client signature will appear after review and acceptance.'}</p>
              </article>
            </div>
          </SOWSection>
        </section>
      </div>

      <div className="fixed bottom-0 left-1/2 z-[95] w-full max-w-[390px] -translate-x-1/2 border-t border-[#e0e0e0] bg-white px-4 pb-5 pt-3 shadow-[0_-8px_24px_rgba(0,0,0,0.08)]">
        <button
          type="button"
          onClick={() => {
            if (!designerSigned) {
              setView('otp')
              return
            }
            setStatus('review')
            setView('remarks')
          }}
          className="h-12 w-full rounded-[18px] bg-black px-4 text-[14px] font-bold text-white"
        >
          {!designerSigned ? 'Verify & sign designer side' : status === 'draft' ? 'Send for review' : status === 'review' ? 'Open review state' : 'Continue'}
        </button>
        <div className="mt-2 grid grid-cols-3 gap-2">
          <button type="button" onClick={() => setView('remarks')} className="h-10 rounded-xl border border-[#e0e0e0] bg-white text-[12px] font-semibold text-[#4b4b4b]">Remarks</button>
          <button type="button" className="h-10 rounded-xl border border-[#e0e0e0] bg-white text-[12px] font-semibold text-[#4b4b4b]">Save draft</button>
          <button type="button" onClick={() => setView('amendments')} className="h-10 rounded-xl border border-[#e0e0e0] bg-white text-[12px] font-semibold text-[#4b4b4b]">Amendments</button>
        </div>
      </div>
    </section>
  )

  const renderRemarksScreen = () => (
    <section className="mx-auto w-full max-w-[390px] pb-[132px] pt-[56px]">
      <StickyHeader title="Client remarks" subtitle="Review and action" onBack={() => setView('draft')} />

      <div className="px-4 py-5">
        <article className="rounded-2xl border border-[#e1e1e1] bg-[#fbfbfb] p-4">
          <p className="text-[14px] font-bold leading-5 text-black">Priya has reviewed this SOW.</p>
          <p className="mt-1 text-[12px] font-medium leading-[18px] text-[#6f6f6f]">Update or retain each item, then send the revised draft back through the same project flow.</p>
        </article>

        <div className="mt-4 space-y-3">
          <article className="rounded-2xl border border-[#e1e1e1] bg-white p-4">
            <p className="text-[12px] font-bold uppercase tracking-[0.08em] text-[#777777]">{remarksById['kitchen-scope'].title}</p>
            <p className="mt-3 text-[12px] leading-5 text-black">{remarksById['kitchen-scope'].remark}</p>
            <div className="mt-3 rounded-xl border border-[#e2e2e2] bg-[#fbfbfb] p-3">
              <p className="text-[10px] font-bold uppercase tracking-[0.08em] text-[#7b7b7b]">Proposed update</p>
              <p className="mt-2 text-[11px] leading-5 text-black">{remarksById['kitchen-scope'].proposedScope}</p>
            </div>
            <div className="mt-3 grid grid-cols-2 gap-2">
              <button type="button" onClick={applyKitchenRemark} className="h-10 rounded-xl bg-black text-[12px] font-bold text-white">Apply edit</button>
              <button type="button" onClick={() => setActionedRemarks((current) => (current.includes('kitchen-scope') ? current : [...current, 'kitchen-scope']))} className="h-10 rounded-xl border border-[#e0e0e0] bg-white text-[12px] font-bold text-black">Mark reviewed</button>
            </div>
          </article>

          <article className="rounded-2xl border border-[#e1e1e1] bg-white p-4">
            <p className="text-[12px] font-bold uppercase tracking-[0.08em] text-[#777777]">{remarksById['budget-estimate'].title}</p>
            <p className="mt-3 text-[12px] leading-5 text-black">{remarksById['budget-estimate'].remark}</p>
            <div className="mt-3 rounded-xl border border-[#e2e2e2] bg-[#fbfbfb] p-3">
              <p className="text-[10px] font-bold uppercase tracking-[0.08em] text-[#7b7b7b]">Response note</p>
              <p className="mt-2 text-[11px] leading-5 text-black">{remarksById['budget-estimate'].rejectionReason}</p>
            </div>
            <div className="mt-3 grid grid-cols-2 gap-2">
              <button type="button" onClick={rejectBudgetRemark} className="h-10 rounded-xl bg-black text-[12px] font-bold text-white">Keep estimate</button>
              <button type="button" onClick={() => setActionedRemarks((current) => (current.includes('budget-estimate') ? current : [...current, 'budget-estimate']))} className="h-10 rounded-xl border border-[#e0e0e0] bg-white text-[12px] font-bold text-black">Mark reviewed</button>
            </div>
          </article>
        </div>
      </div>

      <div className="fixed bottom-0 left-1/2 z-[95] w-full max-w-[390px] -translate-x-1/2 border-t border-[#e0e0e0] bg-white px-4 pb-5 pt-3 shadow-[0_-8px_24px_rgba(0,0,0,0.08)]">
        <button
          type="button"
          disabled={!remarksComplete}
          onClick={() => {
            setStatus('pending-signature')
            setView('draft')
          }}
          className="h-11 w-full rounded-full bg-black text-[14px] font-bold text-white disabled:bg-[#d9d9d9] disabled:text-[#777777]"
        >
          {remarksComplete ? 'Resubmit to client' : `Action ${sowClientRemarks.length - actionedRemarks.length} more remark(s)`}
        </button>
      </div>
    </section>
  )

  const renderOtpScreen = () => (
    <section className="mx-auto w-full max-w-[390px] pb-[132px] pt-[56px]">
      <StickyHeader title="Sign SOW" subtitle="Designer verification" onBack={() => setView('draft')} />

      <div className="px-4 py-5">
        <article className="rounded-2xl border border-[#e1e1e1] bg-white p-5 text-center">
          <div className="mx-auto grid size-14 place-items-center rounded-2xl border border-[#e0e0e0] bg-[#fbfbfb] text-black">
            <NotePencil size={22} weight="regular" />
          </div>
          <h2 className="mt-4 text-[20px] font-extrabold leading-7 text-black">Verify your identity</h2>
          <p className="mt-2 text-[12px] leading-5 text-[#6f6f6f]">OTP sent to the registered mobile number. Confirm to sign the Scope of Work as the designer.</p>
          <div className="mt-5 grid grid-cols-6 gap-2">
            {Array.from({ length: 6 }, (_, index) => (
              <span key={index} className="grid h-12 place-items-center rounded-xl border border-[#e0e0e0] bg-[#fbfbfb] text-[18px] font-bold text-black">
                {index < 2 ? index + 4 : ''}
              </span>
            ))}
          </div>
        </article>
      </div>

      <div className="fixed bottom-0 left-1/2 z-[95] w-full max-w-[390px] -translate-x-1/2 border-t border-[#e0e0e0] bg-white px-4 pb-5 pt-3 shadow-[0_-8px_24px_rgba(0,0,0,0.08)]">
        <button
          type="button"
          onClick={() => {
            setDesignerSigned(true)
            setStatus('draft')
            setView('draft')
          }}
          className="h-11 w-full rounded-full bg-black text-[14px] font-bold text-white"
        >
          Verify & sign
        </button>
      </div>
    </section>
  )

  const renderAmendmentsScreen = () => (
    <section className="mx-auto w-full max-w-[390px] pb-[132px] pt-[56px]">
      <StickyHeader title="Amendments" subtitle="Formal change log" onBack={() => setView('draft')} />

      <div className="space-y-3 px-4 py-5">
        {amendments.map((amendment) => (
          <article key={amendment.id} className="rounded-2xl border border-[#e1e1e1] bg-white p-4">
            <div className="flex items-center justify-between gap-3">
              <p className="text-[13px] font-bold text-black">{amendment.title}</p>
              <span className="rounded-full bg-[#f2f2f2] px-2 py-1 text-[10px] font-bold uppercase tracking-[0.08em] text-[#6f6f6f]">
                {amendment.status === 'active' ? 'Pending' : 'Executed'}
              </span>
            </div>
            <div className="mt-3 rounded-xl border border-[#e2e2e2] bg-[#fbfbfb] p-3">
              <p className="text-[10px] font-bold uppercase tracking-[0.08em] text-[#7b7b7b]">From</p>
              <p className="mt-1 text-[11px] text-[#808080] line-through">{amendment.oldValue}</p>
              <p className="mt-3 text-[10px] font-bold uppercase tracking-[0.08em] text-[#7b7b7b]">To</p>
              <p className="mt-1 text-[11px] font-semibold text-black">{amendment.newValue}</p>
              <p className="mt-3 text-[11px] leading-5 text-[#6f6f6f]">{amendment.reason}</p>
            </div>
          </article>
        ))}
      </div>

      <div className="fixed bottom-0 left-1/2 z-[95] w-full max-w-[390px] -translate-x-1/2 border-t border-[#e0e0e0] bg-white px-4 pb-5 pt-3 shadow-[0_-8px_24px_rgba(0,0,0,0.08)]">
        <button
          type="button"
          onClick={() => {
            setAmendments((current) => current.map((item) => ({ ...item, status: 'executed' })))
            setClientSigned(true)
            setStatus('executed')
          }}
          className="h-11 w-full rounded-full bg-black text-[14px] font-bold text-white"
        >
          Mark latest amendment executed
        </button>
      </div>
    </section>
  )

  return (
    <main className="min-h-dvh w-full overflow-x-hidden bg-white font-['Urbanist'] text-black">
      {view === 'template' ? renderTemplateScreen() : null}
      {view === 'draft' ? renderDraftScreen() : null}
      {view === 'remarks' ? renderRemarksScreen() : null}
      {view === 'otp' ? renderOtpScreen() : null}
      {view === 'amendments' ? renderAmendmentsScreen() : null}
    </main>
  )
}

export default ProSowWorkspace
