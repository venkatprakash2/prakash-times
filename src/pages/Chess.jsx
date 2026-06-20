import { useEffect, useMemo, useState } from 'react'
import { ExternalLink, Loader2, Plus } from 'lucide-react'
import Page from '../components/common/Page'
import SectionHeader from '../components/common/SectionHeader'
import Reveal from '../components/animations/Reveal'
import { chessGames, chessStats, savedChessProfiles } from '../data/chess'
import { extractChessComUsername, fenToBoard, getPieceSymbol } from '../utils/chess'
import { readStorage, writeStorage } from '../utils/storage'

async function chessFetch(path) {
  const response = await fetch(`https://api.chess.com/pub/${path}`)
  if (!response.ok) throw new Error(`Chess.com request failed: ${response.status}`)
  return response.json()
}

export default function Chess() {
  const [profileInput, setProfileInput] = useState('')
  const [savedProfiles, setSavedProfiles] = useState(() => readStorage('prakash-times-chess-profiles', savedChessProfiles))
  const [selectedProfile, setSelectedProfile] = useState(savedProfiles[0] ?? null)
  const [profileData, setProfileData] = useState(null)
  const [profileStats, setProfileStats] = useState(null)
  const [latestGame, setLatestGame] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    writeStorage('prakash-times-chess-profiles', savedProfiles)
  }, [savedProfiles])

  useEffect(() => {
    let active = true

    async function loadProfile() {
      const username = selectedProfile?.username
      if (!username) {
        setProfileData(null)
        setProfileStats(null)
        setLatestGame(null)
        return
      }

      setLoading(true)
      setError('')

      try {
        const [profile, stats, archives] = await Promise.all([
          chessFetch(`player/${username}`),
          chessFetch(`player/${username}/stats`),
          chessFetch(`player/${username}/games/archives`),
        ])

        if (!active) return
        setProfileData(profile)
        setProfileStats(stats)

        const latestArchiveUrl = archives.archives?.[archives.archives.length - 1]
        if (latestArchiveUrl) {
          const archive = await fetch(latestArchiveUrl).then((response) => {
            if (!response.ok) throw new Error(`Archive request failed: ${response.status}`)
            return response.json()
          })
          const latest = archive.games?.[archive.games.length - 1] ?? archive.games?.[0] ?? null
          setLatestGame(latest)
        } else {
          setLatestGame(null)
        }
      } catch (err) {
        if (!active) return
        setError('Could not load that Chess.com profile. Check the username and try again.')
        setProfileData(null)
        setProfileStats(null)
        setLatestGame(null)
      } finally {
        if (active) setLoading(false)
      }
    }

    loadProfile()
    return () => {
      active = false
    }
  }, [selectedProfile])

  const attachProfile = () => {
    const username = extractChessComUsername(profileInput)
    if (!username) {
      setError('Paste a Chess.com username or profile link.')
      return
    }

    const nextProfile = {
      id: `profile-${username.toLowerCase()}`,
      label: username,
      username,
      profileUrl: `https://www.chess.com/member/${username}`,
    }

    setSavedProfiles((current) => {
      const filtered = current.filter((item) => item.username.toLowerCase() !== username.toLowerCase())
      return [nextProfile, ...filtered]
    })
    setSelectedProfile(nextProfile)
    setProfileInput('')
    setError('')
  }

  const board = useMemo(() => fenToBoard(latestGame?.fen), [latestGame?.fen])

  return (
    <Page>
      <SectionHeader
        kicker="Chess Sports Desk"
        title="Rapid games, quiet pressure, and the art of waiting one move longer."
        copy="A sports-section treatment for chess: attach Chess.com profiles, pull public stats, and render the latest archive game right here."
      />
      <section className="mb-8 grid gap-6 lg:grid-cols-[.9fr_1.1fr]">
        <Reveal className="border border-ink bg-ink p-6 text-newsprint shadow-lift">
          <p className="text-xs font-bold uppercase tracking-[0.24em] text-crema">Attach Chess.com Profile</p>
          <div className="mt-5 flex gap-2">
            <input
              value={profileInput}
              onChange={(e) => setProfileInput(e.target.value)}
              placeholder="Username or profile link"
              className="flex-1 border border-newsprint/20 bg-newsprint/10 px-4 py-3 outline-none"
            />
            <button type="button" onClick={attachProfile} className="inline-flex items-center gap-2 border border-newsprint/70 px-4 py-3 text-xs font-bold uppercase tracking-[0.2em]">
              <Plus size={14} /> Save
            </button>
          </div>
          <p className="mt-3 text-xs leading-6 text-newsprint/64">
            Use a Chess.com username or profile URL. The app uses Chess.com’s public data API, so no API key is required for chess.
          </p>
          {error && <p className="mt-4 text-sm text-crema">{error}</p>}
          <div className="mt-6 grid gap-3">
            {savedProfiles.map((profile) => (
              <button
                key={profile.id}
                type="button"
                onClick={() => setSelectedProfile(profile)}
                className={`border px-4 py-3 text-left transition ${selectedProfile?.id === profile.id ? 'border-newsprint bg-newsprint text-ink' : 'border-newsprint/20 bg-newsprint/10 text-newsprint/80'}`}
              >
                <p className="text-xs font-bold uppercase tracking-[0.2em] text-crema">Profile</p>
                <p className="mt-1 font-display text-2xl font-black">{profile.label}</p>
                <p className="text-xs uppercase tracking-[0.18em] opacity-80">{profile.username}</p>
              </button>
            ))}
          </div>
        </Reveal>

        <Reveal className="border border-ink/15 bg-newsprint/78 p-6 shadow-paper">
          <p className="text-xs font-bold uppercase tracking-[0.24em] text-burgundy">Live Summary</p>
          {loading && (
            <div className="mt-6 flex items-center gap-3 text-ink/70">
              <Loader2 className="animate-spin" size={18} />
              <span>Loading public Chess.com data...</span>
            </div>
          )}
          {!loading && profileData && (
            <div className="mt-5 grid gap-4">
              <div>
                <h2 className="font-display text-5xl font-black">{profileData.username}</h2>
                <p className="mt-2 text-sm uppercase tracking-[0.2em] text-coffee">{profileData.location || 'Chess.com player profile'}</p>
              </div>
              <p className="text-sm leading-7 text-ink/70">{profileData.name || profileData.title || 'Public profile and stats loaded from Chess.com.'}</p>
              <div className="grid grid-cols-2 gap-3">
                <Stat label="Joined" value={profileData.joined ? new Date(profileData.joined * 1000).getFullYear().toString() : '—'} />
                <Stat label="Followers" value={String(profileData.followers ?? '—')} />
                <Stat label="FIDE" value={String(profileData.fide ?? '—')} />
                <Stat label="Status" value={profileData.status || '—'} />
              </div>
            </div>
          )}
        </Reveal>
      </section>

      <section className="grid gap-6 lg:grid-cols-[.7fr_1.3fr]">
        <Reveal className="border border-ink bg-ink p-6 text-newsprint shadow-lift">
          <p className="text-xs font-bold uppercase tracking-[0.24em] text-crema">Player Profile</p>
          <h2 className="mt-4 font-display text-5xl font-black leading-none">Prakash, positional correspondent.</h2>
          <p className="mt-5 text-sm leading-7 text-newsprint/72">
            Prefers steady development, practical endgames, and positions where a small advantage can become a headline.
          </p>
          <div className="mt-8 grid grid-cols-2 gap-3">
            {chessStats.map((stat) => (
              <div key={stat.label} className="border border-newsprint/18 p-4">
                <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-crema">{stat.label}</p>
                <p className="mt-2 font-display text-2xl font-black">{stat.value}</p>
              </div>
            ))}
          </div>
        </Reveal>
        <div className="grid gap-6 md:grid-cols-3">
          {chessGames.map((game) => (
            <Reveal key={game.title} className="overflow-hidden border border-ink/15 bg-newsprint shadow-paper">
              <img src={game.image} alt="" className="h-56 w-full object-cover grayscale-[15%]" />
              <div className="p-5">
                <p className="text-xs font-bold uppercase tracking-[0.22em] text-burgundy">{game.result} / {game.opponent}</p>
                <h3 className="mt-3 font-display text-3xl font-black">{game.title}</h3>
                <p className="mt-3 text-sm leading-6 text-ink/68">{game.note}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>
      <section className="mt-14 grid gap-6 lg:grid-cols-[.85fr_1.15fr]">
        <Reveal className="border border-ink/15 bg-newsprint/78 p-6 shadow-paper">
          <p className="text-xs font-bold uppercase tracking-[0.24em] text-coffee">Latest Archived Game</p>
          {latestGame ? (
            <div className="mt-5 space-y-4">
              <p className="text-sm uppercase tracking-[0.2em] text-burgundy">
                {latestGame.time_class || 'game'} / {latestGame.rated ? 'Rated' : 'Casual'}
              </p>
              <p className="text-sm leading-7 text-ink/70">
                {latestGame.white?.username} vs {latestGame.black?.username}
              </p>
              <a href={latestGame.url} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.2em] text-coffee">
                Open on Chess.com <ExternalLink size={14} />
              </a>
            </div>
          ) : (
            <p className="mt-4 text-sm leading-7 text-ink/68">Attach a profile to load the latest archived game and render it here.</p>
          )}
        </Reveal>

        <div className="border-y border-ink py-8">
          <div className="grid grid-cols-8 gap-1 sm:grid-cols-8">
            {board.length > 0 ? (
              board.map((rank, rankIndex) =>
                rank.map((piece, fileIndex) => {
                  const isLight = (rankIndex + fileIndex) % 2 === 0
                  return (
                    <div
                      key={`${rankIndex}-${fileIndex}`}
                      className={`grid aspect-square place-items-center text-xl md:text-2xl ${isLight ? 'bg-newsprint' : 'bg-coffee/70'}`}
                    >
                      <span className={piece?.color === 'w' ? 'text-ink' : 'text-newsprint'}>{piece ? getPieceSymbol(piece) : ''}</span>
                    </div>
                  )
                }),
              )
            ) : (
              Array.from({ length: 64 }).map((_, index) => (
                <div key={index} className={`aspect-square ${Math.floor(index / 8) % 2 === index % 2 ? 'bg-newsprint' : 'bg-coffee/70'}`} />
              ))
            )}
          </div>
        </div>
      </section>

      <section className="mt-14 grid gap-5 md:grid-cols-2">
        {profileStats ? (
          <>
            <StatBlock title="Rapid" value={profileStats.chess_rapid?.last?.rating ?? '—'} />
            <StatBlock title="Blitz" value={profileStats.chess_blitz?.last?.rating ?? '—'} />
            <StatBlock title="Bullet" value={profileStats.chess_bullet?.last?.rating ?? '—'} />
            <StatBlock title="Tactics" value={profileStats.tactics?.highest?.rating ?? '—'} />
          </>
        ) : (
          <>
            <StatBlock title="Rapid" value="—" />
            <StatBlock title="Blitz" value="—" />
            <StatBlock title="Bullet" value="—" />
            <StatBlock title="Tactics" value="—" />
          </>
        )}
      </section>
    </Page>
  )
}

function Stat({ label, value }) {
  return (
    <div className="border border-ink/15 bg-ink p-4 text-newsprint">
      <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-crema">{label}</p>
      <p className="mt-2 font-display text-2xl font-black">{value}</p>
    </div>
  )
}

function StatBlock({ title, value }) {
  return (
    <Reveal className="border border-ink/15 bg-newsprint/78 p-6 shadow-paper">
      <p className="text-xs font-bold uppercase tracking-[0.24em] text-coffee">{title}</p>
      <h3 className="mt-3 font-display text-5xl font-black">{value}</h3>
    </Reveal>
  )
}
