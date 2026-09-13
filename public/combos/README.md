# Combo photos (`public/combos/`)

Put your **real photos** here. Filenames must match **exactly** (lowercase, hyphens).  
Use **`.jpg`** or change `src/data/combos.ts` if you prefer `.png` / `.webp`.

## Required filenames

| Combo | Rename your file to |
|--------|---------------------|
| Entry Level | `entry.jpg` |
| Happy People | `happy.jpg` |
| Stance | `stance.jpg` |
| Crazy | `crazy.jpg` |
| Party | `party.jpg` |
| Polo Vivo | `polo-vivo.jpg` |
| Toyota Vitz | `vitz.jpg` |
| Suzuki Dzire | `dzire.jpg` |
| Ertiga | `ertiga.jpg` |
| Bakkie | `bakkie.jpg` |
| Quantum Basic | `Quantum basic combo.jpg` |
| Air suspension | `suspension air.png`, `images.jfif` |

Paths on the site are `/combos/entry.jpg`, `/combos/happy.jpg`, etc.

## Firebase

If combos are synced from Firestore, set each document’s `image` field to the same path, e.g. `/combos/party.jpg`.

## Old SVG placeholders

You can delete `entry.svg`, `happy.svg`, `party.svg`, `polo-vivo.svg` after your JPGs are in place.
