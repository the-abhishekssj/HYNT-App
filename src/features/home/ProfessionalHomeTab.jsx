import {
  ArrowRight,
  ArrowUp,
  BookmarkSimple,
  CalendarDots,
  CheckSquareOffset,
  IdentificationBadge,
  MapPinSimpleArea,
} from '@phosphor-icons/react'
import HomeExploreCategoriesGrid from './HomeExploreCategoriesGrid'

function ProfessionalHomeTab({
  proPrompt,
  setProPrompt,
  roomTags,
  homepageIdeas,
  homepageProducts,
  homepagePros,
  homepageEvents,
}) {
  return (
    <>
      <div className="h-[6px] w-full bg-[#e0e0e0]" />

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
        <div className="flex items-center justify-between">
          <h2 className="typo-section-title">Browse By Room</h2>
          <div className="typo-utility flex items-center gap-1">See all <ArrowRight size={16} /></div>
        </div>
        <div className="no-scrollbar mt-4 flex gap-2 overflow-x-auto overflow-y-visible pb-1">
          {roomTags.map((tag) => (
            <div key={tag} className="typo-body flex h-10 shrink-0 items-center rounded-[20px] border border-[#9e9e9e] px-4">{tag}</div>
          ))}
        </div>
      </section>

      <div className="h-[6px] w-full bg-[#e0e0e0]" />

      <section className="px-4 py-5">
        <div className="flex items-center justify-between">
          <h2 className="typo-section-title">Ideas For You</h2>
          <div className="typo-utility flex items-center gap-1">Explore all <ArrowRight size={16} /></div>
        </div>
        <div className="no-scrollbar mt-4 flex gap-2 overflow-x-auto pb-1">
          {homepageIdeas.map((idea) => (
            <article key={idea.image} className="relative h-48 w-[175px] shrink-0 overflow-hidden rounded-2xl border border-[#e0e0e0]">
              <img src={idea.image} alt="" className="size-full object-cover" />
              {idea.badge ? <span className="typo-meta absolute right-2 top-2 rounded-lg bg-[#eee5d4] px-[11px] py-[3px] text-[#525252]">{idea.badge}</span> : null}
              <button type="button" className="absolute bottom-2 right-2 grid size-7 place-items-center rounded-lg bg-white"><BookmarkSimple size={16} /></button>
            </article>
          ))}
        </div>
      </section>

      <div className="h-[6px] w-full bg-[#e0e0e0]" />

      <section className="px-4 py-5">
        <div className="flex items-center justify-between">
          <h2 className="typo-section-title">Products</h2>
          <ArrowRight size={16} />
        </div>
        <div className="no-scrollbar mt-4 flex h-[249px] gap-3 overflow-x-auto overflow-y-hidden pb-1">
          {homepageProducts.map((product, index) => (
            <article key={`${product.title}-${index}`} className="h-[249px] w-[184px] shrink-0 rounded-2xl border border-[#e0e0e0] bg-[#fbfbfb] p-1">
              <div className="relative h-[139px] overflow-hidden rounded-[15px] border border-[#e0e0e0] bg-white">
                <img src={product.image} alt={product.title} className="size-full object-cover" />
                <span className="typo-meta absolute right-2 top-2 rounded-lg bg-white px-2 py-1">1/5</span>
              </div>
              <div className="px-2 pb-2 pt-3">
                <p className="typo-body-strong truncate">{product.title}</p>
                <p className="typo-meta mt-1 text-[#808080]">{product.category}</p>
                <button type="button" className="typo-meta mt-2 text-[#808080] underline decoration-dotted">Get a quote</button>
              </div>
            </article>
          ))}
        </div>
      </section>

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
