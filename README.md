# SIGA Audio SA

Website and booking platform for **SIGA Audio SA** — a car sound installation and accessories shop in **Tembisa, Gauteng, South Africa**.

**Live site:** [https://sigaaudio.co.za](https://sigaaudio.co.za)  
**Firebase Hosting:** [https://sigasound.web.app](https://sigasound.web.app)

## What this website is about

SIGA Audio SA specialises in:

- Car sound installs (head units, speakers, amps, subwoofers)
- Combo packages for popular vehicles (Polo Vivo, Quantum, bakkie, and more)
- Fault finding, sales, bumper sensors, and air suspension
- Online booking with EFT deposit + WhatsApp confirmation

Customers can browse packages, book an installation slot, and send payment proof on WhatsApp. Admins manage bookings, homepage content, combo media, and site activity from a private admin panel.

## Stack

| Layer | Technology |
|--------|------------|
| Framework | [Next.js 14](https://nextjs.org/) (App Router) |
| UI | [React 18](https://react.dev/), [Tailwind CSS](https://tailwindcss.com/), [Framer Motion](https://www.framer.com/motion/), [Lucide](https://lucide.dev/) |
| Language | [TypeScript](https://www.typescriptlang.org/) |
| Backend / data | [Firebase](https://firebase.google.com/) — Authentication, Firestore, Storage |
| Hosting | Firebase Hosting (static export from Next.js `output: "export"`) |
| Build output | Static site in `out/` |

## Main features

- Public homepage with packages, services, terms, SEO content, and LocalBusiness JSON-LD
- Combo catalog and detail pages
- Air suspension page with workshop photos
- Customer signup / sign-in and installation booking
- WhatsApp payment flow (Standard Bank EFT deposit)
- Admin panel: bookings, content CMS, combos, media, activity
- `sitemap.xml` and `robots.txt` for Google Search Console

## Project structure

```
siga-audio/
├── public/           # Static assets (combos photos, icons, sitemap, robots)
├── src/app/          # Next.js routes (pages, admin, book, combos)
├── src/components/   # UI components
├── src/data/         # Combo catalog
├── src/lib/          # Firebase, auth, SEO, payment helpers
├── firebase.json     # Hosting + rules config
└── out/              # Generated static site (after build)
```

## Getting started

```powershell
cd siga-audio
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

Copy `.env.local.example` to `.env.local` and add your Firebase web config keys (never commit secrets).

## Build & preview

```powershell
npm run build          # writes static site to out/
npm run preview        # serve out/ at http://localhost:5050
npm run preview:static # build + preview
```

If the Windows build hangs on webpack cache issues:

```powershell
npm run build:fresh
```

## Deploy (Firebase Hosting)

```powershell
npm run deploy:hosting
# or, after a stuck build:
npm run deploy:hosting:fresh
```

`firebase.json` serves the `out/` folder as the Hosting public directory.

## Admin

| URL | Purpose |
|-----|---------|
| `/admin/login` | Admin Google or email/password sign-in |
| `/admin/dashboard` | Bookings, proofs, confirm/cancel |
| `/admin/content` | Homepage & payment details CMS |
| `/admin/combos` | Combo catalog & media |
| `/admin/media` | Air suspension / site media |
| `/admin/activity` | Visits & sign-ins |

Only allowlisted admin emails in `src/lib/adminConfig.ts` (and matching Firestore rules) can access `/admin`.

## License

Private business project for SIGA Audio SA. All rights reserved unless otherwise stated.
