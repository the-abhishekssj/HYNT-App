import { useMemo, useState } from 'react'
import {
  ChatCircleText,
  CheckSquareOffset,
  FileText,
  Gear,
  ImagesSquare,
  LinkSimple,
  PaperPlaneTilt,
  Plus,
  ShareNetwork,
  Sparkle,
  Trash,
  UploadSimple,
  X,
} from '@phosphor-icons/react'
import Button from '../../components/ui/Button'
import { useSharedProject } from '../collaboration/mockProjectStore'
import ProjectWorkspaceHeader from '../shared/ProjectWorkspaceHeader'

const visibilityLabels = {
  'team-only': 'Draft',
  'selected-team': 'Team only',
  'client-shared': 'Shared',
}

const editAccessLabels = {
  'pro-only': 'Only principal edits',
  'team-can-add': 'Team can add',
  'team-can-edit': 'Team can edit',
}

const statusLabels = {
  pending: 'Needs review',
  approved: 'Approved',
  rejected: 'Rejected',
  shared: 'Shared',
  internal: 'Internal',
}

const boardTypeLabels = {
  moodboard: 'Concept board',
  sketches: 'Sketch board',
  renders: 'Render board',
  diagrams: 'Planning board',
  'site-photos': 'Site references',
  'vendor-docs': 'Vendor shortlist',
  custom: 'Custom board',
}

const previewPalettes = [
  ['#f0ebe0', '#d9c8b2', '#8a7968', '#4a5240'],
  ['#e8f0e8', '#c8a882', '#efe5d7', '#6b7564'],
  ['#ede0f0', '#f0ede8', '#d7e0e4', '#584b53'],
]

const colourPresets = [
  { value: '#C8A882', className: 'bg-[#C8A882]' },
  { value: '#8A7968', className: 'bg-[#8A7968]' },
  { value: '#4A5240', className: 'bg-[#4A5240]' },
  { value: '#E8E0D5', className: 'bg-[#E8E0D5]' },
  { value: '#F5F0E8', className: 'bg-[#F5F0E8]' },
  { value: '#2D6A4F', className: 'bg-[#2D6A4F]' },
  { value: '#1A1A2E', className: 'bg-[#1A1A2E]' },
  { value: '#C0392B', className: 'bg-[#C0392B]' },
  { value: '#E8C99A', className: 'bg-[#E8C99A]' },
  { value: '#7FB3C8', className: 'bg-[#7FB3C8]' },
]
const roomTags = ['No tag', 'Living Room', 'Kitchen', 'Master Bedroom', 'Kids Room', 'All rooms']
const addItemOptions = [
  { id: 'image', title: 'Image', subtitle: 'Upload, camera, gallery', icon: ImagesSquare },
  { id: 'product', title: 'Product link', subtitle: 'Paste a vendor URL', icon: LinkSimple },
  { id: 'colour', title: 'Colour swatch', subtitle: 'Hex, palette, material', icon: Sparkle },
  { id: 'text', title: 'Text note', subtitle: 'Label, spec, direction', icon: FileText },
]

const colourClassMap = new Map(colourPresets.map((colour) => [colour.value.toLowerCase(), colour.className]))

function getColourClass(colour, fallback = 'bg-[#C8A882]') {
  return colourClassMap.get(String(colour || '').toLowerCase()) || fallback
}

function getPaletteColours(item, index = 0) {
  const preset = previewPalettes[index % previewPalettes.length]
  if (!item?.colour) return preset
  return Array.from(new Set([item.colour, '#8A7968', '#E8E0D5', '#4A5240']))
}

function moodboardItemKind(item) {
  const title = `${item.title || ''} ${item.linkedTo || ''}`.toLowerCase()
  if (title.trim().startsWith('note:')) return 'note'
  if (item.type === 'product') return 'product'
  if (item.type === 'palette' || item.type === 'colour') return 'palette'
  if (item.type === 'note') return 'note'
  if (title.includes('palette') || title.includes('material')) return 'palette'
  if (title.includes('handle') || title.includes('product') || item.src?.includes('product')) return 'product'
  return 'image'
}

function cleanMoodboardTitle(item, kind) {
  let title = item.title || ''
  if (kind === 'note') title = title.replace(/^note:\s*/i, '')
  if (kind === 'product') title = title.replace(/^product:\s*/i, '')
  if (kind === 'palette') title = title.replace(/^palette:\s*/i, '')
  return title.trim() || item.title || 'Moodboard item'
}

function moodboardItemSize(item) {
  const size = String(item.size || '').toLowerCase()
  if (size.includes('large') || size.includes('full')) return 'large'
  if (size.includes('small')) return 'small'
  return 'medium'
}

function moodboardItemKindLabel(kind) {
  if (kind === 'palette') return 'Colour palette'
  if (kind === 'product') return 'Product reference'
  if (kind === 'note') return 'Note item'
  return 'Image reference'
}

function boardItemsFor(folder, archiveItems) {
  return archiveItems.filter((item) => item.folderId === folder.id)
}

function boardCommentCount(items) {
  return items.reduce((count, item) => count + (item.comments?.length || 0), 0)
}

