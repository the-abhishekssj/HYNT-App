import { useEffect, useState } from 'react'
import {
  ArrowRight,
  BookmarkSimple,
  CaretLeft,
  DotsThreeVertical,
  House,
  ImagesSquare,
  MagnifyingGlass,
  MapPin,
  PaperPlaneTilt,
  PhoneCall,
  SlidersHorizontal,
  Star,
  WhatsappLogo,
} from '@phosphor-icons/react'
import Button from '../../components/ui/Button'
import InputBar from '../../components/ui/InputBar'

const roomCategories = [
  {
    id: 'kitchen',
    title: 'Kitchen',
    count: '12,540+ ideas',
    image: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?auto=format&fit=crop&w=700&q=80',
  },
  {
    id: 'bath',
    title: 'Bath',
    count: '8,230+ ideas',
    image: 'https://images.unsplash.com/photo-1629079447777-1e605162dc8d?auto=format&fit=crop&w=700&q=80',
  },
  {
    id: 'bedroom',
    title: 'Bedroom',
    count: '15,890+ ideas',
    image: 'https://images.unsplash.com/photo-1616594039964-ae9021a400a0?auto=format&fit=crop&w=700&q=80',
  },
  {
    id: 'living',
    title: 'Living',
    count: '20,350+ ideas',
    image: 'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=700&q=80',
  },
  {
    id: 'dining',
    title: 'Dining',
    count: '6,420+ ideas',
    image: 'https://images.unsplash.com/photo-1617806118233-18e1de247200?auto=format&fit=crop&w=700&q=80',
  },
  {
    id: 'outdoor',
    title: 'Outdoor & Garden',
    count: '10,210+ ideas',
    image: 'https://images.unsplash.com/photo-1598902108854-10e335adac99?auto=format&fit=crop&w=700&q=80',
  },
]

const productCategories = [
  ['Furniture & Decor', '420+ products', 'https://images.unsplash.com/photo-1618220179428-22790b461013?auto=format&fit=crop&w=700&q=80'],
  ['Modular Kitchens', '310+ products', 'https://images.unsplash.com/photo-1556912173-3bb406ef7e77?auto=format&fit=crop&w=700&q=80'],
  ['Smart Home', '180+ products', 'https://images.unsplash.com/photo-1558002038-1055907df827?auto=format&fit=crop&w=700&q=80'],
  ['Lighting', '260+ products', 'https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?auto=format&fit=crop&w=700&q=80'],
  ['Solar & Sustainability', '90+ products', 'https://images.unsplash.com/photo-1509391366360-2e959784a276?auto=format&fit=crop&w=700&q=80'],
  ['Bath & Sanitaryware', '140+ products', 'https://images.unsplash.com/photo-1600566752355-35792bedcfea?auto=format&fit=crop&w=700&q=80'],
  ['HVAC & Appliances', '75+ products', 'https://images.unsplash.com/photo-1581092160562-40aa08e78837?auto=format&fit=crop&w=700&q=80'],
  ['Paints & Finishes', '110+ products', 'https://images.unsplash.com/photo-1562259949-e8e7689d7828?auto=format&fit=crop&w=700&q=80'],
].map(([title, count, image]) => ({ id: title, title, count, image }))

