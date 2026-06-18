import { useMemo, useState } from 'react'
import {
  FileText,
  FolderSimple,
  ImagesSquare,
  LinkSimple,
  Plus,
} from '@phosphor-icons/react'
import { useSharedProject } from '../collaboration/mockProjectStore'
import ProjectWorkspaceHeader from '../shared/ProjectWorkspaceHeader'

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
  diagrams: 'Diagrams',
  'site-photos': 'Site photos',
  'vendor-docs': 'Vendor docs',
  custom: 'Custom folder',
}

function Header({ project, openFolder, onBack, onCloseFolder }) {
  return <ProjectWorkspaceHeader title={openFolder ? openFolder.name : 'Archive'} subtitle={openFolder ? folderTypeLabels[openFolder.type] || 'Project folder' : project?.scope || 'Project workspace'} onBack={openFolder ? onCloseFolder : onBack} />
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

function ArchiveItemRow({ item }) {
  return (
    <article className="flex items-center gap-3 border-b border-[#ededed] py-3 last:border-b-0">
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
        {item.comments?.length ? <p className="type-caption mt-1 truncate text-[#267449]">{item.comments.length} homeowner comment(s)</p> : null}
      </div>
      <span className="type-caption shrink-0 rounded-full bg-[#f2f2f2] px-2 py-1 uppercase text-[#6f6f6f]">{statusLabels[item.status] || item.status}</span>
    </article>
  )
}

function ProArchiveWorkspace({ project, onBack }) {
  const projectId = project?.id || 'p-1'
  const { archiveFolders, archiveItems, activeViewer, permissions, actions } = useSharedProject(projectId)
  const [openFolderId, setOpenFolderId] = useState(null)
  const [folderName, setFolderName] = useState('')
  const [itemTitle, setItemTitle] = useState('')

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

  const addItem = () => {
    if (!openFolder) return
    actions.addArchiveItem(openFolder.id, itemTitle)
    setItemTitle('')
  }

  const openFolderItems = openFolder
    ? archiveItems.filter((item) => item.folderId === openFolder.id)
    : []

  return (
    <main className="min-h-dvh w-full overflow-x-hidden bg-white font-['Urbanist'] text-black">
      <section className="mx-auto w-full max-w-[390px] pb-28 pt-16">
        <Header
          project={project}
          openFolder={openFolder}
          onBack={onBack}
          onCloseFolder={() => {
            setOpenFolderId(null)
            setItemTitle('')
          }}
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
                    }}
                  />
                ))}
              </div>
            </section>
          </>
        ) : (
          <>
            <section className="border-b border-[#e5e5e5] px-4 py-5">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="type-caption uppercase text-[#267449]">Folder settings</p>
                  <h1 className="type-page-title mt-2 text-black">{openFolder.name}</h1>
                  <p className="type-body mt-2 text-[#6f6f6f]">
                    Decide who can see this folder and how much the invited team can contribute inside it.
                  </p>
                </div>
                <span className="grid size-10 shrink-0 place-items-center rounded-2xl border border-[#e0e0e0] bg-[#fafafa]">
                  <ImagesSquare size={18} />
                </span>
              </div>
            </section>

            <section className="px-4 py-5">
              <div className="rounded-[24px] border border-[#e5e5e5] bg-[#fbfcfb] px-4">
                {canManageSettings ? (
                  <>
                    <div className="border-b border-[#e5e5e5] py-4">
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
                      <p className="type-caption mt-2 text-[#7b7b7b]">Shared folders appear in the homeowner portal archive.</p>
                    </div>

                    <div className="py-4">
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
                      <p className="type-caption mt-2 text-[#7b7b7b]">
                        Current rule: {editAccessLabels[openFolder.editAccess || 'team-can-add']}. Homeowners can still comment on shared items.
                      </p>
                    </div>
                  </>
                ) : (
                  <div className="py-4">
                    <p className="type-label uppercase text-[#7b7b7b]">Access rule</p>
                    <p className="type-body mt-2 text-black">{visibilityLabels[openFolder.visibility]}</p>
                    <p className="type-body mt-1 text-black">{editAccessLabels[openFolder.editAccess || 'team-can-add']}</p>
                    <p className="type-caption mt-2 text-[#7b7b7b]">Only the principal pro can change folder settings.</p>
                  </div>
                )}
              </div>
            </section>

            <section className="px-4 pb-5">
              <div className="mb-3 flex items-center justify-between gap-3">
                <h2 className="type-section-title text-black">Items</h2>
                <span className="type-caption uppercase text-[#8a8a8a]">{openFolderItems.length} total</span>
              </div>
              <div className="overflow-hidden rounded-[24px] border border-[#ededed] bg-white px-4">
                {openFolderItems.length ? (
                  openFolderItems.map((item) => <ArchiveItemRow key={item.id} item={item} />)
                ) : (
                  <p className="type-body py-4 text-[#6f6f6f]">No items in this folder yet.</p>
                )}
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

      {openFolder && canContributeToFolder(openFolder) ? (
        <div className="fixed bottom-0 left-1/2 z-[95] w-full max-w-[390px] -translate-x-1/2 border-t border-[#e0e0e0] bg-white px-4 pb-6 pt-4">
          <div className="flex items-center gap-2">
            <input
              value={itemTitle}
              onChange={(event) => setItemTitle(event.target.value)}
              placeholder={`Add item to ${openFolder.name}`}
              className="type-body h-10 min-w-0 flex-1 rounded-2xl border border-[#d7d7d7] px-3 outline-none"
            />
            <button
              type="button"
              onClick={addItem}
              disabled={!itemTitle.trim()}
              className="grid size-10 shrink-0 place-items-center rounded-2xl border border-[#d7d7d7] bg-white text-black disabled:text-[#b6b6b6]"
              aria-label="Add archive item"
            >
              <LinkSimple size={17} />
            </button>
          </div>
        </div>
      ) : null}
    </main>
  )
}

export default ProArchiveWorkspace
