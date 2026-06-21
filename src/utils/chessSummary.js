function normalizeDateKey(value) {
  if (value == null) return ''

  const numericValue = typeof value === 'string' && /^\d+$/.test(value) ? Number(value) : value
  const date = typeof numericValue === 'number' && numericValue < 10_000_000_000 ? new Date(numericValue * 1000) : new Date(numericValue)

  if (Number.isNaN(date.getTime())) return ''
  return date.toISOString().slice(0, 10)
}

export async function fetchChessJson(target) {
  const url = target.startsWith('http') ? target : `https://api.chess.com/pub/${target}`
  const response = await fetch(url)
  if (!response.ok) throw new Error(`Chess.com request failed: ${response.status}`)
  return response.json()
}

export function computeChessStreak(games = []) {
  const activeDates = new Set()
  let latestDateKey = ''

  for (const game of games) {
    const dateKey = normalizeDateKey(game?.end_time ?? game?.endTime ?? game?.end_date ?? game?.date ?? game?.last_move)
    if (!dateKey) continue
    activeDates.add(dateKey)
    if (!latestDateKey || dateKey > latestDateKey) latestDateKey = dateKey
  }

  if (!latestDateKey) {
    return { days: 0, latestDate: null }
  }

  const cursor = new Date(`${latestDateKey}T00:00:00Z`)
  let days = 0

  while (activeDates.has(cursor.toISOString().slice(0, 10))) {
    days += 1
    cursor.setUTCDate(cursor.getUTCDate() - 1)
  }

  return { days, latestDate: latestDateKey }
}

export async function loadChessProfileSnapshot(username, { archiveLimit = 6 } = {}) {
  if (!username) throw new Error('A Chess.com username is required.')

  const [profile, stats, archives] = await Promise.all([
    fetchChessJson(`player/${username}`),
    fetchChessJson(`player/${username}/stats`),
    fetchChessJson(`player/${username}/games/archives`),
  ])

  const archiveUrls = (archives.archives || []).slice(-archiveLimit)
  const archiveData = await Promise.all(archiveUrls.map((archiveUrl) => fetchChessJson(archiveUrl)))
  const games = archiveData.flatMap((archive) => archive.games || [])
  const latestArchive = archiveData[archiveData.length - 1] ?? null
  const latestGame = latestArchive?.games?.[latestArchive.games.length - 1] ?? null
  const streak = computeChessStreak(games)

  return {
    profile,
    stats,
    archives,
    archiveData,
    games,
    latestGame,
    streak,
  }
}
