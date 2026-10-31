import { useLanguage } from '../hooks/useLanguage'

export function Footer() {
  const { t, lang } = useLanguage()

  return (
    <footer className="relative overflow-hidden bg-maroon-deep py-16 text-center text-ivory">
      <div
        className="pointer-events-none absolute inset-0 opacity-40"
        style={{
          backgroundImage:
            'radial-gradient(circle at 50% 0%, rgba(196,163,90,0.25), transparent 50%)',
        }}
      />
      <div className="relative mx-auto max-w-lg px-6">
        <p className="font-display text-4xl text-gold-bright">R · C</p>
        <div className="ornament-line my-5">
          <span className="motif-dot" />
        </div>
        <p className={`text-sm text-ivory/70 ${lang === 'ta' ? 'font-tamil' : 'font-serif italic'}`}>
          {t.compliments}
        </p>
        <p className={`mt-4 text-xs text-ivory/45 ${lang === 'ta' ? 'font-tamil' : 'tracking-[0.18em] uppercase'}`}>
          {t.footerBlessing}
        </p>
        <p className="mt-8 font-serif text-xs text-ivory/35">15 · 11 · 2026 · Chennai</p>
      </div>
    </footer>
  )
}
