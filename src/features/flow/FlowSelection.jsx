function FlowSelection({ onSelectFlow, onResetToEmpty, onResetDemo }) {
  return (
    <main className="ui-screen-base ui-feature-surface h-dvh w-full overflow-hidden bg-[#eef3f0] text-slate-950">
      <section className="mx-auto flex h-dvh w-full max-w-[480px] flex-col px-5 pb-8 pt-10">
        <header className="mb-8">
          <img src="/hynt-home/logo-green.png" alt="HYNT" className="h-12 w-auto object-contain" />
          <h1 className="typo-page-title mt-5">Choose your flow</h1>
          <p className="typo-title-16 mt-2 text-[#4a4a4a]">Pick how you want to continue in HYNT.</p>
        </header>
        <div className="grid gap-4">
          <button
            type="button"
            onClick={() => onSelectFlow('homeowner')}
            className="rounded-3xl border border-[#d6e5dd] bg-white p-5 text-left shadow-[0_12px_28px_rgba(22,35,29,0.08)]"
          >
            <p className="typo-label uppercase text-[#267449]">Flow 1</p>
            <p className="typo-page-title mt-2 text-black">Homeowner</p>
            <p className="typo-body mt-1 text-[#5f5f5f]">navigate homeowner user flow</p>
          </button>
          <button
            type="button"
            onClick={() => onSelectFlow('professional')}
            className="rounded-3xl border border-[#d6e5dd] bg-white p-5 text-left shadow-[0_12px_28px_rgba(22,35,29,0.08)]"
          >
            <p className="typo-label uppercase text-[#267449]">Flow 2</p>
            <p className="typo-page-title mt-2 text-black">Professional</p>
            <p className="typo-body mt-1 text-[#5f5f5f]">preview professional user flow</p>
          </button>
        </div>

        <div className="mt-auto flex flex-col gap-3">
          <button
            type="button"
            onClick={onResetToEmpty}
            className="typo-body-strong w-full rounded-2xl border border-dashed border-[#5fc18a] bg-white py-3 text-center text-[#267449] hover:bg-[#eaf5ef] transition-colors"
          >
            Reset to Empty State (No Projects)
          </button>
          <button
            type="button"
            onClick={onResetDemo}
            className="typo-body-strong w-full rounded-2xl border border-[#d6e5dd] bg-white py-3 text-center text-slate-700 hover:bg-slate-50 transition-colors"
          >
            Reset to Demo State (Sharma 3BHK)
          </button>
        </div>
      </section>
    </main>
  )
}

export default FlowSelection
