import { useLayoutEffect, useRef } from 'react'
import {
  ArrowRight,
  Bell,
  CalendarDots,
  CaretDown,
  ChatsCircle,
  ClipboardText,
  FileText,
  MagnifyingGlass,
  MapPinSimpleArea,
  Wallet,
} from '@phosphor-icons/react'
import Button from '../../components/ui/Button'
import { useSharedProject } from '../collaboration/mockProjectStore'
import HomeBlogsSection from './HomeBlogsSection'
import HomeExploreCategoriesGrid from './HomeExploreCategoriesGrid'

function HomeownerQuickActions({ quickActions }) {
  return (
    <section className="mt-5 px-4 py-2">
      <div className="flex h-6 items-center justify-between">
        <h2 className="typo-section-title">Saved shortcuts</h2>
      </div>
      <div className="mt-4 grid grid-cols-4 gap-2">
        {quickActions.map(({ label, displayLines, icon: Icon }) => (
          <button key={label} type="button" aria-label={label} className="hynt-home-quick-action-item flex min-w-0 flex-col items-center gap-3 text-center">
            <span className="hynt-home-quick-action-icon grid size-14 place-items-center overflow-hidden rounded-[22px] border-[0.875px] border-[#a3a3a3] bg-white text-[#26c485]">
              <Icon size={21} weight="fill" />
            </span>
            <span className="typo-label hynt-home-quick-action-label flex min-h-8 w-full flex-col justify-start text-center text-black">
              {(displayLines || [label]).map((line) => <span key={line}>{line}</span>)}
            </span>
          </button>
        ))}
      </div>
    </section>
  )
}

function getHomeownerNextStep({
  project,
  taskApprovals,
  financeInvoices,
  projectTasks,
  siteDiaryEntries,
  onOpenProject,
  onOpenApprovals,
  onOpenFinance,
  onOpenTasks,
  onOpenSiteDiary,
}) {
  const pendingApprovals = taskApprovals.filter((approval) => ['pending', 'question'].includes(approval.status))
  if (pendingApprovals.length > 0) {
    const primaryApproval = pendingApprovals[0]
    const hasMultipleApprovals = pendingApprovals.length > 1

    return {
      eyebrow: 'Needs your review',
      title: hasMultipleApprovals ? `${pendingApprovals.length} reviews waiting` : primaryApproval.title,
      body: hasMultipleApprovals
        ? pendingApprovals.slice(0, 2).map((approval) => approval.title).join(' \u00b7 ')
        : primaryApproval.description || 'A selection is waiting for your response.',
      meta: primaryApproval.dueDate ? `Next due ${primaryApproval.dueDate}` : project?.name || 'Project approval',
      cta: hasMultipleApprovals ? 'Review all' : 'Review',
      icon: ClipboardText,
      items: pendingApprovals,
      onClick: onOpenApprovals,
    }
  }

  const dueInvoice = financeInvoices.find((invoice) => invoice.status === 'due')
  if (dueInvoice) {
    return {
      eyebrow: 'Payment due',
      title: dueInvoice.stageLabel || dueInvoice.title,
      body: dueInvoice.summary || 'A project payment needs attention.',
      meta: dueInvoice.dueDate ? `Due ${dueInvoice.dueDate}` : dueInvoice.number,
      cta: 'Open finance',
      icon: Wallet,
      onClick: onOpenFinance,
    }
  }

  const activeTask = projectTasks.find((task) => task.status !== 'done')
  if (activeTask) {
    return {
      eyebrow: 'Project task',
      title: activeTask.title,
      body: activeTask.note || activeTask.sourceLabel || 'Track what the team is working on next.',
      meta: activeTask.dueDate ? `${activeTask.due} \u00b7 ${activeTask.dueDate}` : activeTask.due,
      cta: 'View task',
      icon: ClipboardText,
      onClick: onOpenTasks,
    }
  }

  const latestDiary = siteDiaryEntries[0]
  if (latestDiary) {
    return {
      eyebrow: 'Latest site update',
      title: latestDiary.title,
      body: latestDiary.note || 'The project team shared a new site diary update.',
      meta: latestDiary.createdBy || project?.designerName || 'Project team',
      cta: 'Open diary',
      icon: FileText,
      onClick: onOpenSiteDiary,
    }
  }

  return {
    eyebrow: project ? 'Project workspace' : 'Start planning',
    title: project ? project.name : 'Plan your home with HYNT',
    body: project ? 'Open your private project workspace for approvals, payments, timeline, and shared files.' : 'Begin with categories, ideas, and a private requirement when you are ready.',
    meta: project?.status || 'Private planning',
    cta: project ? 'Open project' : 'Explore',
    icon: ClipboardText,
    onClick: onOpenProject,
  }
}

