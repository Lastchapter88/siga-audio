# SIGA Audio (Next.js)

## Production build

Run from **`siga-audio`** (this folder):

```powershell
npm run build
```

Success: you get **`out/`** with **`out/index.html`**.

### Build stuck for a long time (“Creating an optimized production build…”)

On **Windows** this is often:

1. **Corrupted webpack cache** in **`.next/cache`** (error in the log like `Restoring pack failed`).  
   - **Fix:** stop **`npm run dev`** (it locks files), then run a **clean build**:
   ```powershell
   npm run build:fresh
   ```
   That deletes **`.next`** and **`out`**, then builds again. `next.config.mjs` also disables webpack’s persistent cache for production builds to avoid repeat hangs.

2. **File locks / EPERM** on **`.next\trace`** — antivirus or another process using the folder.  
   - Close the dev server and Cursor/VS Code if needed, delete **`.next`**, retry.

3. **Not stuck** — first build after a clean can take **several minutes** on a slow PC; 2+ hours usually means it’s hung; use **`build:fresh`** above.

### Deploy when normal build misbehaves

```powershell
npm run deploy:hosting:fresh
```

Same as **`deploy:hosting`** but runs **`build:fresh`** first.

Other checks: run **`npm run lint`** separately (lint is skipped during build via `next.config.mjs`).

## Preview the static site (Firebase-style `out/` folder)

**Run everything from this folder** (`siga-audio`), not the parent `Siga Sound` folder.

```powershell
cd "c:\Users\Admin\Desktop\Siga Sound\siga-audio"
npm run build
npm run preview
```

Then open **http://localhost:5050**

- If **`GET /` returns 404**, you are either serving the wrong directory or `npm run build` did not finish. After a successful build you must have **`siga-audio\out\index.html`**.
- Do **not** run `npx serve out` from `Desktop\Siga Sound` — there is no exported site there.

### One command (build + serve)

```powershell
npm run preview:static
```

## Dev server

```powershell
npm run dev
```

## Admin (bookings & combos)

| URL | Purpose |
|-----|---------|
| `/admin/login` | Sign in with Firebase email/password |
| `/admin/dashboard` | View bookings, proof images, confirm/cancel |
| `/admin/combos` | Manage Firestore combo catalog (needs signup + `users/{uid}.businessId`) |

Create the first account via **`/signup`** (business + admin user). Use the same email/password on **`/admin/login`**.

**Firestore:** Admins need read/write on `bookings` and `combos` in your security rules. Bookings from the public form use `businessId: ""` unless booking with a multi-tenant link; the dashboard merges those with your business’s bookings when your user has a `businessId`.

## Deploy (Firebase Hosting)

```powershell
npm run deploy:hosting
```

If the build step hangs, use **`npm run deploy:hosting:fresh`** instead.

Uses `firebase.json` → `public: "out"` (build creates that folder).
