import puppeteer from 'puppeteer-core'
import { mkdirSync } from 'fs'
const out = '/cursor/stores/self/media/demos'
mkdirSync(out, { recursive: true })
const browser = await puppeteer.launch({
  executablePath: '/usr/bin/google-chrome-stable',
  headless: 'new',
  args: ['--no-sandbox', '--disable-gpu', '--window-size=1280,900'],
  defaultViewport: { width: 1280, height: 900 },
})
const page = await browser.newPage()
await page.goto('http://127.0.0.1:5173/', { waitUntil: 'networkidle0', timeout: 60000 })
await new Promise(r => setTimeout(r, 1000))
await page.screenshot({ path: `${out}/open_line_seal.png`, fullPage: false })
await page.evaluate(() => {
  const buttons = [...document.querySelectorAll('button')]
  buttons.find(b => /open|திறக்க/i.test(b.textContent||''))?.click()
})
await new Promise(r => setTimeout(r, 1800))
await page.screenshot({ path: `${out}/open_line_hero.png`, fullPage: false })
await page.evaluate(() => {
  const els = [...document.querySelectorAll('h2')]
  const v = els.find(e => /Venue|இடம்/i.test(e.textContent||''))
  v?.scrollIntoView({ behavior: 'instant', block: 'start' })
})
await new Promise(r => setTimeout(r, 900))
await page.screenshot({ path: `${out}/venue_redesign.png`, fullPage: false })
const body = await page.evaluate(() => document.body.innerText)
console.log({
  hasOldInvocation: /Kanniamman|கன்னியம்மன்/.test(body),
  hasDedication: /Poovukku|பூவுக்கு/.test(body),
  hasOpenLine: /Two hearts found forever|இரண்டு இதயங்கள் நித்தியம்/.test(body),
  hasVenue: /Praneetha Palace/.test(body),
})
await browser.close()
