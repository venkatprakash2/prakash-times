import Page from '../components/common/Page'
import SectionHeader from '../components/common/SectionHeader'
import Reveal from '../components/animations/Reveal'
import { leadershipEducation, leadershipProfile, leadershipTimeline } from '../data/leadership'

export default function Leadership() {
  return (
    <Page>
      <SectionHeader
        kicker="Leadership & Career"
        title="A career feature, not a resume."
        copy="The professional story is treated like a long-form magazine piece: leadership, judgment, standards, and the quiet reputation earned over years."
      />
      <section className="grid gap-6 lg:grid-cols-[.95fr_1.05fr]">
        <Reveal className="border border-ink bg-ink p-7 text-newsprint shadow-lift">
          <p className="text-xs font-bold uppercase tracking-[0.28em] text-crema">Profile</p>
          <h2 className="mt-4 font-display text-5xl font-black leading-none">{leadershipProfile.name}</h2>
          <p className="mt-3 text-xl font-semibold text-newsprint/82">{leadershipProfile.headline}</p>
          <p className="mt-6 text-base leading-8 text-newsprint/72">{leadershipProfile.summary}</p>
          <div className="mt-8 grid grid-cols-1 gap-3 sm:grid-cols-2">
            {leadershipProfile.strengths.map((item) => (
              <div key={item} className="border border-newsprint/20 p-4">
                <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-crema">Strength</p>
                <p className="mt-2 font-display text-2xl font-black">{item}</p>
              </div>
            ))}
          </div>
        </Reveal>

        <div className="grid gap-6">
          {leadershipProfile.specialties.slice(0, 4).map((specialty, index) => (
            <Reveal key={specialty} className="border border-ink/15 bg-newsprint/78 p-6 shadow-paper">
              <p className="text-xs font-bold uppercase tracking-[0.24em] text-burgundy">Focus {index + 1}</p>
              <h3 className="mt-3 font-display text-3xl font-black">{specialty}</h3>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="mt-14 grid gap-6 md:grid-cols-2">
        {leadershipTimeline.map((milestone, index) => (
          <Reveal key={milestone.year} className={`${index === 0 ? 'md:col-span-2' : ''} border-t border-ink/25 pt-8`}>
            <div className="grid gap-5 md:grid-cols-[.7fr_1.3fr]">
              <div className="border border-ink/15 bg-newsprint/80 p-5 shadow-paper">
                <p className="text-xs font-bold uppercase tracking-[0.24em] text-coffee">{milestone.year}</p>
                <h3 className="mt-3 font-display text-3xl font-black leading-tight">{milestone.title}</h3>
              </div>
              <div className="flex flex-col justify-center">
                <p className="text-lg leading-8 text-ink/70">{milestone.note}</p>
              </div>
            </div>
          </Reveal>
        ))}
      </section>

      <section className="mt-16 grid gap-6 lg:grid-cols-[1fr_1fr]">
        <Reveal className="border border-ink/15 bg-newsprint/78 p-6 shadow-paper">
          <p className="text-xs font-bold uppercase tracking-[0.24em] text-coffee">Education</p>
          <div className="mt-4 grid gap-4">
            {leadershipEducation.map((item) => (
              <div key={item.school} className="border-t border-ink/20 pt-4">
                <h3 className="font-display text-3xl font-black">{item.school}</h3>
                <p className="mt-2 text-sm uppercase tracking-[0.2em] text-burgundy">{item.degree}</p>
                <p className="mt-2 text-sm text-ink/68">{item.years}</p>
              </div>
            ))}
          </div>
        </Reveal>

        <Reveal className="border border-ink bg-ink p-6 text-newsprint shadow-lift">
          <p className="text-xs font-bold uppercase tracking-[0.24em] text-crema">Languages and Certifications</p>
          <div className="mt-5 grid gap-4">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-crema">Languages</p>
              <p className="mt-2 text-lg text-newsprint/80">{leadershipProfile.languages.join(' / ')}</p>
            </div>
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-crema">Certifications</p>
              <ul className="mt-2 space-y-2 text-sm leading-6 text-newsprint/78">
                {leadershipProfile.certifications.map((item) => (
                  <li key={item}>• {item}</li>
                ))}
              </ul>
            </div>
          </div>
        </Reveal>
      </section>
    </Page>
  )
}
