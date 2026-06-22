import { useState } from 'react'
import { CaretDown, CaretLeft, CheckCircle, FileArrowDown, NotePencil } from '@phosphor-icons/react'
import { useSharedProject } from '../collaboration/mockProjectStore'

function ReviewHeader({ title, subtitle, onBack }) {
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
          <button type="button" className="grid size-8 shrink-0 place-items-center rounded-xl border border-[#dbe6df] bg-white text-black">
            <FileArrowDown size={15} />
          </button>
        </div>
      </div>
    </header>
  )
}

function ClientSection({ index, title, open, onToggle, badge, children }) {
  return (
    <article className="overflow-hidden rounded-[20px] border border-[#dbe6df] bg-white">
      <button type="button" onClick={onToggle} className="flex w-full items-center justify-between px-4 py-3 text-left">
        <span className="flex min-w-0 items-center gap-3">
          <span className="type-caption grid size-6 shrink-0 place-items-center rounded-lg bg-[#f4fbf7] text-[#267449]">{index}</span>
          <span className="type-card-title truncate text-[#102418]">{title}</span>
        </span>
        <span className="flex shrink-0 items-center gap-2">
          {badge ? <span className="type-caption rounded-full bg-[#fff3dd] px-2 py-1 uppercase text-[#a86a00]">{badge}</span> : null}
          <CaretDown size={14} className={`transition-transform ${open ? 'rotate-180' : ''}`} />
        </span>
      </button>
      {open ? <div className="border-t border-[#ececec] px-4 py-4">{children}</div> : null}
    </article>
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
          className="type-page-title h-12 rounded-[14px] border border-[#dfdfdf] bg-white text-center text-black outline-none focus:border-black"
        />
      ))}
    </div>
  )
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

