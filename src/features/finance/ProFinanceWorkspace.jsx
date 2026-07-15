import { useMemo, useState } from 'react'
import {
  ChartBar,
  CheckCircle,
  DownloadSimple,
  FileText,
  PaperPlaneTilt,
  Plus,
  Receipt,
  UploadSimple,
  Wallet,
} from '@phosphor-icons/react'
import Button from '../../components/ui/Button'
import { useSharedProject } from '../collaboration/mockProjectStore'
import ProjectWorkspaceHeader from '../shared/ProjectWorkspaceHeader'
import PaymentMilestoneTimeline from './PaymentMilestoneTimeline'

const INR = '\u20b9'

const invoiceStatusTone = {
  paid: 'bg-[#eaf8ef] text-[#267449]',
  due: 'bg-[#fff4dd] text-[#a86a00]',
  upcoming: 'bg-[#f2f2f2] text-[#6a6a6a]',
}

const expenseCategories = ['Vendor payment', 'Materials', 'Labour', 'Travel', 'Miscellaneous']
const paymentModes = ['NEFT', 'UPI', 'Cash', 'Cheque']

const blankInvoiceDraft = {
  title: '',
  amountL: '',
  dueDate: '',
  stageLabel: '',
  summary: '',
  clientNote: '',
}

const blankExpenseDraft = {
  category: expenseCategories[0],
  title: '',
  amount: '',
  expenseDate: '',
  payee: '',
  mode: paymentModes[0],
  gstRate: '18',
  note: '',
  hasBill: false,
}

const formatLakhs = (value) => `${INR}${Number(value || 0).toFixed(1)}L`
const formatRupees = (value) => `${INR}${Math.round(value || 0).toLocaleString('en-IN')}`
const todayLabel = () => new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })

function Header({ title = 'Finance', subtitle, onBack, actions = null }) {
  return (
    <ProjectWorkspaceHeader
      title={title}
      subtitle={subtitle}
      onBack={onBack}
      actions={actions}
    />
  )
}

function SummaryMetric({ label, value, tone = 'text-black' }) {
  return (
    <div className="rounded-[22px] border border-[#e5e5e5] px-4 py-4 text-left">
      <p className={`typo-card-title ${tone}`}>{value}</p>
      <p className="typo-caption mt-2 text-[#7b7b7b]">{label}</p>
    </div>
  )
}

function SectionHeader({ title, meta }) {
  return (
    <div className="mb-4 flex items-center justify-between gap-3">
      <p className="typo-section-title text-black">{title}</p>
      {meta ? <p className="typo-meta text-[#7b7b7b]">{meta}</p> : null}
    </div>
  )
}

function Field({ label, children }) {
  return (
    <label className="block">
      <p className="typo-label mb-2 uppercase text-[#7a8780]">{label}</p>
      {children}
    </label>
  )
}

function TextInput(props) {
  return (
    <input
      className="typo-body h-12 w-full rounded-2xl border border-[#d8e2db] bg-white px-4 outline-none focus:border-black"
      {...props}
    />
  )
}

function TextArea(props) {
  return (
    <textarea
      className="typo-body min-h-24 w-full rounded-2xl border border-[#d8e2db] bg-white px-4 py-3 outline-none focus:border-black"
      {...props}
    />
  )
}

function SelectField({ children, ...props }) {
  return (
    <select
      className="typo-body h-12 w-full rounded-2xl border border-[#d8e2db] bg-white px-4 outline-none focus:border-black"
      {...props}
    >
      {children}
    </select>
  )
}

function ModeChip({ active, children, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`typo-caption rounded-full px-3 py-2 transition ${active ? 'bg-black text-white' : 'border border-[#d8e2db] text-[#5f6f66]'}`}
    >
      {children}
    </button>
  )
}

function InvoiceListItem({ invoice, onOpen }) {
  return (
    <button
      type="button"
      onClick={() => onOpen(invoice)}
      className="flex w-full items-start gap-3 border-b border-[#e5e5e5] py-4 text-left last:border-b-0"
    >
      <span className="mt-1 grid size-10 shrink-0 place-items-center rounded-2xl bg-[#eef8f1] text-[#267449]">
        <Receipt size={20} />
      </span>
      <span className="min-w-0 flex-1">
        <span className="flex items-start justify-between gap-2">
          <span className="min-w-0">
            <span className="typo-body-strong block truncate text-black">{invoice.number} - {invoice.title}</span>
            <span className="typo-meta mt-1 block text-[#777]">
              {invoice.issuedAt ? `Raised ${invoice.issuedAt}` : 'Not yet raised'} / {invoice.dueDate}
            </span>
          </span>
          <span className={`typo-caption shrink-0 rounded-full px-2 py-1 ${invoiceStatusTone[invoice.status]}`}>
            {invoice.status}
          </span>
        </span>
        <span className="typo-body mt-2 block text-[#202020]">{invoice.summary}</span>
        <span className="typo-card-title mt-2 block text-black">{formatLakhs(invoice.amountL)}</span>
      </span>
    </button>
  )
}

