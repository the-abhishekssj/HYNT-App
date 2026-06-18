const historyDateFormatter = new Intl.DateTimeFormat('en-IN', {
  day: '2-digit',
  month: 'short',
  year: 'numeric',
})

export const formatBoqHistoryDate = (value) => {
  if (!value) return 'Signed'
  const date = new Date(value)
  return Number.isNaN(date.getTime()) ? 'Signed' : historyDateFormatter.format(date)
}
