'use client'

import { createContext, useContext, useState } from 'react'
import { Language, TranslationKey, translations } from '@/lib/i18n'

interface LanguageContextValue {
  lang: Language
  setLang: (lang: Language) => void
  t: (key: TranslationKey) => string
}

const LanguageContext = createContext<LanguageContextValue>({
  lang: 'pt',
  setLang: () => {},
  t: (key) => translations.pt[key],
})

export function LanguageProvider({
  children,
  initialLang = 'pt',
}: {
  children: React.ReactNode
  initialLang?: Language
}) {
  const [lang, setLangState] = useState<Language>(initialLang)

  function setLang(l: Language) {
    setLangState(l)
    document.cookie = `hr_lang=${l}; path=/; max-age=31536000; SameSite=Lax`
  }

  const t = (key: TranslationKey): string => translations[lang][key]

  return (
    <LanguageContext.Provider value={{ lang, setLang, t }}>
      {children}
    </LanguageContext.Provider>
  )
}

export function useLanguage() {
  return useContext(LanguageContext)
}
