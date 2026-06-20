import { Gift } from 'lucide-react'
import Page from '../components/common/Page'
import SectionHeader from '../components/common/SectionHeader'
import Reveal from '../components/animations/Reveal'
import { birthdays } from '../data/birthdays'

export default function Birthdays() {
  return (
    <Page>
      <SectionHeader
        kicker="Family Calendar"
        title="Important dates as celebration cards, not rows in a table."
        copy="A warm events section for birthdays, anniversaries, and family moments that deserve their own little headline."
      />
      <section className="mb-8 grid overflow-hidden border border-ink bg-ink text-newsprint shadow-lift lg:grid-cols-[1.2fr_.8fr]">
        <img
          src="https://images.unsplash.com/photo-1530103862676-de8c9debad1d?auto=format&fit=crop&w=1400&q=80"
          alt=""
          className="h-80 w-full object-cover opacity-85 grayscale-[10%] lg:h-full"
        />
        <div className="flex flex-col justify-center p-6 md:p-10">
          <p className="text-xs font-bold uppercase tracking-[0.24em] text-crema">Celebration Desk</p>
          <h3 className="mt-4 font-display text-5xl font-black leading-none">Every date gets its own headline.</h3>
          <p className="mt-5 text-sm leading-7 text-newsprint/72">
            Birthdays and anniversaries are arranged as a living social calendar, ready for family photos, wishes, and tiny annual traditions.
          </p>
        </div>
      </section>
      <section className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {birthdays.map((event, index) => (
          <Reveal key={`${event.name}-${event.date}`} className={`relative overflow-hidden border border-ink/15 bg-newsprint/78 p-6 shadow-paper ${index === 0 ? 'md:col-span-2 lg:col-span-2' : ''}`}>
            <div className="coffee-ring absolute -right-14 -top-14 size-36 opacity-40" />
            <Gift className="text-burgundy" size={28} />
            <p className="mt-8 text-xs font-bold uppercase tracking-[0.24em] text-coffee">{event.type}</p>
            <h3 className="mt-3 font-display text-4xl font-black leading-none md:text-5xl">{event.name}</h3>
            <p className="mt-3 font-display text-3xl font-black text-burgundy">{event.date}</p>
            <p className="mt-5 text-sm leading-6 text-ink/68">{event.mood}</p>
          </Reveal>
        ))}
      </section>
      <section className="mt-14 border-l border-ink/25 pl-6">
        {birthdays.map((event) => (
          <Reveal key={`${event.name}-timeline`} className="relative mb-8 border border-ink/15 bg-paper p-5 shadow-paper">
            <span className="absolute -left-[31px] top-6 size-3 rounded-full bg-burgundy" />
            <p className="text-xs font-bold uppercase tracking-[0.22em] text-coffee">{event.date}</p>
            <h3 className="mt-2 font-display text-3xl font-black">{event.name}</h3>
          </Reveal>
        ))}
      </section>
    </Page>
  )
}
