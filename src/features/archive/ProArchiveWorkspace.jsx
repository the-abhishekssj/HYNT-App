import { useMemo, useState } from 'react'
import {
  FileText,
  FolderSimple,
  LinkSimple,
  Plus,
  Gear,
  X,
  UploadSimple,
  PaperPlaneTilt,
} from '@phosphor-icons/react'
import { useSharedProject } from '../collaboration/mockProjectStore'
import ProjectWorkspaceHeader from '../shared/ProjectWorkspaceHeader'

function CommentRow({ text, index }) {
  const isObject = typeof text === 'object' && text !== null
  const commentText = isObject ? text.text : text
  const senderType = isObject ? text.sender : (index % 2 === 0 ? 'homeowner' : 'designer')
  const rawSenderName = isObject ? text.senderName : (index % 2 === 0 ? 'Homeowner' : 'Designer')

  const isSelf = senderType !== 'homeowner'
  const displaySenderName = isSelf ? 'You' : rawSenderName
  const initials = isSelf ? 'YOU' : displaySenderName.split(' ').map((n) => n[0]).join('').toUpperCase().substring(0, 2)
  const timeLabel = isObject ? text.sentAt : null

  return (
    <article className="flex gap-3 border-b border-[#ededed] py-4 last:border-b-0">
      <span className={`grid size-8 shrink-0 place-items-center rounded-[10px] text-[10px] font-bold ${isSelf ? 'bg-[#f0f4f8] text-[#1e3a5f]' : 'bg-[#eff3f0] text-[#173324]'}`}>
        {initials}
      </span>
      <div className="min-w-0 flex-1">
        <div className="flex items-center justify-between gap-2">
          <p className="text-[11px] font-semibold uppercase tracking-[0.05em] text-[#7b7b7b]">{displaySenderName}</p>
          {timeLabel ? <p className="text-[10px] text-[#999999]">{timeLabel}</p> : null}
        </div>
        <p className="type-body mt-1 text-black">{commentText}</p>
      </div>
    </article>
  )
}

const visibilityLabels = {
  'team-only': 'Internal only',
  'selected-team': 'Selected team',
  'client-shared': 'Homeowner visible',
}

const editAccessLabels = {
  'pro-only': 'Only principal edits',
  'team-can-add': 'Team can add',
  'team-can-edit': 'Team can edit',
}

const statusLabels = {
  pending: 'Pending',
  approved: 'Approved',
  rejected: 'Rejected',
  shared: 'Shared',
  internal: 'Internal',
}

const folderTypeLabels = {
  moodboard: 'Moodboard',
  sketches: 'Sketches',
  renders: 'Renders',
  diagrams: 'Diagrams',
  'site-photos': 'Site photos',
  'vendor-docs': 'Vendor docs',
  custom: 'Custom folder',
}

function Header({ project, openFolder, openItem, onBack, onCloseFolder, onCloseItem, onOpenSettings }) {
  const actions = (openFolder && !openItem) ? (
    <button
      type="button"
      onClick={onOpenSettings}
      className="grid size-9 place-items-center rounded-xl border border-[#dbe6df] bg-[#f7fbf8] text-black hover:bg-[#eaf5ef] transition-colors"
      aria-label="Folder settings"
    >
      <Gear size={20} />
    </button>
  ) : null

  return (
    <ProjectWorkspaceHeader
      title={openItem ? openItem.title : openFolder ? openFolder.name : 'Archive'}
      subtitle={openItem ? openFolder?.name || 'Shared item' : openFolder ? folderTypeLabels[openFolder.type] || 'Project folder' : project?.scope || 'Project workspace'}
      onBack={openItem ? onCloseItem : openFolder ? onCloseFolder : onBack}
      actions={actions}
    />
  )
}

function FolderTile({ folder, onOpen }) {
  return (
    <button
      type="button"
      onClick={() => onOpen(folder.id)}
      className="flex min-h-[148px] flex-col justify-between rounded-[24px] border border-[#dfdfdf] bg-white p-4 text-left transition hover:border-black"
    >
      <div className="flex items-start justify-between gap-3">
        <span className="grid size-10 shrink-0 place-items-center rounded-2xl border border-[#e5e5e5] bg-[#fafafa]">
          <FolderSimple size={18} />
        </span>
        <span className="type-caption shrink-0 uppercase text-[#8a8a8a]">{folder.itemCount} item{folder.itemCount === 1 ? '' : 's'}</span>
      </div>
      <div>
        <p className="type-body-strong text-black">{folder.name}</p>
        <div className="mt-2 space-y-1">
          <p className="type-meta text-[#6f6f6f]">{folderTypeLabels[folder.type] || 'Archive folder'}</p>
          <p className="type-caption uppercase text-[#267449]">{visibilityLabels[folder.visibility]}</p>
        </div>
      </div>
    </button>
  )
}

