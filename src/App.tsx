import { useCallback, useState } from 'react'
import { Couple } from './components/Couple'
import { Countdown } from './components/Countdown'
import { Events } from './components/Events'
import { FloatingControls } from './components/FloatingControls'
import { Footer } from './components/Footer'
import { Hero } from './components/Hero'
import { PhotoStory } from './components/PhotoStory'
import { Petals } from './components/Petals'
import { SealIntro } from './components/SealIntro'
import { Venue } from './components/Venue'
import { useAmbientMusic } from './hooks/useAmbientMusic'
import { LanguageProvider } from './hooks/useLanguage'

function Invitation() {
  const [opened, setOpened] = useState(false)
  const music = useAmbientMusic()

  const handleOpen = useCallback(() => {
    setOpened(true)
    void music.unmute()
  }, [music])

  return (
    <>
      <SealIntro open={opened} onOpen={handleOpen} />
      <FloatingControls
        visible={opened}
        muted={music.muted}
        onToggleMusic={() => void music.toggle()}
      />
      <main
        className={opened ? 'relative opacity-100' : 'pointer-events-none h-screen overflow-hidden opacity-0'}
        aria-hidden={!opened}
      >
        {opened && (
          <>
            <div className="pointer-events-none fixed inset-0 z-40 opacity-25">
              <Petals density={10} active={opened} />
            </div>
            <Hero />
            <Countdown />
            <Couple />
            <Events />
            <PhotoStory />
            <Venue />
            <Footer />
          </>
        )}
      </main>
    </>
  )
}

export default function App() {
  return (
    <LanguageProvider>
      <Invitation />
    </LanguageProvider>
  )
}
