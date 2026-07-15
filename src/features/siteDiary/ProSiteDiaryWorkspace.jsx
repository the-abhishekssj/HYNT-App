import { useMemo, useState } from 'react'
import {
  Archive,
  Camera,
  CaretRight,
  ClipboardText,
  Images,
  Plus,
  WarningCircle,
} from '@phosphor-icons/react'
import Button from '../../components/ui/Button'
import { useSharedProject } from '../collaboration/mockProjectStore'
import ProjectWorkspaceHeader from '../shared/ProjectWorkspaceHeader'
import SiteDiaryComposer from './SiteDiaryComposer'
import {
  ISSUE_STATUS_LABEL,
  ISSUE_STATUS_TONE,
  REFERENCE_STATUS_LABEL,
  REFERENCE_STATUS_TONE,
  SITE_DIARY_BUCKETS,
  formatDiaryDateLabel,
  formatDiaryTimeLabel,
} from './siteDiaryUtils'

const mockPhotoOptions = ['/hynt-home/idea-1.png', '/hynt-home/idea-2.png', '/hynt-home/product.png']
const folderIcons = {
  'daily-log': ClipboardText,
  'progress-photo': Images,
  sourcing: Camera,
  references: Archive,
}

function Header({ title = 'Site diary', subtitle, onBack, onCompose }) {
  return (
    <ProjectWorkspaceHeader
      title={title}
      subtitle={subtitle}
      onBack={onBack}
      actions={onCompose ? <Button type="button" icon={Plus} onClick={onCompose} aria-label="Create diary log" /> : null}
    />
  )
}

function Metric({ value, label, tone = 'text-black' }) {
  return (
    <div className="border-r border-[#e5e5e5] px-3 text-left last:border-r-0 first:pl-0">
      <p className={`typo-card-title ${tone}`}>{value}</p>
      <p className="typo-caption mt-1 text-[#7b7b7b]">{label}</p>
    </div>
  )
}

function FolderCard({ id, label, count, onClick }) {
  const Icon = folderIcons[id] || ClipboardText
  return (
    <button type="button" onClick={onClick} className="flex min-h-28 flex-col justify-between rounded-[18px] border border-[#dce7df] px-3 py-3 text-left text-black">
      <div className="flex items-start justify-between">
        <span className="grid size-10 place-items-center rounded-xl bg-[#eaf6ef] text-[#28754b]"><Icon size={20} /></span>
        <CaretRight size={16} className="mt-2 text-[#8a9a90]" />
      </div>
      <div>
        <p className="typo-body-strong">{label}</p>
        <p className="typo-caption mt-1 text-[#7b7b7b]">{count}</p>
      </div>
    </button>
  )
}

function EntryCard({ entry, onOpen }) {
  return (
    <button type="button" onClick={() => onOpen(entry.id)} className="w-full border-b border-[#e5e5e5] py-4 text-left last:border-b-0">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <p className="typo-body-strong text-black">{entry.title}</p>
            {entry.issueId ? <WarningCircle size={14} weight="fill" className="text-[#e07a2f]" /> : null}
          </div>
          <p className="typo-meta mt-1 text-[#777]">{formatDiaryDateLabel(entry.createdAt)} / {formatDiaryTimeLabel(entry.createdAt)} / {entry.createdBy}</p>
          <p className="typo-body mt-2 text-[#202020]">{entry.note || 'Photo update shared from site.'}</p>
          <div className="mt-2 flex flex-wrap gap-2">
            {(entry.tags || []).slice(0, 3).map((tag) => (
              <span key={tag} className="typo-caption rounded-full border border-[#e5e5e5] px-2 py-1 text-[#6f6f6f]">{tag}</span>
            ))}
          </div>
        </div>
        <div className="shrink-0 text-right">
          <p className="typo-caption text-[#7b7b7b]">{entry.photos.length} photo{entry.photos.length === 1 ? '' : 's'}</p>
          <p className="typo-caption mt-2 text-[#7b7b7b]">{entry.workerCount} workers</p>
        </div>
      </div>
    </button>
  )
}

