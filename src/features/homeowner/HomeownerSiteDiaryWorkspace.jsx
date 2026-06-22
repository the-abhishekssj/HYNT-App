import { useMemo, useState } from 'react'
import {
  CaretRight,
  ClipboardText,
  Images,
  PaperPlaneTilt,
  UploadSimple,
} from '@phosphor-icons/react'
import { useSharedProject } from '../collaboration/mockProjectStore'
import ProjectWorkspaceHeader from '../shared/ProjectWorkspaceHeader'
import {
  ISSUE_STATUS_LABEL,
  ISSUE_STATUS_TONE,
  REFERENCE_STATUS_LABEL,
  REFERENCE_STATUS_TONE,
  SITE_DIARY_BUCKETS,
  formatDiaryDateLabel,
  formatDiaryTimeLabel,
} from '../siteDiary/siteDiaryUtils'

const referenceImageOptions = ['/hynt-home/idea-1.png', '/hynt-home/idea-2.png', '/hynt-home/product.png']

function Header({ title, subtitle, onBack }) {
  return <ProjectWorkspaceHeader title={title} subtitle={subtitle} onBack={onBack} />
}

function Metric({ value, label, tone = 'text-black' }) {
  return (
    <div className="border-r border-[#e5e5e5] px-3 text-left last:border-r-0 first:pl-0">
      <p className={`type-card-title ${tone}`}>{value}</p>
      <p className="type-caption mt-1 text-[#7b7b7b]">{label}</p>
    </div>
  )
}

function HomeFolder({ icon: Icon, title, meta, onClick }) {
  return (
    <button type="button" onClick={onClick} className="flex min-h-28 flex-col justify-between rounded-[18px] border border-[#dce7df] p-3 text-left">
      <div className="flex items-start justify-between">
        <span className="grid size-10 place-items-center rounded-xl bg-[#eaf6ef] text-[#28754b]"><Icon size={20} /></span>
        <CaretRight size={16} className="mt-2 text-[#8a9a90]" />
      </div>
      <div>
        <p className="type-body-strong text-black">{title}</p>
        <p className="type-caption mt-1 text-[#777]">{meta}</p>
      </div>
    </button>
  )
}

function FilterChip({ label, selected, onClick }) {
  return (
    <button type="button" onClick={onClick} className={`type-caption rounded-full px-3 py-2 ${selected ? 'bg-black text-white' : 'border border-[#d8e2db] text-[#6f6f6f]'}`}>
      {label}
    </button>
  )
}

function DiaryRow({ entry, onOpen }) {
  return (
    <button type="button" onClick={() => onOpen(entry.id)} className="w-full border-b border-[#e5e5e5] py-4 text-left last:border-b-0">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="type-body-strong text-black">{entry.title}</p>
          <p className="type-meta mt-1 text-[#777]">{formatDiaryDateLabel(entry.createdAt)} / {formatDiaryTimeLabel(entry.createdAt)}</p>
          <p className="type-body mt-2 text-[#202020]">{entry.note || 'Photo update shared from site.'}</p>
          <div className="mt-2 flex flex-wrap gap-2">
            {(entry.tags || []).slice(0, 3).map((tag) => (
              <span key={tag} className="type-caption rounded-full border border-[#e5e5e5] px-2 py-1 text-[#6f6f6f]">{tag}</span>
            ))}
          </div>
        </div>
        <div className="shrink-0 text-right">
          <p className="type-caption text-[#7b7b7b]">{entry.photos.length} photo{entry.photos.length === 1 ? '' : 's'}</p>
          {entry.clientReviewedAt ? <p className="type-caption mt-2 text-[#267449]">Reviewed</p> : null}
        </div>
      </div>
    </button>
  )
}

function IssueRow({ issue }) {
  return (
    <article className="border-b border-[#e5e5e5] py-4 last:border-b-0">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="type-body-strong text-black">{issue.title}</p>
          <p className="type-meta mt-1 text-[#777]">{issue.reportedBy} / {formatDiaryDateLabel(issue.createdAt)}</p>
          <p className="type-body mt-2 text-[#202020]">{issue.note}</p>
        </div>
        <span className={`type-caption rounded-full px-2 py-1 ${ISSUE_STATUS_TONE[issue.status]}`}>{ISSUE_STATUS_LABEL[issue.status]}</span>
      </div>
    </article>
  )
}

