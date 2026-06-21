export const defaultChessUsername = 'venkatprakash1'

export const chessStats = [
  { label: 'Favorite Opening', value: 'Queen\'s Gambit' },
  { label: 'Style', value: 'Patient pressure' },
  { label: 'Best Time Control', value: 'Rapid' },
  { label: 'Puzzle Mood', value: 'Endgames' },
]

export const chessGames = [
  {
    title: 'The Quiet Bishop',
    opponent: 'Weekend Club Rival',
    result: '1-0',
    image: 'https://images.unsplash.com/photo-1580541832626-2a7131ee809f?auto=format&fit=crop&w=1200&q=80',
    note: 'A slow squeeze where the bishop pair became the entire story.',
  },
  {
    title: 'Rook Lift Report',
    opponent: 'Online Rapid Arena',
    result: 'Draw',
    image: 'https://images.unsplash.com/photo-1604948501466-4e9c339b9c24?auto=format&fit=crop&w=1200&q=80',
    note: 'An attacking idea that turned into a precise defensive lesson.',
  },
  {
    title: 'Endgame Patience',
    opponent: 'Family Match',
    result: '1-0',
    image: 'https://images.unsplash.com/photo-1523875194681-bedd468c58bf?auto=format&fit=crop&w=1200&q=80',
    note: 'King activity, one extra pawn, and no unnecessary hurry.',
  },
]

export const savedChessProfiles = [
  {
    id: 'prakash-main',
    label: 'Prakash',
    username: defaultChessUsername,
    profileUrl: `https://www.chess.com/member/${defaultChessUsername}`,
  },
]