function HomeownerNextStepCard({
  onOpenProject,
  onOpenApprovals,
  onOpenFinance,
  onOpenTasks,
  onOpenSiteDiary,
}) {
  const {
    project,
    taskApprovals = [],
    financeInvoices = [],
    projectTasks = [],
    siteDiaryEntries = [],
  } = useSharedProject('p-1')
  const nextStep = getHomeownerNextStep({
    project,
    taskApprovals,
    financeInvoices,
    projectTasks,
    siteDiaryEntries,
    onOpenProject,
    onOpenApprovals,
    onOpenFinance,
    onOpenTasks,
    onOpenSiteDiary,
  })
  const Icon = nextStep.icon

  return (
    <section className="px-4 py-5">
      <article className="rounded-lg border border-[#dce8df] bg-[#f7fbf8] p-4">
        <div className="flex items-start gap-3">
          <span className="grid size-11 shrink-0 place-items-center rounded-lg bg-white text-[#267449] shadow-[0_4px_16px_rgba(38,116,73,0.08)]">
            <Icon size={22} weight="fill" />
          </span>
          <div className="min-w-0 flex-1">
            <p className="typo-meta text-[#267449]">{nextStep.eyebrow}</p>
            <h2 className="typo-title-16-strong mt-1 text-black">{nextStep.title}</h2>
            <p className="typo-body mt-2 line-clamp-2 text-[#607269]">{nextStep.body}</p>
            <p className="typo-meta mt-3 text-[#6f8178]">{nextStep.meta}</p>
          </div>
        </div>
        <Button type="button" fullWidth onClick={nextStep.onClick} className="mt-4 h-11 rounded-lg bg-[#267449] text-white hover:bg-[#1f603c] focus-visible:ring-[#267449]">
          {nextStep.cta}
        </Button>
        {nextStep.items?.length > 1 ? (
          <div className="mt-3 flex flex-wrap gap-2">
            {nextStep.items.slice(0, 3).map((item) => (
              <button key={item.id} type="button" onClick={nextStep.onClick} className="typo-meta rounded-full border border-[#dce8df] bg-white px-3 py-1 text-[#102418]">
                {item.type}
              </button>
            ))}
          </div>
        ) : null}
      </article>
    </section>
  )
}

