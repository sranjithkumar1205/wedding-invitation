export type Lang = 'en' | 'ta'

/** Prefix public-folder paths with Vite's base so they work under a GitHub Pages subpath. */
const asset = (path: string) => `${import.meta.env.BASE_URL}${path}`

export const photos = {
  /** Wedding-day stage portrait — primary hero / ceremony moment */
  hero: asset('photos/web/couple-stage.jpg'),
  ceremony: asset('photos/web/couple-stage.jpg'),
  seal: asset('photos/web/couple-stage.jpg'),
  coupleGroom: asset('photos/web/02-beach-lookback.jpg'),
  coupleBride: asset('photos/web/11-purple-saree-portrait.jpg'),
  story: [
    { src: asset('photos/web/couple-stage.jpg'), thumb: asset('photos/thumb/couple-stage.jpg'), captionEn: 'On the mandapam, forever begins', captionTa: 'மண்டபத்தில் தொடங்கும் நித்தியம்' },
    { src: asset('photos/web/01-bw-dip.jpg'), thumb: asset('photos/thumb/01-bw-dip.jpg'), captionEn: 'Where the tide met forever', captionTa: 'அலைகள் சந்தித்த நித்தியம்' },
    { src: asset('photos/web/02-beach-lookback.jpg'), thumb: asset('photos/thumb/02-beach-lookback.jpg'), captionEn: 'A glance that stayed', captionTa: 'நிலைத்த ஒரு பார்வை' },
    { src: asset('photos/web/03-into-waves.jpg'), thumb: asset('photos/thumb/03-into-waves.jpg'), captionEn: 'Into the waves, hand in hand', captionTa: 'அலைகளுக்குள், கைகோர்த்து' },
    { src: asset('photos/web/04-hands-closeup.jpg'), thumb: asset('photos/thumb/04-hands-closeup.jpg'), captionEn: 'Promises in quiet hands', captionTa: 'அமைதியான கைகளில் வாக்குறுதி' },
    { src: asset('photos/web/05-wave-splash.jpg'), thumb: asset('photos/thumb/05-wave-splash.jpg'), captionEn: 'Joy that splashes', captionTa: 'தெறிக்கும் மகிழ்ச்சி' },
    { src: asset('photos/web/06-running-beach.jpg'), thumb: asset('photos/thumb/06-running-beach.jpg'), captionEn: 'Running toward forever', captionTa: 'நித்தியத்தை நோக்கி' },
    { src: asset('photos/web/07-bw-legs.jpg'), thumb: asset('photos/thumb/07-bw-legs.jpg'), captionEn: 'Steps in soft light', captionTa: 'மென் ஒளியில் அடிகள்' },
    { src: asset('photos/web/08-oonjal-veena.jpg'), thumb: asset('photos/thumb/08-oonjal-veena.jpg'), captionEn: 'Melody on the oonjal', captionTa: 'ஊஞ்சலில் இசை' },
    { src: asset('photos/web/09-oonjal-close.jpg'), thumb: asset('photos/thumb/09-oonjal-close.jpg'), captionEn: 'Home in each other', captionTa: 'ஒருவருக்கொருவர் இல்லம்' },
    { src: asset('photos/web/10-veena-laugh.jpg'), thumb: asset('photos/thumb/10-veena-laugh.jpg'), captionEn: 'Laughter between notes', captionTa: 'சுரங்களுக்கிடையே சிரிப்பு' },
    { src: asset('photos/web/11-purple-saree-portrait.jpg'), thumb: asset('photos/thumb/11-purple-saree-portrait.jpg'), captionEn: 'Grace in gold & silk', captionTa: 'பட்டும் பொன்னும் அழகு' },
  ],
} as const

export const venue = {
  name: 'Praneetha Palace',
  address:
    'No. 68, MR Nagar, Ethiraj Samy Salai Road, Kodungaiyur, East Erukkancheri, Chennai-600081',
  mapsEmbed:
    'https://www.google.com/maps?q=Praneetha+Palace,+68+MR+Nagar,+Ethiraj+Samy+Salai+Road,+Kodungaiyur,+Chennai+600081&output=embed',
  mapsLink:
    'https://www.google.com/maps/dir/?api=1&destination=Praneetha+Palace,+No.+68,+MR+Nagar,+Ethiraj+Samy+Salai+Road,+Kodungaiyur,+East+Erukkancheri,+Chennai-600081',
  contacts: ['9080322416', '9344225487'],
} as const