function BoardPreview({ items, tall = false }) {
  const previewItems = items.slice(0, 3)
  if (!previewItems.length) {
    return (
      <div className={`grid ${tall ? 'h-[156px]' : 'h-[112px]'} grid-cols-2 grid-rows-2 gap-1 overflow-hidden bg-[#f4f8f5]`}>
        <span className="row-span-2 bg-[#efe7d9]" />
        <span className="bg-[#dfece5]" />
        <span className="bg-[#f4eadb]" />
      </div>
    )
  }

  return (
    <div className={`grid ${tall ? 'h-[156px]' : 'h-[112px]'} grid-cols-2 grid-rows-2 gap-1 overflow-hidden bg-[#f4f8f5]`}>
      {previewItems.map((item, index) => (
        item.src ? (
          <img
            key={item.id}
            src={item.src}
            alt=""
            className={`${index === 0 ? 'row-span-2' : ''} h-full w-full object-cover`}
          />
        ) : (
          <span key={item.id} className={`${index === 0 ? 'row-span-2' : ''} grid place-items-center bg-[#edf4f0] text-[#7f9188]`}>
            <FileText size={22} />
          </span>
        )
      ))}
    </div>
  )
}

function BoardCard({ folder, index, items, onOpen }) {
  const isShared = folder.visibility === 'client-shared'
  const comments = boardCommentCount(items)
  const isTall = index % 3 === 1

  return (
    <button
      type="button"
      onClick={() => onOpen(folder.id)}
      className={`w-full overflow-hidden rounded-[16px] border bg-white text-left shadow-[0_10px_24px_rgba(16,36,24,0.07)] transition active:scale-[0.99] ${isShared ? 'border-[#b9d7c6]' : 'border-[#dfe8e2]'}`}
    >
      <BoardPreview items={items} tall={isTall} />
      <div className="p-4">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <p className="typo-body-strong truncate text-black">{folder.name}</p>
            <p className="typo-meta mt-1 truncate text-[#6b7d72]">
              {items.length} item{items.length === 1 ? '' : 's'} / {boardTypeLabels[folder.type] || 'Moodboard'}
            </p>
          </div>
          <span className={`typo-caption shrink-0 rounded-full px-2 py-1 uppercase ${isShared ? 'bg-[#e7f5ed] text-[#267449]' : 'bg-[#f2f2f2] text-[#6f6f6f]'}`}>
            {visibilityLabels[folder.visibility] || 'Draft'}
          </span>
        </div>
        <div className="mt-3 flex items-center justify-between gap-3">
          <span className="typo-caption uppercase text-[#8a9a91]">{editAccessLabels[folder.editAccess || 'team-can-add']}</span>
          {comments ? (
            <span className="typo-caption inline-flex items-center gap-1 text-[#5f3dc4]">
              <ChatCircleText size={13} /> {comments}
            </span>
          ) : null}
        </div>
      </div>
    </button>
  )
}

function MoodboardItemCard({ item, index, onOpen }) {
  const kind = moodboardItemKind(item)
  const comments = item.comments?.length || 0
  const size = moodboardItemSize(item)
  const isFullWidth = size === 'large'
  const fullWidthClass = isFullWidth ? '[column-span:all]' : ''
  const cardClass = `mb-3 w-full break-inside-avoid overflow-hidden rounded-[16px] border border-[#dfe8e2] bg-white text-left ${fullWidthClass}`
  const displayTitle = cleanMoodboardTitle(item, kind)

  if (kind === 'palette') {
    const paletteColours = getPaletteColours(item, index)
    return (
      <button type="button" onClick={() => onOpen(item.id)} className={cardClass}>
        <div className="bg-[#fbf8ef] p-3">
          <div className="flex gap-1">
            {paletteColours.map((color) => <span key={color} className={`h-12 flex-1 rounded-[10px] border border-black/5 ${getColourClass(color, 'bg-[#EFE7D9]')}`} />)}
          </div>
          <p className="typo-caption mt-2 uppercase text-[#8a7560]">Colour palette</p>
        </div>
        <ItemCardBody item={{ ...item, title: displayTitle }} kind="Colour palette" comments={comments} />
      </button>
    )
  }

  if (kind === 'product') {
    return (
      <button type="button" onClick={() => onOpen(item.id)} className={cardClass}>
        <div className="bg-[#fff8e8] p-3">
          {item.src ? (
            <img src={item.src} alt="" className="h-24 w-full rounded-[14px] object-cover" />
          ) : (
            <span className="grid h-24 place-items-center rounded-[14px] bg-[#f5ead7] text-[#9a7a4d]">
              <LinkSimple size={24} />
            </span>
          )}
          <div className="mt-2 flex items-center justify-between gap-2">
            <span className="typo-caption rounded-full bg-white px-2 py-1 uppercase text-[#9a6b27]">Product link</span>
            <LinkSimple size={14} className="text-[#9a6b27]" />
          </div>
        </div>
        <ItemCardBody item={{ ...item, title: displayTitle }} kind={item.linkedTo && item.linkedTo !== 'Unlinked' ? item.linkedTo : 'Product reference'} comments={comments} />
      </button>
    )
  }

  if (kind === 'note') {
    return (
      <button type="button" onClick={() => onOpen(item.id)} className={`mb-3 w-full break-inside-avoid rounded-[16px] border border-[#dfe8e2] bg-[#f4faf6] p-4 text-left ${fullWidthClass}`}>
        <p className="typo-caption uppercase text-[#6f8178]">Designer note</p>
        <p className="typo-body mt-2 text-black">{displayTitle}</p>
        {comments ? <p className="typo-caption mt-3 text-[#5f3dc4]">{comments} comment{comments === 1 ? '' : 's'}</p> : null}
      </button>
    )
  }

  return (
    <button type="button" onClick={() => onOpen(item.id)} className={cardClass}>
      {item.src ? (
        <div className="relative">
          <img src={item.src} alt="" className={`${size === 'small' ? 'h-24' : size === 'large' ? 'h-48' : index % 3 === 0 ? 'h-40' : 'h-28'} w-full object-cover`} />
          <span className="typo-caption absolute left-2 top-2 rounded-full bg-white/90 px-2 py-1 uppercase text-[#173324]">Image</span>
        </div>
      ) : (
        <span className={`${size === 'small' ? 'h-24' : size === 'large' ? 'h-48' : index % 3 === 0 ? 'h-40' : 'h-28'} grid place-items-center bg-[#edf4f0] text-[#7f9188]`}>
          <ImagesSquare size={24} />
        </span>
      )}
      <ItemCardBody item={{ ...item, title: displayTitle }} kind="Image reference" comments={comments} />
    </button>
  )
}