function HomeownerHomeTab({
  isHomeDockDense,
  setIsFlowSwitcherOpen,
  quickActions,
  homepageEvents,
  onOpenBlogs,
  onOpenProject,
  onOpenApprovals,
  onOpenFinance,
  onOpenTasks,
  onOpenSiteDiary,
}) {
  const eventsRailRef = useRef(null)

  useLayoutEffect(() => {
    if (!eventsRailRef.current) return
    eventsRailRef.current.scrollLeft = 0
  }, [])

  return (
    <section className="hynt-home-mobile-canvas relative mx-auto w-full max-w-[390px] overflow-visible bg-white">
      <div className={`hynt-home-topdock ${isHomeDockDense ? 'hynt-home-topdock--dense' : ''}`}>
        <header className="h-[57px] overflow-hidden bg-gradient-to-b from-white to-white/0 backdrop-blur-[12px]">
          <div className="flex h-[57px] items-center justify-between pl-6 pr-4">
            <button type="button" className="typo-body-strong flex w-[119px] items-center text-[#26c485]">
              <span>Mumbai</span>
              <CaretDown className="ml-1" size={12} weight="bold" />
            </button>
            <img src="/hynt-home/logo-green.png" alt="HYNT" className="h-8 w-[53.152px] opacity-0" />
            <div className="flex items-center gap-1 lg:hidden">
              <button type="button" aria-label="Search" className="grid size-[37px] place-items-center rounded-[10px] opacity-0"><MagnifyingGlass size={20} /></button>
              <button type="button" aria-label="Notifications" onClick={() => setIsFlowSwitcherOpen(true)} className="relative grid size-[37px] place-items-center rounded-[10px]"><Bell size={24} /><span className="absolute right-0 top-0.5 size-2 rounded-full bg-[#26c485]" /></button>
              <button type="button" aria-label="Messages" className="relative grid size-[37px] place-items-center rounded-[10px]"><ChatsCircle size={24} /><span className="typo-status-mini absolute -right-px -top-[3.5px] grid size-4 place-items-center rounded-lg bg-[#26c485] text-center text-white">3</span></button>
            </div>
          </div>
        </header>
        <div className="h-px w-full bg-[#e0e0e0]" />
      </div>

      <div>
        <HomeownerNextStepCard
          onOpenProject={onOpenProject}
          onOpenApprovals={onOpenApprovals}
          onOpenFinance={onOpenFinance}
          onOpenTasks={onOpenTasks}
          onOpenSiteDiary={onOpenSiteDiary}
        />

        <div className="mt-5 h-px w-full bg-[#e0e0e0]" />

        <HomeownerQuickActions quickActions={quickActions} />

        <div className="mt-5 h-px w-full bg-[#e0e0e0]" />

        <HomeExploreCategoriesGrid />

        <div className="mt-5 h-px w-full bg-[#e0e0e0]" />

        <HomeBlogsSection onViewAll={onOpenBlogs} />

        <div className="mt-5 h-px w-full bg-[#e0e0e0]" />

        <section className="mt-5">
          <div className="flex h-6 items-center justify-between px-4">
            <h2 className="typo-section-title">Upcoming events</h2>
            <button type="button" className="typo-utility flex h-5 items-center gap-1">View all <ArrowRight size={20} /></button>
          </div>
          <div ref={eventsRailRef} className="no-scrollbar mt-4 flex gap-3 overflow-x-auto overflow-y-visible px-4 pb-1">
            {homepageEvents.map((event) => (
              <article key={event.title} className="min-h-[252px] w-[175px] shrink-0 rounded-3xl border border-[#e0e0e0] bg-[#fbfbfb] p-2">
                <div className="relative h-36 overflow-hidden rounded-2xl border border-[#e0e0e0] bg-white">
                  <img src={event.image} alt={event.title} className="size-full object-cover" />
                  <span className="typo-meta absolute right-2 top-2 rounded-lg border border-[#333] bg-black/70 px-2 py-1 text-white backdrop-blur">{event.interested}</span>
                </div>
                <div className="px-1 pt-3">
                  <p className="typo-section-title truncate">{event.title}</p>
                  <p className="typo-meta mt-1 flex items-center gap-1 text-[#808080]"><CalendarDots size={16} />{event.date}</p>
                  <p className="typo-meta mt-1 flex items-center gap-1 text-[#808080]"><MapPinSimpleArea size={16} />{event.city}</p>
                </div>
              </article>
            ))}
          </div>
        </section>

        <div className="mt-5 h-px w-full bg-[#e0e0e0]" />

        <div className="mt-5 flex h-24 items-center justify-center opacity-30">
          <img src="/hynt-home/logo-green.png" alt="HYNT" className="h-[58px] w-24 object-contain grayscale" />
        </div>
      </div>
    </section>
  )
}

export default HomeownerHomeTab
