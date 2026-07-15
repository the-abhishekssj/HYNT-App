import { useMemo, useState } from 'react'
import {
  Camera,
  CheckCircle,
  FileText,
  FolderSimple,
  ImagesSquare,
  PaperPlaneTilt,
  XCircle,
} from '@phosphor-icons/react'
import Button from '../../components/ui/Button'
import { useSharedProject } from '../collaboration/mockProjectStore'
import ProjectWorkspaceHeader from '../shared/ProjectWorkspaceHeader'

const folderTypeLabels = {
  moodboard: 'Moodboard',
  sketches: 'Sketches',
  renders: 'Renders',
  diagrams: 'Diagrams',
  'site-photos': 'Site photos',
  'vendor-docs': 'Vendor docs',
  custom: 'Folder',
}

const folderGuidance = {
  moodboard: 'Open items, comment on each direction, and approve or reject if needed.',
  sketches: 'Review drawings/sketches, comment on specific options, and approve selections.',
  renders: 'Check out 3D renders, post comments or feedback, and approve your favorite options.',
  'site-photos': 'Review progress images and leave comments tied to the latest update.',
  diagrams: 'Review drawings and mark up anything that needs clarification.',
  'vendor-docs': 'Check references, linked documents, and coordination notes.',
  custom: 'Open shared files and leave feedback for the team.',
}

const statusTone = {
  pending: 'bg-[#fff5e6] text-[#a86a00]',
  approved: 'bg-[#eaf8ef] text-[#267449]',
  rejected: 'bg-[#fdecec] text-[#b74a4a]',
  shared: 'bg-[#f2f2f2] text-[#6a6a6a]',
  internal: 'bg-[#f2f2f2] text-[#6a6a6a]',
}

const statusLabel = {
  pending: 'Pending',
  approved: 'Approved',
  rejected: 'Rejected',
  shared: 'Shared',
  internal: 'Internal',
}

function FolderTypeIcon({ type }) {
  if (type === 'site-photos') return <Camera size={18} />
  if (type === 'moodboard') return <ImagesSquare size={18} />
  return <FolderSimple size={18} />
}

function Header({ title, subtitle, onBack }) {
  return <ProjectWorkspaceHeader title={title} subtitle={subtitle} onBack={onBack} />
}

function FolderTile({ folder, onOpen }) {
  return (
    <button
      type="button"
      onClick={() => onOpen(folder.id)}
      className="flex min-h-[134px] flex-col justify-between rounded-[18px] border border-[#e2e2e2] px-4 py-4 text-left"
    >
      <div className="flex items-start justify-between gap-3">
        <span className="grid size-10 shrink-0 place-items-center rounded-[14px] border border-[#e5e5e5] bg-[#fafafa]">
          <FolderTypeIcon type={folder.type} />
        </span>
        <span className="typo-caption uppercase text-[#8a8a8a]">{folder.itemCount} item{folder.itemCount === 1 ? '' : 's'}</span>
      </div>
      <div>
        <p className="typo-body-strong text-black">{folder.name}</p>
        <p className="typo-meta mt-1 text-[#6f6f6f]">{folderTypeLabels[folder.type] || 'Shared folder'}</p>
        <p className="typo-caption mt-2 uppercase text-[#267449]">Comment enabled</p>
      </div>
    </button>
  )
}

function ArchiveItemTile({ item, onOpen }) {
  return (
    <button
      type="button"
      onClick={() => onOpen(item.id)}
      className="overflow-hidden rounded-[18px] border border-[#e2e2e2] text-left"
    >
      {item.src ? (
        <img src={item.src} alt={item.title} className="aspect-[4/4.6] w-full object-cover" />
      ) : (
        <div className="grid aspect-[4/4.6] w-full place-items-center bg-[#f7f7f7] text-[#6a6a6a]">
          <FileText size={24} />
        </div>
      )}
      <div className="px-3 py-3">
        <p className="typo-body-strong line-clamp-2 text-black">{item.title}</p>
        <div className="mt-2 flex items-center justify-between gap-2">
          <span className={`typo-status-mini rounded-full px-2 py-1 uppercase ${statusTone[item.status] || statusTone.shared}`}>
            {statusLabel[item.status] || item.status}
          </span>
          <span className="typo-body-10 text-[#7b7b7b]">
            {item.comments?.length ? `${item.comments.length} comment${item.comments.length === 1 ? '' : 's'}` : 'Open'}
          </span>
        </div>
      </div>
    </button>
  )
}

