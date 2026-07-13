import { useMemo, useState } from 'react'
import {
  CheckCircle,
  CreditCard,
  DownloadSimple,
  QrCode,
  Receipt,
} from '@phosphor-icons/react'
import { useSharedProject } from '../collaboration/mockProjectStore'
import ProjectWorkspaceHeader from '../shared/ProjectWorkspaceHeader'
import PaymentMilestoneTimeline from './PaymentMilestoneTimeline'

const INR = '\u20b9'

const statusTone = {
  paid: 'bg-[#eaf8ef] text-[#267449]',
  due: 'bg-[#fff4dd] text-[#a86a00]',
  upcoming: 'bg-[#f2f2f2] text-[#6a6a6a]',
}

const statusLabel = {
  paid: 'Paid',
  due: 'Due',
  upcoming: 'Upcoming',
}

const methodOptions = [
  { id: 'UPI', label: 'UPI', meta: 'GPay, PhonePe, Paytm', icon: QrCode },
  { id: 'Card', label: 'Credit / Debit Card', meta: 'Visa, Mastercard, RuPay', icon: CreditCard },
  { id: 'Net Banking', label: 'Net Banking', meta: 'All major banks', icon: Receipt },
]

const formatLakhs = (value) => `${INR}${value.toFixed(1)}L`

function Header({ title, subtitle, onBack, trailing = null }) {
  return <ProjectWorkspaceHeader title={title} subtitle={subtitle} onBack={onBack} actions={trailing} />
}

function InvoiceRow({ invoice, onOpen }) {
  return (
    <button type="button" onClick={() => onOpen(invoice.id)} className="w-full border-b border-[#e5e5e5] py-4 text-left last:border-b-0">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="typo-body-strong text-black">{invoice.number} - {invoice.title}</p>
          <p className="typo-meta mt-1 text-[#777]">
            {invoice.status === 'paid' ? `Paid ${invoice.paidAt}` : invoice.status === 'due' ? `Due ${invoice.dueDate}` : invoice.dueDate}
          </p>
        </div>
        <div className="text-right">
          <p className="typo-card-title">{formatLakhs(invoice.amountL)}</p>
          <span className={`typo-caption mt-1 inline-flex rounded-full px-2 py-1 ${statusTone[invoice.status]}`}>{statusLabel[invoice.status]}</span>
        </div>
      </div>
    </button>
  )
}