function ItemCardBody({ item, kind, comments }) {
  return (
    <div className="p-3">
      <p className="typo-body-strong text-black">{item.title}</p>
      <p className="typo-meta mt-1 text-[#6f8178]">{kind}</p>
      <div className="mt-3 flex items-center justify-between gap-2">
        <span className="typo-caption rounded-full bg-[#f2f2f2] px-2 py-1 uppercase text-[#6f6f6f]">{statusLabels[item.status] || item.status}</span>
        {comments ? <span className="typo-caption text-[#5f3dc4]">{comments} comment{comments === 1 ? '' : 's'}</span> : null}
      </div>
    </div>
  )
}

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
    <article className="flex gap-3 py-3">
      <span className={`typo-status-mini grid size-8 shrink-0 place-items-center rounded-[10px] ${isSelf ? 'bg-[#eef3f7] text-[#1e3a5f]' : 'bg-[#f5f1ff] text-[#5f3dc4]'}`}>
        {initials}
      </span>
      <div className="min-w-0 flex-1 rounded-[16px] bg-[#f7fbf8] px-3 py-2">
        <div className="flex items-center justify-between gap-2">
          <p className="typo-status-mini uppercase text-[#6f8178]">{displaySenderName}</p>
          {timeLabel ? <p className="typo-body-10 ui-muted">{timeLabel}</p> : null}
        </div>
        <p className="typo-body mt-1 text-black">{commentText}</p>
      </div>
    </article>
  )
}

function Header({ project, openBoard, openItem, onBack, onCloseBoard, onCloseItem, onOpenSettings }) {
  const actions = openBoard && !openItem ? (
    <div className="flex items-center gap-2">
      <Button type="button" variant="outline" size="small" icon={ShareNetwork} aria-label="Share moodboard" className="size-9 rounded-[14px] border-[#dbe6df] text-[#173324]" />
      <Button type="button" variant="outline" size="small" icon={Gear} onClick={onOpenSettings} aria-label="Board settings" className="size-9 rounded-[14px] border-[#dbe6df] text-[#173324]" />
    </div>
  ) : null

  return (
    <ProjectWorkspaceHeader
      title={openItem ? openItem.title : openBoard ? openBoard.name : 'Moodboard'}
      subtitle={openItem ? openBoard?.name || 'Moodboard item' : openBoard ? boardTypeLabels[openBoard.type] || 'Project board' : project?.scope || 'Project workspace'}
      onBack={openItem ? onCloseItem : openBoard ? onCloseBoard : onBack}
      actions={actions}
    />
  )
}