function ReferenceRow({ reference }) {
  return (
    <article className="border-b border-[#e5e5e5] py-4 last:border-b-0">
      <div className="flex gap-3">
        <img src={reference.image} alt={reference.title} className="size-16 rounded-[16px] object-cover" />
        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <p className="type-body-strong text-black">{reference.title}</p>
              <p className="type-meta mt-1 text-[#777]">{formatDiaryDateLabel(reference.createdAt)}</p>
            </div>
            <span className={`type-caption rounded-full px-2 py-1 ${REFERENCE_STATUS_TONE[reference.status]}`}>{REFERENCE_STATUS_LABEL[reference.status]}</span>
          </div>
          <p className="type-body mt-2 text-[#202020]">{reference.note}</p>
          {reference.designerReply ? <p className="type-caption mt-2 text-[#267449]">Reply: {reference.designerReply}</p> : null}
        </div>
      </div>
    </article>
  )
}

function ProgressPhotoGrid({ entries, onOpen }) {
  const photoItems = entries.flatMap((entry) => (
    (entry.photos || []).map((photo, index) => ({
      id: `${entry.id}-photo-${index}`,
      entryId: entry.id,
      photo,
      createdAt: entry.createdAt,
      title: entry.title,
    }))
  ))

  if (!photoItems.length) {
    return <p className="type-body px-1 py-4 text-[#6f6f6f]">No progress photos shared yet.</p>
  }

  return (
    <div className="grid grid-cols-3 gap-2">
      {photoItems.map((item) => (
        <button
          key={item.id}
          type="button"
          onClick={() => onOpen(item.entryId)}
          className="relative aspect-square overflow-hidden rounded-[16px] border border-[#dde5df] bg-[#f5f7f5] text-left"
        >
          <img src={item.photo} alt={item.title} className="size-full object-cover" />
          <span className="absolute bottom-1.5 left-1.5 rounded-full bg-[rgba(0,0,0,0.58)] px-2 py-1 text-[10px] font-semibold leading-none text-white">
            {formatDiaryDateLabel(item.createdAt)}
          </span>
        </button>
      ))}
    </div>
  )
}

