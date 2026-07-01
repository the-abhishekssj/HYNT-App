import { useMemo } from 'react'
import {
  Archive,
  CaretRight,
  Check,
  Clipboard,
  ClipboardText,
  CurrencyInr,
  FileText,
  ImagesSquare,
  NotePencil,
  Camera,
  Wallet,
  CalendarDots,
} from '@phosphor-icons/react'
import { useSharedProject } from '../collaboration/mockProjectStore'
import ProjectWorkspaceToolCard from '../shared/ProjectWorkspaceToolCard'

const INR = '\u20b9'
const formatLakhs = (value) => `${INR}${value.toFixed(1)}L`
const parseAreaValue = (area) => {
  if (typeof area === 'number') return area
  const numeric = Number.parseFloat(String(area).replace(/[^0-9.]/g, ''))
  return Number.isFinite(numeric) ? numeric : 0
}

function SectionTitle({ title, count }) {
  return (
    <div className="flex items-center justify-between gap-3 px-4 pb-3">
      <h2 className="typo-section-title text-black">{title}</h2>
      {count ? <span className="typo-caption uppercase text-[#7b7b7b]">{count}</span> : null}
    </div>
  )
}

function RowButton({ icon: Icon, title, meta, status, onClick }) {
  return (
    <button type="button" onClick={onClick} className="flex w-full items-center justify-between gap-3 border-b border-[#e5e5e5] py-4 text-left last:border-b-0">
      <span className="flex min-w-0 items-center gap-3">
        <span className="grid size-10 shrink-0 place-items-center rounded-[14px] border border-[#dbe6df] bg-[#f7fbf8] text-black">
          <Icon size={18} />
        </span>
        <span className="min-w-0">
          <span className="typo-body-strong block truncate text-black">{title}</span>
          <span className="typo-meta mt-0.5 block truncate text-[#6f6f6f]">{meta}</span>
        </span>
      </span>
      <span className="flex shrink-0 items-center gap-2">
        {status ? <span className="typo-caption rounded-full bg-[#f2f2f2] px-2 py-1 uppercase text-[#6f6f6f]">{status}</span> : null}
        <CaretRight size={15} />
      </span>
    </button>
  )
}

function timelineStatusLabel(phase) {
  if (!phase) return 'Waiting'
  if (phase.status === 'done') return 'Completed'
  if (phase.status === 'active') return phase.delay ? 'Delayed' : 'In progress'
  return 'Upcoming'
}

function TimelinePreviewButton({ phase, completedCount, totalCount, onClick }) {
  const isDone = phase?.status === 'done'
  const isActive = phase?.status === 'active'
  const dotTone = isDone
    ? 'border-[#5fc18a] bg-[#5fc18a] text-white'
    : isActive
      ? 'border-[#f0a34d] bg-[#fff7ee] text-[#f0a34d]'
      : 'border-[#d0d0d0] bg-white text-transparent'
  const badgeTone = isDone
    ? 'bg-[#eaf8ef] text-[#267449]'
    : isActive
      ? 'bg-[#fff1df] text-[#a86a00]'
      : 'bg-[#f2f2f2] text-[#6a6a6a]'

  return (
    <button type="button" onClick={onClick} className="flex w-full gap-3 py-4 text-left">
      <div className="flex w-7 shrink-0 flex-col items-center">
        <span className={`grid size-5 place-items-center rounded-full border ${dotTone}`}>
          {isDone ? <Check size={12} weight="bold" /> : isActive ? <span className="block size-2 rounded-full bg-[#f0a34d]" /> : <span className="block size-2 rounded-full bg-[#d0d0d0]" />}
        </span>
        <span className={`mt-1 h-full min-h-14 w-px ${isDone ? 'bg-[#5fc18a]' : isActive ? 'bg-[#f0a34d]' : 'bg-[#d9d9d9]'}`} />
      </div>

      <div className="min-w-0 flex-1 border-b border-[#e5e5e5] pb-5">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <p className="typo-body-strong text-black">{phase?.name || 'Timeline not set up yet'}</p>
            <p className="typo-meta mt-1 text-[#6f6f6f]">
              {phase ? `${phase.startDate ? new Date(phase.startDate).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }) : ''} - ${phase.endDate ? new Date(phase.endDate).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }) : ''}` : 'Waiting for your professional to start the schedule'}
            </p>
          </div>
          <span className={`typo-caption whitespace-nowrap rounded-full px-2 py-1 ${badgeTone}`}>
            {timelineStatusLabel(phase)}
          </span>
        </div>

        <p className="typo-body mt-2 text-[#202020]">
          {phase?.note || 'The current live stage will appear here once the project timeline has been shared.'}
        </p>

        <div className="mt-2 flex flex-wrap items-center gap-2 text-[#6f6f6f]">
          <span className="typo-caption rounded-full border border-[#e5e5e5] px-2 py-1">
            {phase ? `${completedCount}/${totalCount} phases complete` : 'No live phase'}
          </span>
          {phase?.assignedTo?.length ? (
            <span className="typo-caption rounded-full border border-[#e5e5e5] px-2 py-1">
              {phase.assignedTo.join(', ')}
            </span>
          ) : null}
          {phase?.delay ? (
            <span className="typo-caption rounded-full border border-[#f3d4ad] px-2 py-1 text-[#a86a00]">
              {phase.delay.window} delay: {phase.delay.reason}
            </span>
          ) : null}
        </div>
      </div>
    </button>
  )
}

