import {
  ArrowRight,
} from '@phosphor-icons/react'

const exploreCategories = [
  {
    label: 'Brands',
    image: 'https://images.unsplash.com/photo-1556228453-efd6c1ff04f6?auto=format&fit=crop&w=360&q=80',
    spotlight: true,
  },
  {
    label: 'Interior Designers',
    image: 'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=360&q=80',
  },
  {
    label: 'Architects',
    image: 'https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&w=360&q=80',
  },
  {
    label: 'Home Automation',
    image: 'https://images.unsplash.com/photo-1558002038-1055907df827?auto=format&fit=crop&w=360&q=80',
  },
  {
    label: 'Vastu Consultants',
    image: 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=360&q=80',
  },
  {
    label: 'Furniture & Decor',
    image: 'https://images.unsplash.com/photo-1618220179428-22790b461013?auto=format&fit=crop&w=360&q=80',
  },
  {
    label: 'Lighting',
    image: 'https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?auto=format&fit=crop&w=360&q=80',
  },
  {
    label: 'Solar & Sustainability',
    image: 'https://images.unsplash.com/photo-1509391366360-2e959784a276?auto=format&fit=crop&w=360&q=80',
  },
]

function HomeExploreCategoriesGrid({ title = 'Explore Categories' }) {
  return (
    <section className="px-4 py-5">
      <div className="flex items-center justify-between">
        <h2 className="typo-section-title">{title}</h2>
        <button type="button" className="typo-utility flex items-center gap-1">View all <ArrowRight size={16} /></button>
      </div>
      <div className="mt-4 grid grid-cols-4 gap-2">
        {exploreCategories.map(({ label, image, spotlight }) => (
          <button
            key={label}
            type="button"
            className={`relative flex min-h-[104px] overflow-hidden rounded-[17px] bg-[#102418] text-left ${
              spotlight ? 'hynt-category-image-spotlight border border-[#26C485]' : 'border border-[#e0e0e0]'
            }`}
          >
            {spotlight ? <span className="hynt-category-image-spotlight__glow" aria-hidden="true" /> : null}
            <img src={image} alt="" className="absolute inset-0 size-full object-cover" loading="lazy" />
            <span className="absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-black/82 via-black/42 to-transparent" />
            <span className="typo-caption relative z-10 mt-auto w-full px-2 pb-2 text-balance text-white">{label}</span>
          </button>
        ))}
      </div>
    </section>
  )
}

export default HomeExploreCategoriesGrid
