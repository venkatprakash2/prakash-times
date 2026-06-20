export function extractChessComUsername(input) {
  if (!input) return ''

  const trimmed = input.trim()

  if (/^[a-z0-9_]+$/i.test(trimmed)) return trimmed

  try {
    const url = new URL(trimmed)
    const parts = url.pathname.split('/').filter(Boolean)
    const memberIndex = parts.findIndex((part) => part === 'member' || part === 'player')
    if (memberIndex >= 0 && parts[memberIndex + 1]) return parts[memberIndex + 1]
    if (parts[0] && !['game', 'live', 'daily'].includes(parts[0])) return parts[0]
  } catch {
    return ''
  }

  return ''
}

export function getPieceSymbol(piece) {
  const map = {
    p: { w: '♙', b: '♟' },
    r: { w: '♖', b: '♜' },
    n: { w: '♘', b: '♞' },
    b: { w: '♗', b: '♝' },
    q: { w: '♕', b: '♛' },
    k: { w: '♔', b: '♚' },
  }

  if (!piece) return ''
  return map[piece.type]?.[piece.color] || ''
}

export function fenToBoard(fen) {
  const boardPart = fen?.split(' ')[0]
  if (!boardPart) return []

  const pieces = {
    p: { type: 'p', color: 'b' },
    r: { type: 'r', color: 'b' },
    n: { type: 'n', color: 'b' },
    b: { type: 'b', color: 'b' },
    q: { type: 'q', color: 'b' },
    k: { type: 'k', color: 'b' },
    P: { type: 'p', color: 'w' },
    R: { type: 'r', color: 'w' },
    N: { type: 'n', color: 'w' },
    B: { type: 'b', color: 'w' },
    Q: { type: 'q', color: 'w' },
    K: { type: 'k', color: 'w' },
  }

  return boardPart.split('/').map((rank) => {
    const row = []
    for (const char of rank) {
      if (/\d/.test(char)) {
        row.push(...Array.from({ length: Number(char) }, () => null))
      } else {
        row.push(pieces[char] || null)
      }
    }
    return row
  })
}
