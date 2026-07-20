import { ArrowRight, Buildings, HouseLine, Sparkle } from '@phosphor-icons/react'

const promoCopy = {
  homeowner: {
    eyebrow: 'HYNT Assist',
    title: 'Post once. Compare 5 verified pros.',
    detail: 'Brief, quotes, and next steps in one place.',
    cta: 'Start brief',
    Icon: HouseLine,
  },
  professional: {
    eyebrow: 'HYNT Growth',
    title: 'Get discovered by ready homeowners.',
    detail: 'Boost profile reach and lead quality this week.',
    cta: 'Boost now',
    Icon: Buildings,
  },
}

function HomeTopPromo({ audience = 'homeowner' }) {
  const copy = promoCopy[audience] || promoCopy.homeowner
  const Icon = copy.Icon

  return (
    <section className={`hynt-top-promo hynt-top-promo--${audience} overflow-hidden px-4 pb-6 pt-1 text-white`}>
      <div className="hynt-top-promo__glow" aria-hidden="true" />
      <div className="hynt-top-promo__band" aria-hidden="true" />
      <div className="relative grid min-h-[100px] grid-cols-[minmax(0,1fr)_104px] items-end gap-3">
        <div className="min-w-0 pb-0.5">
          <p className="typo-caption text-white/72">{copy.eyebrow}</p>
          <p className="typo-title-16-strong mt-1 text-balance text-white">{copy.title}</p>
          <p className="typo-meta mt-1 line-clamp-1 text-white/72">{copy.detail}</p>
          <span className="typo-body-strong mt-3 flex h-6 items-center gap-2 leading-none text-white">
            {copy.cta}
            <ArrowRight size={16} weight="bold" />
          </span>
        </div>
        <div className="hynt-top-promo__visual" aria-hidden="true">
          <Icon size={54} weight="duotone" />
        </div>
        <span className="hynt-top-promo__spark hynt-top-promo__spark--one" aria-hidden="true">
          <Sparkle size={14} weight="fill" />
        </span>
        <span className="hynt-top-promo__spark hynt-top-promo__spark--two" aria-hidden="true">
          <Sparkle size={10} weight="fill" />
        </span>
      </div>
    </section>
  )
}

export default HomeTopPromo
