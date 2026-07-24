import { useLayoutEffect, useRef, useState } from 'react'
import {
  ArrowRight,
  CalendarDots,
  CheckSquareOffset,
  FolderOpen,
  ImagesSquare,
  MapPinSimpleArea,
  NotePencil,
  PencilSimpleLine,
  Scroll,
  Wallet,
  X,
} from '@phosphor-icons/react'
import Button from '../../components/ui/Button'
import HomeBannerCarousel from './HomeBannerCarousel'
import HomeBlogsSection from './HomeBlogsSection'
import HomeExploreCategoriesGrid from './HomeExploreCategoriesGrid'

const professionalProjectTools = [
  { label: 'SOW', page: 'sow', Icon: NotePencil },
  { label: 'BOQ', page: 'boq', Icon: Scroll },
  { label: 'Tasks', page: 'tasks', Icon: CheckSquareOffset },
  { label: 'Finance', page: 'finance', Icon: Wallet },
  { label: 'Diary', page: 'site-diary', Icon: PencilSimpleLine },
]

function getVisibleProjects(projects = []) {
  const activeProjects = projects.filter((project) => project.status === 'Active')
  const projectPool = activeProjects.length ? activeProjects : projects
  return projectPool.filter((project) => (project.alerts || []).length > 0)
}

function getAlertToolPage(alert) {
  if (!alert) return null
  if (alert.target === 'archive' || alert.target === 'moodboard') return 'archive'
  return alert.target || null
}

function getProjectUpdateTools(project) {
  const countsByPage = (project.alerts || []).reduce((counts, alert) => {
    const page = getAlertToolPage(alert)
    if (!page) return counts
    return {
      ...counts,
      [page]: (counts[page] || 0) + 1,
    }
  }, {})

  return professionalProjectTools
    .map((tool) => ({
      ...tool,
      count: countsByPage[tool.page] || 0,
    }))
    .filter((tool) => tool.count > 0)
}

function ProjectTodayCard({ project, onOpenProject, onDismiss, isSingle }) {
  const primaryAlert = project.alerts?.[0] || null
  const updateTools = getProjectUpdateTools(project)

  return (
    <article className={`${isSingle ? 'w-full' : 'w-[330px]'} shrink-0 rounded-lg border border-[#dce8df] bg-[#f7fbf8] p-3`}>
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="typo-meta text-[#267449]">Today</p>
          <h2 className="typo-title-16-strong mt-1 truncate text-black">{project.scope}</h2>
          <p className="typo-meta mt-1 truncate text-[#607269]">{project.client} {'\u00b7'} {project.location}</p>
        </div>
        <div className="flex shrink-0 items-center gap-1.5">
          <span className="typo-meta rounded-lg bg-white px-2 py-1 text-[#267449] shadow-[0_4px_16px_rgba(38,116,73,0.08)]">{project.progress}%</span>
          <button type="button" onClick={() => onDismiss(project.id)} aria-label={`Dismiss ${project.scope} update`} className="grid size-7 place-items-center rounded-lg bg-white text-[#607269] shadow-[0_4px_16px_rgba(38,116,73,0.08)]">
            <X size={14} weight="bold" />
          </button>
        </div>
      </div>

      <button type="button" onClick={() => onOpenProject(project.id, primaryAlert?.target || 'overview')} className="mt-3 block w-full text-left">
        <div className="flex items-center justify-between gap-2">
          <p className="typo-meta text-[#6f8178]">{primaryAlert ? primaryAlert.label : 'Next workspace action'}</p>
          <p className="typo-meta shrink-0 text-[#607269]">{primaryAlert ? primaryAlert.time : `Due ${project.dueDate}`}</p>
        </div>
        <p className="typo-body-strong mt-1 line-clamp-2 text-black">{primaryAlert ? primaryAlert.title : `Open ${project.scope}`}</p>
      </button>

      {updateTools.length ? (
        <div className="no-scrollbar mt-3 flex gap-2 overflow-x-auto border-t border-[#dce8df] pt-3">
          {updateTools.map(({ label, page, Icon, count }) => (
            <button
              key={label}
              type="button"
              onClick={() => onOpenProject(project.id, page)}
              className="typo-meta flex h-9 shrink-0 items-center gap-2 rounded-full border border-[#dfe8e3] bg-white px-3 text-[#102418]"
            >
              <span className="text-[#267449]">
                <Icon size={16} weight="fill" />
              </span>
              <span>{label}</span>
              <span className="rounded-full bg-[#eef7f1] px-1.5 py-0.5 text-[#267449]">{String(count).padStart(2, '0')}</span>
            </button>
          ))}
        </div>
      ) : null}
    </article>
  )
}