function EntryDetail({ entry, project, commentDraft, onChangeComment, onSendComment, onToggleReviewed, onBack }) {
  const entryComments = entry.clientComments || []

  return (
    <main className="min-h-dvh w-full overflow-x-hidden bg-white font-['Urbanist'] text-black">
      <section className="mx-auto w-full max-w-[390px] pb-10 pt-16">
        <Header title="Diary update" subtitle={formatDiaryDateLabel(entry.createdAt)} onBack={onBack} />

        <section className="border-b border-[#e5e5e5] px-4 py-5">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="type-caption uppercase text-[#267449]">Shared from site</p>
              <p className="type-body mt-2 text-[#5f7467]">{formatDiaryTimeLabel(entry.createdAt)} by {entry.createdBy || `${project.designerName}'s team`}</p>
            </div>
            <button
              type="button"
              onClick={() => onToggleReviewed(entry.id)}
              className={`type-body-strong h-10 rounded-[16px] px-4 ${entry.clientReviewedAt ? 'bg-[#eaf8ef] text-[#267449]' : 'border border-[#d8e2db] text-[#173324]'}`}
            >
              {entry.clientReviewedAt ? 'Reviewed' : 'Mark reviewed'}
            </button>
          </div>
          <p className="type-body mt-4 text-black">{entry.note || 'Photo update shared from site.'}</p>
          <div className="mt-3 flex flex-wrap gap-2">
            {(entry.tags || []).map((tag) => (
              <span key={tag} className="type-caption rounded-full border border-[#e5e5e5] px-2 py-1 text-[#6f6f6f]">{tag}</span>
            ))}
          </div>
        </section>

        {entry.photos.length ? (
          <section className="px-4 py-5">
            <div className="mb-3 flex items-center justify-between">
              <h2 className="type-section-title text-black">Photos</h2>
              <span className="type-caption text-[#7b7b7b]">{entry.photos.length} shared</span>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {entry.photos.map((photo, index) => (
                <img key={`${entry.id}-${photo}-${index}`} src={photo} alt="Site diary" className="aspect-[4/4.3] w-full rounded-[18px] object-cover" />
              ))}
            </div>
          </section>
        ) : null}

        <section className="px-4 py-1">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="type-section-title text-black">Questions and notes</h2>
            <span className="type-caption text-[#7b7b7b]">{entryComments.length} sent</span>
          </div>
          <div className="border-y border-[#e5e5e5]">
            {entryComments.length ? (
              entryComments.map((comment, index) => (
                <div key={comment.id || `${entry.id}-comment-${index}`} className="border-b border-[#e5e5e5] py-4 last:border-b-0">
                  <div className="flex items-center justify-between gap-3">
                    <p className="type-caption uppercase text-[#7b7b7b]">You asked</p>
                    <p className="type-meta text-[#8a8a8a]">{formatDiaryDateLabel(comment.createdAt)}</p>
                  </div>
                  <p className="type-body mt-1 text-black">{comment.body || comment}</p>
                  {comment.designerReply ? <p className="type-caption mt-2 border-l-2 border-[#70b58d] pl-2 text-[#267449]">Designer replied: {comment.designerReply}</p> : null}
                </div>
              ))
            ) : (
              <div className="py-4">
                <p className="type-body text-[#6f6f6f]">Ask about workmanship, progress, or what happens next on site.</p>
              </div>
            )}
          </div>

          <div className="mt-4 flex items-center gap-2">
            <input
              value={commentDraft}
              onChange={(event) => onChangeComment(event.target.value)}
              placeholder="Ask about this update"
              className="type-body h-10 min-w-0 flex-1 rounded-[14px] border border-[#d7d7d7] px-3 outline-none"
            />
            <button
              type="button"
              onClick={onSendComment}
              disabled={!commentDraft.trim()}
              className="grid size-10 shrink-0 place-items-center rounded-[14px] bg-black text-white disabled:bg-[#d9d9d9]"
              aria-label="Send site diary question"
            >
              <PaperPlaneTilt size={16} />
            </button>
          </div>
        </section>
      </section>
    </main>
  )
}

