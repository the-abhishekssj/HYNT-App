import { useMemo, useState } from 'react'
import { CaretDown, CaretLeft, CheckCircle, FileArrowDown, NotePencil } from '@phosphor-icons/react'
import { createHomeownerSowProject, createInitialSowDocument } from './sowData'

function ClientSection({ index, title, open, onToggle, children }) {
  return (
    <article className="overflow-hidden rounded-2xl border border-[#dbe6df] bg-white shadow-[0_10px_26px_rgba(24,40,31,0.04)]">
      <button type="button" onClick={onToggle} className="flex w-full items-center justify-between px-4 py-3 text-left">
        <span className="flex items-center gap-3">
          <span className="grid size-6 place-items-center rounded-lg border border-[#d9e6de] bg-[#f4fbf7] text-[10px] font-bold text-[#267449]">{index}</span>
          <span className="text-[14px] font-bold leading-5 text-[#102418]">{title}</span>
        </span>
        <CaretDown size={14} className={`transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>
      {open ? <div className="border-t border-[#eaeaea] px-4 py-4">{children}</div> : null}
    </article>
  )
}

function ReviewHeader({ title, subtitle, onBack }) {
  return (
    <header className="fixed left-1/2 top-0 z-[90] w-full max-w-[390px] -translate-x-1/2 border-b border-[#dfe8e2] bg-[rgba(251,255,252,0.88)] backdrop-blur-[16px]">
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
          <button type="button" className="grid size-8 place-items-center rounded-xl border border-[#dbe6df] bg-white text-black">
            <FileArrowDown size={15} />
          </button>
        </div>
      </div>
    </header>
  )
}

function HomeownerSowReview({ onBack }) {
  const project = useMemo(() => createHomeownerSowProject(), [])
  const document = useMemo(() => createInitialSowDocument({
    scope: project.projectType,
    client: project.clientName,
    location: project.location,
  }), [project])
  const [view, setView] = useState('review')
  const [openSections, setOpenSections] = useState({
    overview: true,
    scope: true,
    exclusions: false,
    budget: false,
    payment: false,
    terms: false,
  })
  const [remarks, setRemarks] = useState({
    scope: '',
    budget: '',
  })

  const hasRemarks = Object.values(remarks).some((value) => value.trim())
  const toggleSection = (key) => setOpenSections((current) => ({ ...current, [key]: !current[key] }))

  const renderReview = () => (
    <section className="mx-auto w-full max-w-[390px] pb-[132px] pt-[56px]">
      <ReviewHeader title="Scope of Work" subtitle="Client review" onBack={onBack} />

      <div className="px-4 py-5">
        <section className="pb-5">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-[20px] font-extrabold leading-7 tracking-[-0.02em] text-[#102418]">{project.projectName}</p>
              <p className="mt-1 text-[14px] font-medium leading-5 text-[#5f7467]">Designer: {project.designerName} | {project.location}</p>
            </div>
            <span className="rounded-full bg-[#e7f5ec] px-3 py-1 text-[10px] font-bold uppercase tracking-[0.08em] text-[#267449]">Review</span>
          </div>

          <div className="mt-4 grid grid-cols-3 gap-2">
            <div className="flex min-h-[60px] flex-col items-center justify-center rounded-xl border border-[#dbe6df] bg-[#f4fbf7] px-2.5 py-2.5 text-center">
              <p className="text-[10px] font-bold leading-[14px] text-[#73867c]">Type</p>
              <p className="mt-1 text-[14px] font-extrabold leading-5 text-[#102418]">{project.projectType}</p>
            </div>
            <div className="flex min-h-[60px] flex-col items-center justify-center rounded-xl border border-[#dce7f3] bg-[#f4f8ff] px-2.5 py-2.5 text-center">
              <p className="text-[10px] font-bold leading-[14px] text-[#73849d]">Value</p>
              <p className="mt-1 text-[14px] font-extrabold leading-5 text-[#102418]">INR {project.budgetLabel}</p>
            </div>
            <div className="flex min-h-[60px] flex-col items-center justify-center rounded-xl border border-[#efe2c8] bg-[#fff9ef] px-2.5 py-2.5 text-center">
              <p className="text-[10px] font-bold leading-[14px] text-[#987f53]">Handover</p>
              <p className="mt-1 text-[14px] font-extrabold leading-5 text-[#102418]">{project.handoverMonth}</p>
            </div>
          </div>
        </section>

        <div className="h-[6px] -mx-4 bg-[#e0e0e0]" />

        <section className="space-y-3 py-5">
          <ClientSection index="1" title="Project overview" open={openSections.overview} onToggle={() => toggleSection('overview')}>
            <div className="space-y-3 text-[14px] leading-5">
              {[
                ['Project', document.projectName],
                ['Client', document.clientName],
                ['Location', document.location],
                ['Type', document.projectType],
                ['Handover', document.handoverMonth],
              ].map(([label, value]) => (
                <div key={label} className="flex items-start justify-between gap-4 border-b border-[#ededed] pb-2 last:border-b-0 last:pb-0">
                  <span className="font-semibold uppercase tracking-[0.05em] text-[#71837a]">{label}</span>
                  <span className="text-right font-medium text-black">{value}</span>
                </div>
              ))}
            </div>
          </ClientSection>

          <ClientSection index="2" title="Scope - room wise" open={openSections.scope} onToggle={() => toggleSection('scope')}>
            <div className="space-y-3">
              {document.rooms.map((room) => (
                <article key={room.id} className="border-b border-[#ededed] pb-3 last:border-b-0 last:pb-0">
                  <p className="text-[14px] font-bold leading-5 text-black">{room.name}</p>
                  <p className="mt-1 text-[14px] leading-6 text-[#5f7467]">{room.scope}</p>
                </article>
              ))}
            </div>
            <button type="button" onClick={() => setView('summary')} className="mt-3 flex items-center gap-2 rounded-xl border border-[#e0e0e0] bg-[#fbfbfb] px-3 py-2 text-[12px] font-bold text-black">
              <NotePencil size={14} />
              Add a scope remark
            </button>
          </ClientSection>

          <ClientSection index="3" title="Exclusions" open={openSections.exclusions} onToggle={() => toggleSection('exclusions')}>
            <div className="space-y-2">
              {document.exclusions.map((item) => (
                <div key={item} className="flex items-start gap-2 text-[14px] leading-6 text-black">
                  <span className="mt-1 size-1.5 rounded-full bg-[#8c8c8c]" />
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </ClientSection>

          <ClientSection index="4" title="Budget estimate" open={openSections.budget} onToggle={() => toggleSection('budget')}>
            <div className="space-y-3 text-[14px] leading-5">
              <div className="flex items-center justify-between rounded-xl border border-[#dce7f3] bg-[#f4f8ff] px-3 py-3">
                <span className="font-semibold text-[#617894]">Total value</span>
                <span className="font-extrabold text-black">INR {document.totalValueLabel}</span>
              </div>
              <button type="button" onClick={() => setView('summary')} className="flex items-center gap-2 rounded-xl border border-[#e0e0e0] bg-[#fbfbfb] px-3 py-2 text-[12px] font-bold text-black">
                <NotePencil size={14} />
                Add a budget remark
              </button>
            </div>
          </ClientSection>

          <ClientSection index="5" title="Payment terms" open={openSections.payment} onToggle={() => toggleSection('payment')}>
            <div className="space-y-2 text-[14px] leading-6 text-[#5f7467]">
              {document.paymentTerms.map((term) => <p key={term}>{term}</p>)}
            </div>
          </ClientSection>

          <ClientSection index="6" title="Terms & notes" open={openSections.terms} onToggle={() => toggleSection('terms')}>
            <div className="space-y-2 text-[14px] leading-6 text-[#5f7467]">
              {document.termsNotes.map((term) => <p key={term}>{term}</p>)}
            </div>
          </ClientSection>
        </section>
      </div>

      <div className="fixed bottom-0 left-1/2 z-[95] w-full max-w-[390px] -translate-x-1/2 border-t border-[#e0e0e0] bg-white px-4 pb-5 pt-3 shadow-[0_-8px_24px_rgba(0,0,0,0.08)]">
        <button type="button" onClick={() => setView(hasRemarks ? 'waiting' : 'otp')} className="h-11 w-full rounded-full bg-black text-[14px] font-bold text-white">
          {hasRemarks ? 'Send remarks to designer' : 'Continue to sign'}
        </button>
      </div>
    </section>
  )

  const renderSummary = () => (
    <section className="mx-auto w-full max-w-[390px] pb-[132px] pt-[56px]">
      <ReviewHeader title="Client remarks" subtitle="Add feedback before approval" onBack={() => setView('review')} />

      <div className="space-y-3 px-4 py-5">
        <article className="rounded-2xl border border-[#dbe6df] bg-white p-4">
          <p className="text-[12px] font-bold uppercase tracking-[0.08em] text-[#5f7467]">Scope feedback</p>
          <textarea
            value={remarks.scope}
            onChange={(event) => setRemarks((current) => ({ ...current, scope: event.target.value }))}
            placeholder="Example: I want granite instead of quartz and chimney provision in the kitchen scope."
            className="mt-3 min-h-24 w-full rounded-2xl border border-[#dbe6df] bg-[#f7fbf8] px-4 py-3 text-[14px] leading-6 text-black outline-none"
          />
        </article>
        <article className="rounded-2xl border border-[#dbe6df] bg-white p-4">
          <p className="text-[12px] font-bold uppercase tracking-[0.08em] text-[#5f7467]">Budget feedback</p>
          <textarea
            value={remarks.budget}
            onChange={(event) => setRemarks((current) => ({ ...current, budget: event.target.value }))}
            placeholder="Example: Can we reduce the cost closer to 15L while keeping the same quality?"
            className="mt-3 min-h-24 w-full rounded-2xl border border-[#dbe6df] bg-[#f7fbf8] px-4 py-3 text-[14px] leading-6 text-black outline-none"
          />
        </article>
      </div>

      <div className="fixed bottom-0 left-1/2 z-[95] w-full max-w-[390px] -translate-x-1/2 border-t border-[#e0e0e0] bg-white px-4 pb-5 pt-3 shadow-[0_-8px_24px_rgba(0,0,0,0.08)]">
        <button type="button" onClick={() => setView('review')} className="h-11 w-full rounded-full bg-black text-[14px] font-bold text-white">
          Save remarks
        </button>
      </div>
    </section>
  )

  const renderWaiting = () => (
    <section className="mx-auto w-full max-w-[390px] pb-[132px] pt-[56px]">
      <ReviewHeader title="Remarks sent" subtitle="Waiting for revision" onBack={() => setView('review')} />

      <div className="px-4 py-5">
        <article className="rounded-2xl border border-[#dbe6df] bg-[linear-gradient(180deg,#f4fbf7_0%,#ffffff_100%)] p-5 text-center">
          <div className="mx-auto grid size-14 place-items-center rounded-2xl border border-[#e0e0e0] bg-[#fbfbfb] text-black">
            <NotePencil size={22} weight="regular" />
          </div>
          <h2 className="mt-4 text-[20px] font-extrabold leading-7 text-black">Remarks sent</h2>
          <p className="mt-2 text-[14px] leading-6 text-[#5f7467]">Your designer has been asked to revise the SOW. Review the revised version below when it is ready.</p>
        </article>
      </div>

      <div className="fixed bottom-0 left-1/2 z-[95] w-full max-w-[390px] -translate-x-1/2 border-t border-[#e0e0e0] bg-white px-4 pb-5 pt-3 shadow-[0_-8px_24px_rgba(0,0,0,0.08)]">
        <button type="button" onClick={() => setView('revised')} className="h-11 w-full rounded-full bg-black text-[14px] font-bold text-white">
          Review revised SOW
        </button>
      </div>
    </section>
  )

  const renderRevised = () => (
    <section className="mx-auto w-full max-w-[390px] pb-[132px] pt-[56px]">
      <ReviewHeader title="Revised SOW" subtitle="Designer has actioned your comments" onBack={() => setView('waiting')} />

      <div className="space-y-3 px-4 py-5">
        <article className="rounded-2xl border border-[#dbe6df] bg-white p-4">
          <div className="flex items-start gap-3">
            <CheckCircle size={18} className="mt-0.5 text-black" weight="fill" />
            <div>
              <p className="text-[14px] font-bold text-black">Your remarks were actioned.</p>
              <p className="mt-1 text-[14px] leading-6 text-[#5f7467]">Kitchen scope now includes granite countertop and chimney provision. Budget rationale remains documented for the original scope value.</p>
            </div>
          </div>
        </article>

        <article className="rounded-2xl border border-[#dbe6df] bg-white p-4">
          <p className="text-[12px] font-bold uppercase tracking-[0.08em] text-[#5f7467]">Updated kitchen scope</p>
          <p className="mt-2 text-[14px] leading-6 text-black">Modular L-shape, granite countertop, soft-close shutters, chimney provision included</p>
        </article>

        <article className="rounded-2xl border border-[#dbe6df] bg-white p-4">
          <p className="text-[12px] font-bold uppercase tracking-[0.08em] text-[#5f7467]">Budget note from designer</p>
          <p className="mt-2 text-[14px] leading-6 text-black">The 18L estimate protects execution quality and keeps the selected scope intact after the finish upgrade.</p>
        </article>
      </div>

      <div className="fixed bottom-0 left-1/2 z-[95] w-full max-w-[390px] -translate-x-1/2 border-t border-[#e0e0e0] bg-white px-4 pb-5 pt-3 shadow-[0_-8px_24px_rgba(0,0,0,0.08)]">
        <button type="button" onClick={() => setView('otp')} className="h-11 w-full rounded-full bg-black text-[14px] font-bold text-white">
          Accept & sign
        </button>
      </div>
    </section>
  )

  const renderOtp = () => (
    <section className="mx-auto w-full max-w-[390px] pb-[132px] pt-[56px]">
      <ReviewHeader title="Verify to sign" subtitle="Client approval" onBack={() => setView('revised')} />

      <div className="px-4 py-5">
        <article className="rounded-2xl border border-[#dbe6df] bg-[linear-gradient(180deg,#f4fbf7_0%,#ffffff_100%)] p-5 text-center">
          <div className="mx-auto grid size-14 place-items-center rounded-2xl border border-[#e0e0e0] bg-[#fbfbfb] text-black">
            <CheckCircle size={24} weight="fill" />
          </div>
          <h2 className="mt-4 text-[20px] font-extrabold leading-7 text-black">Verify to sign</h2>
          <p className="mt-2 text-[14px] leading-6 text-[#5f7467]">An OTP was sent to your registered mobile number. Verifying it completes your acceptance of this Scope of Work.</p>
          <div className="mt-5 grid grid-cols-6 gap-2">
            {Array.from({ length: 6 }, (_, index) => (
              <span key={index} className="grid h-12 place-items-center rounded-xl border border-[#e0e0e0] bg-[#fbfbfb] text-[20px] font-bold text-black">
                {index < 2 ? index + 5 : ''}
              </span>
            ))}
          </div>
        </article>
      </div>

      <div className="fixed bottom-0 left-1/2 z-[95] w-full max-w-[390px] -translate-x-1/2 border-t border-[#e0e0e0] bg-white px-4 pb-5 pt-3 shadow-[0_-8px_24px_rgba(0,0,0,0.08)]">
        <button type="button" onClick={() => setView('executed')} className="h-11 w-full rounded-full bg-black text-[14px] font-bold text-white">
          Verify & sign
        </button>
      </div>
    </section>
  )

  const renderExecuted = () => (
    <section className="mx-auto w-full max-w-[390px] pb-[132px] pt-[56px]">
      <ReviewHeader title="SOW signed" subtitle="Executed document" onBack={() => setView('review')} />

      <div className="space-y-3 px-4 py-5">
        <article className="rounded-2xl border border-[#dbe6df] bg-[linear-gradient(180deg,#f4fbf7_0%,#ffffff_100%)] p-5 text-center">
          <div className="mx-auto grid size-16 place-items-center rounded-2xl border border-[#e0e0e0] bg-[#fbfbfb] text-black">
            <CheckCircle size={28} weight="fill" />
          </div>
          <h2 className="mt-4 text-[24px] font-extrabold leading-7 text-black">SOW signed</h2>
          <p className="mt-2 text-[14px] leading-6 text-[#5f7467]">Your project is officially confirmed. The executed Scope of Work is now ready for download and handoff.</p>
        </article>

        <div className="grid grid-cols-2 gap-2">
          <article className="rounded-xl border border-[#e2e2e2] bg-[#fbfbfb] p-3">
            <p className="text-[10px] font-bold uppercase tracking-[0.08em] text-[#7b7b7b]">Designer</p>
            <p className="mt-2 text-[12px] font-bold text-black">{project.designerName}</p>
            <p className="mt-1 text-[10px] font-semibold text-[#6f6f6f]">Signed | 24 May</p>
          </article>
          <article className="rounded-xl border border-[#e2e2e2] bg-[#fbfbfb] p-3">
            <p className="text-[10px] font-bold uppercase tracking-[0.08em] text-[#7b7b7b]">Client</p>
            <p className="mt-2 text-[12px] font-bold text-black">{project.clientName}</p>
            <p className="mt-1 text-[10px] font-semibold text-[#6f6f6f]">Signed | 24 May</p>
          </article>
        </div>
      </div>

      <div className="fixed bottom-0 left-1/2 z-[95] w-full max-w-[390px] -translate-x-1/2 border-t border-[#e0e0e0] bg-white px-4 pb-5 pt-3 shadow-[0_-8px_24px_rgba(0,0,0,0.08)]">
        <button type="button" className="h-11 w-full rounded-full bg-black text-[14px] font-bold text-white">
          Download executed SOW
        </button>
      </div>
    </section>
  )

  return (
    <main className="min-h-dvh w-full overflow-x-hidden bg-white font-['Urbanist'] text-black">
      {view === 'review' ? renderReview() : null}
      {view === 'summary' ? renderSummary() : null}
      {view === 'waiting' ? renderWaiting() : null}
      {view === 'revised' ? renderRevised() : null}
      {view === 'otp' ? renderOtp() : null}
      {view === 'executed' ? renderExecuted() : null}
    </main>
  )
}

export default HomeownerSowReview
