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

const exploreCategories = [
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

function HomeExploreCategoriesGrid({ title = 'Explore Categories' }) {
  return (
    <section className="px-4 py-5">
      <div className="flex items-center justify-between">
        <h2 className="typo-section-title">{title}</h2>
        <button type="button" className="typo-utility flex items-center gap-1">View all <ArrowRight size={16} /></button>
      </div>
      <div className="mt-4 grid grid-cols-4 gap-x-2 gap-y-4">
        {exploreCategories.map(({ label, Icon, tone }) => (
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

export default HomeExploreCategoriesGrid
