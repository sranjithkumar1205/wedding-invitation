import { venue, type Lang } from '../content/i18n'

const place = `${venue.name}, ${venue.address}`

const savedEvents = {
  en: [
    {
      label: 'Save Reception',
      title: 'Reception & Bride Welcome — Ranjith & Chandrika',
      start: '20261114T183000',
      end: '20261114T220000',
    },
    {
      label: 'Save Wedding',
      title: 'Wedding · Subamuhurtham — Ranjith & Chandrika',
      start: '20261115T073000',
      end: '20261115T090000',
    },
  ],
  ta: [
    {
      label: 'வரவேற்பைச் சேமி',
      title: 'வரவேற்பு · மணமகள் அழைப்பு — ரஞ்சித் & சந்திரிகா',
      start: '20261114T183000',
      end: '20261114T220000',
    },
    {
      label: 'திருமணத்தைச் சேமி',
      title: 'திருமணம் · சுபமுகூர்த்தம் — ரஞ்சித் & சந்திரிகா',
      start: '20261115T073000',
      end: '20261115T090000',
    },
  ],
} as const

function googleEventUrl(title: string, start: string, end: string) {
  const params = new URLSearchParams({
    action: 'TEMPLATE',
    text: title,
    dates: `${start}/${end}`,
    details: `${title}\n${place}`,
    location: place,
    ctz: 'Asia/Kolkata',
  })
  return `https://calendar.google.com/calendar/render?${params.toString()}`
}

export function calendarLinks(lang: Lang) {
  return savedEvents[lang].map((event) => ({
    label: event.label,
    href: googleEventUrl(event.title, event.start, event.end),
  }))
}

export function whatsappShareUrl(text: string) {
  return `https://wa.me/?text=${encodeURIComponent(text)}`
}
