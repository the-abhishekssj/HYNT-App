import { useLayoutEffect, useRef, useState } from 'react'
import {
  ArrowRight,
  CalendarDots,
  MapPinSimpleArea,
} from '@phosphor-icons/react'
import HomeBannerCarousel from './HomeBannerCarousel'
import HomeBlogsSection from './HomeBlogsSection'
import HomeExploreCategoriesGrid from './HomeExploreCategoriesGrid'
import HomeSearchBar from './HomeSearchBar'
import HomeTopPromo from './HomeTopPromo'

function HomeDivider({ thick = false }) {
  return <div className={`${thick ? 'h-[6px]' : 'h-px'} w-full bg-[#e0e0e0]`} />
}

function HomeBrandWatermark() {
  return (
    <section className="grid h-24 place-items-center overflow-hidden border-t border-[#e0e0e0] bg-white">
      <img src="/hynt-home/logo-green.png" alt="" className="h-[130px] w-[216px] object-contain opacity-[0.06] grayscale" />
    </section>
  )
}

function HomeownerHomeTab({
  isHomeDockDense,
  setIsFlowSwitcherOpen,
  homepageEvents,
  onOpenBlogs,
}) {
  const eventsRailRef = useRef(null)
  const topDockRef = useRef(null)
  const [topDockSpacerHeight, setTopDockSpacerHeight] = useState(0)

  useLayoutEffect(() => {
    if (!eventsRailRef.current) return
    eventsRailRef.current.scrollLeft = 0
  }, [])

  useLayoutEffect(() => {
    if (typeof window === 'undefined' || !topDockRef.current) return undefined
    const topDock = topDockRef.current

    const updateSpacerHeight = () => {
      setTopDockSpacerHeight(Math.ceil(topDock.getBoundingClientRect().height))
    }

    updateSpacerHeight()
    const observer = window.ResizeObserver ? new window.ResizeObserver(updateSpacerHeight) : null
    observer?.observe(topDock)
    window.addEventListener('resize', updateSpacerHeight)

    return () => {
      observer?.disconnect()
      window.removeEventListener('resize', updateSpacerHeight)
    }
  }, [isHomeDockDense])

  return (
    <section className="hynt-home-mobile-canvas relative mx-auto w-full max-w-[390px] overflow-visible bg-white">
      <div ref={topDockRef} className={`hynt-home-topdock hynt-home-topdock--fixed hynt-home-topdock--safe hynt-home-green-dock ${isHomeDockDense ? 'hynt-home-topdock--dense hynt-home-green-dock--collapsed' : ''}`}>
        <header className="overflow-hidden">
          <div className="hynt-topbar-primary flex items-center justify-between py-2 pl-6 pr-4">
            <img src="/hynt-home/homepagerev/hero-logo.svg" alt="HYNT" className="h-8 w-[108px] object-contain object-left" />
            <div className="flex shrink-0 items-center gap-0.5 lg:hidden">
              <button type="button" aria-label="Notifications" onClick={() => setIsFlowSwitcherOpen(true)} className="relative grid size-[37px] place-items-center rounded-[10px]">
                <img src="/hynt-home/homepagerev/hero-notification.svg" alt="" className="h-[18px] w-[16px] object-contain" />
                <span className="absolute right-0 top-0.5 size-2 rounded-full bg-white" />
              </button>
            </div>
          </div>
          <div className="hynt-topbar-search px-4 pb-3 pt-3">
            <HomeSearchBar fieldClassName="!bg-white text-[#102418] !ring-white/70 focus-within:!ring-white" />
          </div>
          <HomeTopPromo audience="homeowner" />
        </header>
      </div>
      <div className="transition-[height] duration-300 ease-out" style={{ height: topDockSpacerHeight }} aria-hidden="true" />

      <div className="pb-4">
        <HomeExploreCategoriesGrid />

        <HomeDivider thick />

        <section className="py-4">
          <div className="flex h-6 items-center justify-between px-4">
            <h2 className="typo-section-title">Events</h2>
            <button type="button" className="typo-utility flex h-5 items-center gap-1">View all <ArrowRight size={20} /></button>
          </div>
          <div ref={eventsRailRef} className="no-scrollbar mt-4 flex gap-3 overflow-x-auto overflow-y-visible px-3 pb-1">
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

        <HomeDivider thick />

        <HomeBannerCarousel audience="homeowner" />

        <HomeDivider thick />

        <HomeBlogsSection onViewAll={onOpenBlogs} />

        <HomeBrandWatermark />
      </div>
    </section>
  )
}

export default HomeownerHomeTab
