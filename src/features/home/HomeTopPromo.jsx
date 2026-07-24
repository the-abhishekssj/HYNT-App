import { ArrowRight } from '@phosphor-icons/react'

const promoCopy = {
  homeowner: {
    eyebrow: 'HYNT Assist',
    title: 'Post once. Compare 5 verified pros.',
    detail: 'Brief, quotes, and next steps in one place.',
    cta: 'Start brief',
  },
  professional: {
    eyebrow: 'HYNT Growth',
    title: 'Get discovered by ready homeowners.',
    detail: 'Boost profile reach and lead quality this week.',
    cta: 'Boost now',
  },
}

function HomeTopPromo({ audience = 'homeowner' }) {
  const copy = promoCopy[audience] || promoCopy.homeowner

  return (
    <section className={`hynt-top-promo hynt-top-promo--${audience} overflow-hidden px-4 pb-6 pt-1 text-white`}>
      <div className="relative min-h-[96px]">
        <p className="typo-caption text-white/72">{copy.eyebrow}</p>
        <p className="typo-title-16-strong mt-1 max-w-[260px] text-balance text-white">{copy.title}</p>
        <p className="typo-meta mt-1 line-clamp-1 max-w-[300px] text-white/72">{copy.detail}</p>
        <span className="typo-body-strong mt-3 flex h-6 items-center gap-2 leading-none text-white">
          {copy.cta}
          <ArrowRight size={16} weight="bold" />
        </span>
      </div>
    </section>
  )
}

export default HomeTopPromo