function HomeownerSiteDiaryWorkspace({ onBack }) {
  const { project, siteDiaryEntries: allSiteDiaryEntries, siteDiaryIssues, siteDiaryReferences, actions } = useSharedProject('p-1')
  const siteDiaryEntries = useMemo(
    () => allSiteDiaryEntries.filter((entry) => entry.shareWithClient !== false),
    [allSiteDiaryEntries],
  )
  const [selectedEntryId, setSelectedEntryId] = useState(null)
  const [activeView, setActiveView] = useState('home')
  const [commentDrafts, setCommentDrafts] = useState({})
  const [referenceDraft, setReferenceDraft] = useState({ title: '', note: '', image: referenceImageOptions[0] })

  const sortedEntries = useMemo(
    () => [...siteDiaryEntries].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()),
    [siteDiaryEntries],
  )
  const latestEntry = sortedEntries[0] || null
  const selectedEntry = sortedEntries.find((entry) => entry.id === selectedEntryId) || null
  const filteredEntries = useMemo(
    () => sortedEntries.filter((entry) => entry.type === activeView),
    [sortedEntries, activeView],
  )
  const photoCount = sortedEntries.reduce((sum, entry) => sum + entry.photos.length, 0)
  const filteredPhotoCount = filteredEntries.reduce((sum, entry) => sum + entry.photos.length, 0)

  const sendComment = () => {
    if (!selectedEntry) return
    const cleanDraft = (commentDrafts[selectedEntry.id] || '').trim()
    if (!cleanDraft) return
    actions.addSiteDiaryComment(selectedEntry.id, cleanDraft)
    setCommentDrafts((current) => ({ ...current, [selectedEntry.id]: '' }))
  }

  if (selectedEntry) {
    return (
      <EntryDetail
        entry={selectedEntry}
        project={project}
        commentDraft={commentDrafts[selectedEntry.id] || ''}
        onChangeComment={(value) => setCommentDrafts((current) => ({ ...current, [selectedEntry.id]: value }))}
        onSendComment={sendComment}
        onToggleReviewed={actions.toggleSiteDiaryReviewed}
        onBack={() => setSelectedEntryId(null)}
      />
    )
  }

  return (
    <main className="min-h-dvh w-full overflow-x-hidden bg-white font-['Urbanist'] text-black">
      <section className="mx-auto w-full max-w-[390px] pb-10 pt-16">
        <Header
          title={activeView === 'home' ? 'Site diary' : activeView === 'references' ? 'My references' : SITE_DIARY_BUCKETS.find((bucket) => bucket.id === activeView)?.label || 'Site diary'}
          subtitle={`${project.name} / ${project.designerName}`}
          onBack={activeView === 'home' ? onBack : () => setActiveView('home')}
        />

        {activeView === 'home' ? <section className="border-b border-[#e5e5e5] px-4 py-5">
          <p className="type-caption uppercase text-[#267449]">Project updates</p>
          <h1 className="type-page-title mt-2 text-black">{siteDiaryEntries.length} entries shared</h1>
          <p className="type-body mt-2 text-[#5f7467]">
            {latestEntry ? `Latest update: ${latestEntry.title} on ${formatDiaryDateLabel(latestEntry.createdAt)}.` : 'New site updates from the team will appear here.'}
          </p>
        </section> : null}

        <div className="px-4 py-6">
          {activeView === 'home' ? <section className="border-b border-[#e5e5e5] pb-5">
            <div className="grid grid-cols-4">
              <Metric value={siteDiaryEntries.length} label="Logs" tone="text-[#267449]" />
              <Metric value={siteDiaryIssues.filter((issue) => issue.status !== 'resolved').length} label="Open issues" tone="text-[#e07a2f]" />
              <Metric value={photoCount} label="Photos" tone="text-[#267449]" />
              <Metric value={siteDiaryReferences.length} label="References" tone="text-[#f59e0b]" />
            </div>
          </section> : null}

          {activeView !== 'home' ? <section className="border-b border-[#e5e5e5] pb-5">
            <div className="mb-4 flex flex-wrap gap-2">
              {SITE_DIARY_BUCKETS.map((bucket) => (
                <FilterChip key={bucket.id} label={bucket.label} selected={activeView === bucket.id} onClick={() => setActiveView(bucket.id)} />
              ))}
              <FilterChip label="Client references" selected={activeView === 'references'} onClick={() => setActiveView('references')} />
            </div>
          </section> : null}

          {activeView === 'home' ? (
            <>
              <section className="border-b border-[#e5e5e5] py-5">
                <div className="mb-4 flex items-center justify-between">
                  <p className="type-section-title text-black">Browse updates</p>
                  <span className="type-caption text-[#777]">From your project team</span>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <HomeFolder icon={ClipboardText} title="Daily logs" meta={`${siteDiaryEntries.filter((entry) => entry.type === 'daily-log').length} updates`} onClick={() => setActiveView('daily-log')} />
                  <HomeFolder icon={Images} title="Progress photos" meta={`${photoCount} photos`} onClick={() => setActiveView('progress-photo')} />
                  <HomeFolder icon={UploadSimple} title="My references" meta={`${siteDiaryReferences.length} shared`} onClick={() => setActiveView('references')} />
                </div>
              </section>
              <section className="py-5">
                <div className="mb-3 flex items-center justify-between">
                  <p className="type-section-title text-black">Latest updates</p>
                  <button type="button" onClick={() => setActiveView('daily-log')} className="flex items-center gap-1 type-caption text-[#777]">View logs <CaretRight size={14} /></button>
                </div>
                <div className="border-y border-[#e5e5e5]">
                  {sortedEntries.slice(0, 3).map((entry) => <DiaryRow key={entry.id} entry={entry} onOpen={setSelectedEntryId} />)}
                </div>
              </section>
            </>
          ) : activeView === 'references' ? (
            <>
              <section className="border-b border-[#e5e5e5] py-5">
                <div className="mb-4 flex items-center justify-between">
                  <p className="type-section-title text-black">Share inspiration</p>
                  <UploadSimple size={18} className="text-[#7b7b7b]" />
                </div>
                <div className="space-y-3">
                  <input value={referenceDraft.title} onChange={(event) => setReferenceDraft((prev) => ({ ...prev, title: event.target.value }))} placeholder="Reference title" className="type-body h-11 w-full rounded-[16px] border border-[#d7d7d7] px-3 outline-none" />
                  <textarea value={referenceDraft.note} onChange={(event) => setReferenceDraft((prev) => ({ ...prev, note: event.target.value }))} placeholder="Why are you sharing this?" className="type-body h-20 w-full resize-none rounded-[16px] border border-[#d7d7d7] px-3 py-3 outline-none" />
                  <div className="flex gap-2">
                    {referenceImageOptions.map((image) => (
                      <button key={image} type="button" onClick={() => setReferenceDraft((prev) => ({ ...prev, image }))} className={`overflow-hidden rounded-[14px] border ${referenceDraft.image === image ? 'border-black' : 'border-[#d7d7d7]'}`}>
                        <img src={image} alt="" className="size-14 object-cover" />
                      </button>
                    ))}
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      actions.addSiteDiaryReference(referenceDraft)
                      setReferenceDraft({ title: '', note: '', image: referenceImageOptions[0] })
                    }}
                    className="type-body-strong h-11 w-full rounded-[18px] bg-black text-white"
                  >
                    Share reference
                  </button>
                </div>
              </section>

              <section className="py-5">
                <div className="mb-4 flex items-center justify-between">
                  <p className="type-section-title text-black">Shared references</p>
                  <span className="type-caption text-[#7b7b7b]">{siteDiaryReferences.length} total</span>
                </div>
                <div className="border-y border-[#e5e5e5]">
                  {siteDiaryReferences.map((reference) => <ReferenceRow key={reference.id} reference={reference} />)}
                </div>
              </section>
            </>
          ) : activeView === 'progress-photo' ? (
            <section className="py-5">
              <div className="mb-4 flex items-center justify-between">
                <p className="type-section-title text-black">Progress photos</p>
                <span className="type-caption text-[#7b7b7b]">{filteredPhotoCount} shared</span>
              </div>
              <ProgressPhotoGrid entries={filteredEntries} onOpen={setSelectedEntryId} />
            </section>
          ) : (
            <>
              <section className="border-b border-[#e5e5e5] py-5">
                <div className="mb-4 flex items-center justify-between">
                  <p className="type-section-title text-black">{SITE_DIARY_BUCKETS.find((bucket) => bucket.id === activeView)?.label || 'Updates'}</p>
                  <span className="type-caption text-[#7b7b7b]">{filteredEntries.length} items</span>
                </div>
                <div className="border-y border-[#e5e5e5]">
                  {filteredEntries.length ? filteredEntries.map((entry) => (
                    <DiaryRow key={entry.id} entry={entry} onOpen={setSelectedEntryId} />
                  )) : (
                    <p className="type-body px-1 py-4 text-[#6f6f6f]">{SITE_DIARY_BUCKETS.find((bucket) => bucket.id === activeView)?.empty}</p>
                  )}
                </div>
              </section>

              <section className="py-5">
                <div className="mb-4 flex items-center justify-between">
                  <p className="type-section-title text-black">Open issues</p>
                  <span className="type-caption text-[#7b7b7b]">{siteDiaryIssues.length} tracked</span>
                </div>
                <div className="border-y border-[#e5e5e5]">
                  {siteDiaryIssues.map((issue) => <IssueRow key={issue.id} issue={issue} />)}
                </div>
              </section>
            </>
          )}
        </div>
      </section>
    </main>
  )
}

export default HomeownerSiteDiaryWorkspace
