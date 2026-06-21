import { useMemo, useState } from 'react'
import Page from '../components/common/Page'
import SectionHeader from '../components/common/SectionHeader'
import Modal from '../components/common/Modal'
import Reveal from '../components/animations/Reveal'
import { photoClusters, photoManifest } from '../data/photoManifest'

export default function Gallery() {
  const [cluster, setCluster] = useState('All')
  const [selected, setSelected] = useState(null)

  const photos = useMemo(() => {
    return cluster === 'All' ? photoManifest : photoManifest.filter((photo) => photo.cluster === cluster)
  }, [cluster])

  const featured = photos.find(Boolean) ?? photoManifest.find(Boolean)

  return (
    <Page>
      <SectionHeader
        kicker="Gallery"
        title="A clean grid for the family archive."
        copy="This view keeps the same local photo database as Memories, but presents it as a direct gallery with filters, counts, and a stronger browse-first rhythm."
        align="center"
      />

      <section className="grid gap-6 lg:grid-cols-[1.15fr_.85fr]">
        <Reveal className="relative min-h-[520px] overflow-hidden border border-ink bg-ink text-newsprint shadow-lift">
          <img src={featured.image} alt="" className="absolute inset-0 h-full w-full object-cover opacity-70 grayscale-[12%]" />
          <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/40 to-transparent" />
          <div className="relative flex h-full min-h-[520px] flex-col justify-end p-6 md:p-10">
            <p className="text-xs font-bold uppercase tracking-[0.28em] text-crema">Featured Frame</p>
            <h2 className="mt-4 max-w-2xl font-display text-5xl font-black leading-none md:text-7xl">
              {featured.title}
            </h2>
            <p className="mt-5 max-w-xl text-base leading-7 text-newsprint/76">
              {featured.story}
            </p>
            <div className="mt-7 flex flex-wrap gap-3 text-[10px] font-bold uppercase tracking-[0.24em]">
              <span className="border border-newsprint/30 px-3 py-2">{featured.cluster}</span>
              <span className="border border-newsprint/30 px-3 py-2">{featured.location}</span>
            </div>
          </div>
        </Reveal>

        <div className="grid gap-6">
          <Reveal className="border border-ink/15 bg-newsprint/78 p-6 shadow-paper">
            <p className="text-xs font-bold uppercase tracking-[0.24em] text-burgundy">Archive Count</p>
            <h3 className="mt-4 font-display text-5xl font-black">{photoManifest.length}</h3>
            <p className="mt-3 text-sm leading-6 text-ink/68">
              Local photos now drive the Memories and Gallery experience directly from the project folder.
            </p>
          </Reveal>
          <Reveal className="border border-ink/15 bg-newsprint/78 p-6 shadow-paper">
            <p className="text-xs font-bold uppercase tracking-[0.24em] text-coffee">Browse Modes</p>
            <h3 className="mt-4 font-display text-4xl font-black">Scrapbook and gallery, two editorial readings of the same archive.</h3>
          </Reveal>
        </div>
      </section>

      <div className="mb-8 mt-10 flex gap-2 overflow-auto border-y border-ink/20 py-3">
        {photoClusters.map((item) => (
          <button
            key={item}
            type="button"
            onClick={() => setCluster(item)}
            className={`shrink-0 px-4 py-2 text-xs font-bold uppercase tracking-[0.2em] ${cluster === item ? 'bg-ink text-newsprint' : 'bg-newsprint text-ink/70'}`}
          >
            {item}
          </button>
        ))}
      </div>

      <section className="columns-1 gap-5 md:columns-2 lg:columns-3">
        {photos.map((photo, index) => (
          <Reveal
            key={photo.id}
            className="mb-5 break-inside-avoid overflow-hidden border border-ink/15 bg-newsprint/78 shadow-paper"
          >
            <button
              type="button"
              onClick={() => setSelected(photo)}
              className="group block w-full text-left"
            >
              <img
                src={photo.image}
                alt=""
                className={`h-64 w-full object-cover grayscale-[10%] transition duration-500 group-hover:scale-105 ${index % 4 === 0 ? 'h-80' : ''}`}
              />
              <div className="p-5">
                <p className="text-xs font-bold uppercase tracking-[0.22em] text-coffee">{photo.cluster}</p>
                <h3 className="mt-3 font-display text-3xl font-black leading-tight">{photo.title}</h3>
                <p className="mt-3 text-sm leading-6 text-ink/68">{photo.caption}</p>
              </div>
            </button>
          </Reveal>
        ))}
      </section>

      <Modal item={selected} onClose={() => setSelected(null)}>
        {selected && (
          <article className="p-6 pt-0">
            <img src={selected.image} alt="" className="h-80 w-full object-cover" />
            <p className="mt-6 text-xs font-bold uppercase tracking-[0.24em] text-coffee">{selected.cluster} / {selected.location}</p>
            <h2 className="mt-3 font-display text-5xl font-black leading-none">{selected.title}</h2>
            <p className="mt-5 text-lg leading-8 text-ink/72">{selected.story}</p>
            <p className="mt-4 text-sm uppercase tracking-[0.2em] text-ink/50">{selected.location}</p>
          </article>
        )}
      </Modal>
    </Page>
  )
}
