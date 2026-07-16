import {
  Bookmark,
  Crosshair,
  Handshake,
  House,
  ImagesSquare,
  NotePencil,
  SlidersHorizontal,
} from '@phosphor-icons/react'

const exploreCategories = [
  { label: 'Brands', spotlight: true },
  { label: 'Interior Designers', Icon: Handshake },
  { label: 'Architects', Icon: NotePencil },
  { label: 'Home Automation', Icon: House },
  { label: 'Vastu Consultants', Icon: Crosshair },
  { label: 'Furniture & Decor', Icon: Bookmark },
  { label: 'Lighting', Icon: ImagesSquare },
  { label: 'Solar & Sustainability', Icon: SlidersHorizontal },
]

function HomeExploreCategoriesGrid({ title = 'Explore Categories' }) {
  return (
    <section className="px-4 py-5">
      <div className="flex items-center justify-between">
        <h2 className="typo-section-title">{title}</h2>
        <button type="button" className="typo-utility text-[#267449]">See all</button>
      </div>
      <div className="mt-4 grid grid-cols-4 gap-2">
        {exploreCategories.map(({ label, Icon, spotlight }) => (
          <button
            key={label}
            type="button"
            className={`relative flex min-h-[104px] flex-col items-center justify-center gap-2 overflow-hidden rounded-[17px] px-1 py-3 text-center shadow-[0_4px_12px_rgba(0,0,0,0.03)] ${
              spotlight
                ? 'hynt-category-spotlight border border-[#a4db9c] bg-[linear-gradient(145deg,#fffdf7,#edf8ef)]'
                : 'border border-[#e0e0e0] bg-white'
            }`}
          >
            {spotlight ? (
              <>
                <span className="hynt-category-spotlight__halo" aria-hidden="true" />
                <span className="relative z-10 grid size-[58px] place-items-center rounded-full bg-white shadow-[0_10px_24px_rgba(38,116,73,0.18)]">
                  <img src="/hynt-home/brand.png" alt="" className="size-12 rounded-full border border-white object-cover" />
                </span>
                <span className="typo-caption relative z-10 max-w-full text-balance text-black">{label}</span>
              </>
            ) : (
              <>
                <span className="grid size-10 place-items-center rounded-full bg-[#eef7f1] text-[#267449]">
                  <Icon size={19} weight="fill" />
                </span>
                <span className="typo-caption max-w-full text-balance text-black">{label}</span>
              </>
            )}
          </button>
        ))}
      </div>
    </section>
  )
}

export default HomeExploreCategoriesGrid
