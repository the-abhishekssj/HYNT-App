function FlowSelection({ onSelectFlow }) {
  return (
    <main className="h-dvh w-full overflow-hidden bg-[#eef3f0] font-['Urbanist'] text-slate-950">
      <section className="mx-auto flex h-dvh w-full max-w-[480px] flex-col px-5 pb-8 pt-10">
        <header className="mb-8">
          <img src="/hynt-home/logo-green.png" alt="HYNT" className="h-12 w-auto object-contain" />
          <h1 className="mt-5 text-[30px] font-black leading-[1.12] tracking-[-0.03em]">Choose your flow</h1>
          <p className="mt-2 text-[15px] font-medium leading-6 text-[#4a4a4a]">Pick how you want to continue in HYNT.</p>
        </header>
        <div className="grid gap-4">
          <button
            type="button"
            onClick={() => onSelectFlow('homeowner')}
            className="rounded-3xl border border-[#d6e5dd] bg-white p-5 text-left shadow-[0_12px_28px_rgba(22,35,29,0.08)]"
          >
            <p className="text-[12px] font-bold uppercase tracking-[0.18em] text-[#267449]">Flow 1</p>
            <p className="mt-2 text-[24px] font-black leading-[1.2] text-black">Homeowner</p>
            <p className="mt-1 text-[14px] font-medium leading-[1.45] text-[#5f5f5f]">navigate homeowner user flow</p>
          </button>
          <button
            type="button"
            onClick={() => onSelectFlow('professional')}
            className="rounded-3xl border border-[#d6e5dd] bg-white p-5 text-left shadow-[0_12px_28px_rgba(22,35,29,0.08)]"
          >
            <p className="text-[12px] font-bold uppercase tracking-[0.18em] text-[#267449]">Flow 2</p>
            <p className="mt-2 text-[24px] font-black leading-[1.2] text-black">Professional</p>
            <p className="mt-1 text-[14px] font-medium leading-[1.45] text-[#5f5f5f]">preview professional user flow</p>
          </button>
        </div>
      </section>
    </main>
  )
}

export default FlowSelection
