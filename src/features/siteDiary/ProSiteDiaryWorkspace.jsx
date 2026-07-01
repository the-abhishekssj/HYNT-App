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
      actions={<button type="button" onClick={onCompose} className="grid size-9 place-items-center rounded-xl bg-black text-white" aria-label="Create diary log"><Plus size={18} /></button>}
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
    <div className="grid grid-cols-3 gap-2">
      {photoItems.map((item) => (
        <button
          key={item.id}
          type="button"
          onClick={() => onOpen(item.entryId)}
          className="relative aspect-square overflow-hidden rounded-[16px] border border-[#dfe6e1] bg-[#f5f7f5] text-left"
        >
          <img src={item.photo} alt={item.title} className="size-full object-cover" />
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
  const category = entry.tags[0] || 'Sourcing'

  return (
    <button type="button" onClick={() => onOpen(entry.id)} className="flex w-full gap-3 border-b border-[#e5e5e5] py-4 text-left last:border-b-0">
      <img src={thumbnail} alt={entry.title} className="size-14 shrink-0 rounded-[14px] border border-[#dde5df] object-cover" />
      <div className="min-w-0 flex-1">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <p className="typo-body-strong truncate text-black">{entry.title}</p>
            <p className="typo-meta mt-1 text-[#777]">{entry.createdBy} / {formatDiaryDateLabel(entry.createdAt)}</p>
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
        <span className={`typo-caption rounded-full px-2 py-1 ${ISSUE_STATUS_TONE[issue.status]}`}>{ISSUE_STATUS_LABEL[issue.status]}</span>
      </div>
      <div className="mt-4 flex flex-wrap gap-2">
        {['open', 'in-progress', 'resolved'].map((status) => (
          <button
            key={status}
            type="button"
            onClick={() => onUpdateStatus(issue.id, status)}
            className={`typo-caption rounded-full px-3 py-2 ${issue.status === status ? 'bg-black text-white' : 'border border-[#d8e2db] text-[#6f6f6f]'}`}
          >
            {ISSUE_STATUS_LABEL[status]}
          </button>
        ))}
      </div>
    </article>
  )
}

function ReferenceCard({ reference, replyDraft, onChangeReply, onReply }) {
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
            <span className={`typo-caption rounded-full px-2 py-1 ${REFERENCE_STATUS_TONE[reference.status]}`}>{REFERENCE_STATUS_LABEL[reference.status]}</span>
          </div>
          <p className="typo-body mt-2 text-[#202020]">{reference.note}</p>
          {reference.designerReply ? <p className="typo-caption mt-2 text-[#267449]">Reply: {reference.designerReply}</p> : null}
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

function EntryDetailSheet({ entry, issue, replyDrafts, onChangeReply, onReply, onClose }) {
  if (!entry) return null

  return (
    <div className="fixed bottom-0 left-1/2 z-[100] w-full max-w-[390px] -translate-x-1/2 rounded-t-[28px] border-t border-[#e0e0e0] bg-white px-4 pb-6 pt-4 shadow-[0_-8px_24px_rgba(0,0,0,0.08)]">
      <p className="typo-label uppercase text-[#7b7b7b]">Entry detail</p>
      <p className="typo-body-strong mt-1 text-black">{entry.title}</p>
      <p className="typo-meta mt-1 text-[#777]">{formatDiaryDateLabel(entry.createdAt)} / {formatDiaryTimeLabel(entry.createdAt)} / {entry.createdBy}</p>
      <p className="typo-body mt-3 text-[#202020]">{entry.note || 'Photo update shared from site.'}</p>
      {entry.photos.length ? (
        <div className="mt-4 grid grid-cols-3 gap-2">
          {entry.photos.map((photo, index) => <img key={`${photo}-${index}`} src={photo} alt="" className="aspect-square rounded-[14px] object-cover" />)}
        </div>
      ) : null}
      {issue ? <p className="typo-caption mt-4 text-[#e07a2f]">Issue: {issue.title}</p> : null}
      {(entry.clientComments || []).length ? (
        <div className="mt-4 border-t border-[#e5e5e5] pt-3">
          <p className="typo-label uppercase text-[#777]">Homeowner questions</p>
          {(entry.clientComments || []).map((comment) => (
            <div key={comment.id} className="border-b border-[#ededed] py-3 last:border-b-0">
              <p className="typo-body text-black">{comment.body}</p>
              {comment.designerReply ? (
                <p className="typo-caption mt-2 border-l-2 border-[#70b58d] pl-2 text-[#267449]">Your reply: {comment.designerReply}</p>
              ) : (
                <div className="mt-2 flex gap-2">
                  <input value={replyDrafts[comment.id] || ''} onChange={(event) => onChangeReply(comment.id, event.target.value)} placeholder="Reply to homeowner" className="typo-body h-10 min-w-0 flex-1 rounded-xl border border-[#d7d7d7] px-3 outline-none" />
                  <button type="button" onClick={() => onReply(comment.id)} disabled={!(replyDrafts[comment.id] || '').trim()} className="typo-body-strong rounded-xl bg-black px-4 text-white disabled:bg-[#d7d7d7]">Reply</button>
                </div>
              )}
            </div>
          ))}
        </div>
      ) : null}
      <button type="button" onClick={onClose} className="typo-body-strong mt-5 h-11 w-full rounded-[18px] border border-[#d8e2db] text-[#173324]">
        Close
      </button>
    </div>
  )
}

function ProSiteDiaryWorkspace({ project, onBack, onCreateTask }) {
  const { siteDiaryEntries, siteDiaryIssues, siteDiaryReferences, actions } = useSharedProject(project?.id || 'p-1')
  const [activeFolder, setActiveFolder] = useState('home')
  const [isComposerOpen, setIsComposerOpen] = useState(false)
  const [selectedEntryId, setSelectedEntryId] = useState(null)
  const [replyDrafts, setReplyDrafts] = useState({})
  const [commentReplyDrafts, setCommentReplyDrafts] = useState({})
  const [draft, setDraft] = useState({
    type: 'daily-log',
    title: '',
    note: '',
    weather: 'Sunny',
    workerCount: '4',
    tags: 'False ceiling, Lighting',
    photos: [mockPhotoOptions[0]],
    createIssue: false,
    issueTitle: '',
    issueNote: '',
    linkedTaskLabel: '',
    linkedExpenseLabel: '',
    shareWithClient: true,
  })

  const sortedEntries = useMemo(
    () => [...siteDiaryEntries].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()),
    [siteDiaryEntries],
  )
  const filteredEntries = useMemo(
    () => sortedEntries.filter((entry) => entry.type === activeFolder),
    [sortedEntries, activeFolder],
  )
  const selectedEntry = sortedEntries.find((entry) => entry.id === selectedEntryId) || null
  const selectedIssue = selectedEntry?.issueId ? siteDiaryIssues.find((issue) => issue.id === selectedEntry.issueId) || null : null
  const progressPhotoCount = sortedEntries.reduce((sum, entry) => sum + entry.photos.length, 0)
  const activeFolderPhotoCount = filteredEntries.reduce((sum, entry) => sum + entry.photos.length, 0)
  const sourcingCount = sortedEntries.filter((entry) => entry.type === 'sourcing').length
  const folderCountLabel = (bucketId) => {
    if (bucketId === 'progress-photo') {
      const photoCount = sortedEntries
        .filter((entry) => entry.type === bucketId)
        .reduce((sum, entry) => sum + entry.photos.length, 0)
      return `${photoCount} photo${photoCount === 1 ? '' : 's'}`
    }
    if (bucketId === 'sourcing') return `${sourcingCount} entries`
    return `${sortedEntries.filter((entry) => entry.type === bucketId).length} items`
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
      weather: draft.weather,
      workerCount: Number.parseInt(draft.workerCount, 10) || 0,
      tags,
      photos: draft.photos,
      linkedTaskLabel: draft.linkedTaskLabel || null,
      linkedExpenseLabel: draft.linkedExpenseLabel || null,
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

    setDraft({
      type: 'daily-log',
      title: '',
      note: '',
      weather: 'Sunny',
      workerCount: '4',
      tags: 'False ceiling, Lighting',
      photos: [mockPhotoOptions[0]],
      createIssue: false,
      issueTitle: '',
      issueNote: '',
      linkedTaskLabel: '',
      linkedExpenseLabel: '',
      shareWithClient: true,
    })
    setIsComposerOpen(false)
  }

  return (
    <main className="min-h-dvh w-full overflow-x-hidden bg-white font-['Urbanist'] text-black">
      <section className="mx-auto w-full max-w-[390px] pb-28 pt-16">
        <Header
          title={activeFolder === 'home' ? 'Site diary' : activeFolder === 'issues' ? 'Site issues' : activeFolder === 'references' ? 'Client references' : SITE_DIARY_BUCKETS.find((bucket) => bucket.id === activeFolder)?.label}
          subtitle={project?.scope || 'Site diary'}
          onBack={activeFolder === 'home' ? onBack : () => setActiveFolder('home')}
          onCompose={() => setIsComposerOpen(true)}
        />

        <div className="px-4 py-6">
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
              <div className="border-y border-[#e5e5e5]">
                {siteDiaryIssues.map((issue) => <IssueCard key={issue.id} issue={issue} onUpdateStatus={actions.updateSiteDiaryIssueStatus} />)}
              </div>
            </section>
          ) : null}

          {activeFolder !== 'home' && activeFolder !== 'issues' && (activeFolder === 'references' ? (
            <section className="py-5">
              <div className="mb-4 flex items-center justify-between">
                <p className="typo-section-title text-black">Client references</p>
                <span className="typo-caption text-[#7b7b7b]">{siteDiaryReferences.length} total</span>
              </div>
              <div className="border-y border-[#e5e5e5]">
                {siteDiaryReferences.map((reference) => (
                  <ReferenceCard
                    key={reference.id}
                    reference={reference}
                    replyDraft={replyDrafts[reference.id] || ''}
                    onChangeReply={(value) => setReplyDrafts((current) => ({ ...current, [reference.id]: value }))}
                    onReply={() => {
                      actions.replyToSiteDiaryReference(reference.id, replyDrafts[reference.id] || '')
                      setReplyDrafts((current) => ({ ...current, [reference.id]: '' }))
                    }}
                  />
                ))}
              </div>
            </section>
          ) : activeFolder === 'progress-photo' ? (
            <section className="py-5">
              <div className="mb-4 flex items-center justify-between">
                <p className="typo-section-title text-black">Progress photos</p>
                <span className="typo-caption text-[#7b7b7b]">{activeFolderPhotoCount} photos</span>
              </div>
              <ProgressPhotoGrid entries={filteredEntries} onOpen={setSelectedEntryId} />
            </section>
          ) : activeFolder === 'sourcing' ? (
            <section className="py-5">
              <div className="mb-4 flex items-center justify-between">
                <p className="typo-section-title text-black">Sourcing</p>
                <span className="typo-caption text-[#7b7b7b]">{filteredEntries.length} notes</span>
              </div>
              <div className="border-y border-[#e5e5e5]">
                {filteredEntries.length ? filteredEntries.map((entry) => (
                  <SourcingRow key={entry.id} entry={entry} onOpen={setSelectedEntryId} />
                )) : (
                  <p className="typo-body px-1 py-4 text-[#6f6f6f]">No sourcing updates yet.</p>
                )}
              </div>
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

      <EntryDetailSheet
        entry={selectedEntry}
        issue={selectedIssue}
        replyDrafts={commentReplyDrafts}
        onChangeReply={(commentId, value) => setCommentReplyDrafts((current) => ({ ...current, [commentId]: value }))}
        onReply={(commentId) => {
          actions.replyToSiteDiaryComment(selectedEntry.id, commentId, commentReplyDrafts[commentId] || '')
          setCommentReplyDrafts((current) => ({ ...current, [commentId]: '' }))
        }}
        onClose={() => setSelectedEntryId(null)}
      />
    </main>
  )
}

export default ProSiteDiaryWorkspace
