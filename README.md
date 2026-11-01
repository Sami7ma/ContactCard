# Contact Card

Samuel Mifta's contact card, built with React and Vite. It is the same ID card that hangs on the portfolio, as its own page: parchment (Birana) and dark themes, a satin lanyard with the gold clip, the circuit-and-braces logo and a Telegram QR code.

## What it does

- Hangs from an elastic lanyard: pull the card as hard as you like, the strap stretches, thins, snaps back and bounces
- Links to GitHub, email, Telegram and phone, plus a QR code that opens a Telegram chat
- **Save contact** downloads a `.vcf` that phones and address books import
- Switches between Birana (parchment) and dark, and remembers your choice
- Respects reduced-motion settings and works with keyboard and screen readers

## Edit the content

Text and links live in `src/data/contact.js`. The card and the saved contact both read from it. The QR code is in `src/data/qr.js` (it points to `t.me/sami7ma`; replace it if the Telegram handle changes).

## Run locally

```bash
npm install
npm run dev
```

## Other scripts

```bash
npm run build    # production build
npm run lint     # oxlint
npm run preview  # preview the build
```

## Student information

- Section: DRBSE2401B
- GitHub: https://github.com/Sami7ma