const ideaCards = [
  ['idea-1', 'h-[170px]', 'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&w=700&q=80'],
  ['idea-2', 'h-[130px]', 'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?auto=format&fit=crop&w=700&q=80'],
  ['idea-3', 'h-[140px]', 'https://images.unsplash.com/photo-1600210491892-03d54c0aaf87?auto=format&fit=crop&w=700&q=80'],
  ['idea-4', 'h-[195px]', 'https://images.unsplash.com/photo-1617103996702-96ff29b1c467?auto=format&fit=crop&w=700&q=80'],
  ['idea-5', 'h-[110px]', 'https://images.unsplash.com/photo-1616137466211-f939a420be84?auto=format&fit=crop&w=700&q=80'],
  ['idea-6', 'h-[160px]', 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=700&q=80'],
  ['idea-7', 'h-[150px]', 'https://images.unsplash.com/photo-1615529182904-14819c35db37?auto=format&fit=crop&w=700&q=80'],
  ['idea-8', 'h-[120px]', 'https://images.unsplash.com/photo-1598928636135-d146006ff4be?auto=format&fit=crop&w=700&q=80'],
].map(([id, height, image]) => ({ id, height, image }))

const projectViewerImages = [
  '/hynt-home/explore/project-view-1.png',
  '/hynt-home/explore/project-view-2.png',
  'https://images.unsplash.com/photo-1600210492493-0946911123ea?auto=format&fit=crop&w=900&q=80',
  'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=900&q=80',
  'https://images.unsplash.com/photo-1615529182904-14819c35db37?auto=format&fit=crop&w=900&q=80',
]

const projectViewerCreator = {
  name: 'Neha Singh',
  role: 'Interior Designer',
  city: 'Mumbai',
  rating: '4.5',
  ratingsCount: '42',
  avatar: '/hynt-home/explore/neha-singh.png',
}

const projectViewerProject = {
  title: 'Mehta 3BHK, Bandra West',
  subtitle: 'By Neha Singh',
}

const trendingBrands = [
  ['Meraki Interiors', 'Furniture', '#E67E22'],
  ['Native', 'Smart Home', '#12352A'],
  ['Kova Kitchens', 'Modular', '#6B5842'],
  ['Solaris', 'Solar', '#3E7B60'],
].map(([name, category, color]) => ({ name, category, color }))

const roomFilters = ['All', 'Modern', 'Minimal', 'Traditional', 'Compact', 'Budget-friendly']

function useExploreChromeVisibility() {
  const [hidden, setHidden] = useState(false)

  useEffect(() => {
    let lastScrollY = window.scrollY
    let ticking = false

    const updateChrome = () => {
      const currentScrollY = window.scrollY

      if (currentScrollY < 24) {
        setHidden(false)
      } else if (currentScrollY > lastScrollY + 8) {
        setHidden(true)
      } else if (currentScrollY < lastScrollY - 8) {
        setHidden(false)
      }

      lastScrollY = Math.max(currentScrollY, 0)
      ticking = false
    }

    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(updateChrome)
        ticking = true
      }
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return hidden
}

function ExploreChrome({ hidden = false, animated = false, children }) {
  return (
    <div className={`fixed left-1/2 top-0 z-[90] w-full max-w-[390px] -translate-x-1/2 border-b border-[#e0e0e0] bg-[rgba(255,255,255,0.92)] backdrop-blur-[16px] ${animated ? 'transition-transform duration-200 ease-out will-change-transform' : ''} ${hidden ? '-translate-y-full' : 'translate-y-0'}`}>
      {children}
    </div>
  )
}

function ExploreTopbar({ title, subtitle, onBack, actions = null }) {
  return (
    <header className="px-4 py-3">
      <div className="flex items-center justify-between gap-3 py-1">
        <button type="button" onClick={onBack} className="flex min-w-0 items-center gap-4 text-left">
          <span className="grid size-6 shrink-0 place-items-center rounded">
            <CaretLeft size={24} />
          </span>
          <span className="min-w-0">
            <span className="typo-section-title block truncate text-black">{title}</span>
            {subtitle ? <span className="typo-caption block truncate text-[#999999]">{subtitle}</span> : null}
          </span>
        </button>
        {actions ? <div className="flex shrink-0 items-center gap-2">{actions}</div> : null}
      </div>
    </header>
  )
}

function SectionHeader({ title, subtitle, action = 'View all' }) {
  return (
    <div className="mb-4 flex items-end justify-between gap-4 px-4">
      <div className="min-w-0">
        <h2 className="typo-section-title text-black">{title}</h2>
        {subtitle ? <p className="typo-meta mt-1 text-[#607269]">{subtitle}</p> : null}
      </div>
      {action ? (
        <button type="button" className="typo-utility flex shrink-0 items-center gap-1 text-black">
          {action} <ArrowRight size={16} />
        </button>
      ) : null}
    </div>
  )
}

function ExploreSearch() {
  return (
    <div className="px-4 pb-4">
      <InputBar
        type="search"
        aria-label="Search Explore"
        placeholder="Search professionals, products, brands, ideas"
        leadingIcon={MagnifyingGlass}
        trailingIcon={SlidersHorizontal}
      />
    </div>
  )
}

function ModeTabs({ mode, setMode }) {
  const tabs = [
    { id: 'ideas', label: 'Ideas', icon: ImagesSquare },
    { id: 'products', label: 'Products', icon: House },
  ]

  return (
    <div className="no-scrollbar flex gap-2 overflow-x-auto px-4 pb-3">
      {tabs.map(({ id, label, icon: Icon }) => {
        const selected = mode === id
        return (
          <button
            key={id}
            type="button"
            onClick={() => setMode(id)}
            className={`typo-label flex h-9 shrink-0 items-center gap-2 rounded-full border px-3 ${
              selected ? 'border-[#26c485] bg-[#eefaf3]' : 'border-[#e0e0e0] bg-white'
            }`}
          >
            <span className="grid size-5 shrink-0 place-items-center text-[#267449]">
              <Icon size={14} weight="fill" />
            </span>
            <span className="leading-none text-black">{label}</span>
          </button>
        )
      })}
    </div>
  )
}

function SponsoredBanner() {
  return (
    <section className="my-5 px-4">
      <article className="grid min-h-[154px] grid-cols-[1fr_1.1fr] overflow-hidden rounded-[18px] border border-[#e5e5e5] bg-[#f4f1ea]">
        <div className="flex flex-col justify-center p-4">
          <p className="typo-title-16-strong uppercase leading-tight text-black">Kitchens that <span className="block text-[#12352A]">inspire</span></p>
          <p className="typo-meta mt-2 text-[#607269]">Premium fittings. Timeless spaces.</p>
          <Button type="button" size="small" className="mt-3 rounded-lg px-3">
            Explore now
          </Button>
        </div>
        <div className="relative bg-[linear-gradient(150deg,#2A2320,#6B5842)] p-3 text-white">
          <img src="https://images.unsplash.com/photo-1556911220-bff31c812dba?auto=format&fit=crop&w=700&q=80" alt="" className="absolute inset-0 size-full object-cover opacity-70" />
          <span className="typo-label relative z-10 block text-right uppercase tracking-[0.08em]">Kova</span>
          <span className="typo-caption absolute bottom-3 right-3 z-10 rounded-full bg-black/35 px-2 py-1 text-white backdrop-blur">Sponsored</span>
        </div>
      </article>
    </section>
  )
}

function CategoryCard({ item, onClick }) {
  return (
    <button type="button" onClick={onClick} className="overflow-hidden rounded-[18px] border border-[#e5e5e5] bg-white text-left">
      <div className="relative h-[126px] overflow-hidden bg-[#102418]">
        <img src={item.image} alt="" className="size-full object-cover" loading="lazy" />
      </div>
      <div className="px-4 py-4">
        <h3 className="typo-body-strong text-black">{item.title}</h3>
      </div>
    </button>
  )
}

function IdeasLanding({ setView, setSelectedRoom }) {
  const firstCategoryRow = roomCategories.slice(0, 2)
  const remainingCategories = roomCategories.slice(2)

  return (
    <>
      <section>
        <div className="grid grid-cols-2 gap-3 px-4">
          {firstCategoryRow.map((room) => (
            <CategoryCard
              key={room.id}
              item={room}
              onClick={() => {
                setSelectedRoom(room)
                setView('room')
              }}
            />
          ))}
        </div>
      </section>

      <SponsoredBanner />

      <section className="mb-6">
        <div className="grid grid-cols-2 gap-3 px-4">
          {remainingCategories.map((room) => (
            <CategoryCard
              key={room.id}
              item={room}
              onClick={() => {
                setSelectedRoom(room)
                setView('room')
              }}
            />
          ))}
        </div>
      </section>
      <section className="mb-6">
        <SectionHeader title="Featured Project" />
        <button type="button" onClick={() => setView('detail')} className="mx-4 block overflow-hidden rounded-[18px] border border-[#e5e5e5] bg-white text-left">
          <div className="h-[150px] overflow-hidden">
            <img src="https://images.unsplash.com/photo-1600210492493-0946911123ea?auto=format&fit=crop&w=900&q=80" alt="" className="size-full object-cover" />
          </div>
          <div className="p-4">
            <h3 className="typo-title-16-strong text-black">Serene minimal home in Bandra, Mumbai</h3>
            <p className="typo-body mt-2 line-clamp-2 text-[#607269]">A calm, clutter-free home designed with natural textures and warm neutrals.</p>
            <p className="typo-meta mt-3 flex items-center gap-1 text-[#607269]"><MapPin size={14} /> Bandra, Mumbai <span className="px-1 text-[#d0d0d0]">|</span> 2,400 sq.ft</p>
          </div>
        </button>
      </section>
    </>
  )
}

function ProductsLanding() {
  return (
    <>
      <section className="mb-6">
        <SectionHeader title="Shop by Category" subtitle="From HYNT Elite brands and verified vendors" action={null} />
        <div className="grid grid-cols-2 gap-3 px-4">
          {productCategories.map((category) => <CategoryCard key={category.id} item={category} />)}
        </div>
      </section>
      <section className="mb-6">
        <SectionHeader title="Trending Brands" />
        <div className="no-scrollbar flex gap-3 overflow-x-auto px-4 pb-1">
          {trendingBrands.map((brand) => (
            <article key={brand.name} className="w-[132px] shrink-0 rounded-[18px] border border-[#e5e5e5] bg-white p-4 text-center">
              <span className="mx-auto grid size-11 place-items-center rounded-full text-white" style={{ background: brand.color }}>{brand.name.slice(0, 1)}</span>
              <h3 className="typo-body-strong mt-3 truncate text-black">{brand.name}</h3>
              <p className="typo-meta mt-1 text-[#607269]">{brand.category}</p>
            </article>
          ))}
        </div>
      </section>
    </>
  )
}

function RoomFeed({ room, setView }) {
  const [filter, setFilter] = useState('All')

  return (
    <>
      <ExploreChrome>
        <ExploreTopbar
          title={room?.title || 'Living Room'}
          onBack={() => setView('landing')}
        />
        <div className="no-scrollbar flex gap-2 overflow-x-auto px-4 pb-4">
          {roomFilters.map((item) => (
            <button key={item} type="button" onClick={() => setFilter(item)} className={`typo-meta shrink-0 rounded-full px-4 py-2 ${filter === item ? 'bg-black text-white' : 'border border-[#e5e5e5] bg-white text-black'}`}>
              {item}
            </button>
          ))}
        </div>
      </ExploreChrome>
      <div className="h-[126px]" />
      <div className="hynt-explore-masonry px-2 pb-8">
        {ideaCards.map((card) => (
          <button key={card.id} type="button" onClick={() => setView('viewer')} className={`hynt-explore-masonry-item relative mb-2 w-full overflow-hidden rounded-2xl bg-[#102418] text-left ${card.height}`}>
            <img src={card.image} alt="" className="size-full object-cover" loading="lazy" />
            <span className="absolute right-2 top-2 grid size-8 place-items-center rounded-full bg-white text-black">
              <BookmarkSimple size={16} />
            </span>
          </button>
        ))}
      </div>
    </>
  )
}

function ProjectFullscreenViewer({ room, onBack, onOpenProfile }) {
  const creator = projectViewerCreator

  return (
    <section className="fixed left-1/2 top-0 z-[120] flex h-dvh w-full max-w-[390px] -translate-x-1/2 flex-col overflow-hidden bg-black text-white">
      <div className="shrink-0 border-b border-[#e0e0e0] bg-[rgba(255,255,255,0.92)] text-black backdrop-blur-[16px]">
        <ExploreTopbar
          title={projectViewerProject.title}
          subtitle={projectViewerProject.subtitle}
          onBack={onBack}
          actions={(
            <button type="button" aria-label="More project actions" className="grid size-9 place-items-center rounded-full text-black">
              <DotsThreeVertical size={22} weight="bold" />
            </button>
          )}
        />
      </div>

      <main className="relative min-h-0 flex-1 overflow-hidden bg-black">
        <div className="no-scrollbar flex h-full snap-x snap-mandatory overflow-x-auto">
          {projectViewerImages.map((image, index) => (
            <div key={`${image}-${index}`} className="relative h-full w-full shrink-0 snap-center">
              <img src={image} alt="" className="absolute inset-0 size-full object-cover" />
            </div>
        ))}
        </div>
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-black/12 via-transparent to-black/48" />

        <span className="typo-meta absolute right-4 top-4 z-20 rounded-lg bg-white px-2.5 py-1 text-black">
          1/5
        </span>
      </main>

      <footer className="shrink-0 rounded-t-[16px] bg-[#161616] pb-[max(16px,env(safe-area-inset-bottom))]">
        <div className="flex justify-center py-2">
          <span className="h-[5px] w-9 rounded-full bg-white/88" />
        </div>
        <button
          type="button"
          onClick={() => onOpenProfile?.(creator)}
          className="flex w-full items-center gap-3 border-b border-white/[0.04] bg-[#121212] p-4 text-left"
        >
          <img src={creator.avatar} alt={creator.name} className="size-14 shrink-0 rounded-[13px] border border-white/40 object-cover" />
          <span className="min-w-0 flex-1">
            <span className="typo-body-strong block truncate text-white">{creator.name}</span>
            <span className="typo-meta mt-1 block truncate text-white/64">{creator.role}, {creator.city}</span>
          </span>
          <span className="flex shrink-0 flex-col items-end gap-1">
            <span className="flex items-center gap-1.5">
              <Star size={16} weight="fill" className="text-[#ffd34e]" />
              <span className="typo-body-strong text-white">{creator.rating}</span>
            </span>
            <span className="typo-caption text-white/48">{creator.ratingsCount} Ratings</span>
          </span>
        </button>

        <div className="flex h-[72px] items-center gap-2 px-4 pt-2">
          <button type="button" aria-label="Save project" className="grid h-12 w-12 shrink-0 place-items-center rounded-[16px] bg-[#5fc18a] text-white">
            <BookmarkSimple size={17} weight="fill" />
          </button>
          <button type="button" className="typo-body-strong flex h-12 min-w-0 flex-1 items-center justify-center gap-2 rounded-[16px] bg-white px-4 text-black shadow-[0_4px_8px_-2px_rgba(0,0,0,0.16)]">
            <PaperPlaneTilt size={20} weight="fill" />
            <span>Send Inquiry</span>
          </button>
          <a href="tel:+910000000000" aria-label="Call designer" className="grid h-12 w-12 shrink-0 place-items-center rounded-[16px] bg-white text-black">
            <PhoneCall size={17} weight="fill" />
          </a>
          <a href="https://wa.me/910000000000" aria-label="Message designer on WhatsApp" className="grid h-12 w-12 shrink-0 place-items-center rounded-[16px] bg-white text-black">
            <WhatsappLogo size={17} weight="fill" />
          </a>
        </div>
      </footer>

      <span className="sr-only">{room?.title || 'Explore'} project preview</span>
    </section>
  )
}

function IdeaDetail({ setView }) {
  return (
    <>
      <ExploreChrome>
        <ExploreTopbar
          title="Living Room"
          subtitle="Warm minimal living room"
          onBack={() => setView('room')}
          actions={(
            <button type="button" aria-label="Save idea" className="grid size-9 place-items-center rounded-full border border-[#e0e0e0] bg-white text-black">
              <BookmarkSimple size={17} />
            </button>
          )}
        />
      </ExploreChrome>
      <div className="h-[65px]" />
      <section className="relative h-[330px] overflow-hidden bg-[#102418]">
        <img src="https://images.unsplash.com/photo-1600210492493-0946911123ea?auto=format&fit=crop&w=900&q=80" alt="" className="absolute inset-0 size-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-transparent to-black/20" />
        <span className="typo-meta absolute bottom-4 left-4 rounded-full bg-white px-3 py-1 text-black">Living Room</span>
      </section>
      <section className="px-4 py-5">
        <h1 className="typo-title-20-strong text-black">Warm minimal living room, Bandra</h1>
        <div className="mt-4 flex items-center gap-3 rounded-[18px] border border-[#e5e5e5] bg-white p-3">
          <span className="grid size-11 place-items-center rounded-full bg-[#e9fbf3] text-[#267449]">RD</span>
          <span className="min-w-0 flex-1">
            <span className="typo-body-strong block text-black">Riya Desai Studio</span>
            <span className="typo-meta block text-[#607269]">Interior Design {'\u00b7'} 4.9 stars</span>
          </span>
          <Button type="button" size="small" variant="outline" className="rounded-full border-black bg-white px-3">View</Button>
        </div>
        <p className="typo-body mt-4 text-[#607269]">A calm, clutter-free living room built around natural textures and warm neutrals. Oak veneer panelling, a low-slung sectional and layered lighting keep the space feeling open.</p>
        <div className="mt-4 grid grid-cols-3 gap-2">
          {[
            ['Bandra', 'Location'],
            ['340 sq.ft', 'Room size'],
            ['\u20b98.5L', 'Approx. cost'],
          ].map(([value, label]) => (
            <div key={label} className="rounded-[16px] bg-[#f5f6f4] p-3">
              <p className="typo-body-strong text-black">{value}</p>
              <p className="typo-caption mt-1 text-[#607269]">{label}</p>
            </div>
          ))}
        </div>
      </section>
      <section className="pb-8">
        <SectionHeader title="Shop this look" />
        <div className="no-scrollbar flex gap-3 overflow-x-auto px-4">
          {productCategories.slice(0, 4).map((product) => (
            <article key={product.id} className="w-[150px] shrink-0 rounded-[18px] border border-[#e5e5e5] bg-white p-2">
              <div className="h-28 overflow-hidden rounded-[14px]">
                <img src={product.image} alt="" className="size-full object-cover" />
              </div>
              <p className="typo-body-strong mt-3 line-clamp-2 text-black">{product.title}</p>
              <p className="typo-meta mt-1 text-[#607269]">Verified brand</p>
            </article>
          ))}
        </div>
      </section>
    </>
  )
}

function ExploreLanding({ onDepthChange }) {
  const [mode, setMode] = useState('ideas')
  const [view, setView] = useState('landing')
  const [selectedRoom, setSelectedRoom] = useState(roomCategories[3])
  const [, setSelectedCreator] = useState(null)
  const chromeHidden = useExploreChromeVisibility()

  useEffect(() => {
    onDepthChange?.(view !== 'landing')
  }, [onDepthChange, view])

  if (view === 'room') return <RoomFeed room={selectedRoom} setView={setView} />
  if (view === 'viewer') {
    return (
      <ProjectFullscreenViewer
        room={selectedRoom}
        onBack={() => setView('room')}
        onOpenProfile={(creator) => setSelectedCreator(creator)}
      />
    )
  }
  if (view === 'detail') return <IdeaDetail setView={setView} />

  return (
    <>
      <ExploreChrome hidden={chromeHidden} animated>
        <div className="px-4 pb-3 pt-4">
          <h1 className="typo-page-title text-black">Explore</h1>
        </div>
        <ExploreSearch />
        <ModeTabs mode={mode} setMode={setMode} />
      </ExploreChrome>
      <div className="h-[184px]" />
      {mode === 'ideas' ? <IdeasLanding setView={setView} setSelectedRoom={setSelectedRoom} /> : null}
      {mode === 'products' ? <ProductsLanding /> : null}
    </>
  )
}

function ExplorePage({ onDepthChange }) {
  return (
    <section className="hynt-explore-canvas mx-auto w-full max-w-[390px] overflow-visible bg-white pb-[108px]">
      <ExploreLanding onDepthChange={onDepthChange} />
    </section>
  )
}

export default ExplorePage
