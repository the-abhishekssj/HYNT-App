import {
  CaretLeft,
  CaretRight,
  CheckCircle,
  ClipboardText,
  ImagesSquare,
  NotePencil,
} from '@phosphor-icons/react'
import { useSharedProject } from '../collaboration/mockProjectStore'

const statusTone = {
  review: 'bg-[#fff5e6] text-[#a86a00]',
  active: 'bg-[#eef3ff] text-[#3d68b8]',
  signed: 'bg-[#eaf8ef] text-[#267449]',
}

function Header({ onBack }) {
  return (
    <header className="fixed left-1/2 top-0 z-[90] w-full max-w-[390px] -translate-x-1/2 border-b border-[#e0e0e0] bg-[rgba(255,255,255,0.72)] backdrop-blur-[16px]">
      <div className="px-4 py-3">
        <button type="button" onClick={onBack} className="flex min-w-0 items-center gap-4 py-1">
          <span className="grid size-6 shrink-0 place-items-center">
            <CaretLeft size={24} />
          </span>
          <span className="min-w-0 text-left">
            <span className="type-section-title block truncate text-black">Approvals</span>
            <span className="type-caption block truncate text-[#999999]">Pending reviews and client decisions</span>
          </span>
        </button>
      </div>
    </header>
  )
}

function ApprovalRow({ icon: Icon, title, meta, status, onClick }) {
  return (
    <button type="button" onClick={onClick} className="flex w-full items-center justify-between gap-3 border-b border-[#e5e5e5] py-4 text-left last:border-b-0">
      <span className="flex min-w-0 items-center gap-3">
        <span className="grid size-10 shrink-0 place-items-center rounded-[14px] border border-[#dbe6df] bg-[#f7fbf8] text-black">
          <Icon size={18} />
        </span>
        <span className="min-w-0">
          <span className="type-body-strong block truncate text-black">{title}</span>
          <span className="type-meta mt-0.5 block text-[#6f6f6f]">{meta}</span>
        </span>
      </span>
      <span className="flex shrink-0 items-center gap-2">
        <span className={`type-caption rounded-full px-2 py-1 uppercase ${statusTone[status.tone] || statusTone.active}`}>{status.label}</span>
        <CaretRight size={15} />
      </span>
    </button>
  )
}

function EmptyState() {
  return (
    <div className="border-y border-[#e5e5e5] py-5">
      <p className="type-body text-[#6f6f6f]">Nothing is waiting on you right now. New drafts, moodboard choices, and confirmations will show up here.</p>
    </div>
  )
}

function HomeownerApprovalsHub({ onBack, onOpenSow, onOpenTaskApprovals, onOpenArchive }) {
  const { project, sow, archiveFolders, archiveItems } = useSharedProject('p-1')
  const sharedFolderIds = new Set(
    archiveFolders.filter((folder) => folder.visibility === 'client-shared').map((folder) => folder.id),
  )
  const pendingArchiveItems = archiveItems.filter((item) => sharedFolderIds.has(item.folderId) && item.status === 'pending')
  const completedArchiveItems = archiveItems.filter((item) => sharedFolderIds.has(item.folderId) && ['approved', 'rejected'].includes(item.status))
  const openRemarks = sow?.remarks?.filter((remark) => remark.status === 'open') || []

  const reviewRows = [
    sow
      ? {
          id: 'approval-sow',
          icon: NotePencil,
          title: 'Scope of work',
          meta: openRemarks.length
            ? `${openRemarks.length} open remark${openRemarks.length === 1 ? '' : 's'} in the latest draft`
            : sow.status === 'executed'
              ? 'Signed copy available'
              : `Revision ${sow.revision} shared by ${project.designerName}`,
          status: sow.status === 'executed'
            ? { label: 'Signed', tone: 'signed' }
            : { label: openRemarks.length ? 'Remarked' : 'Review', tone: openRemarks.length ? 'active' : 'review' },
          onClick: onOpenSow,
        }
      : null,
    {
      id: 'approval-tasks',
      icon: ClipboardText,
      title: 'Task approvals',
      meta: 'Material choices, confirmations, and site decisions from the project team',
      status: { label: '3 open', tone: 'review' },
      onClick: onOpenTaskApprovals,
    },
    pendingArchiveItems.length
      ? {
          id: 'approval-archive',
          icon: ImagesSquare,
          title: 'Moodboard and archive selections',
          meta: `${pendingArchiveItems.length} shared item${pendingArchiveItems.length === 1 ? '' : 's'} waiting for feedback`,
          status: { label: 'Review', tone: 'review' },
          onClick: onOpenArchive,
        }
      : null,
  ].filter(Boolean)

  const completedRows = [
    sow?.status === 'executed'
      ? {
          id: 'completed-sow',
          icon: CheckCircle,
          title: 'Executed scope of work',
          meta: `Signed by ${project.clientName} and ${project.designerName}`,
          status: { label: 'Done', tone: 'signed' },
          onClick: onOpenSow,
        }
      : null,
    completedArchiveItems.length
      ? {
          id: 'completed-archive',
          icon: ImagesSquare,
          title: 'Reviewed archive items',
          meta: `${completedArchiveItems.length} item${completedArchiveItems.length === 1 ? '' : 's'} already reviewed`,
          status: { label: 'Done', tone: 'signed' },
          onClick: onOpenArchive,
        }
      : null,
  ].filter(Boolean)

  return (
    <main className="min-h-dvh w-full overflow-x-hidden bg-white font-['Urbanist'] text-black">
      <section className="mx-auto w-full max-w-[390px] pb-10 pt-16">
        <Header onBack={onBack} />

        <section className="border-b border-[#e5e5e5] px-4 py-5">
          <p className="type-caption uppercase text-[#267449]">Project</p>
          <h1 className="type-page-title mt-2 text-black">{project.name}</h1>
          <p className="type-body mt-2 text-[#5f7467]">Everything that needs your sign-off, question, or confirmation shows up here first.</p>
        </section>

        <section className="px-4 py-5">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="type-section-title text-black">Needs your response</h2>
            <span className="type-caption uppercase text-[#8a8a8a]">{reviewRows.length}</span>
          </div>
          {reviewRows.length ? (
            <div className="border-y border-[#e5e5e5]">
              {reviewRows.map((item) => (
                <ApprovalRow key={item.id} {...item} />
              ))}
            </div>
          ) : (
            <EmptyState />
          )}
        </section>

        {completedRows.length ? (
          <section className="px-4 py-1">
            <div className="mb-3 flex items-center justify-between">
              <h2 className="type-section-title text-black">Completed</h2>
              <span className="type-caption uppercase text-[#8a8a8a]">{completedRows.length}</span>
            </div>
            <div className="border-y border-[#e5e5e5]">
              {completedRows.map((item) => (
                <ApprovalRow key={item.id} {...item} />
              ))}
            </div>
          </section>
        ) : null}
      </section>
    </main>
  )
}

export default HomeownerApprovalsHub
