import { newsEntries } from '../data/news'

const newsApiKey = import.meta.env.VITE_NEWS_API_KEY

const interestTopics = [
  {
    topic: 'AI',
    terms: ['artificial intelligence', 'AI', 'LLM', 'machine learning', 'copilot', 'automation'],
  },
  {
    topic: 'Technology',
    terms: ['software', 'cloud', 'Java', 'Oracle', 'developer', 'engineering', 'platform'],
  },
  {
    topic: 'Business',
    terms: ['enterprise', 'business', 'leadership', 'management', 'productivity', 'digital transformation'],
  },
  {
    topic: 'India',
    terms: ['India', 'Bengaluru', 'Karnataka', 'Indian'],
  },
  {
    topic: 'Chess',
    terms: ['chess', 'grandmaster', 'rapid', 'blitz', 'Chess.com'],
  },
  {
    topic: 'Sports',
    terms: ['cricket', 'India cricket', 'Indian cricket', 'Olympics', 'Olympic', 'FIFA', 'football', 'soccer'],
  },
]

const relevanceTerms = Array.from(new Set(interestTopics.flatMap((item) => item.terms)))

function buildQuery() {
  return relevanceTerms.map((term) => `"${term}"`).join(' OR ')
}

function escapeRegExp(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

function inferTopic(article) {
  const text = `${article.title || ''} ${article.description || ''}`.toLowerCase()
  const match = interestTopics.find((item) => item.terms.some((term) => text.includes(term.toLowerCase())))
  return match?.topic || 'Current Affairs'
}

function articleMatchesInterest(article) {
  const text = `${article.title || ''} ${article.description || ''}`.toLowerCase()
  return relevanceTerms.some((term) => text.includes(term.toLowerCase()))
}

function normalizeArticle(article) {
  const title = article.title || article.source?.name || 'News update'
  const summary =
    article.description ||
    article.content?.replace(/\s*\[\+\d+ chars\]\s*$/, '') ||
    'A relevant update selected from the live news feed.'

  return {
    id: article.url || `${title}-${article.publishedAt || Math.random()}`,
    category: inferTopic(article),
    source: article.source?.name || 'NewsAPI',
    headline: title,
    image:
      article.urlToImage ||
      'https://images.unsplash.com/photo-1495020689067-958852a7765e?auto=format&fit=crop&w=1200&q=80',
    summary,
    url: article.url,
    publishedAt: article.publishedAt,
  }
}

export async function fetchPrakashNews() {
  if (!newsApiKey) {
    return []
  }

  const query = buildQuery()
  const params = new URLSearchParams({
    q: query,
    searchIn: 'title,description',
    language: 'en',
    sortBy: 'publishedAt',
    pageSize: '24',
    apiKey: newsApiKey,
  })

  const response = await fetch(`https://newsapi.org/v2/everything?${params.toString()}`)
  if (!response.ok) throw new Error(`NewsAPI request failed: ${response.status}`)

  const payload = await response.json()
  const articles = Array.isArray(payload.articles) ? payload.articles : []

  return articles.filter(articleMatchesInterest).map(normalizeArticle).slice(0, 12)
}

export function getFallbackNews() {
  return newsEntries
}
