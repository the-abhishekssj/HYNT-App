function milestoneDate(invoice) {
  if (invoice.status === 'paid') return invoice.paidAt || invoice.issuedAt || invoice.dueDate
  if (invoice.status === 'due') return invoice.dueDate
  return invoice.dueDate || 'Pending'
}

function milestoneTone(invoice, active) {
  if (invoice.status === 'paid') {
    return {
      dot: 'border-[#267449] bg-[#267449]',
      halo: active ? 'ring-4 ring-[#eaf8ef]' : '',
      label: active ? 'text-black' : 'text-[#4f5f56]',
      date: 'text-[#267449]',
    }
  }

  if (invoice.status === 'due') {
    return {
      dot: 'border-[#a86a00] bg-[#a86a00]',
      halo: active ? 'ring-4 ring-[#fff1df]' : '',
      label: active ? 'text-black' : 'text-[#4f5f56]',
      date: 'text-[#a86a00]',
    }
  }

  return {
    dot: 'border-[#d0d0d0] bg-white',
    halo: active ? 'ring-4 ring-[#f3f3f3]' : '',
    label: active ? 'text-black' : 'text-[#7b7b7b]',
    date: 'text-[#9a9a9a]',
  }
}

function PaymentMilestoneTimeline({ invoices, selectedInvoiceId = null, onSelect }) {
  return (
    <div className="relative px-1 pt-1">
      <span className="absolute left-5 right-5 top-2.5 h-px bg-[#d8d8d8]" />

      <div className="relative grid grid-cols-4 gap-2">
        {invoices.map((invoice) => {
          const active = selectedInvoiceId === invoice.id
          const tone = milestoneTone(invoice, active)

          return (
            <button
              key={invoice.id}
              type="button"
              onClick={() => onSelect(invoice)}
              className="flex min-w-0 flex-col items-center text-center"
            >
              <span className={`size-5 rounded-full border-2 ${tone.dot} ${tone.halo}`} />
              <span className={`typo-body-10 mt-4 block ${tone.label}`}>
                {invoice.title}
              </span>
              <span className={`typo-body-10 mt-1 block ${tone.date}`}>
                {milestoneDate(invoice)}
              </span>
            </button>
          )
        })}
      </div>
    </div>
  )
}

export default PaymentMilestoneTimeline
