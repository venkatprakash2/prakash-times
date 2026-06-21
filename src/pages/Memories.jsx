import { useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import Page from '../components/common/Page'
import SectionHeader from '../components/common/SectionHeader'
import PolaroidCard from '../components/cards/PolaroidCard'
import Modal from '../components/common/Modal'
import Reveal from '../components/animations/Reveal'
import { memories, photoClusters } from '../data/memories'
import { photoManifest } from '../data/photoManifest'

export default function Memories() {
  const [selected, setSelected] = useState(null)
  const [searchParams, setSearchParams] = useSearchParams()
  const mode = searchParams.get('view') === 'gallery' ? 'gallery' : 'scrapbook'
  const rotatePattern = [-3, 2, -1, 3, -2, 1]
  const clusterCounts = useMemo(
    () =>
      photoClusters
        .filter((item) => item !== 'All')
        .map((cluster) => ({
          cluster,
          count: memories.filter((memory) => memory.cluster === cluster).length,
        })),
    [],
  )

  const displayPhotos = mode === 'gallery' ? photoManifest : memories
  const featuredPhoto = displayPhotos[0] ?? photoManifest[0]

  const setMode = (nextMode) => {
    const next = new URLSearchParams(searchParams)
    if (nextMode === 'gallery') next.set('view', 'gallery')
    else next.delete('view')
    setSearchParams(next, { replace: true })
  }

  return (
    <Page>
      <SectionHeader
        kicker="Interactive Scrapbook"
        title="Family memories arranged like a desk full of photographs."
        copy="The memories page now carries both readings of the archive: scrapbook storytelling and a clean gallery mode for browsing the same local photos."
      />

      <div className="mb-6 flex flex-wrap gap-2">
        <button type="button" onClick={() => setMode('scrapbook')} className={`px-4 py-2 text-xs font-bold uppercase tracking-[0.2em] ${mode === 'scrapbook' ? 'bg-ink text-newsprint' : 'bg-newsprint text-ink/70'}`}>
          Scrapbook
        </button>
        <button type="button" onClick={() => setMode('gallery')} className={`px-4 py-2 text-xs font-bold uppercase tracking-[0.2em] ${mode === 'gallery' ? 'bg-ink text-newsprint' : 'bg-newsprint text-ink/70'}`}>
          Gallery
        </button>
      </div>

      <section className="grid gap-6 lg:grid-cols-[1.15fr_.85fr]">
        <Reveal className="relative min-h-[520px] overflow-hidden border border-ink bg-ink text-newsprint shadow-lift">
          <img src={featuredPhoto.image} alt="" className="absolute inset-0 h-full w-full object-cover opacity-70 grayscale-[12%]" />
          <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/40 to-transparent" />
          <div className="relative flex h-full min-h-[520px] flex-col justify-end p-6 md:p-10">
            <p className="text-xs font-bold uppercase tracking-[0.28em] text-crema">
              {mode === 'gallery' ? 'Gallery Lead' : 'Scrapbook Lead'}
            </p>
            <h2 className="mt-4 max-w-2xl font-display text-5xl font-black leading-none md:text-7xl">
              {featuredPhoto.title}
            </h2>
            <p className="mt-5 max-w-xl text-base leading-7 text-newsprint/76">
              {featuredPhoto.story}
            </p>
            <div className="mt-7 flex flex-wrap gap-3 text-[10px] font-bold uppercase tracking-[0.24em]">
              <span className="border border-newsprint/30 px-3 py-2">{featuredPhoto.cluster}</span>
              <span className="border border-newsprint/30 px-3 py-2">{featuredPhoto.location}</span>
            </div>
          </div>
        </Reveal>
        <div className="grid gap-6">
          <Reveal className="border border-ink/15 bg-newsprint/78 p-6 shadow-paper">
            <p className="text-xs font-bold uppercase tracking-[0.24em] text-burgundy">Archive Count</p>
            <h3 className="mt-4 font-display text-5xl font-black">{photoManifest.length}</h3>
            <p className="mt-3 text-sm leading-6 text-ink/68">
              The same local photo database now powers both storytelling modes without duplicating the page.
            </p>
          </Reveal>
          <Reveal className="border border-ink/15 bg-newsprint/78 p-6 shadow-paper">
            <p className="text-xs font-bold uppercase tracking-[0.24em] text-coffee">Mode</p>
            <h3 className="mt-4 font-display text-4xl font-black">
              {mode === 'gallery' ? 'Browse first, tell later.' : 'Tell first, browse second.'}
            </h3>
          </Reveal>
        </div>
      </section>

      {mode === 'scrapbook' && (
        <section className="relative mt-6 overflow-hidden border border-ink/15 bg-gradient-to-br from-newsprint to-paper p-6 shadow-paper md:p-10">
          <div className="coffee-ring absolute -right-16 top-8 size-52 opacity-50" />
          <div className="mb-6 flex flex-wrap gap-2">
            {photoClusters.map((cluster) => (
              <span key={cluster} className="border border-ink/15 bg-newsprint/80 px-3 py-2 text-[10px] font-bold uppercase tracking-[0.2em] text-ink/60">
                {cluster}
              </span>
            ))}
          </div>
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {memories.map((memory, index) => (
              <PolaroidCard
                key={memory.id}
                memory={memory}
                rotate={rotatePattern[index % rotatePattern.length]}
                onClick={() => setSelected(memory)}
              />
            ))}
          </div>
        </section>
      )}

      {mode === 'gallery' && (
        <section className="mt-6 columns-1 gap-5 md:columns-2 lg:columns-3">
          {photoManifest.map((photo, index) => (
            <Reveal key={photo.id} className="mb-5 break-inside-avoid overflow-hidden border border-ink/15 bg-newsprint/78 shadow-paper">
              <button type="button" onClick={() => setSelected(photo)} className="group block w-full text-left">
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
      )}

      <section className="mt-14 grid gap-6 md:grid-cols-3">
        {clusterCounts.slice(0, 3).map(({ cluster, count }) => (
          <Reveal key={cluster} className="border border-ink/15 bg-newsprint/78 p-6 shadow-paper">
            <p className="text-xs font-bold uppercase tracking-[0.22em] text-coffee">Memory Cluster</p>
            <h3 className="mt-3 font-display text-3xl font-black">{cluster}</h3>
            <p className="mt-3 text-sm leading-6 text-ink/68">{count} photos in this shelf, all drawn from the local archive.</p>
          </Reveal>
        ))}
      </section>
      <Modal item={selected} onClose={() => setSelected(null)}>
        {selected && (
          <article className="p-6 pt-0">
            <img src={selected.image} alt="" className="h-80 w-full object-cover" />
            <p className="mt-6 text-xs font-bold uppercase tracking-[0.24em] text-coffee">{selected.cluster} / {selected.location}</p>
            <h2 className="mt-3 font-display text-5xl font-black">{selected.title}</h2>
            <p className="mt-4 text-lg leading-8 text-ink/72">{selected.story}</p>
          </article>
        )}
      </Modal>
    </Page>
  )
}
