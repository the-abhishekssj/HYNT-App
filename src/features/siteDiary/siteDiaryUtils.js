export const SITE_DIARY_BUCKETS = [
  { id: 'daily-log', label: 'Daily logs', icon: 'Log', empty: 'No daily logs yet.' },
  { id: 'progress-photo', label: 'Progress photos', icon: 'Photo', empty: 'No progress photos yet.' },
  { id: 'sourcing', label: 'Sourcing', icon: 'Source', empty: 'No sourcing updates yet.' },
]

export const ISSUE_STATUS_TONE = {
  open: 'bg-[#fdecea] text-[#c0392b]',
  'in-progress': 'bg-[#fef0e4] text-[#e07a2f]',
  resolved: 'bg-[#eaf3ee] text-[#2d6a4f]',
}

export const ISSUE_STATUS_LABEL = {
  open: 'Open',
  'in-progress': 'In progress',
  resolved: 'Resolved',
}

export const REFERENCE_STATUS_TONE = {
  new: 'bg-[#fff8e1] text-[#f59e0b]',
  reviewed: 'bg-[#eaf3ee] text-[#2d6a4f]',
}

export const REFERENCE_STATUS_LABEL = {
  new: 'New',
  reviewed: 'Reviewed',
}

export const formatDiaryDateLabel = (value) => new Date(value).toLocaleDateString('en-IN', {
  day: '2-digit',
  month: 'short',
  year: 'numeric',
})

export const formatDiaryTimeLabel = (value) => new Date(value).toLocaleTimeString('en-IN', {
  hour: '2-digit',
  minute: '2-digit',
  hour12: true,
})
