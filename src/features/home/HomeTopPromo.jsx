import { CaretRight } from '@phosphor-icons/react'

const promoCopy = {
  homeowner: {
    title: "India's Home App",
    detail: 'Discover. Connect. Manage.',
    cta: 'Start now',
    image: '/hynt-home/homepagerev/hero-people.png',
  },
  professional: {
    title: 'Grow on HYNT',
    detail: 'Get discovered by ready homeowners.',
    cta: 'Boost now',
    image: '/hynt-home/homepagerev/hero-people.png',
  },
}

function HomeTopPromo({ audience = 'homeowner' }) {
  const copy = promoCopy[audience] || promoCopy.homeowner

  return (
    <section className={`hynt-top-promo hynt-top-promo--${audience} relative overflow-hidden px-4 pb-4 pt-3 text-white`}>
      <div className="relative min-h-[96px]">
        <div className="hynt-top-promo__visual" aria-hidden="true">
          <img src={copy.image} alt="" />
          <span className="hynt-top-promo__visual-wash" />
        </div>

        <div className="relative z-[2] min-w-0 max-w-[214px]">
          <h1 className="text-[20px] font-black leading-[1.6] text-white">{copy.title}</h1>
          <p className="mt-0 text-[14px] font-semibold leading-[1.6] text-white/72">{copy.detail}</p>
          <button type="button" className="mt-2 inline-flex h-8 items-center gap-1 rounded-[10px] pr-2 text-[16px] font-semibold leading-none text-white">
            {copy.cta}
            <CaretRight size={16} weight="bold" />
          </button>
        </div>
      </div>
    </section>
  )
}

export default HomeTopPromo