function HomeownerSowReview({ onBack }) {
  const { project, sow, activity, actions } = useSharedProject('p-1')
  const [view, setView] = useState('review')
  const [showExecutedDetails, setShowExecutedDetails] = useState(false)
  const [remarkDraft, setRemarkDraft] = useState('')
  const [remarkTarget, setRemarkTarget] = useState(null)
  const [otpDigits, setOtpDigits] = useState(['', '', '', '', '', ''])
  const [amendmentResponse, setAmendmentResponse] = useState('')
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

  const document = sow?.document
  const openRemarks = sow?.remarks?.filter((remark) => remark.status === 'open') || []
  const responses = sow?.responses || []
  const pendingAmendment = sow?.amendments?.find((amendment) => amendment.status === 'pending') || null
  const executedAmendments = sow?.amendments?.filter((amendment) => amendment.status !== 'pending') || []
  const toggleSection = (key) => setOpenSections((current) => ({ ...current, [key]: !current[key] }))
  const effectiveView = sow?.status === 'executed' && pendingAmendment && view === 'review'
    ? 'amendment'
    : view

  const startRemark = (sectionKey, sectionTitle, targetId = null, starter = '') => {
    setRemarkTarget({ sectionKey, sectionTitle, targetId })
    setRemarkDraft(starter)
    setView('remark')
  }

  const sendRemark = () => {
    if (!remarkTarget || !remarkDraft.trim()) return
    actions.addClientRemark(remarkTarget.sectionKey, remarkTarget.sectionTitle, remarkDraft, remarkTarget.targetId)
    setRemarkDraft('')
    setRemarkTarget(null)
    setView('waiting')
  }

  const signSow = () => {
    if (otpDigits.some((digit) => !digit)) return
    actions.clientSignSow()
    setView('executed')
  }

  const renderEmpty = () => (
    <section className="mx-auto w-full max-w-[390px] pb-[132px] pt-[56px]">
      <ReviewHeader title="Scope of Work" subtitle="Waiting for designer" onBack={onBack} />

      <div className="px-4 py-5">
        <article className="rounded-[22px] border border-[#dbe6df] bg-white p-5 text-center">
          <div className="mx-auto grid size-14 place-items-center rounded-[18px] border border-[#e0e0e0] bg-[#fbfbfb] text-black">
            <NotePencil size={22} />
          </div>
          <h1 className="type-page-title mt-4 text-black">No SOW shared yet</h1>
          <p className="type-body mt-2 text-[#5f7467]">When the professional creates and sends a Scope of Work, it will appear here automatically.</p>
        </article>

        {activity.length ? (
          <section className="mt-4 rounded-[20px] border border-[#e1e1e1] bg-white p-4">
            <p className="type-label uppercase text-[#5f7467]">Latest activity</p>
            <div className="mt-3 space-y-2">
              {activity.slice(0, 3).map((item) => (
                <p key={item.id} className="type-meta text-[#5f7467]"><span className="font-bold text-black">{item.actor}</span> {item.text}</p>
              ))}
            </div>
          </section>
        ) : null}
      </div>
    </section>
  )

  const renderWaitingForSend = () => (
    <section className="mx-auto w-full max-w-[390px] pb-[132px] pt-[56px]">
      <ReviewHeader title="Scope of Work" subtitle="Draft in progress" onBack={onBack} />

      <div className="px-4 py-5">
        <article className="rounded-[22px] border border-[#dbe6df] bg-white p-5 text-center">
          <div className="mx-auto grid size-14 place-items-center rounded-[18px] border border-[#e0e0e0] bg-[#fbfbfb] text-black">
            <NotePencil size={22} />
          </div>
          <h1 className="type-page-title mt-4 text-black">Designer is preparing the SOW</h1>
          <p className="type-body mt-2 text-[#5f7467]">The document exists, but it has not been sent to you yet. This screen will switch once it is shared for review.</p>
        </article>
      </div>
    </section>
  )

  const renderReview = () => (
    <section className="mx-auto w-full max-w-[390px] pb-[148px] pt-[56px]">
      <ReviewHeader title={sow.status === 'revision-ready' ? 'Revised SOW' : 'Scope of Work'} subtitle={`Revision ${sow.revision}`} onBack={onBack} />

      <div className="px-4 py-5">
        <section className="pb-5">
          <div className="flex items-center justify-between gap-3">
            <div className="min-w-0">
              <p className="type-section-title truncate text-[#102418]">{document.projectName}</p>
              <p className="type-body mt-1 truncate text-[#5f7467]">From {project.designerName} | {document.location}</p>
            </div>
            <span className={`type-caption shrink-0 rounded-full px-3 py-1 uppercase ${sow.status === 'revision-ready' ? 'bg-[#eef7f1] text-[#267449]' : 'bg-[#f2f5ff] text-[#4d5fb3]'}`}>
              {sow.status === 'revision-ready' ? 'Revised' : 'For review'}
            </span>
          </div>

          <div className="mt-4 grid grid-cols-3 gap-2">
            <div className="rounded-[18px] border border-[#dbe6df] bg-white px-3 py-3">
              <p className="type-utility text-[#73867c]">Type</p>
              <p className="type-card-title mt-2 text-[#102418]">{document.projectType}</p>
            </div>
            <div className="rounded-[18px] border border-[#dce7f3] bg-white px-3 py-3">
              <p className="type-utility text-[#73849d]">Value</p>
              <p className="type-card-title mt-2 text-[#102418]">INR {document.totalValueLabel}</p>
            </div>
            <div className="rounded-[18px] border border-[#efe2c8] bg-white px-3 py-3">
              <p className="type-utility text-[#987f53]">Open remarks</p>
              <p className="type-card-title mt-2 text-[#102418]">{openRemarks.length}</p>
            </div>
          </div>
        </section>

        {responses.length ? (
          <section className="space-y-2 pb-5">
            {responses.slice(-3).map((response) => {
              const remark = sow.remarks.find((item) => item.id === response.remarkId)
              return (
                <article key={response.id} className={`rounded-[18px] border p-4 ${response.decision === 'approve' ? 'border-[#dbe6df] bg-[#f4fbf7]' : 'border-[#f1d7d7] bg-[#fff7f7]'}`}>
                  <p className="type-label uppercase text-[#5f7467]">{response.decision === 'approve' ? 'Updated' : 'Rejected'}</p>
                  <p className="type-body mt-2 text-black">{remark?.body}</p>
                  <p className="type-meta mt-2 text-[#5f7467]">{response.body}</p>
                </article>
              )
            })}
          </section>
        ) : null}

        <section className="space-y-3 py-5">
          <ClientSection index="1" title="Project overview" open={openSections.overview} onToggle={() => toggleSection('overview')}>
            <div className="space-y-3">
              {[
                ['Project', document.projectName],
                ['Client', document.clientName],
                ['Location', document.location],
                ['Type', document.projectType],
                ['Handover', document.handoverMonth],
              ].map(([label, value]) => (
                <div key={label} className="flex items-start justify-between gap-4 border-b border-[#ededed] pb-2 last:border-b-0 last:pb-0">
                  <span className="type-utility uppercase text-[#71837a]">{label}</span>
                  <span className="type-data-value text-right text-black">{value}</span>
                </div>
              ))}
            </div>
          </ClientSection>

          <ClientSection index="2" title="Scope - room wise" open={openSections.scope} onToggle={() => toggleSection('scope')} badge={openRemarks.some((remark) => remark.sectionKey === 'rooms') ? 'Remarked' : undefined}>
            <div className="space-y-3">
              {document.rooms.map((room) => (
                <article key={room.id} className="border-b border-[#ededed] pb-3 last:border-b-0 last:pb-0">
                  <p className="type-card-title text-black">{room.name}</p>
                  <p className="type-body mt-1 text-[#5f7467]">{room.scope}</p>
                  <button
                    type="button"
                    onClick={() => startRemark('rooms', `${room.name} scope`, room.id, room.id === 'kitchen' ? 'Please include granite countertop and chimney provision in the kitchen scope.' : '')}
                    className="type-label mt-3 flex items-center gap-2 rounded-xl border border-[#e0e0e0] bg-white px-3 py-2 text-black"
                  >
                    <NotePencil size={14} />
                    Add remark
                  </button>
                </article>
              ))}
            </div>
          </ClientSection>

          <ClientSection index="3" title="Exclusions" open={openSections.exclusions} onToggle={() => toggleSection('exclusions')} badge={openRemarks.some((remark) => remark.sectionKey === 'exclusions') ? 'Remarked' : undefined}>
            <div className="mb-3 rounded-[18px] border border-[#efe2c8] bg-[#fff9ef] p-3">
              <p className="type-caption uppercase text-[#9f8350]">Designer-managed scope boundary</p>
              <p className="type-body mt-1 text-black">These stay outside scope unless your designer actively adds them.</p>
            </div>
            <div className="space-y-2">
              {document.exclusions.map((item) => (
                <div key={item} className="type-body flex items-start gap-2 text-black">
                  <span className="mt-1 size-1.5 rounded-full bg-[#8c8c8c]" />
                  <span>{item}</span>
                </div>
              ))}
            </div>
            <button type="button" onClick={() => startRemark('exclusions', 'Exclusions', null, 'Can you clarify whether one of these exclusions can be added to the scope?')} className="type-label mt-3 flex items-center gap-2 rounded-xl border border-[#e0e0e0] bg-white px-3 py-2 text-black">
              <NotePencil size={14} />
              Add exclusion remark
            </button>
          </ClientSection>

          <ClientSection index="4" title="Timeline" open={openSections.timeline} onToggle={() => toggleSection('timeline')} badge={openRemarks.some((remark) => remark.sectionKey === 'timeline') ? 'Remarked' : undefined}>
            <div className="grid grid-cols-3 gap-2">
              {[
                ['Start', document.startMonth],
                ['Duration', document.durationLabel],
                ['Handover', document.handoverMonth],
              ].map(([label, value]) => (
                <article key={label} className="rounded-[18px] border border-[#e2e2e2] bg-white px-2 py-3 text-center">
                  <p className="type-caption uppercase text-[#7b7b7b]">{label}</p>
                  <p className="type-label mt-2 text-black">{value}</p>
                </article>
              ))}
            </div>
            <button type="button" onClick={() => startRemark('timeline', 'Timeline', null, 'Can you clarify or adjust the project timeline?')} className="type-label mt-3 flex items-center gap-2 rounded-xl border border-[#e0e0e0] bg-white px-3 py-2 text-black">
              <NotePencil size={14} />
              Add timeline remark
            </button>
          </ClientSection>

          <ClientSection index="5" title="Budget estimate" open={openSections.budget} onToggle={() => toggleSection('budget')} badge={openRemarks.some((remark) => remark.sectionKey === 'budget') ? 'Remarked' : undefined}>
            <div className="rounded-[18px] border border-[#dce7f3] bg-white px-3 py-3">
              <p className="type-caption uppercase text-[#73849d]">Total value</p>
              <p className="type-page-title mt-2 text-black">INR {document.totalValueLabel}</p>
            </div>
            <button type="button" onClick={() => startRemark('budget', 'Budget estimate', null, 'Can we discuss the overall estimate before I approve the SOW?')} className="type-label mt-3 flex items-center gap-2 rounded-xl border border-[#e0e0e0] bg-white px-3 py-2 text-black">
              <NotePencil size={14} />
              Add budget remark
            </button>
          </ClientSection>

          <ClientSection index="6" title="Payment terms" open={openSections.payment} onToggle={() => toggleSection('payment')} badge={openRemarks.some((remark) => remark.sectionKey === 'payment') ? 'Remarked' : undefined}>
            <div className="type-body space-y-2 text-[#5f7467]">
              {document.paymentTerms.map((term) => <p key={term}>{term}</p>)}
            </div>
            <button type="button" onClick={() => startRemark('payment', 'Payment terms', null, 'Can we discuss the payment milestones before I approve?')} className="type-label mt-3 flex items-center gap-2 rounded-xl border border-[#e0e0e0] bg-white px-3 py-2 text-black">
              <NotePencil size={14} />
              Add payment remark
            </button>
          </ClientSection>

          <ClientSection index="7" title="Terms & notes" open={openSections.terms} onToggle={() => toggleSection('terms')} badge={openRemarks.some((remark) => remark.sectionKey === 'terms') ? 'Remarked' : undefined}>
            <div className="type-body space-y-2 text-[#5f7467]">
              {document.termsNotes.map((term) => <p key={term}>{term}</p>)}
            </div>
            <button type="button" onClick={() => startRemark('terms', 'Terms and notes', null, 'Please clarify this term before I approve the SOW.')} className="type-label mt-3 flex items-center gap-2 rounded-xl border border-[#e0e0e0] bg-white px-3 py-2 text-black">
              <NotePencil size={14} />
              Add terms remark
            </button>
          </ClientSection>

          <ClientSection index="8" title="Signatures" open={openSections.signatures} onToggle={() => toggleSection('signatures')} badge={openRemarks.some((remark) => remark.sectionKey === 'signatures') ? 'Remarked' : undefined}>
            <div className="grid grid-cols-2 gap-2">
              {[
                ['Designer', project.designerName, sow.designerSigned ? 'Signed' : 'Pending'],
                ['Client', document.clientName, sow.clientSigned ? 'Signed' : 'Waiting'],
              ].map(([label, name, state]) => (
                <article key={label} className="rounded-[18px] border border-[#e2e2e2] bg-white p-3">
                  <p className="type-caption uppercase text-[#7b7b7b]">{label}</p>
                  <p className="type-label mt-2 text-black">{name}</p>
                  <p className="type-caption mt-2 text-[#6f6f6f]">{state}</p>
                </article>
              ))}
            </div>
            <button type="button" onClick={() => startRemark('signatures', 'Signatures', null, 'Please verify the signer details before I complete the acceptance.')} className="type-label mt-3 flex items-center gap-2 rounded-xl border border-[#e0e0e0] bg-white px-3 py-2 text-black">
              <NotePencil size={14} />
              Add signature remark
            </button>
          </ClientSection>
        </section>
      </div>

      <div className="fixed bottom-0 left-1/2 z-[95] w-full max-w-[390px] -translate-x-1/2 border-t border-[#e0e0e0] bg-white px-4 pb-5 pt-3">
        <button type="button" onClick={() => setView('otp')} className="type-body-strong h-11 w-full rounded-full bg-black text-white">
          Looks good - sign and accept
        </button>
        <button type="button" onClick={() => startRemark('general', 'General SOW feedback')} className="type-body-strong mt-2 h-10 w-full rounded-xl border border-[#e0e0e0] bg-white text-[#4b4b4b]">
          Add general remark
        </button>
      </div>
    </section>
  )

  const renderRemark = () => (
    <section className="mx-auto w-full max-w-[390px] pb-[132px] pt-[56px]">
      <ReviewHeader title="Add remark" subtitle={remarkTarget?.sectionTitle || 'SOW feedback'} onBack={() => setView('review')} />

      <div className="space-y-3 px-4 py-5">
        <article className="rounded-[20px] border border-[#dbe6df] bg-white p-4">
          <p className="type-label uppercase text-[#5f7467]">{remarkTarget?.sectionTitle}</p>
          <textarea
            value={remarkDraft}
            onChange={(event) => setRemarkDraft(event.target.value)}
            placeholder="Add a remark for the designer..."
            className="type-body mt-3 min-h-32 w-full rounded-[18px] border border-[#dbe6df] bg-white px-4 py-3 text-black outline-none"
          />
        </article>
      </div>

      <div className="fixed bottom-0 left-1/2 z-[95] w-full max-w-[390px] -translate-x-1/2 border-t border-[#e0e0e0] bg-white px-4 pb-5 pt-3">
        <button type="button" onClick={sendRemark} disabled={!remarkDraft.trim()} className="type-body-strong h-11 w-full rounded-full bg-black text-white disabled:bg-[#d9d9d9] disabled:text-[#777777]">
          Send remark to designer
        </button>
      </div>
    </section>
  )

  const renderWaiting = () => (
    <section className="mx-auto w-full max-w-[390px] pb-[132px] pt-[56px]">
      <ReviewHeader title="Remarks sent" subtitle="Waiting for revision" onBack={() => setView('review')} />

      <div className="px-4 py-5">
        <article className="rounded-[22px] border border-[#dbe6df] bg-white p-5 text-center">
          <div className="mx-auto grid size-14 place-items-center rounded-[18px] border border-[#e0e0e0] bg-[#fbfbfb] text-black">
            <NotePencil size={22} />
          </div>
          <h2 className="type-page-title mt-4 text-black">Remarks sent</h2>
          <p className="type-body mt-2 text-[#5f7467]">Your designer can accept or reject each remark in the professional flow. This screen will update as soon as they respond.</p>
        </article>

        {openRemarks.length ? (
          <section className="mt-4 rounded-[20px] border border-[#dbe6df] bg-white p-4">
            <p className="type-label uppercase text-[#5f7467]">Sent remarks</p>
            <div className="mt-3 space-y-2">
              {openRemarks.map((remark) => (
                <article key={remark.id} className="rounded-[16px] bg-[#fafafa] p-3">
                  <p className="type-card-title text-black">{remark.sectionTitle}</p>
                  <p className="type-body mt-1 text-[#5f7467]">{remark.body}</p>
                </article>
              ))}
            </div>
          </section>
        ) : null}
      </div>

      <div className="fixed bottom-0 left-1/2 z-[95] w-full max-w-[390px] -translate-x-1/2 border-t border-[#e0e0e0] bg-white px-4 pb-5 pt-3">
        <button type="button" onClick={() => setView('review')} className="type-body-strong h-11 w-full rounded-full bg-black text-white">
          Review current SOW
        </button>
      </div>
    </section>
  )

  const renderOtp = () => (
    <section className="mx-auto w-full max-w-[390px] pb-[132px] pt-[56px]">
      <ReviewHeader title="Verify to sign" subtitle="Client approval" onBack={() => setView('review')} />

      <div className="px-4 py-5">
        <article className="rounded-[22px] border border-[#dbe6df] bg-white p-5 text-center">
          <div className="mx-auto grid size-16 place-items-center rounded-[20px] bg-[#f4fbf7] text-black">
            <CheckCircle size={28} weight="fill" />
          </div>
          <h2 className="type-page-title mt-4 text-black">Verify your identity</h2>
          <p className="type-body mt-2 text-[#5f7467]">An OTP was sent to your registered mobile number. Verifying it completes your acceptance of this Scope of Work.</p>
          <div className="mt-5">
            <OtpRow digits={otpDigits} setDigits={setOtpDigits} />
          </div>
          <p className="type-meta mt-4 text-[#7b7b7b]">This acts as a valid electronic signature for the client side.</p>
        </article>
      </div>

      <div className="fixed bottom-0 left-1/2 z-[95] w-full max-w-[390px] -translate-x-1/2 border-t border-[#e0e0e0] bg-white px-4 pb-5 pt-3">
        <button type="button" onClick={signSow} disabled={otpDigits.some((digit) => !digit)} className="type-body-strong h-11 w-full rounded-full bg-black text-white disabled:bg-[#d9d9d9] disabled:text-[#777777]">
          Verify and sign
        </button>
      </div>
    </section>
  )

  const renderAmendmentReview = () => (
    <section className="mx-auto w-full max-w-[390px] pb-[132px] pt-[56px]">
      <ReviewHeader title={`Amendment v${pendingAmendment.version}`} subtitle="Review change request" onBack={() => setView('executed')} />

      <div className="px-4 py-5">
        <article className="rounded-[20px] border border-[#dbe6df] bg-white p-4">
          <p className="type-section-title text-black">{pendingAmendment.sectionTitle}</p>
          <p className="type-body mt-2 text-[#5f7467]">Your designer has proposed a formal change to the executed SOW. Approving it will update the shared document revision.</p>
        </article>

        <section className="mt-4 rounded-[20px] border border-[#dbe6df] bg-white p-4">
          <p className="type-caption uppercase text-[#7b7b7b]">Current</p>
          <p className="type-body mt-2 text-[#8a8a8a] whitespace-pre-wrap">{pendingAmendment.oldValue}</p>
          <p className="type-caption mt-4 uppercase text-[#7b7b7b]">Proposed</p>
          <p className="type-body mt-2 text-black whitespace-pre-wrap">{pendingAmendment.newValue}</p>
          <p className="type-caption mt-4 uppercase text-[#7b7b7b]">Reason</p>
          <p className="type-body mt-2 text-black">{pendingAmendment.reason}</p>
        </section>

        <section className="mt-4 rounded-[20px] border border-[#dbe6df] bg-white p-4">
          <p className="type-label uppercase text-[#5f7467]">Optional rejection note</p>
          <textarea
            value={amendmentResponse}
            onChange={(event) => setAmendmentResponse(event.target.value)}
            placeholder="Add a reason if you want to reject this amendment."
            className="type-body mt-2 min-h-24 w-full resize-none rounded-[18px] border border-[#dbe6df] bg-white px-4 py-3 text-black outline-none"
          />
        </section>
      </div>

      <div className="fixed bottom-0 left-1/2 z-[95] w-full max-w-[390px] -translate-x-1/2 border-t border-[#e0e0e0] bg-white px-4 pb-5 pt-3">
        <div className="grid grid-cols-2 gap-2">
          <button type="button" onClick={() => { actions.approveSowAmendment(pendingAmendment.id); setAmendmentResponse(''); setView('executed') }} className="type-body-strong h-11 rounded-full bg-black text-white">
            Approve
          </button>
          <button type="button" onClick={() => { actions.rejectSowAmendment(pendingAmendment.id, amendmentResponse); setAmendmentResponse(''); setView('executed') }} className="type-body-strong h-11 rounded-full border border-[#e0e0e0] bg-white text-black">
            Reject
          </button>
        </div>
      </div>
    </section>
  )

  const renderExecuted = () => (
    <section className="mx-auto w-full max-w-[390px] pb-[132px] pt-[56px]">
      <ReviewHeader title="SOW signed" subtitle="Executed document" onBack={onBack} />

      <div className="space-y-3 px-4 py-5">
        <article className="rounded-[22px] border border-[#dbe6df] bg-white p-5 text-center">
          <div className="mx-auto grid size-16 place-items-center rounded-[20px] bg-[#f4fbf7] text-black">
            <CheckCircle size={28} weight="fill" />
          </div>
          <h2 className="type-page-title mt-4 text-black">SOW signed</h2>
          <p className="type-body mt-2 text-[#5f7467]">Your project is officially confirmed. Any change from here moves through a formal amendment.</p>
        </article>

        <div className="grid grid-cols-2 gap-2">
          <article className="rounded-[18px] border border-[#e2e2e2] bg-white p-3">
            <p className="type-caption uppercase text-[#7b7b7b]">Designer</p>
            <p className="type-label mt-2 text-black">{project.designerName}</p>
            <p className="type-caption mt-2 text-[#6f6f6f]">{formatStamp(sow.designerSignedAt)}</p>
          </article>
          <article className="rounded-[18px] border border-[#e2e2e2] bg-white p-3">
            <p className="type-caption uppercase text-[#7b7b7b]">You</p>
            <p className="type-label mt-2 text-black">{document.clientName}</p>
            <p className="type-caption mt-2 text-[#6f6f6f]">{formatStamp(sow.clientSignedAt)}</p>
          </article>
        </div>

        <article className="rounded-[20px] border border-[#dbe6df] bg-white p-4">
          <p className="type-section-title text-black">What happens next?</p>
          <div className="type-body mt-3 space-y-2 text-[#5f7467]">
            <p>Detailed drawings and execution planning can begin.</p>
            <p>Your first payment milestone follows the agreed payment structure.</p>
            <p>Any scope change now requires a formal amendment.</p>
          </div>
        </article>

        {pendingAmendment ? (
          <article className="rounded-[20px] border border-[#efe2c8] bg-[#fff9ef] p-4">
            <p className="type-section-title text-black">Amendment waiting</p>
            <p className="type-body mt-2 text-[#5f7467]">A new formal amendment is waiting for your approval.</p>
            <button type="button" onClick={() => setView('amendment')} className="type-body-strong mt-3 h-10 rounded-xl border border-black bg-white px-4 text-black">
              Review amendment
            </button>
          </article>
        ) : null}

        {executedAmendments.length ? (
          <section className="rounded-[20px] border border-[#dbe6df] bg-white p-4">
            <p className="type-label uppercase text-[#5f7467]">Amendment history</p>
            <div className="mt-3 space-y-3">
              {executedAmendments.map((amendment) => (
                <article key={amendment.id} className="rounded-[16px] bg-[#fafafa] p-3">
                  <div className="flex items-center justify-between gap-3">
                    <p className="type-card-title text-black">Amendment v{amendment.version}</p>
                    <span className={`type-caption rounded-full px-2 py-1 uppercase ${amendment.status === 'approved' ? 'bg-[#eaf9f1] text-[#267449]' : 'bg-[#fdecec] text-[#c34545]'}`}>{amendment.status}</span>
                  </div>
                  <p className="type-meta mt-1 text-[#7b7b7b]">{amendment.sectionTitle}</p>
                  {amendment.responseText ? <p className="type-body mt-2 text-[#5f7467]">{amendment.responseText}</p> : null}
                </article>
              ))}
            </div>
          </section>
        ) : null}
        {showExecutedDetails ? (
          <div className="space-y-3 pt-2">
            <ClientSection index="1" title="Project overview" open={openSections.overview} onToggle={() => toggleSection('overview')}>
              <div className="space-y-3">
                {[
                  ['Project', document.projectName],
                  ['Client', document.clientName],
                  ['Location', document.location],
                  ['Type', document.projectType],
                  ['Handover', document.handoverMonth],
                ].map(([label, value]) => (
                  <div key={label} className="flex items-start justify-between gap-4 border-b border-[#ededed] pb-2 last:border-b-0 last:pb-0">
                    <span className="type-utility uppercase text-[#71837a]">{label}</span>
                    <span className="type-data-value text-right text-black">{value}</span>
                  </div>
                ))}
              </div>
            </ClientSection>

            <ClientSection index="2" title="Scope - room wise" open={openSections.scope} onToggle={() => toggleSection('scope')}>
              <div className="space-y-3">
                {document.rooms.map((room) => (
                  <article key={room.id} className="border-b border-[#ededed] pb-3 last:border-b-0 last:pb-0">
                    <p className="type-card-title text-black">{room.name}</p>
                    <p className="type-body mt-1 text-[#5f7467]">{room.scope}</p>
                  </article>
                ))}
              </div>
            </ClientSection>

            <ClientSection index="3" title="Exclusions" open={openSections.exclusions} onToggle={() => toggleSection('exclusions')}>
              <div className="space-y-2">
                {document.exclusions.map((item) => (
                  <div key={item} className="type-body flex items-start gap-2 text-black">
                    <span className="mt-1 size-1.5 rounded-full bg-[#8c8c8c]" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </ClientSection>

            <ClientSection index="4" title="Timeline" open={openSections.timeline} onToggle={() => toggleSection('timeline')}>
              <div className="grid grid-cols-3 gap-2">
                {[
                  ['Start', document.startMonth],
                  ['Duration', document.durationLabel],
                  ['Handover', document.handoverMonth],
                ].map(([label, value]) => (
                  <article key={label} className="rounded-[18px] border border-[#e2e2e2] bg-white px-2 py-3 text-center">
                    <p className="type-caption uppercase text-[#7b7b7b]">{label}</p>
                    <p className="type-label mt-2 text-black">{value}</p>
                  </article>
                ))}
              </div>
            </ClientSection>

            <ClientSection index="5" title="Budget estimate" open={openSections.budget} onToggle={() => toggleSection('budget')}>
              <div className="rounded-[18px] border border-[#dce7f3] bg-white px-3 py-3">
                <p className="type-caption uppercase text-[#73849d]">Total value</p>
                <p className="type-page-title mt-2 text-black">INR {document.totalValueLabel}</p>
              </div>
            </ClientSection>

            <ClientSection index="6" title="Payment terms" open={openSections.payment} onToggle={() => toggleSection('payment')}>
              <div className="space-y-3">
                {document.stages.map((stage) => (
                  <div key={stage.id} className="flex items-start justify-between gap-4 border-b border-[#ededed] pb-2 last:border-b-0 last:pb-0">
                    <span className="type-body text-[#102418]">{stage.label}</span>
                    <span className="type-body-strong text-black">{stage.percentage}%</span>
                  </div>
                ))}
              </div>
            </ClientSection>
          </div>
        ) : null}

        <button
          type="button"
          onClick={() => setShowExecutedDetails(!showExecutedDetails)}
          className="type-body-strong mt-4 flex w-full items-center justify-between rounded-[20px] border border-[#dbe6df] bg-[#f7fbf8] p-4 text-left text-black"
        >
          <span>View executed SOW details</span>
          <span className="type-meta text-[#267449]">
            {showExecutedDetails ? 'Hide details' : 'Show details'}
          </span>
        </button>
      </div>
    </section>
  )

  if (!sow) {
    return <main className="min-h-dvh w-full overflow-x-hidden bg-white font-['Urbanist'] text-black">{renderEmpty()}</main>
  }

  if (sow.status === 'draft') {
    return <main className="min-h-dvh w-full overflow-x-hidden bg-white font-['Urbanist'] text-black">{renderWaitingForSend()}</main>
  }

  if (sow.status === 'executed' && effectiveView === 'amendment' && pendingAmendment) {
    return <main className="min-h-dvh w-full overflow-x-hidden bg-white font-['Urbanist'] text-black">{renderAmendmentReview()}</main>
  }

  if (sow.status === 'executed' || effectiveView === 'executed') {
    return <main className="min-h-dvh w-full overflow-x-hidden bg-white font-['Urbanist'] text-black">{renderExecuted()}</main>
  }

  return (
    <main className="min-h-dvh w-full overflow-x-hidden bg-white font-['Urbanist'] text-black">
      {effectiveView === 'review' ? renderReview() : null}
      {effectiveView === 'remark' ? renderRemark() : null}
      {effectiveView === 'waiting' ? renderWaiting() : null}
      {effectiveView === 'otp' ? renderOtp() : null}
    </main>
  )
}

export default HomeownerSowReview