function ProfessionalTodayRail({ projects, onOpenProject }) {
  const projectRailRef = useRef(null)
  const [dismissedProjectIds, setDismissedProjectIds] = useState([])
  const visibleProjects = getVisibleProjects(projects).filter((project) => !dismissedProjectIds.includes(project.id))
  const isSingleProjectUpdate = visibleProjects.length === 1

  useLayoutEffect(() => {
    if (!projectRailRef.current) return
    projectRailRef.current.scrollLeft = 0
  }, [])

  if (!projects.length) {
    return (
      <section className="px-4 py-5">
        <article className="rounded-lg border border-[#dce8df] bg-[#f7fbf8] p-4">
          <p className="typo-meta text-[#267449]">Workspace</p>
          <h2 className="typo-title-20 mt-2 text-black">No active projects yet</h2>
          <p className="typo-body mt-2 text-[#607269]">Create a project to start tracking scope, timeline, finance, and site updates.</p>
          <Button type="button" fullWidth onClick={() => onOpenProject(null, 'overview')} className="mt-4 h-11 rounded-lg">
            Open projects
          </Button>
        </article>
      </section>
    )
  }

  if (!visibleProjects.length) return null

  return (
    <section className="py-4">
      <div className="mb-3 flex h-6 items-center justify-between px-4">
        <h2 className="typo-section-title">Project updates</h2>
        <span className="typo-meta text-[#607269]">{visibleProjects.length} active</span>
      </div>
      {isSingleProjectUpdate ? (
        <div className="px-4">
          <ProjectTodayCard
            project={visibleProjects[0]}
            onOpenProject={onOpenProject}
            onDismiss={(projectId) => setDismissedProjectIds((current) => [...current, projectId])}
            isSingle
          />
        </div>
      ) : (
      <div ref={projectRailRef} className="no-scrollbar flex gap-3 overflow-x-auto overflow-y-visible pl-4 pr-4">
        {visibleProjects.map((project) => (
          <ProjectTodayCard
            key={project.id}
            project={project}
            onOpenProject={onOpenProject}
            onDismiss={(projectId) => setDismissedProjectIds((current) => [...current, projectId])}
            isSingle={isSingleProjectUpdate}
          />
        ))}
      </div>
      )}
    </section>
  )
}

function ProfessionalLeadInboxPreview({ onOpenProjects, onOpenPortfolio }) {
  return (
    <section className="pb-4">
      <div className="px-4">
        <button type="button" className="flex h-[75px] w-full items-center justify-between rounded-lg bg-black px-4 text-left text-white">
          <span className="min-w-0">
            <span className="typo-body-strong block">See all my leads</span>
            <span className="typo-meta mt-1 block truncate text-white/64">You have 12 leads waiting for you...</span>
          </span>
          <span className="grid size-[42px] shrink-0 place-items-center rounded-[14px] bg-white text-black">
            <ArrowRight size={18} weight="bold" />
          </span>
        </button>
      </div>

      <div className="mt-3 grid grid-cols-2 gap-3 px-4">
        <button type="button" onClick={onOpenProjects} className="rounded-lg border border-[#dce8df] bg-[#f7fbf8] p-4 text-left">
          <span className="grid size-10 place-items-center rounded-lg bg-white text-[#267449] shadow-[0_4px_16px_rgba(38,116,73,0.08)]">
            <FolderOpen size={20} weight="fill" />
          </span>
          <span className="typo-body-strong mt-3 block text-black">Your projects</span>
          <span className="typo-meta mt-1 block text-[#607269]">Open active workspaces</span>
        </button>
        <button type="button" onClick={onOpenPortfolio} className="rounded-lg border border-[#dce8df] bg-[#f7fbf8] p-4 text-left">
          <span className="grid size-10 place-items-center rounded-lg bg-white text-[#267449] shadow-[0_4px_16px_rgba(38,116,73,0.08)]">
            <ImagesSquare size={20} weight="fill" />
          </span>
          <span className="typo-body-strong mt-3 block text-black">Your portfolio</span>
          <span className="typo-meta mt-1 block text-[#607269]">Manage profile work</span>
        </button>
      </div>
    </section>
  )
}

function ProfessionalUpgradeCard({ onUpgrade }) {
  return (
    <section className="px-4 py-5">
      <article className="overflow-hidden rounded-lg border border-[#143a27] bg-[#07140e] p-5 text-white shadow-[0_18px_38px_rgba(7,20,14,0.16)]">
        <p className="typo-meta text-[#8fd5ae]">Upgrade workspace</p>
        <h2 className="typo-title-20 mt-2 text-white">Upgrade to Pro</h2>
        <p className="typo-body mt-2 max-w-[280px] text-white/72">Boost your profile, unlock lead insights, and get priority placement across HYNT discovery.</p>
        <Button variant="inverted" type="button" fullWidth onClick={onUpgrade} className="mt-4 h-11 rounded-lg">
          View plans
        </Button>
      </article>
    </section>
  )
}

function ProfessionalHomeTab({
  homepageEvents,
  onOpenBlogs,
  projects = [],
  onOpenProject,
  isProUpgraded = false,
  onUpgradeToPro,
  onOpenProjects,
  onOpenPortfolio,
}) {
  const eventsRailRef = useRef(null)

  useLayoutEffect(() => {
    if (!eventsRailRef.current) return
    eventsRailRef.current.scrollLeft = 0
  }, [])

  return (
    <>
      {isProUpgraded ? <HomeBannerCarousel audience="professional" /> : <ProfessionalUpgradeCard onUpgrade={onUpgradeToPro} />}

      {isProUpgraded ? (
        <ProfessionalLeadInboxPreview
          onOpenProjects={onOpenProjects}
          onOpenPortfolio={onOpenPortfolio}
        />
      ) : null}

      {isProUpgraded ? <ProfessionalTodayRail projects={projects} onOpenProject={onOpenProject} /> : null}

      <div className="h-[6px] w-full bg-[#e0e0e0]" />

      <HomeExploreCategoriesGrid title="Grow your Network" />

      <div className="h-[6px] w-full bg-[#e0e0e0]" />

      <section className="px-4 py-5">
        <div className="flex items-center justify-between">
          <h2 className="typo-section-title">Upcoming Events</h2>
          <div className="typo-utility flex items-center gap-1">View all <ArrowRight size={16} /></div>
        </div>
        <div ref={eventsRailRef} className="no-scrollbar mt-4 flex gap-3 overflow-x-auto overflow-y-visible pb-1">
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

      <div className="h-[6px] w-full bg-[#e0e0e0]" />

      <HomeBlogsSection onViewAll={onOpenBlogs} />
    </>
  )
}

export default ProfessionalHomeTab
