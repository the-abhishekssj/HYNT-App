import { useMemo, useState } from 'react'
import {
  ChartBar,
  DownloadSimple,
  Plus,
} from '@phosphor-icons/react'
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

const formatLakhs = (value) => `${INR}${value.toFixed(1)}L`
const formatRupees = (value) => `${INR}${Math.round(value).toLocaleString('en-IN')}`

function Header({ subtitle, onBack, onToggleReport, onToggleComposer }) {
  return (
    <ProjectWorkspaceHeader
      title="Finance"
      subtitle={subtitle}
      onBack={onBack}
      actions={(
        <>
            <button type="button" onClick={onToggleReport} className="grid size-9 place-items-center rounded-xl border border-[#e0e0e0] bg-white" aria-label="Toggle report">
              <ChartBar size={17} />
            </button>
            <button type="button" onClick={onToggleComposer} className="grid size-9 place-items-center rounded-xl bg-black text-white" aria-label="Create invoice">
              <Plus size={18} />
            </button>
        </>
      )}
    />
  )
}

function SummaryMetric({ label, value, tone = 'text-black' }) {
  return (
    <div className="rounded-[22px] border border-[#e5e5e5] px-4 py-4 text-left">
      <p className={`type-card-title ${tone}`}>{value}</p>
      <p className="type-caption mt-2 text-[#7b7b7b]">{label}</p>
    </div>
  )
}

function InvoiceCard({ invoice, onSelect, onRecord, onReminder, onRaise }) {
  return (
    <article className="border-b border-[#e5e5e5] py-4 last:border-b-0">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="type-body-strong text-black">{invoice.number} - {invoice.title}</p>
          <p className="type-meta mt-1 text-[#777]">
            {invoice.issuedAt ? `Raised ${invoice.issuedAt}` : 'Not yet raised'} / {invoice.dueDate}
          </p>
          <p className="type-body mt-2 text-[#202020]">{invoice.summary}</p>
          {invoice.reminderCount ? <p className="type-caption mt-2 text-[#7b7b7b]">{invoice.reminderCount} reminder{invoice.reminderCount === 1 ? '' : 's'} sent{invoice.lastReminderAt ? ` / last ${invoice.lastReminderAt}` : ''}</p> : null}
        </div>
        <div className="shrink-0 text-right">
          <p className="type-card-title">{formatLakhs(invoice.amountL)}</p>
          <span className={`type-caption mt-1 inline-flex rounded-full px-2 py-1 ${invoiceStatusTone[invoice.status]}`}>{invoice.status}</span>
        </div>
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        <button type="button" onClick={() => onSelect(invoice)} className="type-caption rounded-full border border-[#d8e2db] px-3 py-2 text-[#173324]">
          View detail
        </button>
        {invoice.status === 'due' ? (
          <>
            <button type="button" onClick={() => onRecord(invoice)} className="type-caption rounded-full bg-black px-3 py-2 text-white">
              Record paid
            </button>
            <button type="button" onClick={() => onReminder(invoice.id)} className="type-caption rounded-full border border-[#ead9bf] px-3 py-2 text-[#a86a00]">
              Send reminder
            </button>
          </>
        ) : null}
        {invoice.status === 'upcoming' ? (
          <button type="button" onClick={() => onRaise(invoice)} className="type-caption rounded-full border border-[#d8e2db] px-3 py-2 text-[#173324]">
            Raise now
          </button>
        ) : null}
      </div>
    </article>
  )
}