function CommentRow({ text, index }) {
  const isObject = typeof text === 'object' && text !== null
  const commentText = isObject ? text.text : text
  const senderType = isObject ? text.sender : (index % 2 === 0 ? 'homeowner' : 'designer')
  const rawSenderName = isObject ? text.senderName : (index % 2 === 0 ? 'Homeowner' : 'Designer')

  const isSelf = senderType === 'homeowner'
  const displaySenderName = isSelf ? 'You' : rawSenderName
  const initials = isSelf ? 'YOU' : displaySenderName.split(' ').map((n) => n[0]).join('').toUpperCase().substring(0, 2)
  const timeLabel = isObject ? text.sentAt : null

  return (
    <article className="flex gap-3 border-b border-[#ededed] py-4 last:border-b-0">
      <span className={`typo-status-mini grid size-8 shrink-0 place-items-center rounded-[10px] ${isSelf ? 'bg-[#eff3f0] text-[#173324]' : 'bg-[#f0f4f8] text-[#1e3a5f]'}`}>
        {initials}
      </span>
      <div className="min-w-0 flex-1">
        <div className="flex items-center justify-between gap-2">
          <p className="typo-status-mini uppercase text-[#7b7b7b]">{isSelf ? 'Homeowner feedback' : displaySenderName}</p>
          {timeLabel ? <p className="typo-body-10 ui-muted">{timeLabel}</p> : null}
        </div>
        <p className="typo-body mt-1 text-black">{commentText}</p>
      </div>
    </article>
  )
}

