import {
  ArrowRight,
  ArrowUp,
  Bell,
  BookmarkSimple,
  CalendarDots,
  CaretDown,
  ChatsCircle,
  CheckSquareOffset,
  IdentificationBadge,
  MagnifyingGlass,
  MapPinSimpleArea,
} from '@phosphor-icons/react'
import HomeExploreCategoriesGrid from './HomeExploreCategoriesGrid'

function HomeownerQuickActions({ quickActions }) {
  return (
    <section className="mt-5 px-4 py-2">
      <div className="flex h-6 items-center justify-between">
        <h2 className="typo-section-title">Saved shortcuts</h2>
        <button type="button" className="typo-utility flex h-5 items-center gap-1">Manage <ArrowRight size={20} /></button>
      </div>
      <div className="no-scrollbar mt-4 flex items-start gap-3 overflow-x-auto pb-1">
        {quickActions.map(({ label, icon: Icon }, index) => (
          <button key={label} type="button" className="hynt-home-quick-action-item flex w-[74px] shrink-0 flex-col items-center gap-3 overflow-hidden text-center">
            <span className={`hynt-home-quick-action-icon grid size-14 place-items-center overflow-hidden rounded-[22px] ${index === 0 ? 'border-[0.438px] border-[#e0e0e0] bg-[#fbfbfb]' : 'border-[0.875px] border-[#a3a3a3] bg-white text-[#26c485]'}`}>
              {index === 0 ? <img src="/hynt-home/brand.png" alt="" className="size-full rounded-[22px] object-cover" /> : <Icon size={21} weight="fill" />}
            </span>
            <span className="typo-label hynt-home-quick-action-label w-[74px] whitespace-normal text-center text-black">{label}</span>
          </button>
        ))}
      </div>
    </section>
  )
}