function ProgressPhotoGrid({ entries, onOpen }) {
  const photoItems = entries.flatMap((entry) => (
    (entry.photos || []).map((photo, index) => ({
      id: `${entry.id}-photo-${index}`,
      entryId: entry.id,
      photo,
      title: entry.title,
      createdAt: entry.createdAt,
      createdBy: entry.createdBy,
    }))
  ))

  if (!photoItems.length) {
    return <p className="typo-body px-1 py-4 text-[#6f6f6f]">No progress photos yet.</p>
  }

  return (
    <div className="columns-2 gap-3 [column-fill:_balance]">
      {photoItems.map((item, index) => (
        <button
          key={item.id}
          type="button"
          onClick={() => onOpen(item.entryId)}
          className="relative mb-3 block w-full break-inside-avoid overflow-hidden rounded-[22px] border border-[#dfe6e1] bg-[#f5f7f5] text-left"
        >
          <img src={item.photo} alt={item.title} className={`w-full object-cover ${index % 3 === 0 ? 'aspect-[4/5]' : 'aspect-square'}`} />
          <div className="absolute inset-x-0 bottom-0 bg-[rgba(0,0,0,0.52)] px-2 py-1.5 text-white">
            <p className="typo-caption truncate">{formatDiaryDateLabel(item.createdAt)}</p>
            <p className="typo-caption truncate text-white/80">{item.createdBy}</p>
          </div>
        </button>
      ))}
    </div>
  )
}

function SourcingRow({ entry, onOpen }) {
  const thumbnail = entry.photos[0] || '/hynt-home/product.png'
  const category = entry.category || entry.tags[0] || 'Sourcing'

  return (
    <button type="button" onClick={() => onOpen(entry.id)} className="flex w-full gap-3 border-b border-[#e5e5e5] py-4 text-left last:border-b-0">
      <img src={thumbnail} alt={entry.title} className="size-14 shrink-0 rounded-[14px] border border-[#dde5df] object-cover" />
      <div className="min-w-0 flex-1">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <p className="typo-body-strong truncate text-black">{entry.title}</p>
            <p className="typo-meta mt-1 text-[#777]">{entry.vendorLocation || entry.createdBy} / {formatDiaryDateLabel(entry.createdAt)}</p>
          </div>
          <span className="typo-caption shrink-0 rounded-full bg-[#fff5e9] px-2 py-1 text-[#a86a00]">{category}</span>
        </div>
        <p className="typo-body mt-2 line-clamp-2 text-[#202020]">{entry.note || 'Sourcing note shared from the field.'}</p>
      </div>
    </button>
  )
}

function IssueCard({ issue, onUpdateStatus }) {
  return (
    <article className="border-b border-[#e5e5e5] py-4 last:border-b-0">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="typo-body-strong text-black">{issue.title}</p>
          <p className="typo-meta mt-1 text-[#777]">{issue.reportedBy} / {formatDiaryDateLabel(issue.createdAt)}</p>
          <p className="typo-body mt-2 text-[#202020]">{issue.note}</p>
          {issue.linkedTaskLabel ? <p className="typo-caption mt-2 text-[#267449]">Linked task: {issue.linkedTaskLabel}</p> : null}
        </div>
        <span className={`typo-caption shrink-0 whitespace-nowrap rounded-full px-2 py-1 ${ISSUE_STATUS_TONE[issue.status]}`}>{ISSUE_STATUS_LABEL[issue.status]}</span>
      </div>
      <div className="mt-4 flex flex-wrap gap-2">
        {['open', 'in-progress', 'resolved'].map((status) => (
          <button
            key={status}
            type="button"
            onClick={() => onUpdateStatus(issue.id, status)}
            className={`typo-caption whitespace-nowrap rounded-full px-3 py-2 ${issue.status === status ? 'bg-black text-white' : 'border border-[#d8e2db] text-[#6f6f6f]'}`}
          >
            {ISSUE_STATUS_LABEL[status]}
          </button>
        ))}
      </div>
    </article>
  )
}

function ReferenceCard({ reference, replyDraft, onChangeReply, onReply, onSaveToMoodboard }) {
  return (
    <article className="border-b border-[#e5e5e5] py-4 last:border-b-0">
      <div className="flex gap-3">
        <img src={reference.image} alt={reference.title} className="size-16 rounded-[16px] object-cover" />
        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <p className="typo-body-strong text-black">{reference.title}</p>
              <p className="typo-meta mt-1 text-[#777]">{reference.createdBy} / {formatDiaryDateLabel(reference.createdAt)}</p>
            </div>
          </div>
          <p className="typo-body mt-2 text-[#202020]">{reference.note}</p>
          {reference.designerReply ? <p className="typo-caption mt-2 text-[#267449]">Reply: {reference.designerReply}</p> : null}
          <div className="mt-3 grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={onSaveToMoodboard}
              disabled={reference.savedToMoodboard}
              className="typo-caption h-9 rounded-[14px] bg-[#eaf8ef] px-3 text-[#267449] disabled:bg-[#f2f2f2] disabled:text-[#777]"
            >
              {reference.savedToMoodboard ? 'Saved to Moodboard' : 'Save to Moodboard'}
            </button>
            <span className={`typo-caption grid h-9 place-items-center rounded-[14px] ${REFERENCE_STATUS_TONE[reference.status]}`}>{REFERENCE_STATUS_LABEL[reference.status]}</span>
          </div>
          <div className="mt-3 flex items-center gap-2">
            <input value={replyDraft} onChange={(event) => onChangeReply(event.target.value)} placeholder="Reply to homeowner" className="typo-body h-10 min-w-0 flex-1 rounded-[14px] border border-[#d7d7d7] px-3 outline-none" />
            <button type="button" onClick={onReply} disabled={!replyDraft.trim()} className="typo-body-strong h-10 rounded-[14px] bg-black px-4 text-white disabled:bg-[#d9d9d9]">
              Reply
            </button>
          </div>
        </div>
      </div>
    </article>
  )
}