function HomeownerProjectPortal({
  onOpenSow,
  onOpenApprovals,
  onOpenArchive,
  onOpenFinance,
  onOpenBoq,
  onOpenTimeline,
  onOpenSiteDiary,
}) {
  const {
    project,
    sow,
    archiveFolders,
    archiveItems,
    activity,
    financeInvoices,
    financeSummary,
    boqItems,
    timelinePhases,
    siteDiaryEntries: allSiteDiaryEntries,
    taskApprovals,
  } = useSharedProject('p-1')

  const siteDiaryEntries = useMemo(
    () => allSiteDiaryEntries.filter((entry) => entry.shareWithClient !== false),
    [allSiteDiaryEntries],
  )

  if (!project) {
    return (
      <section className="hynt-desktop-page mx-auto w-full max-w-[760px] bg-white pb-12 pt-16 px-6 text-center font-['Urbanist']">
        <div className="flex flex-col items-center justify-center min-h-[60vh]">
          <div className="relative mb-8 flex h-24 w-24 items-center justify-center rounded-full bg-[#f4fbf7] text-[#267449] border border-[#dbe6df] shadow-sm animate-pulse">
            <ClipboardText size={42} weight="regular" />
          </div>
          <p className="typo-caption uppercase text-[#267449]">Awaiting Project Setup</p>
          <h1 className="typo-page-title mt-3 max-w-[420px] text-slate-900">Your designer is preparing your project space</h1>
          <p className="typo-body mt-3 max-w-[440px] text-[#5f7467]">
            Welcome to HYNT! Once your designer finishes setting up your project, your Scope of Work, timeline, BOQs, site diaries, and payments will appear here in real-time.
          </p>
          <div className="mt-8 rounded-2xl border border-dashed border-[#dce8e1] bg-[#fcfdfe] p-4 text-left max-w-[400px]">
            <p className="typo-caption uppercase text-[#5f7467]">What to expect next:</p>
            <ul className="typo-body mt-2.5 space-y-2 text-slate-700">
              <li className="flex items-start gap-2">
                <span className="mt-1 block size-1.5 shrink-0 rounded-full bg-[#5fc18a]" />
                <span>Scope of Work sent for review and sign-off</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-1 block size-1.5 shrink-0 rounded-full bg-[#5fc18a]" />
                <span>Material specifications and design choices in BOQ</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-1 block size-1.5 shrink-0 rounded-full bg-[#5fc18a]" />
                <span>Weekly site progress updates with photos</span>
              </li>
            </ul>
          </div>
        </div>
      </section>
    )
  }

  const hasSow = Boolean(sow)
  const sowIsExecuted = sow?.status === 'executed'
  const sowNeedsReview = sow && !sowIsExecuted && sow.status !== 'draft'
  const activeRemarks = sow?.remarks?.filter((remark) => remark.status === 'open') || []
  const sharedFolders = archiveFolders.filter((folder) => folder.visibility === 'client-shared')
  const sharedFolderIds = new Set(sharedFolders.map((folder) => folder.id))
  const pendingArchiveItems = archiveItems.filter((item) => sharedFolderIds.has(item.folderId) && item.status === 'pending')
  const dueInvoice = financeInvoices.find((invoice) => invoice.status === 'due') || null
  const latestPaidInvoice = [...financeInvoices].reverse().find((invoice) => invoice.status === 'paid') || null
  const nextPaymentLabel = dueInvoice ? formatLakhs(dueInvoice.amountL) : financeSummary.upcomingL ? formatLakhs(financeSummary.upcomingL) : 'Settled'
  const latestDiaryEntry = [...siteDiaryEntries].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())[0] || null
  const boqEstimate = boqItems.reduce((sum, row) => sum + (parseAreaValue(row.area) * row.rate), 0)
  const activeTimelinePhase = timelinePhases.find((phase) => phase.status === 'active') || timelinePhases[0] || null
  const completedTimelineCount = timelinePhases.filter((phase) => phase.status === 'done').length
  const pendingTaskApprovals = taskApprovals.filter((approval) => ['pending', 'question'].includes(approval.status))

  const timelineProgress = timelinePhases.length ? Math.round((completedTimelineCount / timelinePhases.length) * 100) : 0
  const delayedPhase = timelinePhases.find((phase) => phase.status === 'active' && phase.delay)

  const quickTools = [
    {
      id: 'tool-sow',
      icon: NotePencil,
      label: 'Scope of work',
      meta: sowNeedsReview ? 'Needs review' : sowIsExecuted ? 'Signed copy' : hasSow ? 'Draft shared' : 'Awaiting document',
      onClick: onOpenSow,
    },
    {
      id: 'tool-archive',
      icon: Archive,
      label: 'Shared archive',
      meta: `${sharedFolders.length} shared folder${sharedFolders.length === 1 ? '' : 's'}`,
      onClick: onOpenArchive,
    },
    {
      id: 'tool-approvals',
      icon: ClipboardText,
      label: 'Approvals',
      meta: `${pendingTaskApprovals.length} approval task${pendingTaskApprovals.length === 1 ? '' : 's'} waiting`,
      onClick: onOpenApprovals,
    },
    {
      id: 'tool-finance',
      icon: Wallet,
      label: 'Payments',
      meta: dueInvoice ? `${dueInvoice.number} due now` : latestPaidInvoice ? `${latestPaidInvoice.number} paid` : 'No invoice yet',
      onClick: onOpenFinance,
    },
    {
      id: 'tool-boq',
      icon: Clipboard,
      label: 'BOQ',
      meta: `${boqItems.length} items / ${formatLakhs(boqEstimate / 100000)}`,
      onClick: onOpenBoq,
    },
    {
      id: 'tool-site-diary',
      icon: Camera,
      label: 'Site diary',
      meta: latestDiaryEntry ? `${siteDiaryEntries.length} updates shared` : 'No site updates yet',
      onClick: onOpenSiteDiary,
    },
  ]

  const attentionRows = [
    sowNeedsReview
      ? {
        id: 'attention-sow',
        icon: NotePencil,
        title: activeRemarks.length ? 'Respond to SOW revision' : 'Review Scope of Work',
        meta: activeRemarks.length ? `${activeRemarks.length} remark(s) pending with designer` : `Revision ${sow.revision} from ${project.designerName}`,
        status: activeRemarks.length ? 'Remarked' : 'Review',
        onClick: onOpenSow,
      }
      : null,
    dueInvoice
      ? {
        id: 'attention-payment',
        icon: Wallet,
        title: `${dueInvoice.number} payment due`,
        meta: `${formatLakhs(dueInvoice.amountL)} due by ${dueInvoice.dueDate}`,
        status: 'Due',
        onClick: onOpenFinance,
      }
      : null,
    delayedPhase
      ? {
        id: 'attention-delay',
        icon: CalendarDots,
        title: 'Project delay logged',
        meta: `${delayedPhase.name} is delayed by ${delayedPhase.delay.window}: ${delayedPhase.delay.reason}`,
        status: 'Delay',
        onClick: onOpenTimeline,
      }
      : null,
    {
      id: 'attention-tasks',
      icon: ClipboardText,
      title: 'Task approvals',
      meta: pendingTaskApprovals.length ? 'Material choices, site decisions and open confirmations' : 'No decisions waiting right now',
      status: pendingTaskApprovals.length ? `${pendingTaskApprovals.length} open` : 'Clear',
      onClick: onOpenApprovals,
    },
    pendingArchiveItems.length
      ? {
          id: 'attention-archive',
          icon: ImagesSquare,
          title: 'Archive selections waiting',
          meta: `${pendingArchiveItems.length} item${pendingArchiveItems.length === 1 ? '' : 's'} need your feedback`,
          status: 'Review',
          onClick: onOpenApprovals,
        }
      : null,
  ].filter(Boolean)

  const moneyRows = [
    dueInvoice
      ? {
        id: dueInvoice.id,
        icon: CurrencyInr,
        title: 'Due now',
        meta: `${dueInvoice.number} / ${formatLakhs(dueInvoice.amountL)} / ${dueInvoice.dueDate}`,
        status: 'Pay',
        onClick: onOpenFinance,
      }
      : latestPaidInvoice
        ? {
          id: latestPaidInvoice.id,
          icon: CurrencyInr,
          title: 'Latest receipt',
          meta: `${latestPaidInvoice.number} / ${formatLakhs(latestPaidInvoice.amountL)} / ${latestPaidInvoice.paidAt}`,
          status: 'Paid',
          onClick: onOpenFinance,
        }
        : {
          id: 'money-empty',
          icon: CurrencyInr,
          title: 'Payments',
          meta: 'No milestones shared yet',
          status: 'Waiting',
          onClick: onOpenFinance,
        },
    {
      id: 'money-summary',
      icon: Wallet,
      title: 'Payment summary',
      meta: `Paid ${formatLakhs(financeSummary.paidL)} / Upcoming ${formatLakhs(financeSummary.upcomingL)}`,
      status: nextPaymentLabel,
      onClick: onOpenFinance,
    },
  ]

  const documentRows = [
    sowIsExecuted
      ? {
        id: 'executed-sow',
        icon: FileText,
        title: 'Executed Scope of Work',
        meta: `Signed by ${project.clientName} and ${project.designerName}`,
        status: 'Signed',
        onClick: onOpenSow,
      }
      : hasSow
        ? {
          id: 'draft-sow',
          icon: FileText,
          title: 'Scope of Work',
          meta: sow.status === 'draft' ? 'Designer is preparing this document' : 'Review in progress',
          status: sow.status === 'draft' ? 'Draft' : 'Active',
          onClick: onOpenSow,
        }
        : {
          id: 'missing-sow',
          icon: FileText,
          title: 'Scope of Work',
          meta: 'Not shared by designer yet',
          status: 'Waiting',
          onClick: onOpenSow,
        },
    ...sharedFolders.slice(0, 2).map((folder) => ({
      id: folder.id,
      icon: Archive,
      title: folder.name,
      meta: `${folder.itemCount} shared item(s)`,
      status: 'Shared',
      onClick: onOpenArchive,
    })),
  ]

  const progressRows = [
    {
      id: 'progress-update',
      icon: ImagesSquare,
      title: 'Latest site update',
      meta: latestDiaryEntry?.note || activity[0]?.text || 'No shared site update yet',
      status: latestDiaryEntry ? 'Open' : 'Today',
      onClick: onOpenSiteDiary,
    },
  ]

  return (
    <section className="hynt-desktop-page mx-auto w-full max-w-[760px] bg-white pb-12 pt-4">
      <header className="px-4 pb-5">
        <p className="typo-caption uppercase text-[#267449]">Project</p>
        <h1 className="typo-page-title mt-2 text-black">{project.name}</h1>
        <p className="typo-body mt-1 text-[#5f7467]">{project.designerName} / {project.location}</p>

        <div className="mt-5 grid grid-cols-4 border-y border-[#e5e5e5]">
          {[
            ['Phase', activeTimelinePhase ? (activeTimelinePhase.status === 'done' ? 'Completed' : activeTimelinePhase.name) : 'Not started'],
            ['Progress', `${timelineProgress}%`],
            ['Approvals', attentionRows.length],
            ['Next due', nextPaymentLabel],
          ].map(([label, value]) => (
            <div key={label} className="border-r border-[#e5e5e5] px-3 py-3 text-center last:border-r-0">
              <p className="typo-caption uppercase text-[#7b7b7b]">{label}</p>
              <p className="typo-meta mt-1 truncate text-black">{value}</p>
            </div>
          ))}
        </div>
      </header>

      <section className="py-3">
        <SectionTitle title="Timeline" />
        <div className="mx-4 border-y border-[#e5e5e5]">
          <TimelinePreviewButton
            phase={activeTimelinePhase}
            completedCount={completedTimelineCount}
            totalCount={timelinePhases.length}
            onClick={onOpenTimeline}
          />
        </div>
      </section>

      <section className="py-3">
        <SectionTitle title="Project tools" />
        <div className="grid grid-cols-2 gap-3 px-4">
          {quickTools.map((tool) => (
            <ProjectWorkspaceToolCard
              key={tool.id}
              icon={tool.icon}
              title={tool.label}
              meta={tool.meta}
              onClick={tool.onClick}
              preview={null}
            />
          ))}
        </div>
      </section>

      <section className="py-4">
        <SectionTitle title="Needs your attention" count={`${attentionRows.length} open`} />
        <div className="mx-4 border-y border-[#e5e5e5]">
          {attentionRows.map((item) => (
            <RowButton key={item.id} {...item} />
          ))}
        </div>
      </section>

      <section className="py-4">
        <SectionTitle title="Money" />
        <div className="mx-4 border-y border-[#e5e5e5]">
          {moneyRows.map((item) => (
            <RowButton key={item.id} {...item} />
          ))}
        </div>
      </section>

      <section className="py-4">
        <SectionTitle title="Shared ideas and files" count={`${sharedFolders.length} shared`} />
        <div className="mx-4 border-y border-[#e5e5e5]">
          {documentRows.map((item) => (
            <RowButton key={item.id} {...item} />
          ))}
        </div>
      </section>

      <section className="py-4">
        <SectionTitle title="Progress on site" />
        <div className="mx-4 border-y border-[#e5e5e5]">
          {progressRows.map((item) => (
            <RowButton key={item.id} {...item} />
          ))}
        </div>
      </section>
    </section>
  )
}

export default HomeownerProjectPortal
