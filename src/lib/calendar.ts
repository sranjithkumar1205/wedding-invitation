function calendarFileUrl(lang: 'en' | 'ta') {
  const file = lang === 'ta' ? 'wedding-ta.ics' : 'wedding-en.ics'
  return new URL(`${import.meta.env.BASE_URL}${file}`, window.location.origin).href
}

function isAppleMobile() {
  const ua = navigator.userAgent
  return /iPhone|iPad|iPod/i.test(ua) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1)
}

/** Open the phone or computer calendar with all three functions ready to save. */
export function addWeddingToCalendar(lang: 'en' | 'ta' = 'en') {
  const icsUrl = calendarFileUrl(lang)
  const host = window.location.hostname
  const onLiveSite = host !== 'localhost' && host !== '127.0.0.1'

  if (isAppleMobile() || !onLiveSite) {
    window.location.assign(icsUrl)
    return
  }

  const google = `https://calendar.google.com/calendar/render?cid=${encodeURIComponent(icsUrl)}`
  const opened = window.open(google, '_blank', 'noopener,noreferrer')
  if (!opened) window.location.assign(google)
}

export function whatsappShareUrl(text: string) {
  return `https://wa.me/?text=${encodeURIComponent(text)}`
}
