export default function Masthead({ edition = 'Special Birthday Edition' }) {
  return (
    <section className="newspaper-rule mb-8 py-5 text-center">
      <div className="flex items-center justify-center gap-4 text-[10px] font-bold uppercase tracking-[0.22em] text-ink/62">
        <span>Established with love</span>
        <span className="hidden h-px w-14 bg-ink/35 sm:block" />
        <span>{edition}</span>
      </div>
      <h1 className="mt-3 font-display text-5xl font-black leading-none tracking-tight md:text-8xl lg:text-9xl">
        The Prakash Times
      </h1>
      <div className="mt-4 flex flex-wrap items-center justify-center gap-3 text-xs font-semibold uppercase tracking-[0.18em] text-ink/64">
        <span>Family</span>
        <span>Current Affairs</span>
        <span>Chess</span>
        <span>Cinema</span>
        <span>Technology</span>
      </div>
    </section>
  )
}
