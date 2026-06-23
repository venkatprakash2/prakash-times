import { useEffect, useMemo, useState } from 'react'
import Page from '../components/common/Page'
import SectionHeader from '../components/common/SectionHeader'
import EditorialCard from '../components/cards/EditorialCard'
import Modal from '../components/common/Modal'
import { newsEntries } from '../data/news'
import { fetchPrakashNews } from '../utils/newsApi'

const categories = ['All', 'India', 'Technology', 'AI', 'Business', 'Sports']

export default function CurrentAffairs() {
  const [category, setCategory] = useState('All')
  const [selected, setSelected] = useState(null)
  const [stories, setStories] = useState(newsEntries)
  const [loading, setLoading] = useState(true)
  const [sourceLabel, setSourceLabel] = useState('Morning desk')

  useEffect(() => {
    let active = true

    async function loadNews() {
      setLoading(true)

      try {
        const liveStories = await fetchPrakashNews()
        if (!active) return

        if (liveStories.length > 0) {
          setStories(liveStories)
          setSourceLabel('Live NewsAPI feed')
        } else {
          setStories(newsEntries)
          setSourceLabel('Morning desk')
        }
      } catch {
        if (!active) return
        setStories(newsEntries)
        setSourceLabel('Morning desk')
      } finally {
        if (active) setLoading(false)
      }
    }

    loadNews()
    return () => {
      active = false
    }
  }, [])

  const visibleStories = useMemo(
    () => (category === 'All' ? stories : stories.filter((item) => item.category === category)),
    [category, stories],
  )

  return (
    <Page>
      <SectionHeader
        kicker="Current Affairs"
        title="A personalized news desk with concise AI-style summaries."
        copy="Live stories from NewsAPI, filtered to Prakash-relevant topics."
      />
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3 text-xs font-bold uppercase tracking-[0.2em] text-ink/55">
        <span>{loading ? 'Refreshing live stories...' : sourceLabel}</span>
        <span>Showing only Prakash-relevant articles</span>
      </div>
      <div className="mb-8 flex gap-2 overflow-auto border-y border-ink/20 py-3">
        {categories.map((item) => (
          <button
            key={item}
            onClick={() => setCategory(item)}
            className={`shrink-0 px-4 py-2 text-xs font-bold uppercase tracking-[0.2em] ${category === item ? 'bg-ink text-newsprint' : 'bg-newsprint text-ink/70'}`}
          >
            {item}
          </button>
        ))}
      </div>
      <section className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {visibleStories.map((item, index) => (
          <EditorialCard key={item.id} item={item} large={index === 0 && category === 'All'} onClick={() => setSelected(item)} />
        ))}
      </section>
      <Modal item={selected} onClose={() => setSelected(null)}>
        {selected && (
          <article className="p-6 pt-0">
            <img src={selected.image} alt="" className="h-80 w-full object-cover" />
            <p className="mt-6 text-xs font-bold uppercase tracking-[0.24em] text-burgundy">{selected.category} / {selected.source}</p>
            <h2 className="mt-3 font-display text-5xl font-black leading-none">{selected.headline}</h2>
            <p className="mt-5 text-lg leading-8 text-ink/72">{selected.summary}</p>
            {selected.publishedAt && (
              <p className="mt-4 text-xs font-bold uppercase tracking-[0.2em] text-coffee">
                Published {new Date(selected.publishedAt).toLocaleString()}
              </p>
            )}
            <div className="mt-6 border border-ink/15 bg-paper p-5">
              <p className="text-xs font-bold uppercase tracking-[0.22em] text-coffee">Context</p>
              <p className="mt-3 text-sm leading-6 text-ink/68">
                This story survived the Prakash-interest filter for technology, leadership, business, India, or sports.
              </p>
            </div>
          </article>
        )}
      </Modal>
    </Page>
  )
}
