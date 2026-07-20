import { useLayoutEffect, useRef } from 'react'
import {
  ArrowRight,
  Bell,
  CalendarDots,
  CaretDown,
  ChatsCircle,
  MapPinSimpleArea,
} from '@phosphor-icons/react'
import Button from '../../components/ui/Button'
import HomeBannerCarousel from './HomeBannerCarousel'
import HomeBlogsSection from './HomeBlogsSection'
import HomeExploreCategoriesGrid from './HomeExploreCategoriesGrid'
import HomeSearchBar from './HomeSearchBar'

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

function HomeownerRequirementCta() {
  return (
    <section className="px-4 py-5">
      <article className="w-full rounded-2xl border border-[#dce8df] bg-[#f7fbf8] px-4 py-5">
        <p className="typo-meta text-[#267449]">Post your requirement</p>
        <h2 className="typo-title-16-strong mt-1 text-black">What do you need help with</h2>
        <p className="typo-body mt-2 max-w-[290px] text-[#607269]">
          Describe your project once and get quotes from up to 5 verified pros within 24 hours.
        </p>
        <Button
          type="button"
          fullWidth
          className="mt-4 h-11 rounded-lg bg-[#267449] text-white hover:bg-[#1f603c] focus-visible:ring-[#267449]"
        >
          Post your requirement
        </Button>
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
}) {
  const eventsRailRef = useRef(null)

  useLayoutEffect(() => {
    if (!eventsRailRef.current) return
    eventsRailRef.current.scrollLeft = 0
  }, [])

  return (
    <section className="hynt-home-mobile-canvas relative mx-auto w-full max-w-[390px] overflow-visible bg-white">
      <div className={`hynt-home-topdock ${isHomeDockDense ? 'hynt-home-topdock--dense' : ''}`}>
        <header className="overflow-hidden bg-gradient-to-b from-white to-white/0 backdrop-blur-[12px]">
          <div className="flex h-[57px] items-center justify-between pl-4 pr-3">
            <button type="button" className="typo-body-strong flex min-w-0 items-center text-[#26c485]">
              <span className="truncate">Mumbai</span>
              <CaretDown className="ml-1" size={12} weight="bold" />
            </button>
            <div className="flex shrink-0 items-center gap-0.5 lg:hidden">
              <button type="button" aria-label="Notifications" onClick={() => setIsFlowSwitcherOpen(true)} className="relative grid size-[37px] place-items-center rounded-[10px]"><Bell size={24} /><span className="absolute right-0 top-0.5 size-2 rounded-full bg-[#26c485]" /></button>
              <button type="button" aria-label="Messages" className="relative grid size-[37px] place-items-center rounded-[10px]"><ChatsCircle size={24} /><span className="typo-status-mini absolute -right-px -top-[3.5px] grid size-4 place-items-center rounded-lg bg-[#26c485] text-center text-white">3</span></button>
            </div>
          </div>
          <div className="px-4 pb-3">
            <HomeSearchBar />
          </div>
        </header>
        <div className="h-px w-full bg-[#e0e0e0]" />
      </div>

      <div>
        <HomeExploreCategoriesGrid />

        <div className="mt-5 h-px w-full bg-[#e0e0e0]" />

        <HomeBannerCarousel audience="homeowner" />

        <div className="h-[6px] w-full bg-[#e0e0e0]" />

        <HomeownerRequirementCta />

        <div className="mt-5 h-px w-full bg-[#e0e0e0]" />

        <HomeownerQuickActions quickActions={quickActions} />

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

        <HomeBlogsSection onViewAll={onOpenBlogs} />

      </div>
    </section>
  )
}

export default HomeownerHomeTab