function ExpenseRow({ expense }) {
  return (
    <article className="border-b border-[#e5e5e5] py-4 last:border-b-0">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="type-body-strong text-black">{expense.title}</p>
          <p className="type-meta mt-1 text-[#777]">{expense.expenseDate} / {expense.mode}{expense.payee ? ` / ${expense.payee}` : ''}</p>
          <div className="mt-2 flex flex-wrap gap-2">
            <span className="type-caption rounded-full border border-[#e5e5e5] px-2 py-1 text-[#6f6f6f]">{expense.category}</span>
            <span className="type-caption rounded-full border border-[#e5e5e5] px-2 py-1 text-[#6f6f6f]">{expense.hasBill ? 'Bill uploaded' : 'No bill'}</span>
          </div>
        </div>
        <div className="shrink-0 text-right">
          <p className="type-card-title text-[#c34545]">{formatRupees(expense.amount)}</p>
          <p className="type-caption mt-1 text-[#7b7b7b]">{expense.submittedBy}</p>
        </div>
      </div>
    </article>
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

  const [activeTab, setActiveTab] = useState('invoices')
  const [showReport, setShowReport] = useState(false)
  const [showInvoiceComposer, setShowInvoiceComposer] = useState(false)
  const [showExpenseComposer, setShowExpenseComposer] = useState(false)
  const [selectedInvoice, setSelectedInvoice] = useState(null)
  const [paymentDraft, setPaymentDraft] = useState(null)
  const [composerTab, setComposerTab] = useState('boq') // 'boq', 'manual', 'scratch'
  const [scratchClientName, setScratchClientName] = useState('Priya Sharma')
  const [scratchTitle, setScratchTitle] = useState('')
  const [scratchAmount, setScratchAmount] = useState('')
  const [scratchDueDate, setScratchDueDate] = useState('')
  const [toastMessage, setToastMessage] = useState(null)
  const [tdsAmount, setTdsAmount] = useState(0)
  const [showTdsInput, setShowTdsInput] = useState(false)

  const triggerToast = (msg) => {
    setToastMessage(msg)
    setTimeout(() => {
      setToastMessage(null)
    }, 2500)
  }

  const [invoiceDraft, setInvoiceDraft] = useState({
    title: '',
    amountL: '',
    dueDate: '',
    stageLabel: '',
    summary: '',
    clientNote: '',
  })
  const [expenseDraft, setExpenseDraft] = useState({
    category: expenseCategories[0],
    title: '',
    amount: '',
    expenseDate: '',
    payee: '',
    mode: paymentModes[0],
    gstRate: '18',
    note: '',
    hasBill: true,
  })

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

  if (!canViewTotals && !canAddExpenses) {
    return (
      <main className="min-h-dvh w-full overflow-x-hidden bg-white font-['Urbanist'] text-black">
        <section className="mx-auto w-full max-w-[390px] pb-6 pt-16">
          <Header subtitle={project?.scope || 'Project finance'} onBack={onBack} onToggleReport={() => {}} onToggleComposer={() => {}} />
          <div className="px-4 pt-8">
            <section className="border-y border-[#e5e5e5] py-6">
              <p className="type-label uppercase text-[#7a8780]">Restricted access</p>
              <h1 className="type-page-title mt-2 text-[#102418]">{viewerRoleLabel} cannot view project finances.</h1>
              <p className="type-body mt-3 text-[#5f6f66]">Grant this role finance visibility or expense-entry rights from People & Access to show this surface.</p>
            </section>
          </div>
        </section>
      </main>
    )
  }

  if (!canViewTotals && canAddExpenses) {
    return (
      <main className="min-h-dvh w-full overflow-x-hidden bg-white font-['Urbanist'] text-black">
        <section className="mx-auto w-full max-w-[390px] pb-10 pt-16">
          <Header subtitle={project?.scope || 'Project finance'} onBack={onBack} onToggleReport={() => {}} onToggleComposer={() => setShowExpenseComposer((prev) => !prev)} />
          <div className="px-4 py-6">
            <section className="border-b border-[#e5e5e5] pb-5">
              <p className="type-label uppercase text-[#7a8780]">Viewing as</p>
              <p className="type-body-strong mt-1 text-[#102418]">{viewerRoleLabel}</p>
              <p className="type-body mt-3 text-[#5f6f66]">This role can submit project expenses without seeing totals, margins, or invoice history.</p>
            </section>

            {showExpenseComposer ? (
              <section className="border-b border-[#e5e5e5] py-5">
                <p className="type-section-title text-black">Log expense</p>
                <div className="mt-4 space-y-4">
                  <label className="block">
                    <p className="type-label mb-2 uppercase text-[#7a8780]">Category</p>
                    <select value={expenseDraft.category} onChange={(event) => setExpenseDraft((prev) => ({ ...prev, category: event.target.value }))} className="type-body h-12 w-full rounded-2xl border border-[#d8e2db] bg-white px-4 outline-none">
                      {expenseCategories.map((category) => <option key={category}>{category}</option>)}
                    </select>
                  </label>
                  <label className="block">
                    <p className="type-label mb-2 uppercase text-[#7a8780]">Description</p>
                    <input value={expenseDraft.title} onChange={(event) => setExpenseDraft((prev) => ({ ...prev, title: event.target.value }))} placeholder="Carpenter payment, tiles, transport..." className="type-body h-12 w-full rounded-2xl border border-[#d8e2db] bg-white px-4 outline-none" />
                  </label>
                  <label className="block">
                    <p className="type-label mb-2 uppercase text-[#7a8780]">Amount</p>
                    <input value={expenseDraft.amount} onChange={(event) => setExpenseDraft((prev) => ({ ...prev, amount: event.target.value }))} inputMode="numeric" placeholder="12500" className="type-body h-12 w-full rounded-2xl border border-[#d8e2db] bg-white px-4 outline-none" />
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    <button type="button" onClick={() => setShowExpenseComposer(false)} className="type-body-strong h-12 rounded-2xl border border-[#d8e2db] bg-white px-4 text-[#4f5d55]">Cancel</button>
                    <button
                      type="button"
                      onClick={() => {
                        actions.addFinanceExpense({
                          ...expenseDraft,
                          submittedBy: activeViewer?.user?.name || viewerRoleLabel,
                        })
                        setShowExpenseComposer(false)
                        setExpenseDraft({
                          category: expenseCategories[0],
                          title: '',
                          amount: '',
                          expenseDate: '',
                          payee: '',
                          mode: paymentModes[0],
                          gstRate: '18',
                          note: '',
                          hasBill: true,
                        })
                      }}
                      className="type-body-strong h-12 rounded-2xl bg-black px-4 text-white"
                    >
                      Save
                    </button>
                  </div>
                </div>
              </section>
            ) : null}

            <section className="py-5">
              <div className="mb-3 flex items-center justify-between">
                <p className="type-section-title">Submitted expenses</p>
                <p className="type-meta text-[#7b7b7b]">{financeExpenses.length} total</p>
              </div>
              <div className="border-y border-[#e5e5e5]">
                {financeExpenses.map((expense) => <ExpenseRow key={expense.id} expense={expense} />)}
              </div>
            </section>
          </div>
        </section>
      </main>
    )
  }

  return (
    <main className="min-h-dvh w-full overflow-x-hidden bg-white font-['Urbanist'] text-black">
      <section className="mx-auto w-full max-w-[390px] pb-10 pt-16">
        <Header
          subtitle={project?.scope || 'Project finance'}
          onBack={onBack}
          onToggleReport={() => setShowReport((prev) => !prev)}
          onToggleComposer={() => activeTab === 'expenses' ? setShowExpenseComposer((prev) => !prev) : setShowInvoiceComposer((prev) => !prev)}
        />

        <div className="px-4 py-6">
          <section className="border-b border-[#e5e5e5] pb-5">
            <div className="flex items-end justify-between gap-3">
              <div>
                <p className="type-caption uppercase text-[#267449]">Project value</p>
                <h1 className="type-page-title mt-2 text-black">{formatLakhs(financeSummary.totalL)}</h1>
                <p className="type-body mt-2 text-[#5f7467]">{project?.name} / incl. GST</p>
              </div>
              <button type="button" onClick={() => triggerToast('All receipts PDF downloaded!')} className="grid size-9 place-items-center rounded-xl border border-[#e0e0e0] bg-white hover:bg-gray-50 transition-colors" aria-label="Download receipts">
                <DownloadSimple size={17} />
              </button>
            </div>

            <div className="mt-5 grid grid-cols-3 border-y border-[#e5e5e5]">
              <SummaryMetric label="Received" value={formatLakhs(receivedL)} tone="text-[#267449]" />
              <SummaryMetric label="Pending" value={formatLakhs(pendingL)} tone="text-[#a86a00]" />
              <SummaryMetric label="Upcoming" value={formatLakhs(upcomingL)} tone="text-[#6a6a6a]" />
            </div>
          </section>

          <section className="border-b border-[#e5e5e5] py-5">
            <div className="mb-4 flex items-center justify-between">
              <p className="type-section-title text-black">Payment timeline</p>
              <span className="type-caption text-[#7b7b7b]">{financeInvoices.length} milestones</span>
            </div>
            <PaymentMilestoneTimeline invoices={financeInvoices} selectedInvoiceId={selectedInvoice?.id || null} onSelect={setSelectedInvoice} />
          </section>

          <section className="border-b border-[#e5e5e5] py-5">
            <div className="grid grid-cols-3 gap-3">
              <SummaryMetric label="Expenses" value={formatLakhs(expenseTotalL)} tone="text-[#c34545]" />
              <SummaryMetric label="Cash profit" value={formatLakhs(currentProfitL)} tone="text-[#267449]" />
              <SummaryMetric label="Margin" value={`${currentMargin}%`} tone="text-[#267449]" />
            </div>
          </section>

          <section className="py-5">
            <div className="mb-4 flex items-center gap-2">
              {[
                ['invoices', 'Invoices'],
                ['expenses', 'Expenses'],
              ].map(([key, label]) => (
                <button key={key} type="button" onClick={() => setActiveTab(key)} className={`type-caption rounded-full px-3 py-2 ${activeTab === key ? 'bg-black text-white' : 'border border-[#d8e2db] text-[#6f6f6f]'}`}>
                  {label}
                </button>
              ))}
            </div>

            {showReport ? (
              <section className="border-b border-[#e5e5e5] pb-5">
                <div className="mb-3 flex items-center justify-between">
                  <p className="type-section-title text-black">P&L snapshot</p>
                  <button type="button" onClick={() => triggerToast('Exported report to Excel!')} className="type-caption rounded-full border border-[#d8e2db] px-3 py-2 text-[#173324] hover:bg-gray-50 transition-colors">Export</button>
                </div>
                <div className="border-y border-[#e5e5e5] py-2 space-y-4">
                  <div>
                    <p className="text-[10px] font-bold text-[#7b7b7b] uppercase tracking-wider mb-2 border-b border-gray-100 pb-1">Revenue</p>
                    <div className="flex items-center justify-between py-1.5">
                      <span className="type-body text-[#5f6f66]">Total invoiced</span>
                      <span className="type-body-strong text-black">{formatLakhs(financeSummary.totalL)}</span>
                    </div>
                    <div className="flex items-center justify-between py-1.5">
                      <span className="type-body text-[#5f6f66]">Total received</span>
                      <span className="type-body-strong text-[#267449]">{formatLakhs(receivedL)}</span>
                    </div>
                    <div className="flex items-center justify-between py-1.5">
                      <span className="type-body text-[#5f6f66]">Pending</span>
                      <span className="type-body-strong text-[#a86a00]">{formatLakhs(pendingL)}</span>
                    </div>
                    <div className="flex items-center justify-between py-1.5">
                      <span className="type-body text-[#5f6f66]">Upcoming</span>
                      <span className="type-body-strong text-gray-400">{formatLakhs(upcomingL)}</span>
                    </div>
                  </div>

                  <div>
                    <p className="text-[10px] font-bold text-[#7b7b7b] uppercase tracking-wider mb-2 border-b border-gray-100 pb-1">Expenses</p>
                    {sortedExpenseBreakdown.map(([label, amount]) => (
                      <div key={label} className="flex items-center justify-between py-1.5">
                        <span className="type-meta text-[#5f6f66]">{label}</span>
                        <span className="type-body-strong text-[#c34545]">{formatRupees(amount)}</span>
                      </div>
                    ))}
                    <div className="flex items-center justify-between py-2.5 bg-[#fffaf5] px-3 rounded-xl mt-2">
                      <span className="text-[12px] font-bold text-black">Total Expenses</span>
                      <span className="text-[14px] font-bold text-[#c34545]">{formatLakhs(expenseTotalL)}</span>
                    </div>
                  </div>

                  <div>
                    <p className="text-[10px] font-bold text-[#7b7b7b] uppercase tracking-wider mb-2 border-b border-gray-100 pb-1">Profit</p>
                    <div className="flex items-center justify-between py-1.5">
                      <span className="type-body text-[#5f6f66]">Gross profit (received - exp)</span>
                      <span className="type-body-strong text-[#267449]">{formatLakhs(currentProfitL)}</span>
                    </div>
                    <div className="flex items-center justify-between py-1.5">
                      <span className="type-body text-[#5f6f66]">Projected profit (total - exp)</span>
                      <span className="type-body-strong text-[#267449]">{formatLakhs(projectedProfitL)}</span>
                    </div>
                    <div className="flex items-center justify-between py-1.5">
                      <span className="type-body text-[#5f6f66]">Current margin</span>
                      <span className="type-body-strong text-[#267449]">{currentMargin}%</span>
                    </div>
                    <div className="flex items-center justify-between py-1.5">
                      <span className="type-body text-[#5f6f66]">Projected margin</span>
                      <span className="type-body-strong text-[#267449]">{projectedMargin}%</span>
                    </div>
                  </div>

                  <div>
                    <p className="text-[10px] font-bold text-[#7b7b7b] uppercase tracking-wider mb-2 border-b border-gray-100 pb-1">GST Summary</p>
                    <div className="border border-[#e5e5e5] rounded-xl overflow-hidden text-[11px] mt-2 bg-white">
                      <div className="flex justify-between py-2 px-3 border-b border-gray-100">
                        <span className="text-gray-600">GST collected (invoices)</span>
                        <span className="font-bold text-[#267449]">{formatRupees(gstCollected)}</span>
                      </div>
                      <div className="flex justify-between py-2 px-3 border-b border-gray-100">
                        <span className="text-gray-600">GST paid (expenses)</span>
                        <span className="font-bold text-[#c34545]">{formatRupees(gstPaid)}</span>
                      </div>
                      <div className="flex justify-between py-2.5 px-3 bg-[#fff9f4] font-bold text-[12px]">
                        <span className="text-black">Net GST payable</span>
                        <span className="text-[#a86a00]">{formatRupees(Math.max(0, gstCollected - gstPaid))}</span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <p className="text-[10px] font-bold text-[#7b7b7b] uppercase tracking-wider mb-2 border-b border-gray-100 pb-1">TDS Section</p>
                    <div className="flex items-center justify-between py-1.5">
                      <span className="type-body text-[#5f6f66]">TDS deducted by client</span>
                      <span className="type-body-strong text-[#a86a00]">{formatRupees(tdsAmount)}</span>
                    </div>
                    {showTdsInput ? (
                      <div className="mt-3 flex gap-2">
                        <input
                          type="number"
                          value={tdsAmount || ''}
                          onChange={(e) => setTdsAmount(parseFloat(e.target.value) || 0)}
                          placeholder="Enter TDS amount"
                          className="type-body h-10 min-w-0 flex-1 rounded-xl border border-[#d8e2db] px-3 outline-none"
                        />
                        <button type="button" onClick={() => { setShowTdsInput(false); triggerToast('TDS amount logged! ✓') }} className="type-body-strong h-10 rounded-xl bg-black px-4 text-white">Save</button>
                      </div>
                    ) : (
                      <button type="button" onClick={() => setShowTdsInput(true)} className="type-caption mt-2 rounded-full border border-[#d8e2db] px-3 py-2 text-[#173324] hover:bg-gray-50 transition-colors">+ Log TDS deduction</button>
                    )}
                  </div>
                </div>
              </section>
            ) : null}

            {activeTab === 'invoices' ? (
              <>
                {showInvoiceComposer && canCreateInvoices ? (
                  <section className="border-b border-[#e5e5e5] pb-5">
                    <p className="type-section-title text-black">New invoice</p>

                    <div className="flex bg-[#f7fbf8] rounded-xl p-1 border border-[#e8f0eb] mt-3 mb-4">
                      {[
                        ['boq', '✦ From BOQ'],
                        ['manual', 'Manual'],
                        ['scratch', 'From scratch']
                      ].map(([tabKey, label]) => (
                        <button
                          key={tabKey}
                          type="button"
                          onClick={() => setComposerTab(tabKey)}
                          className={`flex-1 text-center py-2 rounded-lg text-[11px] font-bold transition-all ${composerTab === tabKey ? 'bg-white text-[#267449] shadow-sm' : 'text-[#7b7b7b]'}`}
                        >
                          {label}
                        </button>
                      ))}
                    </div>

                    {composerTab === 'boq' && (
                      <div className="space-y-4">
                        <div className="border border-[#e5e5e5] rounded-2xl overflow-hidden bg-white text-[11px]">
                          <div className="bg-[#f7fbf8] px-3 py-2 border-b border-[#e5e5e5] font-bold text-[#267449] uppercase tracking-wider">
                            Invoice Schedule — 30-30-24-10%
                          </div>
                          <div className="flex justify-between py-2 px-3 border-b border-gray-100">
                            <span className="text-gray-500">INV-BOQ-01 · Advance (30%)</span>
                            <span className="font-bold text-black">{formatLakhs(totalBoqL * 0.3)}</span>
                          </div>
                          <div className="flex justify-between py-2 px-3 border-b border-gray-100">
                            <span className="text-gray-500">INV-BOQ-02 · Milestone 1 (30%)</span>
                            <span className="font-bold text-black">{formatLakhs(totalBoqL * 0.3)}</span>
                          </div>
                          <div className="flex justify-between py-2 px-3 border-b border-gray-100">
                            <span className="text-gray-500">INV-BOQ-03 · Milestone 2 (24%)</span>
                            <span className="font-bold text-black">{formatLakhs(totalBoqL * 0.24)}</span>
                          </div>
                          <div className="flex justify-between py-2 px-3 font-semibold text-black">
                            <span className="text-gray-500">INV-BOQ-04 · Final (10%)</span>
                            <span className="font-bold text-black">{formatLakhs(totalBoqL * 0.1)}</span>
                          </div>
                        </div>

                        {isScheduleCreated ? (
                          <p className="type-caption text-[#5f7467] text-center">✓ Invoice schedule has been generated from BOQ.</p>
                        ) : (
                          <button
                            type="button"
                            onClick={() => {
                              actions.createFinanceScheduleFromBoq('auto')
                              triggerToast('Invoice schedule created in Finance! ✓')
                              setShowInvoiceComposer(false)
                            }}
                            className="type-body-strong h-12 w-full rounded-2xl bg-[#267449] text-white hover:bg-[#1f4e38] transition-colors"
                          >
                            Create All 4 Invoices →
                          </button>
                        )}
                        <button type="button" onClick={() => setShowInvoiceComposer(false)} className="type-body-strong h-12 w-full rounded-2xl border border-[#d8e2db] bg-white text-[#4f5d55]">Cancel</button>
                      </div>
                    )}

                    {composerTab === 'manual' && (
                      <div className="space-y-4">
                        <label className="block">
                          <p className="type-label mb-2 uppercase text-[#7a8780]">Invoice title</p>
                          <input value={invoiceDraft.title} onChange={(event) => setInvoiceDraft((prev) => ({ ...prev, title: event.target.value }))} placeholder="Milestone 3 - modular execution" className="type-body h-12 w-full rounded-2xl border border-[#d8e2db] bg-white px-4 outline-none" />
                        </label>
                        <div className="grid grid-cols-2 gap-3">
                          <label className="block">
                            <p className="type-label mb-2 uppercase text-[#7a8780]">Amount (L)</p>
                            <input value={invoiceDraft.amountL} onChange={(event) => setInvoiceDraft((prev) => ({ ...prev, amountL: event.target.value }))} inputMode="decimal" placeholder="1.2" className="type-body h-12 w-full rounded-2xl border border-[#d8e2db] bg-white px-4 outline-none" />
                          </label>
                          <label className="block">
                            <p className="type-label mb-2 uppercase text-[#7a8780]">Due date</p>
                            <input value={invoiceDraft.dueDate} onChange={(event) => setInvoiceDraft((prev) => ({ ...prev, dueDate: event.target.value }))} placeholder="15 Nov 2026" className="type-body h-12 w-full rounded-2xl border border-[#d8e2db] bg-white px-4 outline-none" />
                          </label>
                        </div>
                        <label className="block">
                          <p className="type-label mb-2 uppercase text-[#7a8780]">Milestone label</p>
                          <input value={invoiceDraft.stageLabel} onChange={(event) => setInvoiceDraft((prev) => ({ ...prev, stageLabel: event.target.value }))} placeholder="Execution checkpoint" className="type-body h-12 w-full rounded-2xl border border-[#d8e2db] bg-white px-4 outline-none" />
                        </label>
                        <label className="block">
                          <p className="type-label mb-2 uppercase text-[#7a8780]">Summary</p>
                          <textarea value={invoiceDraft.summary} onChange={(event) => setInvoiceDraft((prev) => ({ ...prev, summary: event.target.value }))} placeholder="What this invoice covers..." className="type-body min-h-24 w-full rounded-2xl border border-[#d8e2db] bg-white px-4 py-3 outline-none" />
                        </label>
                        <label className="block">
                          <p className="type-label mb-2 uppercase text-[#7a8780]">Note to homeowner</p>
                          <textarea value={invoiceDraft.clientNote} onChange={(event) => setInvoiceDraft((prev) => ({ ...prev, clientNote: event.target.value }))} placeholder="Optional note..." className="type-body min-h-20 w-full rounded-2xl border border-[#d8e2db] bg-white px-4 py-3 outline-none" />
                        </label>
                        <div className="grid grid-cols-2 gap-3">
                          <button type="button" onClick={() => setShowInvoiceComposer(false)} className="type-body-strong h-12 rounded-2xl border border-[#d8e2db] bg-white px-4 text-[#4f5d55]">Cancel</button>
                          <button
                            type="button"
                            onClick={() => {
                              actions.createFinanceInvoice(invoiceDraft)
                              triggerToast('Invoice created & sent! ✓')
                              setShowInvoiceComposer(false)
                              setInvoiceDraft({ title: '', amountL: '', dueDate: '', stageLabel: '', summary: '', clientNote: '' })
                            }}
                            className="type-body-strong h-12 rounded-2xl bg-black px-4 text-white"
                          >
                            Create invoice
                          </button>
                        </div>
                      </div>
                    )}

                    {composerTab === 'scratch' && (
                      <div className="space-y-4">
                        <label className="block">
                          <p className="type-label mb-2 uppercase text-[#7a8780]">Client name</p>
                          <input value={scratchClientName} onChange={(e) => setScratchClientName(e.target.value)} placeholder="Client Name" className="type-body h-12 w-full rounded-2xl border border-[#d8e2db] bg-white px-4 outline-none" />
                        </label>
                        <label className="block">
                          <p className="type-label mb-2 uppercase text-[#7a8780]">Invoice title</p>
                          <input value={scratchTitle} onChange={(e) => setScratchTitle(e.target.value)} placeholder="e.g. Design consultation" className="type-body h-12 w-full rounded-2xl border border-[#d8e2db] bg-white px-4 outline-none" />
                        </label>
                        <div className="grid grid-cols-2 gap-3">
                          <label className="block">
                            <p className="type-label mb-2 uppercase text-[#7a8780]">Amount (₹)</p>
                            <input value={scratchAmount} onChange={(e) => setScratchAmount(e.target.value)} placeholder="0.00" className="type-body h-12 w-full rounded-2xl border border-[#d8e2db] bg-white px-4 outline-none" />
                          </label>
                          <label className="block">
                            <p className="type-label mb-2 uppercase text-[#7a8780]">Due date</p>
                            <input value={scratchDueDate} onChange={(e) => setScratchDueDate(e.target.value)} placeholder="e.g. 15 Dec 2026" className="type-body h-12 w-full rounded-2xl border border-[#d8e2db] bg-white px-4 outline-none" />
                          </label>
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                          <button type="button" onClick={() => setShowInvoiceComposer(false)} className="type-body-strong h-12 rounded-2xl border border-[#d8e2db] bg-white px-4 text-[#4f5d55]">Cancel</button>
                          <button
                            type="button"
                            onClick={() => {
                              triggerToast('Invoice created from scratch! ✓')
                              setShowInvoiceComposer(false)
                              setScratchTitle('')
                              setScratchAmount('')
                              setScratchDueDate('')
                            }}
                            className="type-body-strong h-12 rounded-2xl bg-black px-4 text-white"
                          >
                            Create & Send
                          </button>
                        </div>
                      </div>
                    )}
                  </section>
                ) : null}

                <div className="border-y border-[#e5e5e5]">
                  {financeInvoices.map((invoice) => (
                    <InvoiceCard
                      key={invoice.id}
                      invoice={invoice}
                      onSelect={setSelectedInvoice}
                      onRecord={(target) => setPaymentDraft({ id: target.id, method: 'NEFT', transactionId: '' })}
                      onReminder={(id) => {
                        actions.sendFinanceReminder(id)
                        triggerToast('Reminder sent to Priya! ✓')
                      }}
                      onRaise={(target) => {
                        actions.updateFinanceInvoice(target.id, {
                          status: 'due',
                          issuedAt: new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }),
                          dueDate: target.dueDate === 'On completion' ? '15 Dec 2026' : target.dueDate,
                        })
                        triggerToast('Invoice raised and sent! ✓')
                      }}
                    />
                  ))}
                </div>
              </>
            ) : (
              <>
                {showExpenseComposer ? (
                  <section className="border-b border-[#e5e5e5] pb-5">
                    <p className="type-section-title text-black">Log expense</p>
                    <div className="mt-4 space-y-4">
                      <label className="block">
                        <p className="type-label mb-2 uppercase text-[#7a8780]">Category</p>
                        <select value={expenseDraft.category} onChange={(event) => setExpenseDraft((prev) => ({ ...prev, category: event.target.value }))} className="type-body h-12 w-full rounded-2xl border border-[#d8e2db] bg-white px-4 outline-none">
                          {expenseCategories.map((category) => <option key={category}>{category}</option>)}
                        </select>
                      </label>
                      <label className="block">
                        <p className="type-label mb-2 uppercase text-[#7a8780]">Description</p>
                        <input value={expenseDraft.title} onChange={(event) => setExpenseDraft((prev) => ({ ...prev, title: event.target.value }))} placeholder="Sleek Kitchens - stage payment" className="type-body h-12 w-full rounded-2xl border border-[#d8e2db] bg-white px-4 outline-none" />
                      </label>
                      <div className="grid grid-cols-2 gap-3">
                        <label className="block">
                          <p className="type-label mb-2 uppercase text-[#7a8780]">Amount</p>
                          <input value={expenseDraft.amount} onChange={(event) => setExpenseDraft((prev) => ({ ...prev, amount: event.target.value }))} inputMode="numeric" placeholder="150000" className="type-body h-12 w-full rounded-2xl border border-[#d8e2db] bg-white px-4 outline-none" />
                        </label>
                        <label className="block">
                          <p className="type-label mb-2 uppercase text-[#7a8780]">Date</p>
                          <input value={expenseDraft.expenseDate} onChange={(event) => setExpenseDraft((prev) => ({ ...prev, expenseDate: event.target.value }))} placeholder="20 Sep 2026" className="type-body h-12 w-full rounded-2xl border border-[#d8e2db] bg-white px-4 outline-none" />
                        </label>
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <label className="block">
                          <p className="type-label mb-2 uppercase text-[#7a8780]">Payee</p>
                          <input value={expenseDraft.payee} onChange={(event) => setExpenseDraft((prev) => ({ ...prev, payee: event.target.value }))} placeholder="Optional" className="type-body h-12 w-full rounded-2xl border border-[#d8e2db] bg-white px-4 outline-none" />
                        </label>
                        <label className="block">
                          <p className="type-label mb-2 uppercase text-[#7a8780]">Mode</p>
                          <select value={expenseDraft.mode} onChange={(event) => setExpenseDraft((prev) => ({ ...prev, mode: event.target.value }))} className="type-body h-12 w-full rounded-2xl border border-[#d8e2db] bg-white px-4 outline-none">
                            {paymentModes.map((mode) => <option key={mode}>{mode}</option>)}
                          </select>
                        </label>
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <label className="block">
                          <p className="type-label mb-2 uppercase text-[#7a8780]">GST paid</p>
                          <select value={expenseDraft.gstRate} onChange={(event) => setExpenseDraft((prev) => ({ ...prev, gstRate: event.target.value }))} className="type-body h-12 w-full rounded-2xl border border-[#d8e2db] bg-white px-4 outline-none">
                            <option value="0">None</option>
                            <option value="5">5%</option>
                            <option value="12">12%</option>
                            <option value="18">18%</option>
                            <option value="28">28%</option>
                          </select>
                        </label>
                        <label className="flex items-end pb-2">
                          <input type="checkbox" checked={expenseDraft.hasBill} onChange={(event) => setExpenseDraft((prev) => ({ ...prev, hasBill: event.target.checked }))} className="mr-2" />
                          <span className="type-body text-black">Bill uploaded</span>
                        </label>
                      </div>
                      <label className="block">
                        <p className="type-label mb-2 uppercase text-[#7a8780]">Notes</p>
                        <textarea value={expenseDraft.note} onChange={(event) => setExpenseDraft((prev) => ({ ...prev, note: event.target.value }))} placeholder="Optional note..." className="type-body min-h-20 w-full rounded-2xl border border-[#d8e2db] bg-white px-4 py-3 outline-none" />
                      </label>
                      <div className="grid grid-cols-2 gap-3">
                        <button type="button" onClick={() => setShowExpenseComposer(false)} className="type-body-strong h-12 rounded-2xl border border-[#d8e2db] bg-white px-4 text-[#4f5d55]">Cancel</button>
                        <button
                          type="button"
                          onClick={() => {
                            actions.addFinanceExpense({
                              ...expenseDraft,
                              submittedBy: activeViewer?.user?.name || viewerRoleLabel,
                            })
                            setShowExpenseComposer(false)
                            setExpenseDraft({
                              category: expenseCategories[0],
                              title: '',
                              amount: '',
                              expenseDate: '',
                              payee: '',
                              mode: paymentModes[0],
                              gstRate: '18',
                              note: '',
                              hasBill: true,
                            })
                          }}
                          className="type-body-strong h-12 rounded-2xl bg-black px-4 text-white"
                        >
                          Save expense
                        </button>
                      </div>
                    </div>
                  </section>
                ) : null}

                <div className="border-y border-[#e5e5e5]">
                  {financeExpenses.map((expense) => <ExpenseRow key={expense.id} expense={expense} />)}
                </div>
              </>
            )}
          </section>
        </div>
      </section>

      {selectedInvoice ? (
        <div className="fixed bottom-0 left-1/2 z-[95] w-full max-w-[390px] -translate-x-1/2 border-t border-[#e0e0e0] bg-white px-4 pb-6 pt-4 shadow-[0_-8px_24px_rgba(0,0,0,0.08)]">
          <p className="type-label uppercase text-[#7b7b7b]">Invoice detail</p>
          <p className="type-body-strong mt-1">{selectedInvoice.number} - {selectedInvoice.title}</p>
          <p className="type-body mt-2 text-[#202020]">{selectedInvoice.summary}</p>
          <div className="mt-3 flex items-center justify-between">
            <span className="type-caption text-[#7b7b7b]">{selectedInvoice.stageLabel || selectedInvoice.title}</span>
            <span className={`type-caption rounded-full px-2 py-1 ${invoiceStatusTone[selectedInvoice.status]}`}>{selectedInvoice.status}</span>
          </div>
          <div className="mt-3 flex items-center justify-between">
            <span className="type-meta text-[#7b7b7b]">Due {selectedInvoice.dueDate}</span>
            <span className="type-card-title">{formatLakhs(selectedInvoice.amountL)}</span>
          </div>
          <div className="mt-4 grid grid-cols-2 gap-3">
            <button type="button" onClick={() => setSelectedInvoice(null)} className="type-body-strong h-11 rounded-2xl border border-[#d8e2db] bg-white text-[#173324]">
              Close
            </button>
            {selectedInvoice.status === 'due' ? (
              <button type="button" onClick={() => setPaymentDraft({ id: selectedInvoice.id, method: 'NEFT', transactionId: '' })} className="type-body-strong h-11 rounded-2xl bg-black text-white">
                Record paid
              </button>
            ) : (
              <button type="button" className="type-body-strong h-11 rounded-2xl border border-[#d8e2db] bg-white text-[#173324]">
                Receipt sent
              </button>
            )}
          </div>
        </div>
      ) : null}

      {paymentDraft ? (
        <div className="fixed inset-0 z-[110] flex items-end justify-center bg-black/30">
          <div className="w-full max-w-[390px] rounded-t-[28px] bg-white px-4 pb-6 pt-5">
            <p className="type-section-title text-black">Record payment</p>
            <p className="type-body mt-2 text-[#5f7467]">Mark the invoice paid and notify the homeowner.</p>
            <div className="mt-4 space-y-4">
              <label className="block">
                <p className="type-label mb-2 uppercase text-[#7a8780]">Payment mode</p>
                <select value={paymentDraft.method} onChange={(event) => setPaymentDraft((prev) => ({ ...prev, method: event.target.value }))} className="type-body h-12 w-full rounded-2xl border border-[#d8e2db] bg-white px-4 outline-none">
                  {paymentModes.map((mode) => <option key={mode}>{mode}</option>)}
                </select>
              </label>
              <label className="block">
                <p className="type-label mb-2 uppercase text-[#7a8780]">Reference / UTR</p>
                <input value={paymentDraft.transactionId} onChange={(event) => setPaymentDraft((prev) => ({ ...prev, transactionId: event.target.value }))} placeholder="Optional" className="type-body h-12 w-full rounded-2xl border border-[#d8e2db] bg-white px-4 outline-none" />
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button type="button" onClick={() => setPaymentDraft(null)} className="type-body-strong h-12 rounded-2xl border border-[#d8e2db] bg-white text-[#173324]">Cancel</button>
                <button
                  type="button"
                  onClick={() => {
                    actions.recordFinancePayment(paymentDraft.id, paymentDraft)
                    setPaymentDraft(null)
                    setSelectedInvoice(null)
                    triggerToast('Payment recorded successfully! ✓')
                  }}
                  className="type-body-strong h-12 rounded-2xl bg-black text-white"
                >
                  Mark paid
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : null}

      {toastMessage ? (
        <div className="fixed bottom-6 left-1/2 z-[150] -translate-x-1/2 rounded-full bg-black px-4 py-2 text-[11px] font-semibold text-white shadow-lg">
          {toastMessage}
        </div>
      ) : null}
    </main>
  )
}

export default ProFinanceWorkspace