function ExpenseRow({ expense }) {
  return (
    <article className="border-b border-[#e5e5e5] py-4 last:border-b-0">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="typo-body-strong text-black">{expense.title}</p>
          <p className="typo-meta mt-1 text-[#777]">{expense.expenseDate} / {expense.mode}{expense.payee ? ` / ${expense.payee}` : ''}</p>
          <div className="mt-2 flex flex-wrap gap-2">
            <span className="typo-caption rounded-full border border-[#e5e5e5] px-2 py-1 text-[#6f6f6f]">{expense.category}</span>
            <span className="typo-caption rounded-full border border-[#e5e5e5] px-2 py-1 text-[#6f6f6f]">{expense.hasBill ? 'Bill uploaded' : 'No bill'}</span>
          </div>
        </div>
        <div className="shrink-0 text-right">
          <p className="typo-card-title text-[#c34545]">{formatRupees(expense.amount)}</p>
          <p className="typo-caption mt-1 text-[#7b7b7b]">{expense.submittedBy}</p>
        </div>
      </div>
    </article>
  )
}

function ActionRow({ icon: Icon, title, detail, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex w-full items-center gap-3 border-b border-[#e5e5e5] py-4 text-left last:border-b-0"
    >
      <span className="grid size-10 shrink-0 place-items-center rounded-2xl bg-[#f1f7f3] text-[#173324]">
        <Icon size={20} />
      </span>
      <span className="min-w-0 flex-1">
        <span className="typo-body-strong block text-black">{title}</span>
        {detail ? <span className="typo-caption mt-1 block text-[#6f7d74]">{detail}</span> : null}
      </span>
    </button>
  )
}

function ProFinanceWorkspace({ project, onBack }) {
  const projectId = project?.id || 'p-1'
  const {
    activeViewer,
    permissions,
    financeInvoices,
    financeExpenses,
    financeSummary,
    financeExpenseBreakdown,
    boqMeta,
    boqItems,
    actions,
  } = useSharedProject(projectId)

  const [view, setView] = useState('home')
  const [activeTab, setActiveTab] = useState('invoices')
  const [selectedInvoiceId, setSelectedInvoiceId] = useState(null)
  const [paymentDraft, setPaymentDraft] = useState(null)
  const [paymentSuccess, setPaymentSuccess] = useState(null)
  const [composerTab, setComposerTab] = useState('boq')
  const [editingInvoiceId, setEditingInvoiceId] = useState(null)
  const [scratchClientName, setScratchClientName] = useState(project?.client || 'Priya Sharma')
  const [scratchTitle, setScratchTitle] = useState('')
  const [scratchAmount, setScratchAmount] = useState('')
  const [scratchDueDate, setScratchDueDate] = useState('')
  const [invoiceDraft, setInvoiceDraft] = useState(blankInvoiceDraft)
  const [expenseDraft, setExpenseDraft] = useState(blankExpenseDraft)
  const [toastMessage, setToastMessage] = useState(null)
  const [tdsAmount, setTdsAmount] = useState(0)
  const [showTdsInput, setShowTdsInput] = useState(false)

  const viewerRoleLabel = activeViewer?.role?.label || 'Principal Pro'
  const canViewTotals = permissions.canViewFinanceTotals
  const canAddExpenses = permissions.canAddExpenses
  const canCreateInvoices = permissions.canCreateInvoices

  const receivedL = financeSummary.paidL
  const pendingL = financeSummary.dueL
  const upcomingL = financeSummary.upcomingL
  const expenseTotalL = financeSummary.expenseTotalL
  const projectedProfitL = Math.max(0, financeSummary.totalL - expenseTotalL)
  const currentProfitL = Math.max(0, receivedL - expenseTotalL)
  const currentMargin = receivedL > 0 ? Math.round((currentProfitL / receivedL) * 100) : 0
  const projectedMargin = financeSummary.totalL > 0 ? Math.round((projectedProfitL / financeSummary.totalL) * 100) : 0
  const collectionPercent = financeSummary.totalL > 0 ? Math.min(100, Math.round((receivedL / financeSummary.totalL) * 100)) : 0

  const selectedInvoice = useMemo(
    () => financeInvoices.find((invoice) => invoice.id === selectedInvoiceId) || null,
    [financeInvoices, selectedInvoiceId],
  )

  const totalBoqAmount = useMemo(() => {
    return boqItems.reduce((sum, item) => sum + ((parseFloat(item.area) || 0) * (parseFloat(item.rate) || 0)), 0)
  }, [boqItems])
  const totalBoqL = totalBoqAmount / 100000
  const isScheduleCreated = boqMeta?.[projectId]?.financeScheduleCreated || false

  const invoicedPaidAndDue = useMemo(() => {
    return financeInvoices
      .filter((inv) => inv.status === 'paid' || inv.status === 'due')
      .reduce((sum, inv) => sum + inv.amountL * 100000, 0)
  }, [financeInvoices])

  const gstCollected = Math.round((invoicedPaidAndDue * 0.18) / 1.18)

  const gstPaid = useMemo(() => {
    return financeExpenses.reduce((sum, exp) => {
      const rate = parseFloat(exp.gstRate) || 0
      if (rate === 0) return sum
      return sum + Math.round((exp.amount * rate) / (100 + rate))
    }, 0)
  }, [financeExpenses])

  const sortedExpenseBreakdown = useMemo(
    () => Object.entries(financeExpenseBreakdown).sort((a, b) => b[1] - a[1]),
    [financeExpenseBreakdown],
  )

  const manualAmountL = Number.parseFloat(invoiceDraft.amountL) || 0
  const manualAmount = manualAmountL * 100000
  const manualGst = Math.round((manualAmount * 0.18) / 1.18)
  const scratchAmountNumber = Number.parseFloat(scratchAmount) || 0
  const scratchAmountL = scratchAmountNumber / 100000

  const triggerToast = (msg) => {
    setToastMessage(msg)
    setTimeout(() => {
      setToastMessage(null)
    }, 2500)
  }

  const openInvoiceDetail = (invoice) => {
    setSelectedInvoiceId(invoice.id)
    setView('invoice-detail')
  }

  const openRecordPayment = (invoice) => {
    setSelectedInvoiceId(invoice.id)
    setPaymentDraft({ id: invoice.id, method: invoice.method || 'NEFT', transactionId: '' })
    setView('record-payment')
  }

  const goHome = () => {
    setView('home')
    setPaymentDraft(null)
    setPaymentSuccess(null)
    setEditingInvoiceId(null)
  }

  const resetExpenseDraft = () => setExpenseDraft(blankExpenseDraft)
  const resetInvoiceDraft = () => setInvoiceDraft(blankInvoiceDraft)

  const saveExpense = () => {
    actions.addFinanceExpense({
      ...expenseDraft,
      submittedBy: activeViewer?.user?.name || viewerRoleLabel,
    })
    resetExpenseDraft()
    setActiveTab('expenses')
    setView('home')
    triggerToast('Expense logged')
  }

  const createManualInvoice = () => {
    if (editingInvoiceId) {
      actions.updateFinanceInvoice(editingInvoiceId, {
        title: invoiceDraft.title,
        amountL: Number.parseFloat(invoiceDraft.amountL) || 0,
        dueDate: invoiceDraft.dueDate,
        stageLabel: invoiceDraft.stageLabel || invoiceDraft.title,
        summary: invoiceDraft.summary,
        clientNote: invoiceDraft.clientNote,
      })
    } else {
      actions.createFinanceInvoice(invoiceDraft)
    }
    resetInvoiceDraft()
    setEditingInvoiceId(null)
    setActiveTab('invoices')
    setView('home')
    triggerToast(editingInvoiceId ? 'Invoice updated' : 'Invoice created and sent')
  }

  const createScratchInvoice = () => {
    actions.createFinanceInvoice({
      title: scratchTitle,
      amountL: scratchAmountL.toFixed(2),
      dueDate: scratchDueDate,
      stageLabel: 'Standalone invoice',
      summary: `Standalone invoice for ${scratchClientName || 'client'}.`,
      clientNote: '',
    })
    setScratchTitle('')
    setScratchAmount('')
    setScratchDueDate('')
    setActiveTab('invoices')
    setView('home')
    triggerToast('Standalone invoice created')
  }

  const screenSubtitle = project?.scope || 'Project finance'

  if (!canViewTotals && !canAddExpenses) {
    return (
      <main className="ui-screen-base ui-feature-surface min-h-dvh w-full overflow-x-hidden bg-white text-black">
        <section className="mx-auto w-full max-w-[390px] pb-6 pt-16">
          <Header subtitle={screenSubtitle} onBack={onBack} />
          <div className="px-4 pt-8">
            <section className="border-y border-[#e5e5e5] py-6">
              <p className="typo-label uppercase text-[#7a8780]">Restricted access</p>
              <h1 className="typo-page-title mt-2 text-[#102418]">{viewerRoleLabel} cannot view project finances.</h1>
              <p className="typo-body mt-3 text-[#5f6f66]">Grant this role finance visibility or expense-entry rights from People & Access to show this surface.</p>
            </section>
          </div>
        </section>
      </main>
    )
  }

  if (view === 'report' && canViewTotals) {
    return (
      <main className="ui-screen-base ui-feature-surface min-h-dvh w-full overflow-x-hidden bg-white text-black">
        <section className="mx-auto w-full max-w-[390px] pb-10 pt-16">
          <Header
            title="P&L report"
            subtitle={screenSubtitle}
            onBack={goHome}
            actions={<Button icon={DownloadSimple} variant="outline" aria-label="Export report" onClick={() => triggerToast('Report exported')} />}
          />
          <div className="ui-screen-content pt-6">
            <section className="border-b border-[#e5e5e5] pb-5">
              <p className="typo-caption uppercase text-[#267449]">Full project</p>
              <h1 className="typo-page-title mt-2 text-black">{formatLakhs(projectedProfitL)}</h1>
              <p className="typo-body mt-2 text-[#5f7467]">Projected profit after logged project expenses.</p>
            </section>

            <section className="border-b border-[#e5e5e5] py-5">
              <SectionHeader title="Revenue" />
              <div className="space-y-3">
                <SummaryLine label="Total invoiced" value={formatLakhs(financeSummary.totalL)} />
                <SummaryLine label="Received" value={formatLakhs(receivedL)} valueClass="text-[#267449]" />
                <SummaryLine label="Pending" value={formatLakhs(pendingL)} valueClass="text-[#a86a00]" />
                <SummaryLine label="Upcoming" value={formatLakhs(upcomingL)} valueClass="text-[#6a6a6a]" />
              </div>
            </section>

            <section className="border-b border-[#e5e5e5] py-5">
              <SectionHeader title="Expenses" meta={formatLakhs(expenseTotalL)} />
              <div className="space-y-3">
                {sortedExpenseBreakdown.map(([label, amount]) => (
                  <SummaryLine key={label} label={label} value={formatRupees(amount)} valueClass="text-[#c34545]" />
                ))}
              </div>
            </section>

            <section className="border-b border-[#e5e5e5] py-5">
              <SectionHeader title="Profit" />
              <div className="grid grid-cols-2 gap-3">
                <SummaryMetric label="Cash profit" value={formatLakhs(currentProfitL)} tone="text-[#267449]" />
                <SummaryMetric label="Current margin" value={`${currentMargin}%`} tone="text-[#267449]" />
                <SummaryMetric label="Projected profit" value={formatLakhs(projectedProfitL)} tone="text-[#267449]" />
                <SummaryMetric label="Projected margin" value={`${projectedMargin}%`} tone="text-[#267449]" />
              </div>
            </section>

            <section className="py-5">
              <SectionHeader title="GST and TDS" />
              <div className="space-y-3">
                <SummaryLine label="GST collected" value={formatRupees(gstCollected)} valueClass="text-[#267449]" />
                <SummaryLine label="GST paid" value={formatRupees(gstPaid)} valueClass="text-[#c34545]" />
                <SummaryLine label="Net GST payable" value={formatRupees(Math.max(0, gstCollected - gstPaid))} valueClass="text-[#a86a00]" />
                <SummaryLine label="TDS deducted" value={formatRupees(tdsAmount)} valueClass="text-[#a86a00]" />
              </div>
              {showTdsInput ? (
                <div className="mt-4 flex gap-2">
                  <TextInput
                    type="number"
                    value={tdsAmount || ''}
                    onChange={(event) => setTdsAmount(parseFloat(event.target.value) || 0)}
                    placeholder="Enter TDS"
                  />
                  <Button onClick={() => { setShowTdsInput(false); triggerToast('TDS logged') }}>Save</Button>
                </div>
              ) : (
                <Button variant="ghost" className="mt-4" onClick={() => setShowTdsInput(true)}>Log TDS deduction</Button>
              )}
            </section>
          </div>
          {toastMessage ? <Toast message={toastMessage} /> : null}
        </section>
      </main>
    )
  }

  if (view === 'new-invoice' && canCreateInvoices) {
    return (
      <main className="ui-screen-base ui-feature-surface min-h-dvh w-full overflow-x-hidden bg-white text-black">
        <section className="mx-auto w-full max-w-[390px] pb-28 pt-16">
          <Header title={editingInvoiceId ? 'Edit invoice' : 'New invoice'} subtitle={screenSubtitle} onBack={goHome} />
          <div className="ui-screen-content pt-6">
            <section className="border-b border-[#e5e5e5] pb-5">
                <p className="typo-label uppercase text-[#7a8780]">{editingInvoiceId ? 'Invoice details' : 'Invoice source'}</p>
                {editingInvoiceId ? (
                  <p className="typo-body mt-2 text-[#5f7467]">Update the invoice details without changing the homeowner payment trail.</p>
                ) : (
                  <div className="mt-3 flex flex-wrap gap-2">
                    <ModeChip active={composerTab === 'boq'} onClick={() => setComposerTab('boq')}>From BOQ</ModeChip>
                    <ModeChip active={composerTab === 'manual'} onClick={() => setComposerTab('manual')}>Manual</ModeChip>
                    <ModeChip active={composerTab === 'scratch'} onClick={() => setComposerTab('scratch')}>Scratch</ModeChip>
                  </div>
                )}
              </section>

            {composerTab === 'boq' && !editingInvoiceId ? (
              <section className="py-5">
                <SectionHeader title="30-30-24-10 schedule" meta={formatLakhs(totalBoqL)} />
                <div className="border-y border-[#e5e5e5]">
                  {[
                    ['INV-BOQ-01', 'Advance', 0.3],
                    ['INV-BOQ-02', 'Milestone 1', 0.3],
                    ['INV-BOQ-03', 'Milestone 2', 0.24],
                    ['INV-BOQ-04', 'Final', 0.1],
                  ].map(([number, title, split]) => (
                    <div key={number} className="flex items-center justify-between gap-3 border-b border-[#e5e5e5] py-3 last:border-b-0">
                      <div>
                        <p className="typo-body-strong text-black">{title}</p>
                        <p className="typo-meta mt-1 text-[#777]">{number}</p>
                      </div>
                      <p className="typo-card-title text-black">{formatLakhs(totalBoqL * split)}</p>
                    </div>
                  ))}
                </div>
                {isScheduleCreated ? (
                  <p className="typo-body mt-4 text-[#5f7467]">Invoice schedule has already been generated from the BOQ.</p>
                ) : null}
                <div className="fixed bottom-0 left-1/2 z-[80] w-full max-w-[390px] -translate-x-1/2 border-t border-[#e5e5e5] bg-white px-4 pb-6 pt-4">
                  <Button
                    fullWidth
                    disabled={isScheduleCreated}
                    trailingIcon={FileText}
                    onClick={() => {
                      actions.createFinanceScheduleFromBoq('auto')
                      setActiveTab('invoices')
                      setView('home')
                      triggerToast('BOQ invoice schedule created')
                    }}
                  >
                    Create all invoices
                  </Button>
                </div>
              </section>
            ) : null}

            {composerTab === 'manual' ? (
              <section className="space-y-4 py-5">
                <Field label="Invoice title">
                  <TextInput value={invoiceDraft.title} onChange={(event) => setInvoiceDraft((prev) => ({ ...prev, title: event.target.value }))} placeholder="Milestone 3 - modular execution" />
                </Field>
                <div className="grid grid-cols-2 gap-3">
                  <Field label="Amount (L)">
                    <TextInput value={invoiceDraft.amountL} onChange={(event) => setInvoiceDraft((prev) => ({ ...prev, amountL: event.target.value }))} inputMode="decimal" placeholder="1.2" />
                  </Field>
                  <Field label="Due date">
                    <TextInput value={invoiceDraft.dueDate} onChange={(event) => setInvoiceDraft((prev) => ({ ...prev, dueDate: event.target.value }))} placeholder="15 Nov 2026" />
                  </Field>
                </div>
                <Field label="Milestone label">
                  <TextInput value={invoiceDraft.stageLabel} onChange={(event) => setInvoiceDraft((prev) => ({ ...prev, stageLabel: event.target.value }))} placeholder="Execution checkpoint" />
                </Field>
                <Field label="Summary">
                  <TextArea value={invoiceDraft.summary} onChange={(event) => setInvoiceDraft((prev) => ({ ...prev, summary: event.target.value }))} placeholder="What this invoice covers..." />
                </Field>
                <Field label="Note to homeowner">
                  <TextArea value={invoiceDraft.clientNote} onChange={(event) => setInvoiceDraft((prev) => ({ ...prev, clientNote: event.target.value }))} placeholder="Optional note..." />
                </Field>
                <section className="rounded-[22px] bg-[#f7fbf8] px-4 py-4">
                  <SummaryLine label="Invoice total" value={formatRupees(manualAmount)} />
                  <SummaryLine label="GST included" value={formatRupees(manualGst)} valueClass="text-[#267449]" />
                </section>
                <div className="fixed bottom-0 left-1/2 z-[80] w-full max-w-[390px] -translate-x-1/2 border-t border-[#e5e5e5] bg-white px-4 pb-6 pt-4">
                  <Button fullWidth trailingIcon={PaperPlaneTilt} onClick={createManualInvoice}>{editingInvoiceId ? 'Update invoice' : 'Create and send'}</Button>
                </div>
              </section>
            ) : null}

            {composerTab === 'scratch' ? (
              <section className="space-y-4 py-5">
                <Field label="Client name">
                  <TextInput value={scratchClientName} onChange={(event) => setScratchClientName(event.target.value)} placeholder="Client name" />
                </Field>
                <Field label="Invoice title">
                  <TextInput value={scratchTitle} onChange={(event) => setScratchTitle(event.target.value)} placeholder="Design consultation" />
                </Field>
                <div className="grid grid-cols-2 gap-3">
                  <Field label="Amount">
                    <TextInput value={scratchAmount} onChange={(event) => setScratchAmount(event.target.value)} inputMode="numeric" placeholder="120000" />
                  </Field>
                  <Field label="Due date">
                    <TextInput value={scratchDueDate} onChange={(event) => setScratchDueDate(event.target.value)} placeholder="15 Dec 2026" />
                  </Field>
                </div>
                <section className="rounded-[22px] bg-[#f7fbf8] px-4 py-4">
                  <SummaryLine label="Standalone total" value={formatRupees(scratchAmountNumber)} />
                  <SummaryLine label="Amount in finance" value={formatLakhs(scratchAmountL)} valueClass="text-[#267449]" />
                </section>
                <div className="fixed bottom-0 left-1/2 z-[80] w-full max-w-[390px] -translate-x-1/2 border-t border-[#e5e5e5] bg-white px-4 pb-6 pt-4">
                  <Button fullWidth trailingIcon={PaperPlaneTilt} onClick={createScratchInvoice}>Create and send</Button>
                </div>
              </section>
            ) : null}
          </div>
          {toastMessage ? <Toast message={toastMessage} /> : null}
        </section>
      </main>
    )
  }

  if (view === 'new-expense' && canAddExpenses) {
    return (
      <main className="ui-screen-base ui-feature-surface min-h-dvh w-full overflow-x-hidden bg-white text-black">
        <section className="mx-auto w-full max-w-[390px] pb-28 pt-16">
          <Header title="Add expense" subtitle={screenSubtitle} onBack={goHome} />
          <div className="ui-screen-content space-y-4 pt-6">
            <Field label="Category">
              <SelectField value={expenseDraft.category} onChange={(event) => setExpenseDraft((prev) => ({ ...prev, category: event.target.value }))}>
                {expenseCategories.map((category) => <option key={category}>{category}</option>)}
              </SelectField>
            </Field>
            <Field label="Description">
              <TextInput value={expenseDraft.title} onChange={(event) => setExpenseDraft((prev) => ({ ...prev, title: event.target.value }))} placeholder="Carpenter payment, tiles, transport..." />
            </Field>
            <div className="grid grid-cols-2 gap-3">
              <Field label="Amount">
                <TextInput value={expenseDraft.amount} onChange={(event) => setExpenseDraft((prev) => ({ ...prev, amount: event.target.value }))} inputMode="numeric" placeholder="12500" />
              </Field>
              <Field label="Date">
                <TextInput value={expenseDraft.expenseDate} onChange={(event) => setExpenseDraft((prev) => ({ ...prev, expenseDate: event.target.value }))} placeholder={todayLabel()} />
              </Field>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <Field label="Payee">
                <TextInput value={expenseDraft.payee} onChange={(event) => setExpenseDraft((prev) => ({ ...prev, payee: event.target.value }))} placeholder="Optional" />
              </Field>
              <Field label="Mode">
                <SelectField value={expenseDraft.mode} onChange={(event) => setExpenseDraft((prev) => ({ ...prev, mode: event.target.value }))}>
                  {paymentModes.map((mode) => <option key={mode}>{mode}</option>)}
                </SelectField>
              </Field>
            </div>
            <Field label="GST paid">
              <SelectField value={expenseDraft.gstRate} onChange={(event) => setExpenseDraft((prev) => ({ ...prev, gstRate: event.target.value }))}>
                <option value="0">None</option>
                <option value="5">5%</option>
                <option value="12">12%</option>
                <option value="18">18%</option>
                <option value="28">28%</option>
              </SelectField>
            </Field>
            <button
              type="button"
              onClick={() => setExpenseDraft((prev) => ({ ...prev, hasBill: true }))}
              className={`flex w-full items-center gap-3 rounded-[24px] border border-dashed px-4 py-5 text-left ${expenseDraft.hasBill ? 'border-[#267449] bg-[#f1f8f4]' : 'border-[#cddbd3] bg-white'}`}
            >
              <span className="grid size-11 place-items-center rounded-2xl bg-[#eef8f1] text-[#267449]">
                <UploadSimple size={22} />
              </span>
              <span>
                <span className="typo-body-strong block text-black">{expenseDraft.hasBill ? 'Bill attached' : 'Upload bill photo'}</span>
                <span className="typo-caption mt-1 block text-[#6f7d74]">Keeps reimbursements and GST proof traceable.</span>
              </span>
            </button>
            <Field label="Notes">
              <TextArea value={expenseDraft.note} onChange={(event) => setExpenseDraft((prev) => ({ ...prev, note: event.target.value }))} placeholder="Optional note..." />
            </Field>
          </div>
          <div className="fixed bottom-0 left-1/2 z-[80] w-full max-w-[390px] -translate-x-1/2 border-t border-[#e5e5e5] bg-white px-4 pb-6 pt-4">
            <Button fullWidth onClick={saveExpense}>Save expense</Button>
          </div>
          {toastMessage ? <Toast message={toastMessage} /> : null}
        </section>
      </main>
    )
  }

  if (view === 'invoice-detail' && selectedInvoice) {
    const isDue = selectedInvoice.status === 'due'
    const isUpcoming = selectedInvoice.status === 'upcoming'

    return (
      <main className="ui-screen-base ui-feature-surface min-h-dvh w-full overflow-x-hidden bg-white text-black">
        <section className="mx-auto w-full max-w-[390px] pb-28 pt-16">
          <Header title="Invoice detail" subtitle={screenSubtitle} onBack={goHome} />
          <div className="ui-screen-content pt-6">
            <section className="border-b border-[#e5e5e5] pb-5">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="typo-caption uppercase text-[#267449]">{selectedInvoice.number}</p>
                  <h1 className="typo-page-title mt-2 text-black">{selectedInvoice.title}</h1>
                  <p className="typo-body mt-2 text-[#5f7467]">{selectedInvoice.summary}</p>
                </div>
                <span className={`typo-caption shrink-0 rounded-full px-3 py-2 ${invoiceStatusTone[selectedInvoice.status]}`}>{selectedInvoice.status}</span>
              </div>
            </section>

            <section className="grid grid-cols-3 border-b border-[#e5e5e5] py-5">
              <div className="border-r border-[#e5e5e5] pr-3">
                <p className="typo-label uppercase text-[#7a8780]">Amount</p>
                <p className="typo-card-title mt-2">{formatLakhs(selectedInvoice.amountL)}</p>
              </div>
              <div className="border-r border-[#e5e5e5] px-3">
                <p className="typo-label uppercase text-[#7a8780]">Due</p>
                <p className="typo-body-strong mt-2">{selectedInvoice.dueDate}</p>
              </div>
              <div className="pl-3">
                <p className="typo-label uppercase text-[#7a8780]">Paid</p>
                <p className="typo-body-strong mt-2">{selectedInvoice.paidAt || '-'}</p>
              </div>
            </section>

            <section className="border-b border-[#e5e5e5] py-5">
              <SectionHeader title="Actions" />
              <div className="border-y border-[#e5e5e5]">
                {isDue ? (
                  <ActionRow
                    icon={PaperPlaneTilt}
                    title="Send reminder"
                    detail={`${selectedInvoice.reminderCount || 0} sent${selectedInvoice.lastReminderAt ? ` / last ${selectedInvoice.lastReminderAt}` : ''}`}
                    onClick={() => {
                      actions.sendFinanceReminder(selectedInvoice.id)
                      triggerToast('Reminder sent')
                    }}
                  />
                ) : null}
                {isUpcoming ? (
                  <ActionRow
                    icon={PaperPlaneTilt}
                    title="Raise invoice now"
                    detail="Moves this milestone into homeowner dues."
                    onClick={() => {
                      actions.updateFinanceInvoice(selectedInvoice.id, {
                        status: 'due',
                        issuedAt: todayLabel(),
                        dueDate: selectedInvoice.dueDate === 'On completion' ? '15 Dec 2026' : selectedInvoice.dueDate,
                      })
                      triggerToast('Invoice raised')
                    }}
                  />
                ) : null}
                <ActionRow icon={DownloadSimple} title="Download receipt" detail={selectedInvoice.status === 'paid' ? 'Receipt is available.' : 'Available after payment is recorded.'} onClick={() => triggerToast(selectedInvoice.status === 'paid' ? 'Receipt downloaded' : 'Receipt not ready yet')} />
                <ActionRow icon={FileText} title="Edit invoice" detail="Update title, due date, amount, or homeowner note." onClick={() => { setComposerTab('manual'); setEditingInvoiceId(selectedInvoice.id); setInvoiceDraft({ title: selectedInvoice.title, amountL: String(selectedInvoice.amountL), dueDate: selectedInvoice.dueDate, stageLabel: selectedInvoice.stageLabel || '', summary: selectedInvoice.summary || '', clientNote: selectedInvoice.clientNote || '' }); setView('new-invoice') }} />
              </div>
            </section>
          </div>

          <div className="fixed bottom-0 left-1/2 z-[80] w-full max-w-[390px] -translate-x-1/2 border-t border-[#e5e5e5] bg-white px-4 pb-6 pt-4">
            {isDue ? (
              <Button fullWidth leadingIcon={Wallet} onClick={() => openRecordPayment(selectedInvoice)}>Record payment</Button>
            ) : (
              <Button fullWidth variant="outline" leadingIcon={Receipt} onClick={() => triggerToast(selectedInvoice.status === 'paid' ? 'Receipt sent' : 'Invoice is not due yet')}>{selectedInvoice.status === 'paid' ? 'Send receipt' : 'Not due yet'}</Button>
            )}
          </div>
          {toastMessage ? <Toast message={toastMessage} /> : null}
        </section>
      </main>
    )
  }

  if (view === 'record-payment' && selectedInvoice && paymentDraft) {
    return (
      <main className="ui-screen-base ui-feature-surface min-h-dvh w-full overflow-x-hidden bg-white text-black">
        <section className="mx-auto w-full max-w-[390px] pb-28 pt-16">
          <Header title="Record payment" subtitle={screenSubtitle} onBack={() => setView('invoice-detail')} />
          <div className="ui-screen-content space-y-5 pt-6">
            <section className="rounded-[28px] border border-[#d8e2db] px-5 py-5">
              <p className="typo-caption uppercase text-[#267449]">{selectedInvoice.number}</p>
              <h1 className="typo-page-title mt-2 text-black">{formatLakhs(selectedInvoice.amountL)}</h1>
              <p className="typo-body mt-2 text-[#5f7467]">{selectedInvoice.title}</p>
            </section>

            <Field label="Payment mode">
              <SelectField value={paymentDraft.method} onChange={(event) => setPaymentDraft((prev) => ({ ...prev, method: event.target.value }))}>
                {paymentModes.map((mode) => <option key={mode}>{mode}</option>)}
              </SelectField>
            </Field>
            <Field label="Reference / UTR">
              <TextInput value={paymentDraft.transactionId} onChange={(event) => setPaymentDraft((prev) => ({ ...prev, transactionId: event.target.value }))} placeholder="Optional" />
            </Field>
            <section className="rounded-[22px] bg-[#f1f8f4] px-4 py-4">
              <p className="typo-body text-[#267449]">Receipt will be generated and the homeowner timeline will update after payment is marked paid.</p>
            </section>
          </div>
          <div className="fixed bottom-0 left-1/2 z-[80] w-full max-w-[390px] -translate-x-1/2 border-t border-[#e5e5e5] bg-white px-4 pb-6 pt-4">
            <Button
              fullWidth
              leadingIcon={CheckCircle}
              onClick={() => {
                const successPayload = {
                  invoice: selectedInvoice,
                  method: paymentDraft.method,
                  transactionId: paymentDraft.transactionId || `REC-${Date.now().toString().slice(-6)}`,
                }
                actions.recordFinancePayment(paymentDraft.id, paymentDraft)
                setPaymentSuccess(successPayload)
                setPaymentDraft(null)
                setView('payment-success')
              }}
            >
              Mark paid
            </Button>
          </div>
        </section>
      </main>
    )
  }

  if (view === 'payment-success' && paymentSuccess) {
    return (
      <main className="ui-screen-base ui-feature-surface min-h-dvh w-full overflow-x-hidden bg-white text-black">
        <section className="mx-auto w-full max-w-[390px] pb-28 pt-16">
          <Header title="Payment recorded" subtitle={screenSubtitle} onBack={goHome} />
          <div className="ui-screen-content pt-12 text-center">
            <span className="mx-auto grid size-20 place-items-center rounded-full bg-[#eaf8ef] text-[#267449]">
              <CheckCircle size={42} weight="fill" />
            </span>
            <h1 className="typo-page-title mt-6 text-black">Payment recorded</h1>
            <p className="typo-body mt-3 text-[#5f7467]">{paymentSuccess.invoice.number} is now marked paid. Receipt and project activity are updated.</p>
            <section className="mt-8 rounded-[28px] border border-[#d8e2db] px-5 py-5 text-left">
              <SummaryLine label="Invoice" value={paymentSuccess.invoice.title} />
              <SummaryLine label="Amount" value={formatLakhs(paymentSuccess.invoice.amountL)} valueClass="text-[#267449]" />
              <SummaryLine label="Mode" value={paymentSuccess.method} />
              <SummaryLine label="Reference" value={paymentSuccess.transactionId} />
            </section>
          </div>
          <div className="fixed bottom-0 left-1/2 z-[80] w-full max-w-[390px] -translate-x-1/2 border-t border-[#e5e5e5] bg-white px-4 pb-6 pt-4">
            <Button fullWidth onClick={goHome}>Back to finance</Button>
          </div>
        </section>
      </main>
    )
  }

  const homeActions = (
    <>
      {canViewTotals ? <Button icon={ChartBar} variant="outline" aria-label="Open report" onClick={() => setView('report')} /> : null}
      {activeTab === 'expenses' && canAddExpenses ? (
        <Button icon={Plus} aria-label="Add expense" onClick={() => setView('new-expense')} />
      ) : null}
      {activeTab === 'invoices' && canCreateInvoices ? (
        <Button icon={Plus} aria-label="Create invoice" onClick={() => { setEditingInvoiceId(null); resetInvoiceDraft(); setComposerTab('boq'); setView('new-invoice') }} />
      ) : null}
    </>
  )

  return (
    <main className="ui-screen-base ui-feature-surface min-h-dvh w-full overflow-x-hidden bg-white text-black">
      <section className="mx-auto w-full max-w-[390px] pb-10 pt-16">
        <Header subtitle={screenSubtitle} onBack={onBack} actions={homeActions} />

        <div className="ui-screen-content pt-6">
          {canViewTotals ? (
            <>
              <section className="border-b border-[#e5e5e5] pb-5">
                <div className="flex items-end justify-between gap-3">
                  <div>
                    <p className="typo-caption uppercase text-[#267449]">Project value</p>
                    <h1 className="typo-page-title mt-2 text-black">{formatLakhs(financeSummary.totalL)}</h1>
                    <p className="typo-body mt-2 text-[#5f7467]">{project?.name} / incl. GST</p>
                  </div>
                  <Button icon={DownloadSimple} variant="outline" aria-label="Download receipts" onClick={() => triggerToast('Receipts downloaded')} />
                </div>
                <div className="mt-5">
                  <div className="h-3 overflow-hidden rounded-full bg-[#eff4f1]">
                    <span className="block h-full rounded-full bg-[#267449]" style={{ width: `${collectionPercent}%` }} />
                  </div>
                  <div className="mt-2 flex items-center justify-between">
                    <p className="typo-caption text-[#5f7467]">{collectionPercent}% collected</p>
                    <p className="typo-caption text-[#7b7b7b]">{formatLakhs(receivedL)} of {formatLakhs(financeSummary.totalL)}</p>
                  </div>
                </div>
                <div className="mt-5 grid grid-cols-3 gap-3">
                  <SummaryMetric label="Received" value={formatLakhs(receivedL)} tone="text-[#267449]" />
                  <SummaryMetric label="Pending" value={formatLakhs(pendingL)} tone="text-[#a86a00]" />
                  <SummaryMetric label="Upcoming" value={formatLakhs(upcomingL)} tone="text-[#6a6a6a]" />
                </div>
              </section>

              <section className="border-b border-[#e5e5e5] py-5">
                <SectionHeader title="Payment timeline" meta={`${financeInvoices.length} milestones`} />
                <PaymentMilestoneTimeline invoices={financeInvoices} selectedInvoiceId={selectedInvoiceId} onSelect={openInvoiceDetail} />
              </section>

              <section className="border-b border-[#e5e5e5] py-5">
                <div className="grid grid-cols-3 gap-3">
                  <SummaryMetric label="Expenses" value={formatLakhs(expenseTotalL)} tone="text-[#c34545]" />
                  <SummaryMetric label="Cash profit" value={formatLakhs(currentProfitL)} tone="text-[#267449]" />
                  <SummaryMetric label="Margin" value={`${currentMargin}%`} tone="text-[#267449]" />
                </div>
              </section>
            </>
          ) : (
            <section className="border-b border-[#e5e5e5] pb-5">
              <p className="typo-label uppercase text-[#7a8780]">Viewing as</p>
              <p className="typo-body-strong mt-1 text-[#102418]">{viewerRoleLabel}</p>
              <p className="typo-body mt-3 text-[#5f6f66]">This role can submit project expenses without seeing totals, margins, or invoice history.</p>
            </section>
          )}

          <section className="py-5">
            <div className="mb-4 flex items-center gap-2">
              {canViewTotals ? (
                <ModeChip active={activeTab === 'invoices'} onClick={() => setActiveTab('invoices')}>Invoices</ModeChip>
              ) : null}
              <ModeChip active={activeTab === 'expenses'} onClick={() => setActiveTab('expenses')}>Expenses</ModeChip>
            </div>

            {activeTab === 'invoices' && canViewTotals ? (
              <div className="border-y border-[#e5e5e5]">
                {financeInvoices.map((invoice) => (
                  <InvoiceListItem key={invoice.id} invoice={invoice} onOpen={openInvoiceDetail} />
                ))}
              </div>
            ) : null}

            {activeTab === 'expenses' ? (
              <>
                {canViewTotals ? (
                  <div className="mb-5 grid grid-cols-2 gap-3">
                    {sortedExpenseBreakdown.slice(0, 4).map(([label, amount]) => (
                      <SummaryMetric key={label} label={label} value={formatRupees(amount)} tone="text-[#c34545]" />
                    ))}
                  </div>
                ) : null}
                <div className="border-y border-[#e5e5e5]">
                  {financeExpenses.map((expense) => <ExpenseRow key={expense.id} expense={expense} />)}
                </div>
              </>
            ) : null}
          </section>
        </div>
      </section>
      {toastMessage ? <Toast message={toastMessage} /> : null}
    </main>
  )
}

function SummaryLine({ label, value, valueClass = 'text-black' }) {
  return (
    <div className="flex items-center justify-between gap-3 py-1">
      <span className="typo-body text-[#5f6f66]">{label}</span>
      <span className={`typo-body-strong text-right ${valueClass}`}>{value}</span>
    </div>
  )
}

function Toast({ message }) {
  return (
    <div className="typo-body-10 fixed bottom-6 left-1/2 z-[150] -translate-x-1/2 rounded-full bg-black px-4 py-2 text-white shadow-lg">
      {message}
    </div>
  )
}

export default ProFinanceWorkspace
