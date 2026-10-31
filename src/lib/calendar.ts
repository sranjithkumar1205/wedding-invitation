import { events, venue } from '../content/i18n'

function toICSDate(iso: string) {
  const d = new Date(iso)
  const pad = (n: number) => String(n).padStart(2, '0')
  return (
    d.getUTCFullYear() +
    pad(d.getUTCMonth() + 1) +
    pad(d.getUTCDate()) +
    'T' +
    pad(d.getUTCHours()) +
    pad(d.getUTCMinutes()) +
    pad(d.getUTCSeconds()) +
    'Z'
  )
}

const titles: Record<(typeof events)[number]['id'], { en: string; ta: string }> = {
  pandakkal: { en: 'Pandakkal — Ranjith & Chandrika', ta: 'பந்தக்கால் — ரஞ்சித் & சந்திரிகா' },
  reception: {
    en: 'Reception & Bride Welcome — Ranjith & Chandrika',
    ta: 'வரவேற்பு · மணமகள் அழைப்பு — ரஞ்சித் & சந்திரிகா',
  },
  wedding: {
    en: 'Wedding · Subamuhurtham — Ranjith & Chandrika',
    ta: 'திருமணம் · சுபமுகூர்த்தம் — ரஞ்சித் & சந்திரிகா',
  },
}

export function downloadWeddingICS(lang: 'en' | 'ta' = 'en') {
  const lines = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//RanjithChandrika//Wedding//EN',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
  ]

  for (const ev of events) {
    lines.push(
      'BEGIN:VEVENT',
      `UID:${ev.id}@ranjith-chandrika.wedding`,
      `DTSTAMP:${toICSDate(new Date().toISOString())}`,
      `DTSTART:${toICSDate(ev.calendarStart)}`,
      `DTEND:${toICSDate(ev.calendarEnd)}`,
      `SUMMARY:${titles[ev.id][lang]}`,
      `LOCATION:${venue.name}\\, ${venue.address}`,
      `DESCRIPTION:${venue.name} — ${venue.address}`,
      'END:VEVENT',
    )
  }

  lines.push('END:VCALENDAR')
  const blob = new Blob([lines.join('\r\n')], {
    type: 'text/calendar;charset=utf-8',
  })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = 'ranjith-chandrika-wedding.ics'
  a.click()
  URL.revokeObjectURL(url)
}

export function whatsappShareUrl(text: string) {
  return `https://wa.me/?text=${encodeURIComponent(text)}`
}
