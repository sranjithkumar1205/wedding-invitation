import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import { dictionaries, type Dict, type Lang } from '../content/i18n'

type LanguageContextValue = {
  lang: Lang
  t: Dict
  toggle: () => void
  setLang: (lang: Lang) => void
}

const LanguageContext = createContext<LanguageContextValue | null>(null)

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLang] = useState<Lang>(() => {
    const saved = localStorage.getItem('wedding-lang')
    return saved === 'ta' || saved === 'en' ? saved : 'en'
  })

  useEffect(() => {
    localStorage.setItem('wedding-lang', lang)
    document.documentElement.lang = lang === 'ta' ? 'ta' : 'en'
    document.body.classList.toggle('lang-ta', lang === 'ta')
  }, [lang])

  const toggle = useCallback(() => {
    setLang((prev) => (prev === 'en' ? 'ta' : 'en'))
  }, [])

  const value = useMemo(
    () => ({ lang, t: dictionaries[lang], toggle, setLang }),
    [lang, toggle],
  )

  return (
    <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>
  )
}

export function useLanguage() {
  const ctx = useContext(LanguageContext)
  if (!ctx) throw new Error('useLanguage must be used within LanguageProvider')
  return ctx
}
