export const designSystem = {
  colors: {
    ink: '#11100d',
    paper: '#f4eadb',
    newsprint: '#fffaf0',
    coffee: '#7c5130',
    espresso: '#2f2018',
    sage: '#6f7d64',
    burgundy: '#7a2836',
    gold: '#b88b38',
  },
  motion: {
    page: { duration: 0.45, ease: [0.22, 1, 0.36, 1] },
    reveal: { duration: 0.65, ease: [0.16, 1, 0.3, 1] },
  },
  cards: {
    editorial: 'border border-ink/15 bg-newsprint/75 shadow-paper backdrop-blur',
    dark: 'border border-ink bg-ink text-newsprint',
  },
}