function CalendarLogView({ entries, onOpenDay }) {
  const referenceDate = entries[0]?.createdAt ? new Date(entries[0].createdAt) : new Date()
  const monthLabel = referenceDate.toLocaleDateString('en-IN', { month: 'long', year: 'numeric' })
  const daysInMonth = new Date(referenceDate.getFullYear(), referenceDate.getMonth() + 1, 0).getDate()
  const days = Array.from({ length: daysInMonth }, (_, index) => index + 1)
  const entriesByDay = new Map()
  entries.forEach((entry) => {
    const entryDate = new Date(entry.createdAt)
    if (entryDate.getMonth() !== referenceDate.getMonth() || entryDate.getFullYear() !== referenceDate.getFullYear()) return
    const day = entryDate.getDate()
    entriesByDay.set(day, [...(entriesByDay.get(day) || []), entry])
  })

  return (
    <div>
      <div className="mb-3 flex items-center justify-between">
        <span className="typo-caption text-[#7b7b7b]">{monthLabel}</span>
        <span className="typo-caption text-[#7b7b7b]">Issue days marked amber</span>
      </div>
      <div className="grid grid-cols-7 gap-1">
        {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((day, index) => (
          <span key={`${day}-${index}`} className="typo-caption py-1 text-center text-[#8a8a8a]">{day}</span>
        ))}
        {days.map((day) => {
          const dayEntries = entriesByDay.get(day) || []
          const hasIssue = dayEntries.some((entry) => entry.issueId)
          const hasEntries = dayEntries.length > 0
          return (
            <button
              key={day}
              type="button"
              disabled={!hasEntries}
              onClick={() => onOpenDay(dayEntries)}
              className={`typo-caption relative h-9 rounded-[12px] text-center disabled:text-[#cfd8d2] ${
                hasIssue ? 'bg-[#fef0e4] text-[#e07a2f]' : hasEntries ? 'bg-[#eaf3ee] text-[#267449]' : 'bg-transparent'
              }`}
            >
              {day}
              {hasEntries ? <span className={`absolute bottom-1 left-1/2 size-1 -translate-x-1/2 rounded-full ${hasIssue ? 'bg-[#e07a2f]' : 'bg-[#52b788]'}`} /> : null}
            </button>
          )
        })}
      </div>
    </div>
  )
}