/** Muhurtham start — countdown target */
export const muhurthamISO = '2026-11-15T07:30:00+05:30'

export const events = [
  {
    id: 'pandakkal',
    dateISO: '2026-11-13',
    timeStart: '06:00',
    timeEnd: '07:30',
    calendarStart: '2026-11-13T06:00:00+05:30',
    calendarEnd: '2026-11-13T07:30:00+05:30',
  },
  {
    id: 'reception',
    dateISO: '2026-11-14',
    timeStart: '18:30',
    timeEnd: '22:00',
    calendarStart: '2026-11-14T18:30:00+05:30',
    calendarEnd: '2026-11-14T22:00:00+05:30',
  },
  {
    id: 'wedding',
    dateISO: '2026-11-15',
    timeStart: '07:30',
    timeEnd: '09:00',
    calendarStart: '2026-11-15T07:30:00+05:30',
    calendarEnd: '2026-11-15T09:00:00+05:30',
  },
] as const

const en = {
  openLine: 'Two hearts found forever — this day is waiting for you.',
  openSeal: 'Open Invitation',
  tapToOpen: 'Tap the seal to begin',
  weddingOf: 'The Wedding of',
  groomTitle: 'Selvan.',
  groomName: 'Ranjith Kumar S.',
  groomDegree: 'B.Tech.',
  groomRole: 'Software Engineer — HCL Tech',
  groomParents: 'S/o Mr. R. Sadagopan & Mrs. S. Padmavathi',
  brideTitle: 'Selvi.',
  brideName: 'Chandrika Devi A.',
  brideDegree: 'MBA.',
  brideRole: 'Monitoring & Testing Specialist — Citi Corp',
  brideParents: 'D/o Mr. R. Ashok Kumar & Mrs. A. Meena',
  weds: 'weds',
  quote:
    'Some Hearts are simply meant to find each other. Today, Two such hearts unite to begin a beautiful journey together, forever.',
  scrollInvite: 'Scroll to explore',
  countdownTitle: 'Counting down to Subamuhurtham',
  days: 'Days',
  hours: 'Hours',
  minutes: 'Minutes',
  seconds: 'Seconds',
  celebrating: 'The muhurtham has begun',
  ourStory: 'Our Story in Frames',
  ourStorySub: 'Beach mornings, oonjal evenings — moments that led us here.',
  eventsTitle: 'Celebrations',
  eventsSub: 'Three sacred gatherings · one joyful beginning',
  pandakkal: 'Pandakkal',
  pandakkalDesc: 'Blessing the home before the festivities',
  reception: 'Reception & Bride Welcome',
  receptionDesc: 'An evening to welcome our beloved bride',
  wedding: 'Wedding · Subamuhurtham',
  weddingDesc: 'The sacred hour we become one',
  onDate: {
    pandakkal: 'Friday, 13 November 2026',
    reception: 'Saturday, 14 November 2026',
    wedding: 'Sunday, 15 November 2026',
  },
  time: {
    pandakkal: '6:00 – 7:30 AM',
    reception: 'From 6:30 PM',
    wedding: '7:30 – 9:00 AM',
  },
  venueTitle: 'Venue',
  getDirections: 'Get Directions',
  callUs: 'Call',
  saveCalendar: 'Save to Calendar',
  shareWhatsApp: 'Share on WhatsApp',
  mute: 'Mute',
  unmute: 'Play soft music',
  compliments: 'With best compliments from relatives & friends',
  footerBlessing: 'May love light every step of this journey',
  langSwitch: 'தமிழ்',
  coupleSection: 'Two hearts · one home',
  programmeNote: 'Programme window also lists 7:00–9:30 AM',
  venueSub: 'We would love to welcome you here',
  chennaiLabel: 'Chennai',
}