function ProArchiveWorkspace({ project, onBack }) {
  const projectId = project?.id || 'p-1'
  const { archiveFolders, archiveItems, activeViewer, permissions, actions } = useSharedProject(projectId)
  const [openBoardId, setOpenBoardId] = useState(null)
  const [openItemId, setOpenItemId] = useState(null)
  const [commentDrafts, setCommentDrafts] = useState({})
  const [boardName, setBoardName] = useState('')
  const [boardRoomTag, setBoardRoomTag] = useState('No tag')
  const [boardStartMode, setBoardStartMode] = useState('blank')
  const [isCreatingBoard, setIsCreatingBoard] = useState(false)
  const [addItemMode, setAddItemMode] = useState(null)
  const [itemTitle, setItemTitle] = useState('')
  const [productUrl, setProductUrl] = useState('')
  const [productNote, setProductNote] = useState('')
  const [selectedColour, setSelectedColour] = useState('#C8A882')
  const [colourName, setColourName] = useState('')
  const [noteLabel, setNoteLabel] = useState('')
  const [noteBody, setNoteBody] = useState('')
  const [imageSize, setImageSize] = useState('Medium')
  const [noteSize, setNoteSize] = useState('Full width')
  const [isSettingsOpen, setIsSettingsOpen] = useState(false)
  const [uploadedPhoto, setUploadedPhoto] = useState(null)

  const visibleBoards = useMemo(
    () => (permissions.canViewInternalArchive
      ? archiveFolders
      : archiveFolders.filter((folder) => folder.visibility === 'client-shared')),
    [archiveFolders, permissions.canViewInternalArchive],
  )
  const displayBoards = useMemo(
    () => visibleBoards.filter((board) => board.type === 'custom' || boardItemsFor(board, archiveItems).length > 0),
    [archiveItems, visibleBoards],
  )

  const openBoard = useMemo(
    () => visibleBoards.find((board) => board.id === openBoardId) || null,
    [openBoardId, visibleBoards],
  )
  const showBoardEmptyState = displayBoards.length === 0
  const openBoardItems = openBoard ? boardItemsFor(openBoard, archiveItems) : []
  const openItem = openBoardItems.find((item) => item.id === openItemId) || null
  const openItemKind = openItem ? moodboardItemKind(openItem) : null
  const openItemPaletteColours = openItemKind === 'palette'
    ? getPaletteColours(openItem, Math.max(0, openBoardItems.findIndex((item) => item.id === openItem?.id)))
    : []
  const canCreateBoard = permissions.canCreateArchiveFolder
  const canManageSettings = permissions.canManageArchiveSettings
  const canContributeToBoard = (board) => {
    if (!board || !permissions.canAddArchiveItems) return false
    if (permissions.isPrincipalPro) return true
    return board.editAccess !== 'pro-only'
  }

  const createBoard = () => {
    if (!boardName.trim()) return
    const newBoardId = `af-${Date.now()}`
    actions.createArchiveFolder(boardName, { id: newBoardId })
    setOpenBoardId(newBoardId)
    setBoardName('')
    setBoardRoomTag('No tag')
    setBoardStartMode('blank')
    setIsCreatingBoard(false)
  }

  const closeAddItem = () => {
    setAddItemMode(null)
    setItemTitle('')
    setProductUrl('')
    setProductNote('')
    setSelectedColour('#C8A882')
    setColourName('')
    setNoteLabel('')
    setNoteBody('')
    setImageSize('Medium')
    setNoteSize('Full width')
    setUploadedPhoto(null)
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
    if (!openBoard) return
    const titleVal = itemTitle.trim() || (uploadedPhoto ? 'Uploaded image' : 'New moodboard item')
    actions.addArchiveItem(openBoard.id, titleVal, {
      type: 'image',
      src: uploadedPhoto,
      size: imageSize.toLowerCase(),
    })
    closeAddItem()
  }

  const addProductItem = () => {
    if (!openBoard) return
    const titleVal = itemTitle.trim() || 'Product reference'
    actions.addArchiveItem(openBoard.id, titleVal, {
      type: 'product',
      linkedTo: productUrl.trim() || 'Product link',
      note: productNote.trim(),
      size: 'medium',
    })
    closeAddItem()
  }

  const addColourItem = () => {
    if (!openBoard) return
    const name = colourName.trim() || 'Colour palette'
    actions.addArchiveItem(openBoard.id, name, {
      type: 'palette',
      colour: selectedColour,
      linkedTo: selectedColour,
      size: 'medium',
    })
    closeAddItem()
  }

  const addTextItem = () => {
    if (!openBoard) return
    const label = noteLabel.trim() || 'Designer note'
    const body = noteBody.trim() || 'Moodboard note'
    actions.addArchiveItem(openBoard.id, `${label}: ${body}`, {
      type: 'note',
      note: body,
      size: noteSize === 'Full width' ? 'large' : 'medium',
    })
    closeAddItem()
  }

  const updateDraft = (itemId, value) => {
    setCommentDrafts((current) => ({ ...current, [itemId]: value }))
  }

  const sendComment = (itemId) => {
    actions.addArchiveComment(itemId, commentDrafts[itemId] || '', activeViewer?.role?.type || 'designer')
    setCommentDrafts((current) => ({ ...current, [itemId]: '' }))
  }

  return (
    <main className="ui-screen-base ui-feature-surface min-h-dvh w-full overflow-x-hidden bg-white text-black">
      <section className="mx-auto w-full max-w-[390px] pb-28 pt-16">
        <Header
          project={project}
          openBoard={openBoard}
          openItem={openItem}
          onBack={onBack}
          onCloseBoard={() => {
            setOpenBoardId(null)
            setItemTitle('')
            setUploadedPhoto(null)
            closeAddItem()
            setIsSettingsOpen(false)
            setOpenItemId(null)
          }}
          onCloseItem={() => setOpenItemId(null)}
          onOpenSettings={() => setIsSettingsOpen(true)}
        />

        {!openBoard ? (
          <>
            <section className="ui-screen-content pt-6">
              {showBoardEmptyState ? (
                <div className="flex min-h-[58dvh] flex-col items-center justify-center px-2 pb-10 pt-4 text-center">
                  <img src="/empty-projects.svg" alt="" className="w-full max-w-[260px]" />
                  <h2 className="typo-section-title mt-5 text-black">No moodboard items yet</h2>
                  <p className="typo-body mt-2 max-w-[290px] text-[#607269]">
                    Add a folder when you are ready to collect references, products, colours, and notes.
                  </p>
                  {visibleBoards.length ? (
                    <Button type="button" onClick={() => setOpenBoardId(visibleBoards[0].id)} className="mt-6 h-12 rounded-[20px] px-6">
                      Start moodboard
                    </Button>
                  ) : canCreateBoard ? (
                    <Button type="button" leadingIcon={Plus} onClick={() => setIsCreatingBoard(true)} className="mt-6 h-12 rounded-[20px] px-6">
                      Add folder
                    </Button>
                  ) : null}
                </div>
              ) : (
                <div className="grid grid-cols-2 items-start gap-3">
                  {displayBoards.map((board, index) => (
                    <BoardCard key={board.id} folder={board} index={index} items={boardItemsFor(board, archiveItems)} onOpen={setOpenBoardId} />
                  ))}
                </div>
              )}
            </section>
          </>
        ) : !openItem ? (
          <>
            <section className="ui-page-summary px-4 py-5">
              <div className="flex items-center justify-between gap-3">
                <span className={`typo-caption rounded-full px-2 py-1 uppercase ${openBoard.visibility === 'client-shared' ? 'bg-[#e7f5ed] text-[#267449]' : 'bg-[#f2f2f2] text-[#6f6f6f]'}`}>
                  {visibilityLabels[openBoard.visibility] || 'Draft'}
                </span>
                <span className="typo-caption text-[#5f3dc4]">{boardCommentCount(openBoardItems)} comments</span>
              </div>
              <h1 className="typo-page-title mt-3 text-black">{openBoard.name}</h1>
              <div className="mt-4 rounded-[18px] border border-[#dfe8e2] bg-[#f8fcfa] p-3">
                <div className="flex items-start gap-3">
                  <span className="grid size-9 shrink-0 place-items-center rounded-[13px] bg-[#f5f1ff] text-[#5f3dc4]">
                    <Sparkle size={18} />
                  </span>
                  <div>
                    <p className="typo-body-strong text-black">AI mood suggestion</p>
                    <p className="typo-meta mt-1 text-[#6b7d72]">Use this board to generate palette and material ideas from the current concept direction.</p>
                  </div>
                </div>
              </div>
            </section>

            <section className="px-4 pb-5 pt-4">
              <div className="mb-3 flex items-center justify-between gap-3">
                <h2 className="typo-section-title text-black">Board items</h2>
                <span className="typo-caption uppercase text-[#8a8a8a]">{openBoardItems.length} total</span>
              </div>
              {openBoardItems.length ? (
                <div className="columns-2 gap-3">
                  {openBoardItems.map((item, index) => (
                    <MoodboardItemCard key={item.id} item={item} index={index} onOpen={setOpenItemId} />
                  ))}
                </div>
              ) : (
                <div className="rounded-[22px] border border-dashed border-[#c8d8cf] bg-[#fbfffd] p-5 text-center">
                  <ImagesSquare size={28} className="mx-auto text-[#7f9188]" />
                  <p className="typo-body-strong mt-3 text-black">No moodboard items yet</p>
                  <p className="typo-meta mt-1 text-[#6b7d72]">Add an image, product, palette, or note to start shaping this board.</p>
                </div>
              )}
            </section>
          </>
        ) : (
          <>
            {openItem.src && openItemKind === 'image' ? (
              <section className="border-b border-[#e5e5e5]">
                <img src={openItem.src} alt={openItem.title} className="aspect-[4/3.3] w-full object-cover" />
              </section>
            ) : null}

            <section className={`ui-screen-content ${openItem.src && openItemKind === 'image' ? '' : 'pt-6'}`}>
              <p className="typo-caption uppercase text-[#6f8178]">{moodboardItemKindLabel(openItemKind)}</p>
              <p className="typo-section-title mt-1 text-black">{openItem.title}</p>
              <p className="typo-meta mt-1 text-[#6f6f6f]">{openItem.linkedTo}</p>
              {openItemKind === 'palette' ? (
                <div className="mt-5">
                  <p className="typo-caption uppercase text-[#7b7b7b]">Palette</p>
                  <div className="mt-3 overflow-hidden rounded-[24px] border border-[#dbe6df]">
                    {openItemPaletteColours.map((colour, index) => (
                      <div key={`${colour}-${index}`} className="flex items-stretch border-b border-white last:border-b-0">
                        <span className="h-16 flex-1" style={{ backgroundColor: colour }} />
                        <span className="typo-body-strong flex w-28 items-center justify-end bg-white px-4 text-black">{colour}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="mt-4 grid grid-cols-3 border-y border-[#e5e5e5]">
                  {[
                    ['Status', statusLabels[openItem.status] || openItem.status],
                    ['Comments', openItem.comments?.length || 0],
                    ['Access', openBoard.visibility === 'client-shared' ? 'Client' : 'Team'],
                  ].map(([label, value]) => (
                    <div key={label} className="border-r border-[#e5e5e5] px-2 py-3 text-center last:border-r-0">
                      <p className="typo-caption uppercase text-[#7b7b7b]">{label}</p>
                      <p className="typo-meta mt-1 text-black">{value}</p>
                    </div>
                  ))}
                </div>
              )}
              <Button
                type="button"
                variant="outline"
                fullWidth
                leadingIcon={Trash}
                className="mt-4 h-11 rounded-[18px] border-[#f0c9c9] bg-[#fffafa] text-[#b42318] hover:border-[#b42318] hover:bg-[#fff5f5]"
                onClick={() => {
                  actions.deleteArchiveItem(openItem.id)
                  setOpenItemId(null)
                }}
              >
                Delete item
              </Button>
            </section>

            <section className="px-4 py-1 pb-10">
              <div className="mb-3 flex items-center justify-between">
                <h2 className="typo-section-title text-black">Comments</h2>
                <span className="typo-caption text-[#7b7b7b]">Visible on shared board</span>
              </div>
              <div className="divide-y divide-[#edf2ee] border-y border-[#e5e5e5]">
                {(openItem.comments || []).length ? (
                  openItem.comments.map((comment, index) => (
                    <CommentRow key={`${openItem.id}-comment-${index}`} text={comment} index={index} />
                  ))
                ) : (
                  <div className="py-4">
                    <p className="typo-body text-[#6f6f6f]">No comments yet. Add a note for the homeowner or reply when they comment.</p>
                  </div>
                )}
              </div>
              <div className="mt-4 flex items-center gap-2">
                <input
                  value={commentDrafts[openItem.id] || ''}
                  onChange={(event) => updateDraft(openItem.id, event.target.value)}
                  placeholder="Reply or add a comment"
                  className="typo-body h-10 min-w-0 flex-1 rounded-[14px] border border-[#d7d7d7] px-3 outline-none"
                />
                <button
                  type="button"
                  onClick={() => sendComment(openItem.id)}
                  disabled={!(commentDrafts[openItem.id] || '').trim()}
                  className="grid size-10 shrink-0 place-items-center rounded-[14px] bg-black text-white disabled:bg-[#d9d9d9]"
                  aria-label="Send moodboard comment"
                >
                  <PaperPlaneTilt size={16} />
                </button>
              </div>
            </section>
          </>
        )}
      </section>

      {!openBoard && canCreateBoard ? (
        <div className="fixed bottom-0 left-1/2 z-[95] w-full max-w-[390px] -translate-x-1/2 border-t border-[#e0e0e0] bg-white px-4 pb-6 pt-4 shadow-[0_-8px_24px_rgba(0,0,0,0.06)]">
          <Button
            type="button"
            onClick={() => setIsCreatingBoard(true)}
            fullWidth
            leadingIcon={Plus}
            className="h-12 rounded-[20px]"
          >
            Add folder
          </Button>
        </div>
      ) : null}

      {openBoard && !openItem && canContributeToBoard(openBoard) ? (
        <div className="fixed bottom-0 left-1/2 z-[95] w-full max-w-[390px] -translate-x-1/2 border-t border-[#e0e0e0] bg-white px-4 pb-6 pt-4 shadow-[0_-8px_24px_rgba(0,0,0,0.06)]">
          <Button
            type="button"
            onClick={() => setAddItemMode('choose')}
            fullWidth
            leadingIcon={Plus}
            className="h-12 rounded-[20px]"
          >
            Add item
          </Button>
        </div>
      ) : null}

      {isCreatingBoard ? (
        <>
          <div className="fixed inset-0 z-[100] bg-black/35 backdrop-blur-sm" onClick={() => setIsCreatingBoard(false)} />
          <div className="fixed bottom-0 left-1/2 z-[101] w-full max-w-[390px] -translate-x-1/2 rounded-t-[28px] bg-white p-5 shadow-[0_-8px_30px_rgba(0,0,0,0.12)]">
            <div className="flex items-start justify-between gap-3 border-b border-[#e5e5e5] pb-3">
              <div>
                <p className="typo-caption uppercase text-[#267449]">New folder</p>
                <h3 className="typo-section-title text-black">Add moodboard folder</h3>
              </div>
              <Button type="button" variant="ghost" size="small" icon={X} onClick={() => setIsCreatingBoard(false)} aria-label="Close new folder" className="size-8 rounded-full bg-[#f2f2f2]" />
            </div>
            <div className="mt-4 space-y-4">
              <label className="block">
                <span className="typo-label uppercase text-[#7b7b7b]">Folder name</span>
                <input value={boardName} onChange={(event) => setBoardName(event.target.value)} placeholder="Living Room - Materials" className="typo-body mt-2 h-11 w-full rounded-[18px] border border-[#d8d8d8] px-3 outline-none" />
              </label>
              <label className="block">
                <span className="typo-label uppercase text-[#7b7b7b]">Room tag</span>
                <select value={boardRoomTag} onChange={(event) => setBoardRoomTag(event.target.value)} className="typo-body mt-2 h-11 w-full rounded-[18px] border border-[#d8d8d8] bg-white px-3 outline-none">
                  {roomTags.map((tag) => <option key={tag}>{tag}</option>)}
                </select>
              </label>
              <div>
                <p className="typo-label uppercase text-[#7b7b7b]">Start with</p>
                <div className="mt-2 grid grid-cols-2 gap-2">
                  {[
                    ['blank', 'Blank board', FileText],
                    ['ai', 'AI suggest', Sparkle],
                  ].map(([mode, label, Icon]) => (
                    <button
                      key={mode}
                      type="button"
                      onClick={() => setBoardStartMode(mode)}
                      className={`rounded-[18px] border p-3 text-center ${boardStartMode === mode ? 'border-black bg-[#f7fbf8]' : 'border-[#dbe6df] bg-white'}`}
                    >
                      <Icon size={22} className="mx-auto" />
                      <span className="typo-body-strong mt-2 block text-black">{label}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
            <Button type="button" onClick={createBoard} disabled={!boardName.trim()} fullWidth className="mt-5 h-12 rounded-[20px]">
              Add folder
            </Button>
          </div>
        </>
      ) : null}

      {addItemMode && openBoard && !openItem ? (
        <>
          <div className="fixed inset-0 z-[100] bg-black/35 backdrop-blur-sm" onClick={closeAddItem} />
          <div className="fixed bottom-0 left-1/2 z-[101] max-h-[82dvh] w-full max-w-[390px] -translate-x-1/2 overflow-y-auto rounded-t-[28px] bg-white p-5 shadow-[0_-8px_30px_rgba(0,0,0,0.12)]">
            <div className="flex items-start justify-between gap-3 border-b border-[#e5e5e5] pb-3">
              <div>
                <p className="typo-caption uppercase text-[#267449]">Add to board</p>
                <h3 className="typo-section-title text-black">{openBoard.name}</h3>
              </div>
              <Button type="button" variant="ghost" size="small" icon={X} onClick={closeAddItem} aria-label="Close add item" className="size-8 rounded-full bg-[#f2f2f2]" />
            </div>

            {addItemMode === 'choose' ? (
              <div className="mt-4">
                <div className="grid grid-cols-2 gap-2">
                  {addItemOptions.map((option) => {
                    const Icon = option.icon
                    return (
                      <button key={option.id} type="button" onClick={() => setAddItemMode(option.id)} className="min-h-[116px] rounded-[18px] border border-[#dbe6df] bg-[#fbfffd] p-3 text-left">
                        <span className="grid size-10 place-items-center rounded-[14px] bg-[#e7f5ed] text-[#173324]">
                          <Icon size={19} />
                        </span>
                        <span className="typo-body-strong mt-3 block text-black">{option.title}</span>
                        <span className="typo-caption mt-1 block text-[#7b8e84]">{option.subtitle}</span>
                      </button>
                    )
                  })}
                </div>
                <div className="mt-4">
                  <p className="typo-label uppercase text-[#7b7b7b]">Import from</p>
                  <div className="mt-2 grid grid-cols-3 gap-2">
                    {[
                      ['Drive', FileText],
                      ['Site diary', ImagesSquare],
                      ['Approvals', CheckSquareOffset],
                    ].map(([label, Icon]) => (
                      <button key={label} type="button" className="rounded-[16px] border border-[#dbe6df] bg-white px-2 py-3 text-center text-[#173324]">
                        <Icon size={17} className="mx-auto" />
                        <span className="typo-caption mt-1 block uppercase">{label}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            ) : null}

            {addItemMode === 'image' ? (
              <div className="mt-4 space-y-4">
                <label className="block cursor-pointer rounded-[20px] border border-dashed border-[#b8cfc2] bg-[#fbfffd] p-6 text-center">
                  {uploadedPhoto ? <img src={uploadedPhoto} alt="Upload preview" className="mx-auto h-28 w-full rounded-[16px] object-cover" /> : <UploadSimple size={30} className="mx-auto text-[#173324]" />}
                  <span className="typo-body-strong mt-3 block text-black">Upload image</span>
                  <span className="typo-caption mt-1 block uppercase text-[#7b8e84]">Camera / gallery / drive</span>
                  <input type="file" accept="image/*" className="hidden" onChange={handlePhotoSelect} />
                </label>
                <label className="block"><span className="typo-label uppercase text-[#7b7b7b]">Caption</span><input value={itemTitle} onChange={(event) => setItemTitle(event.target.value)} placeholder="Boucle armchair reference" className="typo-body mt-2 h-11 w-full rounded-[18px] border border-[#d8d8d8] px-3 outline-none" /></label>
                <div><p className="typo-label uppercase text-[#7b7b7b]">Size on board</p><div className="mt-2 grid grid-cols-3 gap-2">{['Small', 'Medium', 'Large'].map((size) => <button key={size} type="button" onClick={() => setImageSize(size)} className={`typo-caption rounded-[16px] border px-2 py-3 uppercase ${imageSize === size ? 'border-black bg-[#f7fbf8] text-black' : 'border-[#dbe6df] text-[#6f6f6f]'}`}>{size}</button>)}</div></div>
                <Button type="button" onClick={addItem} disabled={!itemTitle.trim() && !uploadedPhoto} fullWidth className="h-12 rounded-[20px]">Add to board</Button>
              </div>
            ) : null}

            {addItemMode === 'product' ? (
              <div className="mt-4 space-y-4">
                <div className="rounded-[18px] border border-[#dbe6df] bg-[#f8fcfa] p-3">
                  <p className="typo-body-strong text-black">Paste any product URL</p>
                  <p className="typo-meta mt-1 text-[#6f8178]">Pepperfry, Amazon, Hafele, Sleek, or any brand website.</p>
                </div>
                <label className="block"><span className="typo-label uppercase text-[#7b7b7b]">Product URL</span><input value={productUrl} onChange={(event) => setProductUrl(event.target.value)} placeholder="https://pepperfry.com/..." className="typo-body mt-2 h-11 w-full rounded-[18px] border border-[#d8d8d8] px-3 outline-none" /></label>
                {productUrl.trim() ? <div className="rounded-[18px] bg-[#fff8e8] p-3"><div className="grid h-20 place-items-center rounded-[14px] bg-[#f5ead7] text-[#9a7a4d]"><LinkSimple size={24} /></div><p className="typo-body-strong mt-3 text-black">{itemTitle || 'Product preview'}</p><p className="typo-meta text-[#6f8178]">Auto-fetched product details preview</p></div> : null}
                <label className="block"><span className="typo-label uppercase text-[#7b7b7b]">Product name</span><input value={itemTitle} onChange={(event) => setItemTitle(event.target.value)} placeholder="Scandi 3-seat sofa" className="typo-body mt-2 h-11 w-full rounded-[18px] border border-[#d8d8d8] px-3 outline-none" /></label>
                <label className="block"><span className="typo-label uppercase text-[#7b7b7b]">Your note</span><input value={productNote} onChange={(event) => setProductNote(event.target.value)} placeholder="Consider this for living room main sofa" className="typo-body mt-2 h-11 w-full rounded-[18px] border border-[#d8d8d8] px-3 outline-none" /></label>
                <Button type="button" onClick={addProductItem} disabled={!itemTitle.trim() && !productUrl.trim()} fullWidth className="h-12 rounded-[20px]">Add product</Button>
              </div>
            ) : null}

            {addItemMode === 'colour' ? (
              <div className="mt-4 space-y-4">
                <div className="flex items-center gap-3">
                  <span className={`size-14 rounded-[16px] border border-black/10 ${getColourClass(selectedColour, 'bg-[#C8A882]')}`} />
                  <div><p className="typo-body-strong text-black">{selectedColour}</p><p className="typo-meta text-[#6f8178]">{colourName || 'Selected colour'}</p></div>
                </div>
                <div><p className="typo-label uppercase text-[#7b7b7b]">Presets</p><div className="mt-2 flex flex-wrap gap-2">{colourPresets.map((colour) => <button key={colour.value} type="button" aria-label={colour.value} onClick={() => setSelectedColour(colour.value)} className={`size-8 rounded-[10px] border-2 ${colour.className} ${selectedColour === colour.value ? 'border-black' : 'border-transparent'}`} />)}</div></div>
                <label className="block"><span className="typo-label uppercase text-[#7b7b7b]">Hex code</span><input value={selectedColour} onChange={(event) => setSelectedColour(event.target.value)} placeholder="#000000" className="typo-body mt-2 h-11 w-full rounded-[18px] border border-[#d8d8d8] px-3 outline-none" /></label>
                <label className="block"><span className="typo-label uppercase text-[#7b7b7b]">Colour name</span><input value={colourName} onChange={(event) => setColourName(event.target.value)} placeholder="Warm Sand / Asian Paints 7689" className="typo-body mt-2 h-11 w-full rounded-[18px] border border-[#d8d8d8] px-3 outline-none" /></label>
                <Button type="button" onClick={addColourItem} fullWidth className="h-12 rounded-[20px]">Add swatch</Button>
              </div>
            ) : null}

            {addItemMode === 'text' ? (
              <div className="mt-4 space-y-4">
                <label className="block"><span className="typo-label uppercase text-[#7b7b7b]">Label / header</span><input value={noteLabel} onChange={(event) => setNoteLabel(event.target.value)} placeholder="Wall finish spec" className="typo-body mt-2 h-11 w-full rounded-[18px] border border-[#d8d8d8] px-3 outline-none" /></label>
                <label className="block"><span className="typo-label uppercase text-[#7b7b7b]">Note</span><textarea value={noteBody} onChange={(event) => setNoteBody(event.target.value)} rows={4} placeholder="All walls in matte finish..." className="typo-body mt-2 w-full resize-none rounded-[18px] border border-[#d8d8d8] px-3 py-3 outline-none" /></label>
                <div><p className="typo-label uppercase text-[#7b7b7b]">Size on board</p><div className="mt-2 grid grid-cols-2 gap-2">{['Medium', 'Full width'].map((size) => <button key={size} type="button" onClick={() => setNoteSize(size)} className={`typo-caption rounded-[16px] border px-2 py-3 uppercase ${noteSize === size ? 'border-black bg-[#f7fbf8] text-black' : 'border-[#dbe6df] text-[#6f6f6f]'}`}>{size}</button>)}</div></div>
                <Button type="button" onClick={addTextItem} disabled={!noteBody.trim()} fullWidth className="h-12 rounded-[20px]">Add note</Button>
              </div>
            ) : null}
          </div>
        </>
      ) : null}

      {isSettingsOpen && openBoard && !openItem ? (
        <>
          <div className="fixed inset-0 z-[100] bg-black/40 backdrop-blur-sm" onClick={() => setIsSettingsOpen(false)} />
          <div className="fixed bottom-0 left-1/2 z-[101] w-full max-w-[390px] -translate-x-1/2 rounded-t-[30px] bg-white p-5 shadow-[0_-8px_30px_rgba(0,0,0,0.12)]">
            <div className="flex items-center justify-between border-b border-[#e5e5e5] pb-3">
              <div>
                <p className="typo-caption uppercase text-[#267449]">Board settings</p>
                <h3 className="typo-section-title text-black">{openBoard.name}</h3>
              </div>
              <Button type="button" variant="ghost" size="small" icon={X} onClick={() => setIsSettingsOpen(false)} aria-label="Close settings" className="size-8 rounded-full bg-[#f2f2f2]" />
            </div>

            <div className="mt-4 space-y-4">
              {canManageSettings ? (
                <>
                  <div>
                    <label className="block">
                      <span className="typo-label uppercase text-[#7b7b7b]">Sharing</span>
                      <select
                        value={openBoard.visibility}
                        onChange={(event) => actions.updateArchiveFolderVisibility(openBoard.id, event.target.value)}
                        className="typo-body-strong mt-2 h-11 w-full rounded-2xl border border-[#d8d8d8] bg-white px-3 text-black outline-none"
                      >
                        <option value="team-only">Draft</option>
                        <option value="selected-team">Team only</option>
                        <option value="client-shared">Shared with homeowner</option>
                      </select>
                    </label>
                    <p className="typo-caption mt-1.5 text-[#7b7b7b]">Shared boards appear in the homeowner moodboard view for comments.</p>
                  </div>

                  <div>
                    <label className="block">
                      <span className="typo-label uppercase text-[#7b7b7b]">Contribution access</span>
                      <select
                        value={openBoard.editAccess || 'team-can-add'}
                        onChange={(event) => actions.updateArchiveFolderEditAccess(openBoard.id, event.target.value)}
                        className="typo-body-strong mt-2 h-11 w-full rounded-2xl border border-[#d8d8d8] bg-white px-3 text-black outline-none"
                      >
                        <option value="pro-only">Only principal edits</option>
                        <option value="team-can-add">Team can add</option>
                        <option value="team-can-edit">Team can edit</option>
                      </select>
                    </label>
                  </div>
                </>
              ) : (
                <div>
                  <p className="typo-label uppercase text-[#7b7b7b]">Access rule</p>
                  <p className="typo-body mt-2 text-black">{visibilityLabels[openBoard.visibility]}</p>
                  <p className="typo-body mt-1 text-black">{editAccessLabels[openBoard.editAccess || 'team-can-add']}</p>
                  <p className="typo-caption mt-2 text-[#7b7b7b]">Only the principal pro can change board settings.</p>
                </div>
              )}
            </div>

            <Button type="button" onClick={() => setIsSettingsOpen(false)} fullWidth className="mt-6 h-11 rounded-2xl">
              Done
            </Button>
          </div>
        </>
      ) : null}
    </main>
  )
}

export default ProArchiveWorkspace