function HomeownerArchiveWorkspace({ onBack }) {
  const { archiveFolders, archiveItems, actions } = useSharedProject('p-1')
  const sharedFolders = archiveFolders.filter((folder) => folder.visibility === 'client-shared')
  const [openFolderId, setOpenFolderId] = useState(null)
  const [openItemId, setOpenItemId] = useState(null)
  const [commentDrafts, setCommentDrafts] = useState({})

  const openFolder = useMemo(
    () => sharedFolders.find((folder) => folder.id === openFolderId) || null,
    [openFolderId, sharedFolders],
  )
  const openFolderItems = openFolder
    ? archiveItems.filter((item) => item.folderId === openFolder.id)
    : []
  const openItem = openFolderItems.find((item) => item.id === openItemId) || null

  const updateDraft = (itemId, value) => {
    setCommentDrafts((current) => ({ ...current, [itemId]: value }))
  }

  const sendComment = (itemId) => {
    actions.addArchiveComment(itemId, commentDrafts[itemId] || '', 'homeowner')
    setCommentDrafts((current) => ({ ...current, [itemId]: '' }))
  }

  const handleBack = () => {
    if (openItem) {
      setOpenItemId(null)
      return
    }
    if (openFolder) {
      setOpenFolderId(null)
      return
    }
    onBack()
  }

  return (
    <main className="ui-screen-base ui-feature-surface min-h-dvh w-full overflow-x-hidden bg-white text-black">
      <section className="mx-auto w-full max-w-[390px] pb-10 pt-16">
        <Header
          title={openItem ? openItem.title : openFolder ? openFolder.name : 'Shared archive'}
          subtitle={openItem ? openFolder?.name || 'Shared item' : openFolder ? folderTypeLabels[openFolder.type] || 'Shared folder' : 'Homeowner visible folders'}
          onBack={handleBack}
        />

        {!openFolder ? (
          <>
            <section className="ui-page-summary px-4 py-5">
              <p className="typo-caption ui-kicker">References</p>
              <h1 className="typo-page-title mt-2 text-black">Open a folder to review files and comment on specific items.</h1>
            </section>

            <section className="ui-screen-content">
              <div className="mb-4 flex items-center justify-between gap-3">
                <h2 className="typo-section-title text-black">Folders</h2>
                <span className="typo-caption uppercase text-[#8a8a8a]">{sharedFolders.length} shared</span>
              </div>
              <div className="grid grid-cols-2 gap-3">
                {sharedFolders.map((folder) => (
                  <FolderTile key={folder.id} folder={folder} onOpen={(folderId) => {
                    setOpenFolderId(folderId)
                    setOpenItemId(null)
                  }}
                  />
                ))}
              </div>
            </section>
          </>
        ) : !openItem ? (
          <>
            <section className="ui-page-summary px-4 py-5">
              <p className="typo-caption ui-kicker">{folderTypeLabels[openFolder.type] || 'Shared folder'}</p>
              <h1 className="typo-page-title mt-2 text-black">{openFolder.name}</h1>
              <p className="typo-body mt-2 text-[#5f7467]">{folderGuidance[openFolder.type] || folderGuidance.custom}</p>
              <div className="mt-5 grid grid-cols-3 border-y border-[#e5e5e5]">
                {[
                  ['Items', openFolderItems.length],
                  ['Access', ['moodboard', 'sketches', 'renders'].includes(openFolder.type) ? 'Comment + approve' : 'Comment only'],
                  ['State', 'Live'],
                ].map(([label, value]) => (
                  <div key={label} className="border-r border-[#e5e5e5] px-2 py-3 text-center last:border-r-0">
                    <p className="typo-caption uppercase text-[#7b7b7b]">{label}</p>
                    <p className="typo-meta mt-1 text-black">{value}</p>
                  </div>
                ))}
              </div>
            </section>

            <section className="ui-screen-content">
              <div className="mb-4 flex items-center justify-between gap-3">
                <h2 className="typo-section-title text-black">Items</h2>
                <span className="typo-caption text-[#7b7b7b]">Tap any item</span>
              </div>
              <div className="grid grid-cols-2 gap-3">
                {openFolderItems.map((item) => (
                  <ArchiveItemTile key={item.id} item={item} onOpen={setOpenItemId} />
                ))}
              </div>
            </section>
          </>
        ) : (
          <>
            <section className="border-b border-[#e5e5e5]">
              {openItem.src ? (
                <img src={openItem.src} alt={openItem.title} className="aspect-[4/3.3] w-full object-cover" />
              ) : (
                <div className="grid aspect-[4/3.3] w-full place-items-center bg-[#f7f7f7] text-[#6a6a6a]">
                  <FileText size={28} />
                </div>
              )}
            </section>

            <section className="ui-screen-content">
              <p className="typo-body-strong text-black">{openItem.title}</p>
              <p className="typo-meta mt-1 text-[#6f6f6f]">{openItem.linkedTo}</p>
              <div className="mt-4 grid grid-cols-3 border-y border-[#e5e5e5]">
                {[
                  ['Status', statusLabel[openItem.status] || openItem.status],
                  ['Type', openItem.type === 'photo' ? 'Photo' : openItem.type === 'image' ? 'Reference' : 'Document'],
                  ['Access', ['moodboard', 'sketches', 'renders'].includes(openFolder.type) ? 'Approve' : 'Comment'],
                ].map(([label, value]) => (
                  <div key={label} className="border-r border-[#e5e5e5] px-2 py-3 text-center last:border-r-0">
                    <p className="typo-caption uppercase text-[#7b7b7b]">{label}</p>
                    <p className="typo-meta mt-1 text-black">{value}</p>
                  </div>
                ))}
              </div>

              {['moodboard', 'sketches', 'renders'].includes(openFolder.type) ? (
                <div className="mt-4 grid grid-cols-2 gap-2">
                  <Button type="button" onClick={() => actions.setArchiveItemStatus(openItem.id, 'approved')} fullWidth size="small" leadingIcon={CheckCircle}>
                    Approve
                  </Button>
                  <Button type="button" onClick={() => actions.setArchiveItemStatus(openItem.id, 'rejected')} fullWidth size="small" variant="ghost" leadingIcon={XCircle} className="text-[#b42318] hover:bg-[#fff5f5]">
                    Reject
                  </Button>
                </div>
              ) : null}
            </section>

            <section className="px-4 py-1">
              <div className="mb-3 flex items-center justify-between">
                <h2 className="typo-section-title text-black">Comments</h2>
                <span className="typo-caption text-[#7b7b7b]">Designer sees these instantly</span>
              </div>
              <div className="border-y border-[#e5e5e5]">
                {(openItem.comments || []).length ? (
                  openItem.comments.map((comment, index) => (
                    <CommentRow key={`${openItem.id}-comment-${index}`} text={comment} index={index} />
                  ))
                ) : (
                  <div className="py-4">
                    <p className="typo-body text-[#6f6f6f]">No comments yet. Add feedback on this item.</p>
                  </div>
                )}
              </div>
              <div className="mt-4 flex items-center gap-2">
                <input
                  value={commentDrafts[openItem.id] || ''}
                  onChange={(event) => updateDraft(openItem.id, event.target.value)}
                  placeholder="Comment on this item"
                  className="typo-body h-10 min-w-0 flex-1 rounded-[14px] border border-[#d7d7d7] px-3 outline-none"
                />
                <button
                  type="button"
                  onClick={() => sendComment(openItem.id)}
                  disabled={!(commentDrafts[openItem.id] || '').trim()}
                  className="grid size-10 shrink-0 place-items-center rounded-[14px] bg-black text-white disabled:bg-[#d9d9d9]"
                  aria-label="Send archive comment"
                >
                  <PaperPlaneTilt size={16} />
                </button>
              </div>
            </section>
          </>
        )}
      </section>
    </main>
  )
}

export default HomeownerArchiveWorkspace
