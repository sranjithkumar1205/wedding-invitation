# Ranjith & Chandrika — Wedding E-Invitation

Animated bilingual (EN / தமிழ்) wedding invitation. Vite + React + TypeScript + Tailwind CSS v4 + Framer Motion.

## Open locally

```bash
cd /agent/wedding-invite
npm install
npm run dev
```

Dev server: **http://127.0.0.1:5173/** (also on the VM LAN IP, port `5173`).

## Structure

```
src/
  App.tsx                 # Seal gate → main invite + soft petals
  content/i18n.ts         # Couple, events, venue, EN/TA copy, photo map
  components/
    SealIntro.tsx         # Wax seal + card-unfold
    Hero.tsx              # Full-bleed stage portrait + brand names
    Countdown.tsx         # To Subamuhurtham 15 Nov 2026 7:30 AM IST
    Couple.tsx            # Parents + quote
    Events.tsx            # Pandakkal / Reception / Wedding
    PhotoStory.tsx        # Parallax gallery
    Venue.tsx             # Maps, directions, calendar, WhatsApp
    Petals.tsx            # Soft rose/cream petal drift
    FloatingControls.tsx  # Language + music mute
  hooks/                  # Language + procedural ambient audio
public/photos/            # Pre-wedding + couple-stage.jpg
public/invitation/        # Scanned card images (reference)
```

## Limits

- **Music:** Procedural Web Audio pad (no MP3). Starts after opening the seal; mute toggle always works. Not a song file.

## Demos

Screenshots / recording: `/cursor/stores/self/media/demos/`
