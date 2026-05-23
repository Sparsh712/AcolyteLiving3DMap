# City Identity Platform

Interactive 3D student housing explorer built with Next.js and MapLibre.

The experience starts in a global 2D world view. Users choose a country, then a city, then pick a university to explore nearby accommodation in 3D, inspect property details, and filter nearby amenities.

## Highlights

- Global Earth 2D start view before any city is selected
- Country-first flow: choose country, then city, then university
- Searchable country, city, and university dropdowns with inline clear controls
- 3D map with university markers and property extrusions
- University-level price slider with dynamic bounds and adaptive step size
- Cinematic camera transitions on property selection:
  - fly in to selected property
  - slight zoom-out
  - continuous rotation until user interaction
- Property panel with image carousel and clickable amenity category chips
- Amenity API normalization across datasets:
  - removes University amenities
  - distinguishes Park vs Sports Pitch

## Tech Stack

- Next.js 16 (App Router)
- React 19
- TypeScript
- MapLibre GL JS
- ESLint

## Getting Started

1. Install dependencies

```bash
npm install
```

2. Optional: add a MapTiler key in `.env.local` for improved basemap quality

```bash
NEXT_PUBLIC_MAPTILER_KEY=your_key_here
```

If no key is set, the app falls back to the public Carto dark style.

3. Run the development server

```bash
npm run dev
```

4. Open `http://localhost:3000`

## Scripts

- `npm run dev` - start development server
- `npm run build` - production build
- `npm run start` - run production server
- `npm run lint` - run ESLint

## Runtime Data

Primary runtime data is served from `public/data/<country>/<city>/`:

- `properties.json`
- `amenities.json`
- `property-buildings.json`

The data-fetch workflow also creates a combined helper file at `full json/city-snippets.txt`. It contains ready-to-paste snippets for:

- `scripts/process-data.ts` `cityConfigs`
- `hooks/useProperties.ts` `CITY_SOURCES`

If you use the batch fetchers, they accept the same city-pairs input format as `fetch-city-houses.ts`:

```bash
npx tsx scripts/fetch-city-amenities.ts --input=./scripts/city-pairs.json
npx tsx scripts/fetch-city-buildings.ts --input=./scripts/city-pairs.json
```

Amenity details are loaded via API route:

- `GET /api/amenities/[id]`

Response includes:

- `features`: amenity GeoJSON features for selected property
- `summary`: category counts used by amenity chips

## Key Files

- `app/page.tsx` - core app orchestration, city/university selection, camera flows
- `components/map/MapView.tsx` - MapLibre bootstrap and base layer setup
- `components/map/UniversityMarkers.tsx` - university marker rendering and selection
- `components/map/PropertyMarkers.tsx` - property extrusion rendering and filtering
- `components/map/AmenityMarkers.tsx` - amenity extrusion layer and category filtering
- `components/ui/FilterBar.tsx` - country/city selectors + searchable university selector
- `components/ui/CustomSelect.tsx` - shared searchable select with inline clear control
- `components/ui/PropertyPanel.tsx` - property details and amenity controls
- `hooks/useProperties.ts` - loads and merges property datasets
- `app/api/amenities/[id]/route.ts` - amenity retrieval + category normalization

## City Import Workflow

For the full walkthrough, see [ADD_CITIES.md](ADD_CITIES.md).

Quick version:

1. Fetch raw exports with `scripts/fetch-city-houses.ts`.
2. Add each city to `scripts/process-data.ts` and `hooks/useProperties.ts`.
3. Generate `properties.json`, then optionally generate amenities and buildings.
4. If you add a brand-new country, also update the country helpers in `app/page.tsx`, `components/ui/PropertyPanel.tsx`, and `lib/data/normalizer.ts`.

Use `scripts/fetch-city-houses.ts` with `--pair`, `--pairs`, or `--input=./scripts/city-pairs.json`.

The same pair file can be reused for amenities and building footprints:

```bash
npx tsx scripts/fetch-city-houses.ts --input=./scripts/city-pairs.json
npx tsx scripts/fetch-city-amenities.ts --input=./scripts/city-pairs.json
npx tsx scripts/fetch-city-buildings.ts --input=./scripts/city-pairs.json
```

The house fetcher writes the raw JSON exports plus `full json/city-snippets.txt`, which groups the generated `cityConfigs` entries first, then a blank gap, then the matching `CITY_SOURCES` entries.

If you are adding a new country like `china`, also update:

- `app/api/property-images/[id]/route.ts` allowlists
- any country-specific fallback logic in `app/page.tsx`
- any slug helpers in `components/ui/PropertyPanel.tsx` and `lib/data/normalizer.ts`

## Notes

- Clearing city selection returns to global Earth 2D view.
- University banner shows filtered/total accommodation count for selected university.
- Property orbit animation stops on user pointer interaction.