function EntryDetailPage({ entry, issue, project, replyDrafts, onChangeReply, onReply, onBack }) {
  if (!entry) return null

  return (
    <main className="ui-screen-base ui-feature-surface min-h-dvh w-full overflow-x-hidden bg-white text-black">
      <section className="mx-auto w-full max-w-[390px] pb-10 pt-16">
        <Header title="Diary entry" subtitle={project?.scope || 'Site diary'} onBack={onBack} />

        <div className="ui-screen-content pt-5">
          <section className="border-b border-[#e5e5e5] pb-5">
            <p className="typo-caption uppercase text-[#7b7b7b]">Entry detail</p>
            <h1 className="typo-section-title mt-2 text-black">{entry.title}</h1>
            <p className="typo-body mt-2 text-[#5f7467]">{formatDiaryDateLabel(entry.createdAt)} / {formatDiaryTimeLabel(entry.createdAt)} / {entry.createdBy}</p>
            <p className="typo-body mt-4 text-[#202020]">{entry.note || 'Photo update shared from site.'}</p>
            <div className="mt-4 flex flex-wrap gap-2">
              {(entry.tags || []).map((tag) => (
                <span key={tag} className="typo-caption rounded-full border border-[#e5e5e5] px-2 py-1 text-[#6f6f6f]">{tag}</span>
              ))}
              <span className="typo-caption rounded-full bg-[#eaf3ee] px-2 py-1 text-[#267449]">{entry.workerCount} workers</span>
              <span className="typo-caption rounded-full bg-[#eef5ff] px-2 py-1 text-[#41658a]">{entry.weather}</span>
            </div>
          </section>

          {entry.photos.length ? (
            <section className="border-b border-[#e5e5e5] py-5">
              <div className="mb-3 flex items-center justify-between">
                <h2 className="typo-section-title text-black">Photos</h2>
                <span className="typo-caption text-[#7b7b7b]">{entry.photos.length} attached</span>
              </div>
              <div className="columns-2 gap-3">
                {entry.photos.map((photo, index) => (
                  <img key={`${photo}-${index}`} src={photo} alt="" className={`mb-3 w-full break-inside-avoid rounded-[22px] object-cover ${index % 2 === 0 ? 'aspect-[4/5]' : 'aspect-square'}`} />
                ))}
              </div>
            </section>
          ) : null}

          {issue ? (
            <section className="border-b border-[#e5e5e5] py-5">
              <h2 className="typo-section-title text-black">Linked issue</h2>
              <p className="typo-body-strong mt-3 text-[#c0392b]">{issue.title}</p>
              <p className="typo-body mt-1 text-[#5f7467]">{issue.note || 'No issue note added.'}</p>
            </section>
          ) : null}

          <section className="py-5">
            <div className="mb-3 flex items-center justify-between">
              <h2 className="typo-section-title text-black">Homeowner questions</h2>
              <span className="typo-caption text-[#7b7b7b]">{(entry.clientComments || []).length} total</span>
            </div>
            <div className="border-y border-[#e5e5e5]">
              {(entry.clientComments || []).length ? (entry.clientComments || []).map((comment) => (
                <div key={comment.id} className="border-b border-[#ededed] py-3 last:border-b-0">
                  <p className="typo-body text-black">{comment.body}</p>
                  {comment.designerReply ? (
                    <p className="typo-caption mt-2 border-l-2 border-[#70b58d] pl-2 text-[#267449]">Your reply: {comment.designerReply}</p>
                  ) : (
                    <div className="mt-2 flex gap-2">
                      <input value={replyDrafts[comment.id] || ''} onChange={(event) => onChangeReply(comment.id, event.target.value)} placeholder="Reply to homeowner" className="typo-body h-10 min-w-0 flex-1 rounded-xl border border-[#d7d7d7] px-3 outline-none" />
                      <Button type="button" size="small" onClick={() => onReply(comment.id)} disabled={!(replyDrafts[comment.id] || '').trim()}>
                        Reply
                      </Button>
                    </div>
                  )}
                </div>
              )) : (
                <p className="typo-body py-4 text-[#6f6f6f]">No homeowner questions on this entry.</p>
              )}
            </div>
          </section>
        </div>
      </section>
    </main>
  )
}

function DayEntriesPage({ project, dateLabel, entries, onBack, onOpenEntry }) {
  return (
    <main className="ui-screen-base ui-feature-surface min-h-dvh w-full overflow-x-hidden bg-white text-black">
      <section className="mx-auto w-full max-w-[390px] pb-10 pt-16">
        <Header title="Day entries" subtitle={dateLabel || project?.scope || 'Site diary'} onBack={onBack} />
        <div className="ui-screen-content pt-5">
          <div className="mb-4 flex items-center justify-between">
            <h1 className="typo-section-title text-black">{dateLabel}</h1>
            <span className="typo-caption text-[#7b7b7b]">{entries.length} entries</span>
          </div>
          <div className="border-y border-[#e5e5e5]">
            {entries.map((entry) => (
              <EntryCard key={entry.id} entry={entry} onOpen={onOpenEntry} />
            ))}
          </div>
        </div>
      </section>
    </main>
  )
}

function createDefaultDraft(type = 'daily-log') {
  const today = new Date().toISOString().slice(0, 10)
  return {
    type,
    date: today,
    title: type === 'sourcing' ? '' : '',
    note: '',
    weather: 'Sunny',
    workerCount: type === 'sourcing' ? '0' : '4',
    tags: type === 'sourcing' ? 'Sourcing' : 'False ceiling, Lighting',
    photos: [mockPhotoOptions[0]],
    createIssue: false,
    issueTitle: '',
    issueNote: '',
    linkedTaskLabel: '',
    linkedExpenseLabel: '',
    shareWithClient: type !== 'sourcing',
    vendorLocation: '',
    category: type === 'sourcing' ? 'Furniture' : '',
  }
}

