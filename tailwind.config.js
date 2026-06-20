export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        ink: '#11100d',
        paper: '#f4eadb',
        newsprint: '#fffaf0',
        coffee: '#7c5130',
        crema: '#d8b98a',
        espresso: '#2f2018',
        sage: '#6f7d64',
        burgundy: '#7a2836',
        gold: '#b88b38',
        graphite: '#34312c',
      },
      fontFamily: {
        display: ['Georgia', 'Times New Roman', 'serif'],
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        paper: '0 24px 80px rgba(47, 32, 24, 0.14)',
        lift: '0 18px 50px rgba(17, 16, 13, 0.16)',
      },
      backgroundImage: {
        grain:
          'radial-gradient(circle at 20% 15%, rgba(124,81,48,.12), transparent 28%), radial-gradient(circle at 78% 10%, rgba(184,139,56,.12), transparent 26%), linear-gradient(135deg, rgba(255,255,255,.48), rgba(244,234,219,.45))',
      },
    },
  },
  plugins: [],
}