function HomeownerHomeTab({
  isHomeDockDense,
  setIsFlowSwitcherOpen,
  quickActions,
  roomTags,
  homepageIdeas,
  homepagePros,
  homepageProducts,
  homepageEvents,
  prompt,
  setPrompt,
  openChatFromHome,
  showHomeAiRive,
  allowRiveLoader,
  RivePlayer,
}) {
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
        <section className="mt-5 h-28 px-4">
          <form onSubmit={openChatFromHome} className="h-28 w-[358px] overflow-hidden rounded-3xl border border-[rgba(95,193,138,0.24)] bg-black p-4">
            <div className="flex h-6 items-center gap-2">
              <span className="grid size-6 place-items-center overflow-hidden">
                {showHomeAiRive && allowRiveLoader && RivePlayer ? (
                  <RivePlayer src="/hynt-home/door-and-star2.riv" autoplay className="size-6" />
                ) : (
                  <img src="/hynt-home/door-and-star.svg" alt="" className="size-6" />
                )}
              </span>
              <p className="typo-body whitespace-nowrap text-white">Home planning with <span className="typo-weight-heavy">HYNT</span> <span className="typo-caption text-[#5fc18a]">AI</span></p>
            </div>
            <div className="mt-2 flex h-12 items-center overflow-hidden rounded-2xl border border-[#5fc18a] bg-[#fbfbfb] py-[5px] pl-4 pr-1.5">
              <input
                value={prompt}
                onChange={(event) => setPrompt(event.target.value)}
                placeholder="Ask anything"
                className="typo-input h-[24px] min-w-0 flex-1 bg-transparent text-black outline-none placeholder:text-[#808080] hynt-ai-input"
              />
              <button type="submit" aria-label="Send" className="grid h-9 w-6 shrink-0 place-items-center rounded-[10px] bg-[#26c485] text-black">
                <ArrowUp size={12} weight="bold" />
              </button>
            </div>
          </form>
        </section>

        <div className="mt-5 h-px w-full bg-[#e0e0e0]" />

        <HomeExploreCategoriesGrid />

        <div className="mt-5 h-px w-full bg-[#e0e0e0]" />

        <section className="mt-5 h-24 px-4 py-2">
          <div className="flex h-6 items-center justify-between">
            <h2 className="typo-section-title capitalize">browse by room</h2>
            <button type="button" className="typo-utility flex h-5 items-center gap-1">See all <ArrowRight size={20} /></button>
          </div>
          <div className="no-scrollbar mt-4 flex h-10 gap-2 overflow-x-auto">
            {roomTags.map((tag) => (
              <button key={tag} type="button" className="typo-body h-10 shrink-0 overflow-hidden rounded-[20px] border border-[#9e9e9e] bg-white px-5 text-black hynt-room-chip">{tag}</button>
            ))}
          </div>
        </section>

        <div className="mt-5 h-px w-full bg-[#e0e0e0]" />

        <section className="mt-5 h-64 py-2">
          <div className="flex h-6 items-center justify-between px-4">
            <h2 className="typo-section-title capitalize">Ideas for you</h2>
            <button type="button" className="typo-utility flex h-5 items-center gap-1 hynt-section-link">Explore all <ArrowRight size={20} /></button>
          </div>
          <div className="no-scrollbar mt-4 flex h-[200px] gap-2 overflow-x-auto px-4 py-1">
            {homepageIdeas.map((idea, index) => (
              <article key={idea.image} className="relative h-48 w-[175px] shrink-0 overflow-hidden rounded-2xl border-[1.043px] border-[#e0e0e0] bg-white">
                <img src={idea.image} alt={`Idea ${index + 1}`} className="size-full rounded-[10px] object-cover" />
                {idea.badge ? <span className="typo-meta absolute right-2 top-2 rounded-lg bg-[#eee5d4] px-[11px] py-[3px] text-[#525252]">{idea.badge}</span> : null}
                <button type="button" aria-label="Save idea" className="absolute bottom-2 right-2 grid size-7 place-items-center rounded-lg bg-white"><BookmarkSimple size={16} /></button>
              </article>
            ))}
          </div>
        </section>

        <div className="mt-5 h-px w-full bg-[#e0e0e0]" />

        <section className="no-scrollbar mt-5 flex h-[172px] gap-2 overflow-x-auto px-4">
          {[0, 1, 2].map((item) => (
            <article key={item} className="relative h-[172px] w-[338px] shrink-0 overflow-hidden rounded-3xl bg-[#070a22]">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_74%_18%,#7738ff_0_13%,transparent_34%),radial-gradient(circle_at_25%_75%,#006dff_0_18%,transparent_44%),linear-gradient(135deg,#06091d_0%,#111b70_45%,#7a26ff_100%)]" />
              <p className="typo-title-16-strong absolute left-4 top-4 w-[155px] uppercase text-white">Showcase your brand here</p>
              <button type="button" className="typo-meta absolute bottom-3 right-3 rounded-lg bg-black px-4 py-2 text-white">Learn more</button>
            </article>
          ))}
        </section>

        <div className="mt-5 h-px w-full bg-[#e0e0e0]" />

        <section className="mt-5 h-[286px] py-2">
          <div className="flex h-6 items-center justify-between px-4">
            <h2 className="typo-section-title">Professionals for you</h2>
            <button type="button" className="typo-utility flex h-5 items-center gap-1">View all <ArrowRight size={20} /></button>
          </div>
          <div className="no-scrollbar mt-4 flex h-[230px] gap-3 overflow-x-auto px-4 py-1">
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

        <div className="mt-5 h-px w-full bg-[#e0e0e0]" />

        <section className="mt-5 h-[305px] py-2">
          <div className="flex h-6 items-center justify-between px-4">
            <h2 className="typo-section-title">Products you might like</h2>
            <button type="button" className="typo-utility flex h-5 items-center gap-1">View all <ArrowRight size={20} /></button>
          </div>
          <div className="no-scrollbar mt-4 flex h-[249px] gap-3 overflow-x-auto overflow-y-hidden px-4">
            {homepageProducts.map((product, index) => (
              <article key={`${product.title}-${index}`} className="h-[249px] w-[184px] shrink-0 rounded-2xl border border-[#e0e0e0] bg-[#fbfbfb] p-1">
                <div className="relative h-[139px] overflow-hidden rounded-[15px] border border-[#e0e0e0] bg-white">
                  <img src={product.image} alt={product.title} className="size-full object-cover" />
                  <span className="typo-meta absolute right-2 top-2 rounded-lg bg-white px-2 py-1">1/5</span>
                  <button type="button" className="absolute bottom-2 right-2 grid size-7 place-items-center rounded-lg bg-white"><BookmarkSimple size={16} /></button>
                </div>
                <div className="px-2 pb-2 pt-3">
                  <p className="typo-body-strong line-clamp-2">{product.title}</p>
                  <p className="typo-meta mt-1 text-[#808080]">{product.category}</p>
                  <button type="button" className="typo-meta mt-2 text-[#808080] underline decoration-dotted">Get a quote</button>
                </div>
              </article>
            ))}
          </div>
        </section>

        <div className="mt-5 h-px w-full bg-[#e0e0e0]" />

        <HomeownerQuickActions quickActions={quickActions} />

        <div className="mt-5 h-px w-full bg-[#e0e0e0]" />

        <section className="mt-5 h-[292px]">
          <div className="flex h-6 items-center justify-between px-4">
            <h2 className="typo-section-title">Upcoming events</h2>
            <button type="button" className="typo-utility flex h-5 items-center gap-1">View all <ArrowRight size={20} /></button>
          </div>
          <div className="no-scrollbar mt-4 flex h-[252px] gap-3 overflow-x-auto px-4">
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

        <div className="mt-5 h-px w-full bg-[#e0e0e0]" />

        <div className="mt-5 flex h-24 items-center justify-center opacity-30">
          <img src="/hynt-home/logo-green.png" alt="HYNT" className="h-[58px] w-24 object-contain grayscale" />
        </div>
      </div>
    </section>
  )
}

export default HomeownerHomeTab