function ArchiveItemRow({ item, onOpen }) {
  return (
    <button type="button" onClick={() => onOpen(item.id)} className="flex w-full text-left items-center gap-3 border-b border-[#ededed] py-3 last:border-b-0 hover:bg-[#fcfcfc] transition-colors px-2 -mx-2 rounded-xl">
      {item.src ? (
        <img src={item.src} alt={item.title} className="size-14 shrink-0 rounded-2xl border border-[#e0e0e0] object-cover" />
      ) : (
        <span className="grid size-14 shrink-0 place-items-center rounded-2xl border border-[#e0e0e0] bg-[#fbfbfb]">
          <FileText size={18} />
        </span>
      )}
      <div className="min-w-0 flex-1">
        <p className="type-body-strong truncate text-black">{item.title}</p>
        <p className="type-meta mt-0.5 truncate text-[#6f6f6f]">{item.linkedTo}</p>
        {item.comments?.length ? <p className="type-caption mt-1 truncate text-[#267449]">{item.comments.length} comment(s)</p> : null}
      </div>
      <span className="type-caption shrink-0 rounded-full bg-[#f2f2f2] px-2 py-1 uppercase text-[#6f6f6f]">{statusLabels[item.status] || item.status}</span>
    </button>
  )
}

function ProArchiveWorkspace({ project, onBack }) {
  const projectId = project?.id || 'p-1'
  const { archiveFolders, archiveItems, activeViewer, permissions, actions } = useSharedProject(projectId)
  const [openFolderId, setOpenFolderId] = useState(null)
  const [openItemId, setOpenItemId] = useState(null)
  const [commentDrafts, setCommentDrafts] = useState({})
  const [folderName, setFolderName] = useState('')
  const [itemTitle, setItemTitle] = useState('')
  const [isSettingsOpen, setIsSettingsOpen] = useState(false)
  const [uploadedPhoto, setUploadedPhoto] = useState(null)

  const visibleFolders = useMemo(
    () => (permissions.canViewInternalArchive
      ? archiveFolders
      : archiveFolders.filter((folder) => folder.visibility === 'client-shared')),
    [archiveFolders, permissions.canViewInternalArchive],
  )

  const openFolder = useMemo(
    () => visibleFolders.find((folder) => folder.id === openFolderId) || null,
    [openFolderId, visibleFolders],
  )
  const sharedCount = visibleFolders.filter((folder) => folder.visibility === 'client-shared').length
  const canCreateFolder = permissions.canCreateArchiveFolder
  const canManageSettings = permissions.canManageArchiveSettings
  const canContributeToFolder = (folder) => {
    if (!folder || !permissions.canAddArchiveItems) return false
    if (permissions.isPrincipalPro) return true
    return folder.editAccess !== 'pro-only'
  }

  const createFolder = () => {
    actions.createArchiveFolder(folderName)
    setFolderName('')
  }

  const handlePhotoSelect = (event) => {
    const file = event.target.files?.[0]
    if (file) {
      setUploadedPhoto(URL.createObjectURL(file))
      if (!itemTitle.trim()) {
        const nameWithoutExt = file.name.substring(0, file.name.lastIndexOf('.')) || file.name
        setItemTitle(nameWithoutExt)
      }
    }
  }

  const addItem = () => {
    if (!openFolder) return
    const titleVal = itemTitle.trim() || (uploadedPhoto ? 'Uploaded image' : 'New item')
    actions.addArchiveItem(openFolder.id, titleVal, uploadedPhoto)
    setItemTitle('')
    setUploadedPhoto(null)
  }

  const openFolderItems = openFolder
    ? archiveItems.filter((item) => item.folderId === openFolder.id)
    : []

  const openItem = openFolderItems.find((item) => item.id === openItemId) || null

  const updateDraft = (itemId, value) => {
    setCommentDrafts((current) => ({ ...current, [itemId]: value }))
  }

  const sendComment = (itemId) => {
    actions.addArchiveComment(itemId, commentDrafts[itemId] || '', activeViewer?.role?.type || 'designer')
    setCommentDrafts((current) => ({ ...current, [itemId]: '' }))
  }

  return (
    <main className="min-h-dvh w-full overflow-x-hidden bg-white font-['Urbanist'] text-black">
      <section className="mx-auto w-full max-w-[390px] pb-28 pt-16">
        <Header
          project={project}
          openFolder={openFolder}
          openItem={openItem}
          onBack={onBack}
          onCloseFolder={() => {
            setOpenFolderId(null)
            setItemTitle('')
            setUploadedPhoto(null)
            setIsSettingsOpen(false)
            setOpenItemId(null)
          }}
          onCloseItem={() => setOpenItemId(null)}
          onOpenSettings={() => setIsSettingsOpen(true)}
        />

        {!openFolder ? (
          <>
            <section className="border-b border-[#e5e5e5] px-4 py-5">
              <p className="type-caption uppercase text-[#267449]">Project archive</p>
              <h1 className="type-page-title mt-2 text-black">Open a folder to manage what is shared and who can work inside it.</h1>
              <p className="type-meta mt-2 text-[#6f6f6f]">
                Viewing as {activeViewer?.role?.label}. {!permissions.canViewInternalArchive ? 'Only homeowner-visible folders are shown here.' : 'Internal folders remain visible.'}
              </p>
              <div className="mt-5 grid grid-cols-3 border-y border-[#e5e5e5] text-center">
                {[
                  ['Folders', visibleFolders.length],
                  ['Shared', sharedCount],
                  ['Items', openFolder ? openFolderItems.length : archiveItems.filter((item) => visibleFolders.some((folder) => folder.id === item.folderId)).length],
                ].map(([label, value]) => (
                  <div key={label} className="border-r border-[#e5e5e5] px-2 py-3 last:border-r-0">
                    <p className="type-caption uppercase text-[#7b7b7b]">{label}</p>
                    <p className="type-card-title mt-1 text-black">{value}</p>
                  </div>
                ))}
              </div>
            </section>

            <section className="px-4 py-5">
              <div className="mb-4 flex items-center justify-between gap-3">
                <h2 className="type-section-title text-black">Folders</h2>
                <span className="type-caption uppercase text-[#8a8a8a]">Tap to open</span>
              </div>
              <div className="grid grid-cols-2 gap-3">
                {visibleFolders.map((folder) => (
                  <FolderTile
                    key={folder.id}
                    folder={folder}
                    onOpen={(folderId) => {
                      setOpenFolderId(folderId)
                      setItemTitle('')
                      setOpenItemId(null)
                    }}
                  />
                ))}
              </div>
            </section>
          </>
        ) : !openItem ? (
          <>
            <section className="border-b border-[#e5e5e5] px-4 py-5">
              <p className="type-caption uppercase text-[#267449]">{folderTypeLabels[openFolder.type] || 'Project folder'}</p>
              <h1 className="type-page-title mt-2 text-black">{openFolder.name}</h1>
              <p className="type-body mt-2 text-[#5f7467]">
                {openFolder.type === 'moodboard'
                  ? 'Moodboard and inspirations shared with the homeowner.'
                  : openFolder.type === 'sketches'
                  ? 'Sketches and draft concepts for internal review.'
                  : openFolder.type === 'renders'
                  ? 'High-quality 3D renders shared with client.'
                  : 'Project files and documentation.'}
              </p>
              <div className="mt-5 grid grid-cols-3 border-y border-[#e5e5e5]">
                {[
                  ['Items', openFolderItems.length],
                  ['Visibility', visibilityLabels[openFolder.visibility]],
                  ['Access', editAccessLabels[openFolder.editAccess || 'team-can-add']],
                ].map(([label, value]) => (
                  <div key={label} className="border-r border-[#e5e5e5] px-2 py-3 text-center last:border-r-0">
                    <p className="type-caption uppercase text-[#7b7b7b]">{label}</p>
                    <p className="mt-1 text-[11px] font-bold leading-[1.4] text-black truncate">{value}</p>
                  </div>
                ))}
              </div>
            </section>

            <section className="px-4 pb-5 pt-4">
              <div className="mb-3 flex items-center justify-between gap-3">
                <h2 className="type-section-title text-black">Items</h2>
                <span className="type-caption uppercase text-[#8a8a8a]">{openFolderItems.length} total</span>
              </div>
              <div className="overflow-hidden rounded-[24px] border border-[#ededed] bg-white px-4">
                {openFolderItems.length ? (
                  openFolderItems.map((item) => <ArchiveItemRow key={item.id} item={item} onOpen={setOpenItemId} />)
                ) : (
                  <p className="type-body py-4 text-[#6f6f6f]">No items in this folder yet.</p>
                )}
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

            <section className="px-4 py-5">
              <p className="type-body-strong text-black">{openItem.title}</p>
              <p className="type-meta mt-1 text-[#6f6f6f]">{openItem.linkedTo}</p>
              <div className="mt-4 grid grid-cols-3 border-y border-[#e5e5e5]">
                {[
                  ['Status', statusLabels[openItem.status] || openItem.status],
                  ['Type', openItem.type === 'photo' ? 'Photo' : openItem.type === 'image' ? 'Reference' : 'Document'],
                  ['Access', ['moodboard', 'sketches', 'renders'].includes(openFolder.type) ? 'Approve' : 'Comment'],
                ].map(([label, value]) => (
                  <div key={label} className="border-r border-[#e5e5e5] px-2 py-3 text-center last:border-r-0">
                    <p className="type-caption uppercase text-[#7b7b7b]">{label}</p>
                    <p className="mt-1 text-[12px] font-semibold leading-[1.4] text-black">{value}</p>
                  </div>
                ))}
              </div>
            </section>

            <section className="px-4 py-1 pb-10">
              <div className="mb-3 flex items-center justify-between">
                <h2 className="type-section-title text-black">Comments</h2>
                <span className="type-caption text-[#7b7b7b]">Homeowner sees these instantly</span>
              </div>
              <div className="border-y border-[#e5e5e5]">
                {(openItem.comments || []).length ? (
                  openItem.comments.map((comment, index) => (
                    <CommentRow key={`${openItem.id}-comment-${index}`} text={comment} index={index} />
                  ))
                ) : (
                  <div className="py-4">
                    <p className="type-body text-[#6f6f6f]">No comments yet. Reply to the homeowner here.</p>
                  </div>
                )}
              </div>
              <div className="mt-4 flex items-center gap-2">
                <input
                  value={commentDrafts[openItem.id] || ''}
                  onChange={(event) => updateDraft(openItem.id, event.target.value)}
                  placeholder="Reply or add a comment"
                  className="type-body h-10 min-w-0 flex-1 rounded-[14px] border border-[#d7d7d7] px-3 outline-none"
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

      {!openFolder && canCreateFolder ? (
        <div className="fixed bottom-0 left-1/2 z-[95] w-full max-w-[390px] -translate-x-1/2 border-t border-[#e0e0e0] bg-white px-4 pb-6 pt-4">
          <div className="flex items-center gap-2">
            <input
              value={folderName}
              onChange={(event) => setFolderName(event.target.value)}
              placeholder="New folder"
              className="type-body h-10 min-w-0 flex-1 rounded-2xl border border-[#d7d7d7] px-3 outline-none"
            />
            <button
              type="button"
              onClick={createFolder}
              disabled={!folderName.trim()}
              className="grid size-10 shrink-0 place-items-center rounded-2xl bg-black text-white disabled:bg-[#d9d9d9]"
              aria-label="Create folder"
            >
              <Plus size={17} />
            </button>
          </div>
        </div>
      ) : null}

      {openFolder && !openItem && canContributeToFolder(openFolder) ? (
        <div className="fixed bottom-0 left-1/2 z-[95] w-full max-w-[390px] -translate-x-1/2 border-t border-[#e0e0e0] bg-white px-4 pb-6 pt-4 shadow-[0_-8px_24px_rgba(0,0,0,0.06)]">
          {uploadedPhoto ? (
            <div className="mb-3 flex items-center gap-3">
              <div className="relative">
                <img src={uploadedPhoto} alt="Upload preview" className="h-12 w-16 rounded-xl border border-[#dedede] object-cover" />
                <button
                  type="button"
                  onClick={() => setUploadedPhoto(null)}
                  className="absolute -right-1.5 -top-1.5 flex size-5 items-center justify-center rounded-full bg-red-500 text-[11px] font-bold text-white shadow-sm"
                  aria-label="Remove photo"
                >
                  ×
                </button>
              </div>
              <p className="type-caption uppercase tracking-wider text-[#6f6f6f]">Ready to upload</p>
            </div>
          ) : null}
          <div className="flex items-center gap-2">
            <label className="grid size-10 shrink-0 cursor-pointer place-items-center rounded-2xl border border-[#d7d7d7] bg-[#fcfdfe] text-black hover:bg-[#f3f7f4] transition-colors">
              <UploadSimple size={17} />
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handlePhotoSelect}
              />
            </label>
            <input
              value={itemTitle}
              onChange={(event) => setItemTitle(event.target.value)}
              placeholder={uploadedPhoto ? "Rename photo (optional)" : `Add item to ${openFolder.name}`}
              className="type-body h-10 min-w-0 flex-1 rounded-2xl border border-[#d7d7d7] px-3 outline-none"
            />
            <button
              type="button"
              onClick={addItem}
              disabled={!itemTitle.trim() && !uploadedPhoto}
              className="grid size-10 shrink-0 place-items-center rounded-2xl bg-black text-white disabled:bg-[#d9d9d9] disabled:text-[#b6b6b6]"
              aria-label="Add archive item"
            >
              <Plus size={17} />
            </button>
          </div>
        </div>
      ) : null}

      {isSettingsOpen && openFolder && !openItem ? (
        <>
          <div
            className="fixed inset-0 z-[100] bg-black/40 backdrop-blur-sm"
            onClick={() => setIsSettingsOpen(false)}
          />
          <div className="fixed bottom-0 left-1/2 z-[101] w-full max-w-[390px] -translate-x-1/2 rounded-t-[30px] bg-white p-5 shadow-[0_-8px_30px_rgba(0,0,0,0.12)]">
            <div className="flex items-center justify-between border-b border-[#e5e5e5] pb-3">
              <div>
                <p className="type-caption uppercase text-[#267449]">Folder Settings</p>
                <h3 className="type-section-title text-black">{openFolder.name}</h3>
              </div>
              <button
                type="button"
                onClick={() => setIsSettingsOpen(false)}
                className="grid size-8 place-items-center rounded-full bg-[#f2f2f2] text-black"
                aria-label="Close settings"
              >
                <X size={18} />
              </button>
            </div>

            <div className="mt-4 space-y-4">
              {canManageSettings ? (
                <>
                  <div>
                    <label className="block">
                      <span className="type-label uppercase text-[#7b7b7b]">Visibility</span>
                      <select
                        value={openFolder.visibility}
                        onChange={(event) => actions.updateArchiveFolderVisibility(openFolder.id, event.target.value)}
                        className="type-body-strong mt-2 h-11 w-full rounded-2xl border border-[#d8d8d8] bg-white px-3 text-black outline-none"
                      >
                        <option value="team-only">Internal only</option>
                        <option value="selected-team">Selected team</option>
                        <option value="client-shared">Homeowner visible</option>
                      </select>
                    </label>
                    <p className="type-caption mt-1.5 text-[#7b7b7b]">Shared folders appear in the homeowner portal archive.</p>
                  </div>

                  <div>
                    <label className="block">
                      <span className="type-label uppercase text-[#7b7b7b]">Modification access</span>
                      <select
                        value={openFolder.editAccess || 'team-can-add'}
                        onChange={(event) => actions.updateArchiveFolderEditAccess(openFolder.id, event.target.value)}
                        className="type-body-strong mt-2 h-11 w-full rounded-2xl border border-[#d8d8d8] bg-white px-3 text-black outline-none"
                      >
                        <option value="pro-only">Only principal edits</option>
                        <option value="team-can-add">Team can add</option>
                        <option value="team-can-edit">Team can edit</option>
                      </select>
                    </label>
                    <p className="type-caption mt-1.5 text-[#7b7b7b]">
                      Current rule: {editAccessLabels[openFolder.editAccess || 'team-can-add']}. Homeowners can still comment on shared items.
                    </p>
                  </div>
                </>
              ) : (
                <div>
                  <p className="type-label uppercase text-[#7b7b7b]">Access rule</p>
                  <p className="type-body mt-2 text-black">{visibilityLabels[openFolder.visibility]}</p>
                  <p className="type-body mt-1 text-black">{editAccessLabels[openFolder.editAccess || 'team-can-add']}</p>
                  <p className="type-caption mt-2 text-[#7b7b7b]">Only the principal pro can change folder settings.</p>
                </div>
              )}
            </div>

            <button
              type="button"
              onClick={() => setIsSettingsOpen(false)}
              className="type-body-strong mt-6 h-11 w-full rounded-2xl bg-black text-white"
            >
              Done
            </button>
          </div>
        </>
      ) : null}
    </main>
  )
}

export default ProArchiveWorkspace