const ta = {
  openLine: 'இரண்டு இதயங்கள் நித்தியத்தைக் கண்டன — இந்த நாள் உங்களுக்காகக் காத்திருக்கிறது.',
  openSeal: 'அழைப்பிதழைத் திறக்க',
  tapToOpen: 'முத்திரையைத் தொட்டுத் தொடங்குங்கள்',
  weddingOf: 'திருமண அழைப்பிதழ்',
  groomTitle: 'செல்வன்.',
  groomName: 'ரஞ்சித் குமார் ச.',
  groomDegree: 'B.Tech.',
  groomRole: 'மென்பொருள் பொறியாளர் — HCL Tech',
  groomParents: 'திரு. ர. சதாகோபன் & திருமதி. ச. பத்மாவதி ஆகியோரின் புதல்வர்',
  brideTitle: 'செல்வி.',
  brideName: 'சந்திரிகா தேவி அ.',
  brideDegree: 'MBA.',
  brideRole: 'Monitoring & Testing Specialist — Citi Corp',
  brideParents: 'திரு. ர. அசோக் குமார் & திருமதி. அ. மீனா ஆகியோரின் புதல்வி',
  weds: 'திருமணம்',
  quote:
    'சில இதயங்கள் ஒருவரையொருவர் கண்டுகொள்ளவே பிறக்கின்றன. இன்று இரண்டு இதயங்கள் ஒன்றிணைந்து அழகிய பயணத்தைத் தொடங்குகின்றன.',
  scrollInvite: 'கீழே சென்று காணுங்கள்',
  countdownTitle: 'சுபமுகூர்த்தத்திற்கான எண்ணிக்கை',
  days: 'நாட்கள்',
  hours: 'மணி',
  minutes: 'நிமிடம்',
  seconds: 'வினாடி',
  celebrating: 'சுபமுகூர்த்தம் தொடங்கிவிட்டது',
  ourStory: 'எங்கள் கதை · படங்களில்',
  ourStorySub: 'கடற்கரை காலைகள், ஊஞ்சல் மாலைகள் — இங்கே இட்டுவந்த தருணங்கள்.',
  eventsTitle: 'நிகழ்ச்சிகள்',
  eventsSub: 'மூன்று புனித சந்திப்புகள் · ஒரே மகிழ்ச்சி',
  pandakkal: 'பந்தக்கால்',
  pandakkalDesc: 'விழாவுக்கு முன் இல்லத்திற்கு ஆசீர்வாதம்',
  reception: 'வரவேற்பு · மணமகள் அழைப்பு',
  receptionDesc: 'எங்கள் அன்பார்ந்த மணமகளை வரவேற்கும் மாலை',
  wedding: 'திருமணம் · சுபமுகூர்த்தம்',
  weddingDesc: 'நாம் ஒன்றாகும் புனித வேளை',
  onDate: {
    pandakkal: 'வெள்ளி, 13 நவம்பர் 2026',
    reception: 'சனி, 14 நவம்பர் 2026',
    wedding: 'ஞாயிறு, 15 நவம்பர் 2026',
  },
  time: {
    pandakkal: 'காலை 6:00 – 7:30',
    reception: 'மாலை 6:30 முதல்',
    wedding: 'காலை 7:30 – 9:00',
  },
  venueTitle: 'இடம்',
  getDirections: 'வழிகாட்டி',
  callUs: 'அழைக்க',
  saveCalendar: 'நாட்காட்டியில் சேமி',
  shareWhatsApp: 'WhatsApp-இல் பகிர்',
  mute: 'நிசப்தம்',
  unmute: 'மென் இசை',
  compliments: 'உறவினர்கள் & நண்பர்களின் வாழ்த்துக்களுடன்',
  footerBlessing: 'இந்தப் பயணத்தின் ஒவ்வொரு அடியிலும் அன்பு ஒளிரட்டும்',
  langSwitch: 'EN',
  coupleSection: 'இரண்டு இதயங்கள் · ஒரே இல்லம்',
  programmeNote: 'நிகழ்ச்சி அட்டவணையில் 7:00–9:30 காலை எனவும் குறிக்கப்பட்டுள்ளது',
  venueSub: 'உங்களை இங்கே வரவேற்க ஆவலாக இருக்கிறோம்',
  chennaiLabel: 'சென்னை',
}

export type Dict = typeof en

export const dictionaries: Record<Lang, Dict> = { en, ta }
