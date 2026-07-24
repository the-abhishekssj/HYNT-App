import {
  ArrowRight,
  Armchair,
  Buildings,
  Compass,
  LampPendant,
  PlugsConnected,
  SolarPanel,
  Storefront,
  UsersThree,
} from '@phosphor-icons/react'

const legacyExploreCategories = [
  {
    label: 'Brands',
    Icon: Storefront,
    tone: 'bg-[#eaf7ef] text-[#267449]',
  },
  {
    label: 'Interior Designers',
    Icon: UsersThree,
    tone: 'bg-[#eef3fb] text-[#315f8f]',
  },
  {
    label: 'Architects',
    Icon: Buildings,
    tone: 'bg-[#f4f0ea] text-[#7b5a31]',
  },
  {
    label: 'Home Automation',
    Icon: PlugsConnected,
    tone: 'bg-[#eef5f7] text-[#2d6874]',
  },
  {
    label: 'Vastu Consultants',
    Icon: Compass,
    tone: 'bg-[#f8f0ec] text-[#9a5436]',
  },
  {
    label: 'Furniture & Decor',
    Icon: Armchair,
    tone: 'bg-[#f2f5ec] text-[#637a32]',
  },
  {
    label: 'Lighting',
    Icon: LampPendant,
    tone: 'bg-[#f8f4df] text-[#927317]',
  },
  {
    label: 'Solar & Sustainability',
    Icon: SolarPanel,
    tone: 'bg-[#eaf6f2] text-[#2f7568]',
  },
]

const exploreCategories = [
  {
    label: 'Interior Designers',
    description: 'Design your dream space',
    icon: '/hynt-home/homepagerev/interior-design.svg',
  },
  {
    label: 'Furniture & Decor',
    description: 'Style every corner of your home',
    icon: '/hynt-home/homepagerev/furniture.svg',
  },
  {
    label: 'Solar & Sustainability',
    description: 'Power your home sustainably',
    icon: '/hynt-home/homepagerev/solar.svg',
  },
  {
    label: 'Interior Designers',
    description: 'Design your dream space',
    icon: '/hynt-home/homepagerev/interior-design.svg',
  },
  {
    label: 'Interior Designers',
    description: 'Design your dream space',
    icon: '/hynt-home/homepagerev/interior-design.svg',
  },
]

function CategoryIcon({ src }) {
  return <img src={src} alt="" className="size-6 object-contain" />
}

function HomeExploreCategoriesGrid({ title = 'Categories', layout = 'cards' }) {
  if (layout === 'icons') {
    return (
      <section className="px-4 py-5">
        <div className="flex items-center justify-between">
          <h2 className="typo-section-title">{title}</h2>
          <button type="button" className="typo-utility flex items-center gap-1">
            View all <ArrowRight size={16} />
          </button>
        </div>
        <div className="mt-4 grid grid-cols-4 gap-x-2 gap-y-4">
          {legacyExploreCategories.map(({ label, Icon, tone }) => (
            <button
              key={label}
              type="button"
              aria-label={label}
              className="flex min-w-0 flex-col items-center text-center"
            >
              <span className={`grid size-16 place-items-center rounded-full border border-white shadow-[0_8px_22px_rgba(22,44,32,0.08)] ${tone}`}>
                <Icon size={28} weight="duotone" />
              </span>
              <span className="typo-caption mt-2 block min-h-8 w-full text-balance px-1 text-black">{label}</span>
            </button>
          ))}
        </div>
      </section>
    )
  }

  return (
    <section className="px-3 py-4">
      <div className="flex items-center justify-between px-1">
        <h2 className="typo-section-title">{title}</h2>
        <button type="button" className="typo-utility flex items-center gap-1">
          View all <ArrowRight size={16} />
        </button>
      </div>

      <div className="mt-4 grid grid-cols-3 gap-x-3 gap-y-4">
        <button
          type="button"
          aria-label="Sponsor of the day"
          className="group relative min-h-[132px] overflow-hidden rounded-[20px] border border-black/[0.04] bg-[#fbfbfb] text-left shadow-[4px_8px_12px_-9px_rgba(95,193,138,0.12)]"
        >
          <video
            aria-hidden="true"
            autoPlay
            className="absolute inset-0 size-full object-cover transition duration-300 group-hover:scale-[1.03]"
            loop
            muted
            playsInline
            preload="metadata"
            src="/hynt-home/homepagerev/sponsor-video.mp4"
          />
        </button>

        {exploreCategories.map(({ label, description, icon }, index) => (
          <button
            key={`${label}-${index}`}
            type="button"
            aria-label={label}
            className="min-h-[132px] rounded-[20px] border border-black/[0.04] bg-[#fbfbfb] px-3 pb-4 pt-3 text-left shadow-[4px_8px_12px_-9px_rgba(95,193,138,0.12)]"
          >
            <span className="grid size-10 place-items-center rounded-[12px] bg-black/[0.08] text-black">
              <CategoryIcon src={icon} />
            </span>
            <span className="typo-body-12 mt-2 block text-balance text-black">{label}</span>
            <span className="typo-caption mt-1 block text-balance text-black/64">{description}</span>
          </button>
        ))}
      </div>
    </section>
  )
}

export default HomeExploreCategoriesGrid