function ProSiteDiaryWorkspace({ project, onBack, onCreateTask }) {
  const { siteDiaryEntries, siteDiaryIssues, siteDiaryReferences, actions } = useSharedProject(project?.id || 'p-1')
  const [activeFolder, setActiveFolder] = useState('home')
  const [isComposerOpen, setIsComposerOpen] = useState(false)
  const [selectedEntryId, setSelectedEntryId] = useState(null)
  const [selectedDayEntryIds, setSelectedDayEntryIds] = useState([])
  const [replyDrafts, setReplyDrafts] = useState({})
  const [commentReplyDrafts, setCommentReplyDrafts] = useState({})
  const [logView, setLogView] = useState('feed')
  const [logFilter, setLogFilter] = useState('all')
  const [issueFilter, setIssueFilter] = useState('open')
  const [draft, setDraft] = useState(() => createDefaultDraft())

  const sortedEntries = useMemo(
    () => [...siteDiaryEntries].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()),
    [siteDiaryEntries],
  )
  const filteredEntries = useMemo(
    () => sortedEntries.filter((entry) => entry.type === activeFolder),
    [sortedEntries, activeFolder],
  )
  const dailyLogEntries = useMemo(
    () => sortedEntries.filter((entry) => entry.type === 'daily-log'),
    [sortedEntries],
  )
  const visibleDailyLogEntries = useMemo(() => {
    if (logFilter === 'mine') {
      return dailyLogEntries.filter((entry) => entry.createdBy === (project?.designerName || 'Riya Desai'))
    }
    if (logFilter === 'team') {
      return dailyLogEntries.filter((entry) => entry.createdBy !== (project?.designerName || 'Riya Desai'))
    }
    return dailyLogEntries
  }, [dailyLogEntries, logFilter, project?.designerName])
  const progressPhotoEntries = useMemo(
    () => sortedEntries.filter((entry) => entry.photos.length && entry.type !== 'sourcing'),
    [sortedEntries],
  )
  const selectedEntry = sortedEntries.find((entry) => entry.id === selectedEntryId) || null
  const selectedDayEntries = selectedDayEntryIds
    .map((entryId) => sortedEntries.find((entry) => entry.id === entryId))
    .filter(Boolean)
  const selectedDayLabel = selectedDayEntries[0] ? formatDiaryDateLabel(selectedDayEntries[0].createdAt) : ''
  const selectedIssue = selectedEntry?.issueId ? siteDiaryIssues.find((issue) => issue.id === selectedEntry.issueId) || null : null
  const progressPhotoCount = progressPhotoEntries.reduce((sum, entry) => sum + entry.photos.length, 0)
  const sourcingCount = sortedEntries.filter((entry) => entry.type === 'sourcing').length
  const issueTabs = [
    ['open', 'Open'],
    ['in-progress', 'In progress'],
    ['resolved', 'Resolved'],
  ]
  const visibleIssues = siteDiaryIssues.filter((issue) => issue.status === issueFilter)
  const folderCountLabel = (bucketId) => {
    if (bucketId === 'progress-photo') {
      return `${progressPhotoCount} photo${progressPhotoCount === 1 ? '' : 's'}`
    }
    if (bucketId === 'sourcing') return `${sourcingCount} entries`
    return `${sortedEntries.filter((entry) => entry.type === bucketId).length} items`
  }

  const openComposer = (type = null) => {
    const nextType = type || (activeFolder === 'sourcing' ? 'sourcing' : activeFolder === 'progress-photo' ? 'progress-photo' : 'daily-log')
    setDraft(createDefaultDraft(nextType))
    setIsComposerOpen(true)
  }

  const saveEntry = () => {
    const tags = draft.tags.split(',').map((tag) => tag.trim()).filter(Boolean)
    const linkToken = `${Date.now()}-${Math.random().toString(16).slice(2)}`
    const entryId = `diary-${linkToken}`
    const issueId = draft.createIssue && draft.issueTitle.trim() ? `issue-${linkToken}` : null
    const issuePayload = draft.createIssue && draft.issueTitle.trim()
      ? { id: issueId, title: draft.issueTitle, note: draft.issueNote, linkedTaskLabel: draft.issueTitle.trim() }
      : null

    actions.addSiteDiaryEntry({
      id: entryId,
      type: draft.type,
      title: draft.title,
      note: draft.note,
      createdAt: draft.date ? new Date(`${draft.date}T09:00:00`).toISOString() : null,
      weather: draft.weather,
      workerCount: Number.parseInt(draft.workerCount, 10) || 0,
      tags,
      photos: draft.photos,
      linkedTaskLabel: draft.linkedTaskLabel || null,
      linkedExpenseLabel: draft.linkedExpenseLabel || null,
      vendorLocation: draft.vendorLocation || '',
      category: draft.category || '',
      issue: issuePayload,
      createdBy: project?.designerName || 'Riya Desai',
      shareWithClient: draft.shareWithClient !== false,
    })

    if (issuePayload) {
      onCreateTask?.({
        title: issuePayload.title,
        note: issuePayload.note,
        sourceEntryId: entryId,
        sourceIssueId: issueId,
        sourceLabel: draft.title.trim() || 'Site update',
      })
    }

    setDraft(createDefaultDraft())
    setIsComposerOpen(false)
  }

  const openCalendarDay = (entries) => {
    if (entries.length === 1) {
      setSelectedEntryId(entries[0].id)
      return
    }
    setSelectedDayEntryIds(entries.map((entry) => entry.id))
  }

  if (selectedEntry) {
    return (
      <EntryDetailPage
        entry={selectedEntry}
        issue={selectedIssue}
        project={project}
        replyDrafts={commentReplyDrafts}
        onChangeReply={(commentId, value) => setCommentReplyDrafts((current) => ({ ...current, [commentId]: value }))}
        onReply={(commentId) => {
          actions.replyToSiteDiaryComment(selectedEntry.id, commentId, commentReplyDrafts[commentId] || '')
          setCommentReplyDrafts((current) => ({ ...current, [commentId]: '' }))
        }}
        onBack={() => setSelectedEntryId(null)}
      />
    )
  }

  if (selectedDayEntries.length) {
    return (
      <DayEntriesPage
        project={project}
        dateLabel={selectedDayLabel}
        entries={selectedDayEntries}
        onBack={() => setSelectedDayEntryIds([])}
        onOpenEntry={(entryId) => setSelectedEntryId(entryId)}
      />
    )
  }

  return (
    <main className="ui-screen-base ui-feature-surface min-h-dvh w-full overflow-x-hidden bg-white text-black">
      <section className="mx-auto w-full max-w-[390px] pb-28 pt-16">
        <Header
          title={activeFolder === 'home' ? 'Site diary' : activeFolder === 'issues' ? 'Site issues' : activeFolder === 'references' ? 'Client references' : SITE_DIARY_BUCKETS.find((bucket) => bucket.id === activeFolder)?.label}
          subtitle={project?.scope || 'Site diary'}
          onBack={activeFolder === 'home' ? onBack : () => setActiveFolder('home')}
          onCompose={activeFolder === 'references' ? null : () => openComposer()}
        />

        <div className="ui-screen-content">
          {activeFolder === 'home' ? (
            <>
          <section className="border-b border-[#e5e5e5] pb-5">
            <div className="grid grid-cols-4">
              <Metric value={siteDiaryEntries.length} label="Logs" tone="text-[#267449]" />
              <Metric value={siteDiaryIssues.filter((issue) => issue.status !== 'resolved').length} label="Open issues" tone="text-[#e07a2f]" />
              <Metric value={progressPhotoCount} label="Photos" tone="text-[#267449]" />
              <Metric value={siteDiaryReferences.filter((reference) => reference.status === 'new').length} label="New refs" tone="text-[#f59e0b]" />
            </div>
          </section>

          <section className="border-b border-[#e5e5e5] py-5">
            <div className="mb-4 flex items-center justify-between">
              <p className="typo-section-title text-black">Folders</p>
              <span className="typo-caption text-[#7b7b7b]">Module home</span>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {SITE_DIARY_BUCKETS.map((bucket) => (
                <FolderCard
                  key={bucket.id}
                  id={bucket.id}
                  label={bucket.label}
                  count={folderCountLabel(bucket.id)}
                  onClick={() => setActiveFolder(bucket.id)}
                />
              ))}
              <FolderCard
                id="references"
                label="Client references"
                count={`${siteDiaryReferences.length} shared`}
                onClick={() => setActiveFolder('references')}
              />
            </div>
          </section>

            <section className="border-b border-[#e5e5e5] py-5">
              <button type="button" onClick={() => setActiveFolder('issues')} className="mb-4 flex w-full items-center justify-between text-left">
                <p className="typo-section-title text-black">Open issues</p>
                <span className="flex items-center gap-1 typo-caption text-[#7b7b7b]">View all <CaretRight size={14} /></span>
              </button>
              <div className="border-y border-[#e5e5e5]">
                {siteDiaryIssues.filter((issue) => issue.status !== 'resolved').length ? siteDiaryIssues.filter((issue) => issue.status !== 'resolved').slice(0, 2).map((issue) => (
                  <IssueCard key={issue.id} issue={issue} onUpdateStatus={actions.updateSiteDiaryIssueStatus} />
                )) : (
                  <p className="typo-body px-1 py-4 text-[#6f6f6f]">No active issues right now.</p>
                )}
              </div>
            </section>
            </>
          ) : activeFolder === 'issues' ? (
            <section>
              <div className="mb-4 flex items-center justify-between">
                <p className="typo-section-title text-black">Tracked issues</p>
                <span className="typo-caption text-[#7b7b7b]">{siteDiaryIssues.length} total</span>
              </div>
              <div className="mb-4 grid grid-cols-3 gap-1 rounded-[18px] bg-[#f2f6f3] p-1">
                {issueTabs.map(([status, label]) => (
                  <button
                    key={status}
                    type="button"
                    onClick={() => setIssueFilter(status)}
                    className={`typo-caption min-h-9 rounded-[14px] px-2 uppercase ${issueFilter === status ? 'bg-black text-white' : 'text-[#65766c]'}`}
                  >
                    {label}
                  </button>
                ))}
              </div>
              <div className="border-y border-[#e5e5e5]">
                {visibleIssues.length ? visibleIssues.map((issue) => <IssueCard key={issue.id} issue={issue} onUpdateStatus={actions.updateSiteDiaryIssueStatus} />) : (
                  <p className="typo-body px-1 py-4 text-[#6f6f6f]">No {ISSUE_STATUS_LABEL[issueFilter].toLowerCase()} issues.</p>
                )}
              </div>
            </section>
          ) : null}

          {activeFolder !== 'home' && activeFolder !== 'issues' && (activeFolder === 'references' ? (
            <section className="py-5">
              <div className="mb-4 flex items-center justify-between">
                <p className="typo-section-title text-black">Client references</p>
                <span className="typo-caption text-[#7b7b7b]">{siteDiaryReferences.length} total</span>
              </div>
              <div className="mb-4 rounded-[20px] bg-[#eaf3ee] px-4 py-3">
                <p className="typo-body text-[#267449]">Homeowner references can be acknowledged here or saved directly into the project Moodboard.</p>
              </div>
              <div className="border-y border-[#e5e5e5]">
                {siteDiaryReferences.filter((reference) => reference.status === 'new').length ? (
                  <div className="border-b border-[#e5e5e5] py-3 last:border-b-0">
                    <p className="typo-caption mb-2 uppercase text-[#f59e0b]">New</p>
                    {siteDiaryReferences.filter((reference) => reference.status === 'new').map((reference) => (
                      <ReferenceCard
                        key={reference.id}
                        reference={reference}
                        replyDraft={replyDrafts[reference.id] || ''}
                        onChangeReply={(value) => setReplyDrafts((current) => ({ ...current, [reference.id]: value }))}
                        onReply={() => {
                          actions.replyToSiteDiaryReference(reference.id, replyDrafts[reference.id] || '')
                          setReplyDrafts((current) => ({ ...current, [reference.id]: '' }))
                        }}
                        onSaveToMoodboard={() => actions.saveSiteDiaryReferenceToMoodboard(reference.id)}
                      />
                    ))}
                  </div>
                ) : null}
                {siteDiaryReferences.filter((reference) => reference.status !== 'new').length ? (
                  <div className="py-3">
                    <p className="typo-caption mb-2 uppercase text-[#7b7b7b]">Earlier</p>
                    {siteDiaryReferences.filter((reference) => reference.status !== 'new').map((reference) => (
                      <ReferenceCard
                        key={reference.id}
                        reference={reference}
                        replyDraft={replyDrafts[reference.id] || ''}
                        onChangeReply={(value) => setReplyDrafts((current) => ({ ...current, [reference.id]: value }))}
                        onReply={() => {
                          actions.replyToSiteDiaryReference(reference.id, replyDrafts[reference.id] || '')
                          setReplyDrafts((current) => ({ ...current, [reference.id]: '' }))
                        }}
                        onSaveToMoodboard={() => actions.saveSiteDiaryReferenceToMoodboard(reference.id)}
                      />
                    ))}
                  </div>
                ) : null}
              </div>
            </section>
          ) : activeFolder === 'progress-photo' ? (
            <section className="py-5">
              <div className="mb-4 flex items-center justify-between">
                <p className="typo-section-title text-black">Progress photos</p>
                <Button type="button" size="small" onClick={() => openComposer('progress-photo')}>
                  Upload
                </Button>
              </div>
              <div className="mb-4 rounded-[20px] bg-[#eaf3ee] px-4 py-3">
                <p className="typo-body text-[#267449]">Photos from daily logs appear here automatically. Team can also upload directly.</p>
              </div>
              <ProgressPhotoGrid entries={progressPhotoEntries} onOpen={setSelectedEntryId} />
            </section>
          ) : activeFolder === 'sourcing' ? (
            <section className="py-5">
              <div className="mb-4 flex items-center justify-between">
                <p className="typo-section-title text-black">Sourcing</p>
                <Button type="button" size="small" onClick={() => openComposer('sourcing')}>
                  Add photo
                </Button>
              </div>
              <div className="mb-4 rounded-[20px] bg-[#fff8e1] px-4 py-3">
                <p className="typo-body text-[#9a6700]">Private team-only vendor and market references. Client cannot see this folder.</p>
              </div>
              <div className="border-y border-[#e5e5e5]">
                {filteredEntries.length ? filteredEntries.map((entry) => (
                  <SourcingRow key={entry.id} entry={entry} onOpen={setSelectedEntryId} />
                )) : (
                  <p className="typo-body px-1 py-4 text-[#6f6f6f]">No sourcing updates yet.</p>
                )}
              </div>
            </section>
          ) : activeFolder === 'daily-log' ? (
            <section className="py-5">
              <div className="mb-4 grid grid-cols-2 gap-1 rounded-[18px] bg-[#f2f6f3] p-1">
                {[
                  ['feed', 'Feed'],
                  ['calendar', 'Calendar'],
                ].map(([view, label]) => (
                  <button
                    key={view}
                    type="button"
                    onClick={() => setLogView(view)}
                    className={`typo-caption min-h-9 rounded-[14px] uppercase ${logView === view ? 'bg-black text-white' : 'text-[#65766c]'}`}
                  >
                    {label}
                  </button>
                ))}
              </div>
              <div className="mb-4 flex gap-2 overflow-x-auto pb-1">
                {[
                  ['all', 'All'],
                  ['mine', 'My entries'],
                  ['team', 'Team'],
                ].map(([filter, label]) => (
                  <button
                    key={filter}
                    type="button"
                    onClick={() => setLogFilter(filter)}
                    className={`typo-caption shrink-0 rounded-full px-3 py-1.5 ${logFilter === filter ? 'bg-[#eaf3ee] text-[#267449]' : 'text-[#6f6f6f]'}`}
                  >
                    {label}
                  </button>
                ))}
              </div>
              {logView === 'calendar' ? (
                <CalendarLogView entries={visibleDailyLogEntries} onOpenDay={openCalendarDay} />
              ) : (
                <div className="border-y border-[#e5e5e5]">
                  {visibleDailyLogEntries.length ? visibleDailyLogEntries.map((entry) => (
                    <EntryCard key={entry.id} entry={entry} onOpen={setSelectedEntryId} />
                  )) : (
                    <p className="typo-body px-1 py-4 text-[#6f6f6f]">No daily logs in this filter.</p>
                  )}
                </div>
              )}
            </section>
          ) : (
            <section className="py-5">
              <div className="mb-4 flex items-center justify-between">
                <p className="typo-section-title text-black">{SITE_DIARY_BUCKETS.find((bucket) => bucket.id === activeFolder)?.label || 'Entries'}</p>
                <span className="typo-caption text-[#7b7b7b]">{filteredEntries.length} items</span>
              </div>
              <div className="border-y border-[#e5e5e5]">
                {filteredEntries.length ? filteredEntries.map((entry) => (
                  <EntryCard key={entry.id} entry={entry} onOpen={setSelectedEntryId} />
                )) : (
                  <p className="typo-body px-1 py-4 text-[#6f6f6f]">{SITE_DIARY_BUCKETS.find((bucket) => bucket.id === activeFolder)?.empty}</p>
                )}
              </div>
            </section>
          ))}
        </div>
      </section>

      {isComposerOpen ? (
        <SiteDiaryComposer
          draft={draft}
          photoOptions={mockPhotoOptions}
          onChange={(patch) => setDraft((current) => ({ ...current, ...patch }))}
          onClose={() => setIsComposerOpen(false)}
          onSave={saveEntry}
        />
      ) : null}

    </main>
  )
}

export default ProSiteDiaryWorkspace
