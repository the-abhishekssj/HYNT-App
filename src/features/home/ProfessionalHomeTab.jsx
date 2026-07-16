import {
  ArrowRight,
  ArrowUp,
  CalendarDots,
  CheckSquareOffset,
  IdentificationBadge,
  MapPinSimpleArea,
} from '@phosphor-icons/react'
import HomeBlogsSection from './HomeBlogsSection'
import HomeExploreCategoriesGrid from './HomeExploreCategoriesGrid'

function ProfessionalHomeTab({
  proPrompt,
  setProPrompt,
  homepagePros,
  homepageEvents,
  onOpenBlogs,
}) {
  return (
    <>
      <section className="px-4 py-5">
        <form
          onSubmit={(event) => event.preventDefault()}
          className="h-28 overflow-hidden rounded-3xl border border-[rgba(95,193,138,0.24)] bg-black p-4"
        >
          <div className="flex h-6 items-center gap-2">
            <span className="grid size-6 place-items-center overflow-hidden">
              <img src="/hynt-home/door-and-star.svg" alt="" className="size-6" />
            </span>
            <p className="typo-body whitespace-nowrap text-white">
              Home planning with <span className="typo-weight-heavy">HYNT</span> <span className="typo-caption text-[#5fc18a]">AI</span>
            </p>
          </div>
          <div className="mt-2 flex h-12 items-center overflow-hidden rounded-2xl border border-[#5fc18a] bg-[#fbfbfb] py-[5px] pl-4 pr-1.5">
            <input
              value={proPrompt}
              onChange={(event) => setProPrompt(event.target.value)}
              placeholder="Ask anything"
              className="typo-input h-[24px] min-w-0 flex-1 bg-transparent text-black outline-none placeholder:text-[#808080]"
            />
            <button type="submit" aria-label="Send" className="grid h-9 w-6 shrink-0 place-items-center rounded-[10px] bg-[#26c485] text-black">
              <ArrowUp size={12} weight="bold" />
            </button>
          </div>
        </form>
      </section>

      <div className="h-[6px] w-full bg-[#e0e0e0]" />

      <HomeExploreCategoriesGrid />

      <div className="h-[6px] w-full bg-[#e0e0e0]" />

      <section className="px-4 py-5">
        <article className="overflow-hidden rounded-3xl border border-[#143a27] bg-[#07140e] p-5 text-white shadow-[0_18px_38px_rgba(7,20,14,0.16)]">
          <p className="typo-meta text-[#8fd5ae]">Upgrade workspace</p>
          <h2 className="typo-title-20 mt-2 text-white">Upgrade to Pro</h2>
          <p className="typo-body mt-2 max-w-[280px] text-white/72">Boost your profile, unlock lead insights, and get priority placement across HYNT discovery.</p>
          <button type="button" className="typo-body-strong mt-4 rounded-full bg-[#5fc18a] px-5 py-3 text-[#07140e]">View plans</button>
        </article>
      </section>

      <div className="h-[6px] w-full bg-[#e0e0e0]" />

      <HomeBlogsSection onViewAll={onOpenBlogs} />

      <div className="h-[6px] w-full bg-[#e0e0e0]" />

      <section className="px-4 py-5">
        <div className="flex items-center justify-between">
          <h2 className="typo-section-title">Professionals</h2>
          <div className="typo-utility flex items-center gap-1">View all <ArrowRight size={16} /></div>
        </div>
        <div className="no-scrollbar mt-4 flex gap-3 overflow-x-auto overflow-y-visible pb-1">
          {homepagePros.map((pro) => (
            <article key={pro.name} className="h-[222px] w-[138px] shrink-0 rounded-2xl border border-[#e6e6e6] bg-white p-2">
              <img src={pro.image} alt={pro.name} className="h-[110px] w-[122px] rounded-xl object-cover" />
              <div className="mt-2 px-1">
                <p className="typo-body-strong truncate text-black">{pro.name}</p>
                <p className="typo-meta truncate text-[#5f5f5f]">{pro.role}</p>
              </div>
              <div className="typo-meta mt-2 flex h-[30px] items-center gap-2 px-0.5 text-[#808080]"><span className="flex items-center gap-1"><CheckSquareOffset size={16} />42</span><span className="h-3 w-px bg-[#d1d1d1]" /><span className="flex items-center gap-1"><IdentificationBadge size={16} />5 years</span></div>
            </article>
          ))}
        </div>
      </section>

      <div className="h-[6px] w-full bg-[#e0e0e0]" />

      <section className="px-4 py-5">
        <div className="flex items-center justify-between">
          <h2 className="typo-section-title">Upcoming Events</h2>
          <div className="typo-utility flex items-center gap-1">View all <ArrowRight size={16} /></div>
        </div>
        <div className="no-scrollbar mt-4 flex gap-3 overflow-x-auto overflow-y-visible pb-1">
          {homepageEvents.map((event) => (
            <article key={event.title} className="h-[252px] w-[175px] shrink-0 rounded-3xl border border-[#e0e0e0] bg-[#fbfbfb] p-2">
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

      <div className="flex h-24 items-center justify-center py-5 opacity-30">
        <img src="/hynt-home/logo-green.png" alt="HYNT" className="h-[58px] w-24 object-contain grayscale" />
      </div>
    </>
  )
}

export default ProfessionalHomeTab