function HomeownerFinanceWorkspace({ onBack }) {
  const { project, financeInvoices, financeSummary, actions } = useSharedProject('p-1')
  const [screen, setScreen] = useState('overview')
  const [selectedInvoiceId, setSelectedInvoiceId] = useState(financeInvoices.find((invoice) => invoice.status === 'due')?.id || financeInvoices[0]?.id || null)
  const [selectedMethod, setSelectedMethod] = useState('UPI')
  const [otpDigits, setOtpDigits] = useState(Array(6).fill(''))
  const [toastMessage, setToastMessage] = useState(null)

  const triggerToast = (msg) => {
    setToastMessage(msg)
    setTimeout(() => {
      setToastMessage(null)
    }, 2500)
  }

  const selectedInvoice = useMemo(
    () => financeInvoices.find((invoice) => invoice.id === selectedInvoiceId) || null,
    [financeInvoices, selectedInvoiceId],
  )
  const dueInvoice = financeInvoices.find((invoice) => invoice.status === 'due') || null

  const openPayFlow = (invoiceId) => {
    setSelectedInvoiceId(invoiceId)
    setSelectedMethod('UPI')
    setOtpDigits(Array(6).fill(''))
    setScreen('pay')
  }

  const openDetail = (invoiceId) => {
    setSelectedInvoiceId(invoiceId)
    setScreen('detail')
  }

  const updateOtpDigit = (index, value) => {
    const nextDigits = [...otpDigits]
    nextDigits[index] = value.slice(-1)
    setOtpDigits(nextDigits)
  }

  const confirmPayment = () => {
    if (otpDigits.join('').length < 6 || !selectedInvoice) return
    actions.payFinanceInvoice(selectedInvoice.id, selectedMethod)
    setScreen('success')
  }

  if (screen === 'detail' && selectedInvoice) {
    return (
      <main className="ui-screen-base ui-feature-surface min-h-dvh w-full overflow-x-hidden bg-white text-black">
        <section className="mx-auto w-full max-w-[390px] pb-10 pt-16">
          <Header
            title={selectedInvoice.number}
            subtitle={`${project.name} / ${selectedInvoice.stageLabel || selectedInvoice.title}`}
            onBack={() => setScreen('overview')}
            trailing={selectedInvoice.status === 'paid' ? (
              <button type="button" onClick={() => triggerToast('Receipt downloaded!')} className="grid size-9 place-items-center rounded-xl border border-[#e0e0e0] bg-white hover:bg-gray-50 transition-colors" aria-label="Download receipt">
                <DownloadSimple size={17} />
              </button>
            ) : null}
          />

          <div className="ui-screen-content">
            <section className="border-b border-[#e5e5e5] pb-5">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="typo-caption uppercase text-[#267449]">{selectedInvoice.stageLabel || selectedInvoice.title}</p>
                  <h1 className="typo-page-title mt-2 text-black">{formatLakhs(selectedInvoice.amountL)}</h1>
                </div>
                <span className={`typo-caption rounded-full px-3 py-2 ${statusTone[selectedInvoice.status]}`}>{statusLabel[selectedInvoice.status]}</span>
              </div>
              <p className="typo-body mt-3 text-[#5f7467]">{selectedInvoice.summary || 'Payment milestone shared by your professional.'}</p>
            </section>

            <section className="border-b border-[#e5e5e5] py-5">
              <div className="flex items-center justify-between py-2">
                <span className="typo-meta text-[#7b7b7b]">Issued</span>
                <span className="typo-body-strong text-black">{selectedInvoice.issuedAt || 'Not raised yet'}</span>
              </div>
              <div className="flex items-center justify-between py-2">
                <span className="typo-meta text-[#7b7b7b]">Due</span>
                <span className="typo-body-strong text-black">{selectedInvoice.dueDate}</span>
              </div>
              <div className="flex items-center justify-between py-2">
                <span className="typo-meta text-[#7b7b7b]">Milestone</span>
                <span className="typo-body-strong text-black">{selectedInvoice.stageLabel || selectedInvoice.title}</span>
              </div>
              {selectedInvoice.paidAt ? (
                <div className="flex items-center justify-between py-2">
                  <span className="typo-meta text-[#7b7b7b]">Paid</span>
                  <span className="typo-body-strong text-black">{selectedInvoice.paidAt}</span>
                </div>
              ) : null}
              {selectedInvoice.method ? (
                <div className="flex items-center justify-between py-2">
                  <span className="typo-meta text-[#7b7b7b]">Method</span>
                  <span className="typo-body-strong text-black">{selectedInvoice.method}</span>
                </div>
              ) : null}
              {selectedInvoice.transactionId ? (
                <div className="flex items-center justify-between py-2">
                  <span className="typo-meta text-[#7b7b7b]">Reference</span>
                  <span className="typo-body-strong text-black">{selectedInvoice.transactionId}</span>
                </div>
              ) : null}
            </section>

            <section className="border-b border-[#e5e5e5] py-5">
              <p className="typo-section-title text-black">Note from your professional</p>
              <p className="typo-body mt-3 text-[#202020]">{selectedInvoice.clientNote || 'No additional note was added to this payment milestone.'}</p>
            </section>

            {selectedInvoice.status === 'due' ? (
              <button type="button" onClick={() => openPayFlow(selectedInvoice.id)} className="typo-body-strong mt-6 h-12 w-full rounded-[20px] bg-[#173324] text-white">
                Pay now
              </button>
            ) : (
              <button type="button" onClick={() => setScreen('overview')} className="typo-body-strong mt-6 h-12 w-full rounded-[20px] border border-[#d8e2db] bg-white text-[#173324]">
                Back to payments
              </button>
            )}
          </div>
        </section>
        {toastMessage ? (
          <div className="typo-body-10 fixed bottom-6 left-1/2 z-[150] -translate-x-1/2 rounded-full bg-black px-4 py-2 text-white shadow-lg">
            {toastMessage}
          </div>
        ) : null}
      </main>
    )
  }

  if (screen === 'pay' && selectedInvoice) {
    return (
      <main className="ui-screen-base ui-feature-surface min-h-dvh w-full overflow-x-hidden bg-white text-black">
        <section className="mx-auto w-full max-w-[390px] pb-10 pt-16">
          <Header title="Pay invoice" subtitle={`${project.name} / ${project.designerName}`} onBack={() => setScreen('detail')} />

          <div className="ui-screen-content">
            <section className="border-y border-[#e5e5e5] py-4 text-center">
              <p className="typo-meta text-[#5f7467]">{selectedInvoice.number} - {selectedInvoice.title}</p>
              <p className="typo-page-title mt-2 text-black">{formatLakhs(selectedInvoice.amountL)}</p>
              <p className="typo-caption mt-2 text-[#7b7b7b]">{selectedInvoice.stageLabel || project.scope}</p>
            </section>

            <section className="mt-6">
              <p className="typo-section-title text-black">Choose payment method</p>
              <div className="mt-4 border-y border-[#e5e5e5]">
                {methodOptions.map((method) => {
                  const Icon = method.icon
                  const selected = selectedMethod === method.id
                  return (
                    <button
                      key={method.id}
                      type="button"
                      onClick={() => setSelectedMethod(method.id)}
                      className={`flex w-full items-center gap-3 border-b px-1 py-4 text-left last:border-b-0 ${selected ? 'border-[#dbe6df] bg-[#f7fbf8]' : 'border-[#e5e5e5] bg-white'}`}
                    >
                      <span className="grid size-11 shrink-0 place-items-center rounded-[16px] border border-[#e0e0e0] bg-[#fbfbfb]">
                        <Icon size={18} />
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="typo-body-strong block text-black">{method.label}</span>
                        <span className="typo-meta mt-1 block text-[#777]">{method.meta}</span>
                      </span>
                    </button>
                  )
                })}
              </div>
            </section>

            <button type="button" onClick={() => setScreen('otp')} className="typo-body-strong mt-6 h-12 w-full rounded-[20px] bg-[#173324] text-white">
              Continue
            </button>
          </div>
        </section>
      </main>
    )
  }

  if (screen === 'otp' && selectedInvoice) {
    return (
      <main className="ui-screen-base ui-feature-surface min-h-dvh w-full overflow-x-hidden bg-white text-black">
        <section className="mx-auto w-full max-w-[390px] pb-10 pt-16">
          <Header title="Verify payment" subtitle={selectedMethod} onBack={() => setScreen('pay')} />

          <div className="ui-screen-content">
            <section className="border-y border-[#e5e5e5] px-3 py-6 text-center">
              <p className="typo-card-title text-black">Confirm {formatLakhs(selectedInvoice.amountL)}</p>
              <p className="typo-body mt-2 text-[#5f7467]">OTP sent to your registered number. Enter it below to complete payment for {selectedInvoice.number}.</p>
            </section>

            <div className="mt-6 flex justify-center gap-2">
              {otpDigits.map((digit, index) => (
                <input
                  key={index}
                  value={digit}
                  onChange={(event) => updateOtpDigit(index, event.target.value.replace(/\D/g, ''))}
                  inputMode="numeric"
                  maxLength={1}
                  className="typo-card-title h-12 w-11 rounded-2xl border border-[#d8e2db] text-center outline-none"
                />
              ))}
            </div>

            <button type="button" onClick={confirmPayment} className="typo-body-strong mt-6 h-12 w-full rounded-[20px] bg-[#173324] text-white">
              Confirm payment
            </button>
          </div>
        </section>
      </main>
    )
  }

  if (screen === 'success' && selectedInvoice) {
    return (
      <main className="ui-screen-base ui-feature-surface min-h-dvh w-full overflow-x-hidden bg-white text-black">
        <section className="mx-auto w-full max-w-[390px] pb-10 pt-16">
          <Header title="Payment" subtitle={project.name} onBack={onBack} />

          <div className="px-4 py-8 text-center">
            <div className="mx-auto grid size-20 place-items-center rounded-full border-2 border-[#52B788] bg-[#EAF3EE] text-[#267449]">
              <CheckCircle size={34} weight="fill" />
            </div>
            <h1 className="typo-page-title mt-5 text-black">Payment successful</h1>
            <p className="typo-page-title mt-2 text-[#267449]">{formatLakhs(selectedInvoice.amountL)}</p>
            <p className="typo-body mt-3 text-[#5f7467]">{selectedInvoice.number} has been marked paid and {project.designerName} has been notified.</p>

            <div className="mt-6 border-y border-[#e5e5e5] px-1 py-2 text-left">
              <div className="flex items-center justify-between border-b border-[#e3ebe5] py-3 first:pt-0 last:border-b-0 last:pb-0">
                <span className="typo-meta text-[#7b7b7b]">Transaction ID</span>
                <span className="typo-body-strong text-black">{selectedInvoice.transactionId}</span>
              </div>
              <div className="flex items-center justify-between border-b border-[#e3ebe5] py-3 first:pt-0 last:border-b-0 last:pb-0">
                <span className="typo-meta text-[#7b7b7b]">Method</span>
                <span className="typo-body-strong text-black">{selectedInvoice.method}</span>
              </div>
              <div className="flex items-center justify-between py-3 first:pt-0 last:border-b-0 last:pb-0">
                <span className="typo-meta text-[#7b7b7b]">Receipt</span>
                <span className="typo-body-strong text-[#267449]">Sent</span>
              </div>
            </div>

            <button type="button" onClick={() => triggerToast('Receipt PDF downloaded!')} className="typo-body-strong mt-6 h-12 w-full rounded-[20px] bg-black text-white hover:bg-gray-800 transition-colors">
              Download Receipt
            </button>
            <button type="button" onClick={() => setScreen('overview')} className="typo-body-strong mt-2 h-12 w-full rounded-[20px] border border-[#d8e2db] bg-white text-[#173324] hover:bg-gray-50 transition-colors">
              Back to payments
            </button>
          </div>
        </section>
        {toastMessage ? (
          <div className="typo-body-10 fixed bottom-6 left-1/2 z-[150] -translate-x-1/2 rounded-full bg-black px-4 py-2 text-white shadow-lg">
            {toastMessage}
          </div>
        ) : null}
      </main>
    )
  }

  return (
    <main className="ui-screen-base ui-feature-surface min-h-dvh w-full overflow-x-hidden bg-white text-black">
      <section className="mx-auto w-full max-w-[390px] pb-10 pt-16">
        <Header
          title="My payments"
          subtitle={(
            <span className="flex items-center gap-1.5 flex-wrap">
              <span>{project.name}</span>
              <span className="inline-block h-2.5 w-px bg-gray-300" />
              <span className="typo-status-mini typo-weight-bold rounded-md bg-[#eff3f0] px-1.5 py-0.5 text-[#173324]">{formatLakhs(financeSummary.paidL)} Paid</span>
              <span className="typo-status-mini typo-weight-bold rounded-md bg-[#fff7ee] px-1.5 py-0.5 text-[#a86a00]">{formatLakhs(financeSummary.dueL)} Due</span>
            </span>
          )}
          onBack={onBack}
          trailing={(
            <button type="button" onClick={() => triggerToast('All receipts PDF downloaded!')} className="grid size-9 place-items-center rounded-xl border border-[#e0e0e0] bg-white hover:bg-gray-50 transition-colors" aria-label="Download receipts">
              <DownloadSimple size={17} />
            </button>
          )}
        />

        <div className="ui-screen-content">
          <section className="mb-6">
            <div className="typo-body-10 mb-1.5 flex items-center justify-between text-[#6f6f6f]">
              <span>{formatLakhs(financeSummary.paidL)} of {formatLakhs(financeSummary.totalL)} paid</span>
              <span className="typo-weight-bold text-[#267449]">{financeSummary.totalL > 0 ? Math.round((financeSummary.paidL / financeSummary.totalL) * 100) : 0}%</span>
            </div>
            <div className="h-1.5 w-full bg-[#ececec] rounded-full overflow-hidden">
              <div className="h-full bg-[#5fc18a] rounded-full transition-all duration-300" style={{ width: `${financeSummary.totalL > 0 ? Math.round((financeSummary.paidL / financeSummary.totalL) * 100) : 0}%` }} />
            </div>
          </section>

          <section>
            <div className="flex items-end justify-between gap-3">
              <div>
                <p className="typo-caption uppercase text-[#267449]">Payment summary</p>
                <p className="typo-page-title mt-2 text-black">{formatLakhs(financeSummary.totalL)}</p>
                <p className="typo-meta mt-2 text-[#7b7b7b]">{project.scope} / incl. GST</p>
              </div>
              <button type="button" onClick={dueInvoice ? () => openPayFlow(dueInvoice.id) : undefined} className="typo-body-strong h-11 rounded-[20px] border border-[#d8e2db] px-5 text-[#173324] disabled:opacity-50" disabled={!dueInvoice}>
                {dueInvoice ? 'Pay due now' : 'All clear'}
              </button>
            </div>

            <div className="mt-5 grid grid-cols-3 border-y border-[#e5e5e5]">
              {[
                ['Paid', financeSummary.paidL],
                ['Due now', financeSummary.dueL],
                ['Upcoming', financeSummary.upcomingL],
              ].map(([label, value]) => (
                <div key={label} className="border-r border-[#e5e5e5] px-3 py-4 text-center last:border-r-0">
                  <p className="typo-card-title text-black">{formatLakhs(value)}</p>
                  <p className="typo-caption mt-1 text-[#7b7b7b]">{label}</p>
                </div>
              ))}
            </div>
          </section>

          {dueInvoice ? (
            <section className="mt-5 border-y border-[#ead9bf] bg-[#fffaf3] px-4 py-4">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="typo-caption uppercase text-[#a86a00]">Payment due</p>
                  <p className="typo-body-strong mt-2 text-black">{dueInvoice.number} - {dueInvoice.title}</p>
                  <p className="typo-meta mt-1 text-[#777]">Due {dueInvoice.dueDate}</p>
                </div>
                <p className="typo-card-title text-black">{formatLakhs(dueInvoice.amountL)}</p>
              </div>
              <p className="typo-body mt-3 text-[#5f7467]">{dueInvoice.summary}</p>
              <div className="mt-4 flex items-center justify-between gap-3 border-t border-[#ead9bf] pt-4">
                <p className="typo-caption text-[#7b7b7b]">{dueInvoice.stageLabel}</p>
                <button type="button" onClick={() => openPayFlow(dueInvoice.id)} className="typo-body-strong h-11 rounded-[20px] bg-[#173324] px-5 text-white">
                  Pay now
                </button>
              </div>
              <p className="typo-body-10 mt-4 flex items-center justify-center gap-1 text-center text-[#7b7b7b]">🔒 Secured by Razorpay · UPI · Card · Net Banking</p>
            </section>
          ) : null}

          <section className="mt-6">
            <div className="mb-4 flex items-center justify-between">
              <p className="typo-section-title text-black">Payment schedule</p>
              <span className="typo-caption text-[#6f6f6f]">{financeInvoices.length} milestones</span>
            </div>
            <div className="border-y border-[#e5e5e5] py-4">
              <PaymentMilestoneTimeline invoices={financeInvoices} selectedInvoiceId={selectedInvoiceId} onSelect={(invoice) => openDetail(invoice.id)} />
            </div>
          </section>

          <section className="mt-6">
            <div className="mb-3 flex items-center justify-between">
              <p className="typo-section-title text-black">Invoice history</p>
              <p className="typo-meta text-[#7b7b7b]">{financeInvoices.length} total</p>
            </div>
            <div className="border-y border-[#e5e5e5]">
              {financeInvoices.map((invoice) => (
                <InvoiceRow key={invoice.id} invoice={invoice} onOpen={openDetail} />
              ))}
            </div>
          </section>
        </div>
      </section>
      {toastMessage ? (
        <div className="typo-body-10 fixed bottom-6 left-1/2 z-[150] -translate-x-1/2 rounded-full bg-black px-4 py-2 text-white shadow-lg">
          {toastMessage}
        </div>
      ) : null}
    </main>
  )
}

export default HomeownerFinanceWorkspace
