import { useEffect, useMemo, useState } from 'react'
import { ExternalLink, Loader2, Plus } from 'lucide-react'
import { Chess as ChessEngine } from 'chess.js'
import Page from '../components/common/Page'
import SectionHeader from '../components/common/SectionHeader'
import Reveal from '../components/animations/Reveal'
import { chessGames, chessStats, defaultChessUsername, savedChessProfiles } from '../data/chess'
import { extractChessComUsername, getPieceSymbol } from '../utils/chess'
import { loadChessProfileSnapshot } from '../utils/chessSummary'
import { readStorage, writeStorage } from '../utils/storage'

export default function Chess() {
  const [profileInput, setProfileInput] = useState('')
  const [savedProfiles, setSavedProfiles] = useState(() => {
    const stored = readStorage('prakash-times-chess-profiles', savedChessProfiles)
    if (!Array.isArray(stored)) return savedChessProfiles

    const canonical = stored.find((item) => item?.username?.toLowerCase() === defaultChessUsername)
    return canonical ? [canonical] : savedChessProfiles
  })
  const [selectedProfile, setSelectedProfile] = useState(savedProfiles[0] ?? null)
  const [profileData, setProfileData] = useState(null)
  const [profileStats, setProfileStats] = useState(null)
  const [latestGame, setLatestGame] = useState(null)
  const [streakSummary, setStreakSummary] = useState(null)
  const [gamesScanned, setGamesScanned] = useState(0)
  const [moveIndex, setMoveIndex] = useState(0)
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
        setStreakSummary(null)
        setGamesScanned(0)
        setMoveIndex(0)
        return
      }

      setLoading(true)
      setError('')

      try {
        const snapshot = await loadChessProfileSnapshot(username)
        if (!active) return

        setProfileData(snapshot.profile)
        setProfileStats(snapshot.stats)
        setLatestGame(snapshot.latestGame)
        setStreakSummary(snapshot.streak)
        setGamesScanned(snapshot.games.length)
        setMoveIndex(0)
      } catch {
        if (!active) return
        setError('Could not load that Chess.com profile. Check the username and try again.')
        setProfileData(null)
        setProfileStats(null)
        setLatestGame(null)
        setStreakSummary(null)
        setGamesScanned(0)
        setMoveIndex(0)
      } finally {
        if (active) setLoading(false)
      }
    }

    loadProfile()
    return () => {
      active = false
    }
  }, [selectedProfile?.username])

  const attachProfile = () => {
    const username = extractChessComUsername(profileInput)
    if (!username) {
      setError('Paste a Chess.com username or profile link.')
      return
    }

    const nextProfile = {
      id: `profile-${username.toLowerCase()}`,
      label: username === defaultChessUsername ? 'Prakash' : username,
      username,
      profileUrl: `https://www.chess.com/member/${username}`,
    }

    setSavedProfiles([nextProfile])
    setSelectedProfile(nextProfile)
    setProfileInput('')
    setError('')
  }

  const replay = useMemo(() => {
    if (!latestGame?.pgn) return null

    try {
      const game = new ChessEngine()
      game.loadPgn(latestGame.pgn, { sloppy: true })
      const moves = game.history({ verbose: true })
      return { moves }
    } catch {
      return null
    }
  }, [latestGame?.pgn])

  const boardState = useMemo(() => {
    if (!replay?.moves?.length) return []

    try {
      const game = new ChessEngine()
      const limit = Math.max(0, Math.min(moveIndex, replay.moves.length))
      for (let i = 0; i < limit; i += 1) {
        game.move(replay.moves[i])
      }

      return game.board()
    } catch {
      return []
    }
  }, [moveIndex, replay])

  const currentMove = replay?.moves?.[moveIndex - 1] ?? null
  const nextMove = replay?.moves?.[moveIndex] ?? null
  const totalMoves = replay?.moves?.length ?? 0
  const streakLabel = loading ? 'Loading…' : streakSummary?.days ? `${streakSummary.days}-day streak` : 'No active streak'
  const profileHighlights = [
    ...chessStats,
    { label: 'Playing Streak', value: streakLabel },
  ]

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
                <Stat label="Streak" value={streakLabel} />
                <Stat label="Games" value={gamesScanned ? String(gamesScanned) : '—'} />
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
            {profileHighlights.map((stat) => (
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
              <p className="text-sm leading-7 text-ink/70">
                Active streak: <span className="font-semibold text-ink">{streakLabel}</span>
              </p>
              {replay?.moves?.length ? (
                <div className="rounded border border-ink/10 bg-paper p-3 text-sm leading-6 text-ink/72">
                  <p className="text-xs font-bold uppercase tracking-[0.2em] text-burgundy">Move Playback</p>
                  <p className="mt-2">
                    Move {Math.min(moveIndex, totalMoves)} of {totalMoves}
                  </p>
                  <p className="mt-1 font-semibold text-ink">{currentMove ? `${currentMove.color === 'w' ? 'White' : 'Black'}: ${currentMove.san}` : 'Start position'}</p>
                  <p className="mt-1 text-ink/64">{nextMove ? `Next: ${nextMove.color === 'w' ? 'White' : 'Black'} to play ${nextMove.san}` : 'Game complete'}</p>
                  <div className="mt-4 flex gap-2">
                    <button type="button" onClick={() => setMoveIndex((value) => Math.max(0, value - 1))} className="border border-ink/20 px-3 py-2 text-[10px] font-bold uppercase tracking-[0.2em]">
                      Previous
                    </button>
                    <button type="button" onClick={() => setMoveIndex((value) => Math.min(totalMoves, value + 1))} className="border border-ink/20 px-3 py-2 text-[10px] font-bold uppercase tracking-[0.2em]">
                      Next
                    </button>
                    <button type="button" onClick={() => setMoveIndex(0)} className="border border-ink/20 px-3 py-2 text-[10px] font-bold uppercase tracking-[0.2em]">
                      Start
                    </button>
                    <button type="button" onClick={() => setMoveIndex(totalMoves)} className="border border-ink/20 px-3 py-2 text-[10px] font-bold uppercase tracking-[0.2em]">
                      End
                    </button>
                  </div>
                </div>
              ) : null}
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
            {boardState.length > 0 ? (
              boardState.map((rank, rankIndex) =>
                rank.map((piece, fileIndex) => {
                  const isLight = (rankIndex + fileIndex) % 2 === 0
                  const squareName = `${String.fromCharCode(97 + fileIndex)}${8 - rankIndex}`
                  const isFrom = currentMove?.from === squareName
                  const isTo = currentMove?.to === squareName
                  return (
                    <div
                      key={`${rankIndex}-${fileIndex}`}
                      className={`grid aspect-square place-items-center text-xl md:text-2xl ${isLight ? 'bg-[#dcc39a]' : 'bg-[#6b4a2d]'} ${isFrom ? 'ring-4 ring-burgundy ring-inset' : ''} ${isTo ? 'ring-4 ring-gold ring-inset' : ''}`}
                    >
                      <span
                        className={piece?.color === 'w' ? 'text-newsprint' : 'text-ink'}
                        style={piece?.color === 'w' ? { filter: 'drop-shadow(0 1px 1px rgba(17,16,13,0.6))' } : undefined}
                      >
                        {piece ? getPieceSymbol(piece) : ''}
                      </span>
                    </div>
                  )
                }),
              )
            ) : (
              Array.from({ length: 64 }).map((_, index) => (
                <div key={index} className={`aspect-square ${Math.floor(index / 8) % 2 === index % 2 ? 'bg-[#dcc39a]' : 'bg-[#6b4a2d]'}`} />
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

      {replay?.moves?.length ? (
        <section className="mt-14 border border-ink/15 bg-newsprint/78 p-6 shadow-paper">
          <p className="text-xs font-bold uppercase tracking-[0.24em] text-coffee">Move List</p>
          <div className="mt-5 grid gap-2 md:grid-cols-2 lg:grid-cols-3">
            {replay.moves.map((move, index) => (
              <button
                key={`${move.san}-${index}`}
                type="button"
                onClick={() => setMoveIndex(index + 1)}
                className={`flex items-center justify-between border px-4 py-3 text-left text-sm transition ${
                  moveIndex === index + 1 ? 'border-ink bg-ink text-newsprint' : 'border-ink/15 bg-paper text-ink/72 hover:bg-ink/5'
                }`}
              >
                <span>{Math.floor(index / 2) + 1}{move.color === 'w' ? '. ' : '... '}{move.san}</span>
                <span className="text-[10px] uppercase tracking-[0.2em] opacity-70">{move.color === 'w' ? 'White' : 'Black'}</span>
              </button>
            ))}
          </div>
        </section>
      ) : null}
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
