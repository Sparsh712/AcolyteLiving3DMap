# Add New Cities and Countries (Beginner Guide)

This guide explains the full workflow for adding a new city, or a brand-new country, to this project.

If you only add another city inside a country that already works, you will usually touch fewer files.
If you add a new country like `china`, you must update the app's country helpers too.

---

## What the project expects

Runtime data lives here:

```text
public/data/<country>/<city>/
  properties.json
  amenities.json
  property-buildings.json
```

Example:

```text
public/data/uk/birmingham/
  properties.json
  amenities.json
  property-buildings.json
```

The raw export files stay in `full json/` by default, for example:

```text
full json/Birmingham UK All Data.json
```

The house fetch script also writes `full json/city-snippets.txt`, which is a helper file containing ready-to-paste snippets for:

- `scripts/process-data.ts` `cityConfigs`
- `hooks/useProperties.ts` `CITY_SOURCES`

---

## Before you start

- If this is a fresh clone, run `npm install` once before anything else.
- Keep a terminal open in the project root while you work through the steps.
- Run all commands from the project root, the folder with `package.json`.
- You need internet access for the Acolyte API and Overpass (OpenStreetMap).
- Decide whether you are adding only a city, or a brand-new country.
- If you add a brand-new country, you must update the country parsing helpers in the app.

---

## Slug rules

- Country slug: short lowercase string such as `uk`, `us`, or `china`.
- City slug: lowercase string with hyphens such as `st-andrews` or `new-york`.
- Keep both slugs stable, because they become folder names and URL keys.

---

## Step 1: Fetch the raw export

Use the house fetch script to download the raw JSON export.

```bash
# One city
npx tsx scripts/fetch-city-houses.ts --pair=birmingham,uk

# Multiple cities inline
npx tsx scripts/fetch-city-houses.ts --pairs='[["birmingham","uk"],["birmingham","us"],["shanghai","china"]]'

# Multiple cities from a JSON file
npx tsx scripts/fetch-city-houses.ts --input=./scripts/city-pairs.json
```

Example `scripts/city-pairs.json`:

```json
[
  ["birmingham", "uk"],
  ["birmingham", "us"],
  ["shanghai", "china"]
]
```

PowerShell-safe alternative:

```bash
npx tsx scripts/fetch-city-houses.ts --pairs="[[`"birmingham`",`"uk`"]]"
```

What this creates:

- Raw `All Data` JSON files in `full json/`
- `full json/city-snippets.txt`

If you do not get the raw file, stop here. The rest of the pipeline depends on it.

---

## Step 2: Convert raw data into runtime properties

Open [scripts/process-data.ts](scripts/process-data.ts) and add one `cityConfigs` object per city.

Example:

```ts
{
  name: 'Birmingham UK',
  country: 'uk',
  city: 'birmingham',
  inputFile: 'Birmingham UK All Data.json',
  outputProperties: 'properties.json',
}
```

Then run:

```bash
npx tsx scripts/process-data.ts
```

This writes:

- `public/data/<country>/<city>/properties.json`

If you are adding several cities, add several config objects.
You can usually copy them from `full json/city-snippets.txt`.

---

## Step 3: Generate optional amenities and buildings

These files are optional, but they improve the 3D experience.

```bash
# One city
npx tsx scripts/fetch-city-amenities.ts --country=uk --city=birmingham
npx tsx scripts/fetch-city-buildings.ts --country=uk --city=birmingham

# Multiple cities using the same pair file
npx tsx scripts/fetch-city-amenities.ts --input=./scripts/city-pairs.json
npx tsx scripts/fetch-city-buildings.ts --input=./scripts/city-pairs.json
```

These scripts write:

- `public/data/<country>/<city>/amenities.json`
- `public/data/<country>/<city>/property-buildings.json`

Notes:

- Overpass can rate-limit requests, so these commands may take a while.
- If you skip them, the map still works.
- If you are adding many cities, the `--input=./scripts/city-pairs.json` workflow is the easiest.

---

## Step 4: Register the city in the app

Open [hooks/useProperties.ts](hooks/useProperties.ts) and add the city to `CITY_SOURCES`.

Example:

```ts
{ country: 'uk', city: 'birmingham' }
```

Without this step, the app will not load the city into the dropdowns.

If you add several cities, add one `CITY_SOURCES` entry for each city.

---

## Step 5: If you added a new country, update country helpers

This is the step people usually miss.

The app currently knows about country slugs through helper functions. If you add a new country such as `china`, update all of these places:

- [app/page.tsx](app/page.tsx)
  - `getPropertyCountry()`
  - `getPropertyCity()` if the new URL shape needs special fallback logic
  - `resolveCountryZoom()` if you want a different zoom for the new country
  - `resolveCityCenter()` if you want a curated fly-to center

- [components/ui/PropertyPanel.tsx](components/ui/PropertyPanel.tsx)
  - `getPropertyCountrySlug()`
  - `getPropertyCitySlug()`

- [lib/data/normalizer.ts](lib/data/normalizer.ts)
  - `getPropertyCountrySlug()`
  - `getPropertyCitySlug()`

These helpers affect:

- which country appears in the country dropdown
- which city appears under that country
- which building cache file is loaded
- which listing URL the "View Full Listing" button opens

If you add a country but do not update these helpers, the data may still exist on disk but the UI will not understand it.

---

## Step 6: If you use property images, update the route allowlists

If you use [app/api/property-images/[id]/route.ts](app/api/property-images/%5Bid%5D/route.ts), update:

- `ALLOWED_COUNTRIES`
- `ALLOWED_CITIES`
- the URL building logic if the external property site uses a different path shape

The route expects requests like:

```text
/api/property-images/123?country=us&city=birmingham
```

If you do not use the image route, you can skip this step.

---

## Step 7: Optional camera tuning

If the automatic map center looks bad for a new city, add a custom center in [lib/maplibre/mapConfig.ts](lib/maplibre/mapConfig.ts) and use it in `resolveCityCenter()` in [app/page.tsx](app/page.tsx).

This is optional.

---

## Step 8: Verify everything

Before opening the app, make sure every file you expect exists:

- `full json/<City> <Country> All Data.json`
- `public/data/<country>/<city>/properties.json`
- `public/data/<country>/<city>/amenities.json` (if generated)
- `public/data/<country>/<city>/property-buildings.json` (if generated)

Run the app:

```bash
npm run dev
```

Checklist:

- Country appears in the country dropdown
- City appears after selecting the country
- Properties render on the map
- Amenities appear after selecting a property, if generated
- Buildings extrude in 3D, if generated
- Listing links open the right country and city
- Image fetches still work, if you use the route

For a brand-new country, also verify:

- the country label is correct everywhere in the UI
- the country dropdown shows the new slug as a real country, not as UK or US
- the app still flies to a sensible map center

---

## Exact files you usually touch

1) [scripts/fetch-city-houses.ts](scripts/fetch-city-houses.ts)
- Download raw city exports.
- Use `--pair`, `--pairs`, or `--input=./scripts/city-pairs.json`.
- Writes the raw JSON files plus `full json/city-snippets.txt`.

2) [scripts/process-data.ts](scripts/process-data.ts)
- Add each city to `cityConfigs`.
- Converts raw exports into `properties.json`.

3) [scripts/fetch-city-amenities.ts](scripts/fetch-city-amenities.ts)
- Optional, but recommended.
- Generates `amenities.json`.

4) [scripts/fetch-city-buildings.ts](scripts/fetch-city-buildings.ts)
- Optional, but recommended.
- Generates `property-buildings.json`.

5) [hooks/useProperties.ts](hooks/useProperties.ts)
- Add each city to `CITY_SOURCES`.
- Without this, the app will not load the city.

6) [app/page.tsx](app/page.tsx)
- Update country detection if you added a new country.
- Update city fallback logic if the URL shape is different.

7) [components/ui/PropertyPanel.tsx](components/ui/PropertyPanel.tsx)
- Update listing URL helpers if the new country or city uses a different slug format.

8) [lib/data/normalizer.ts](lib/data/normalizer.ts)
- Update building cache lookup helpers if the new country or city slug format changes.

9) [app/api/property-images/[id]/route.ts](app/api/property-images/%5Bid%5D/route.ts)
- Add the new city to `ALLOWED_CITIES`.
- Add the new country to `ALLOWED_COUNTRIES`.
- Update the external property URL if needed.

10) [lib/maplibre/mapConfig.ts](lib/maplibre/mapConfig.ts)
- Optional custom map center constants.

---

## Copy/paste checklist

### Existing country, new city

```bash
# 1) Download raw data
npx tsx scripts/fetch-city-houses.ts --pair=CITY,COUNTRY

# 2) Add a cityConfigs entry in scripts/process-data.ts

# 3) Add { country: 'COUNTRY', city: 'CITY' } to hooks/useProperties.ts

# 4) Generate properties
npx tsx scripts/process-data.ts

# 5) Generate amenities and buildings
npx tsx scripts/fetch-city-amenities.ts --country=COUNTRY --city=CITY
npx tsx scripts/fetch-city-buildings.ts --country=COUNTRY --city=CITY

# 6) Run the app
npm run dev
```

### Brand-new country

```bash
# 1) Download raw data
npx tsx scripts/fetch-city-houses.ts --pair=shanghai,china

# 2) Add a cityConfigs entry in scripts/process-data.ts

# 3) Add { country: 'china', city: 'shanghai' } to hooks/useProperties.ts

# 4) Update app/page.tsx country and city helpers

# 5) Update components/ui/PropertyPanel.tsx and lib/data/normalizer.ts helpers

# 6) If needed, update app/api/property-images/[id]/route.ts

# 7) Generate properties, amenities, and buildings
npx tsx scripts/process-data.ts
npx tsx scripts/fetch-city-amenities.ts --country=china --city=shanghai
npx tsx scripts/fetch-city-buildings.ts --country=china --city=shanghai

# 8) Run the app
npm run dev
```

If your new country is not `uk` or `us`, also check:

- [app/page.tsx](app/page.tsx) → country and city helpers
- [components/ui/PropertyPanel.tsx](components/ui/PropertyPanel.tsx) → listing URL helpers
- [lib/data/normalizer.ts](lib/data/normalizer.ts) → building cache helpers
- [app/api/property-images/[id]/route.ts](app/api/property-images/%5Bid%5D/route.ts) → `ALLOWED_COUNTRIES`

---

## Common issues and fixes

1) City does not appear in the dropdown
- Check [hooks/useProperties.ts](hooks/useProperties.ts).
- Check that `public/data/<country>/<city>/properties.json` exists.

2) Country shows as UK when it should not
- Update `getPropertyCountry()` in [app/page.tsx](app/page.tsx).
- Update `getPropertyCountrySlug()` in [components/ui/PropertyPanel.tsx](components/ui/PropertyPanel.tsx).
- Update `getPropertyCountrySlug()` in [lib/data/normalizer.ts](lib/data/normalizer.ts).

3) Amenities are empty
- Make sure `amenities.json` exists.
- Re-run [scripts/fetch-city-amenities.ts](scripts/fetch-city-amenities.ts).

4) Buildings are flat boxes
- Make sure `property-buildings.json` exists.
- Re-run [scripts/fetch-city-buildings.ts](scripts/fetch-city-buildings.ts).

5) View Full Listing opens the wrong country
- Update `getPropertyCountrySlug()` in [components/ui/PropertyPanel.tsx](components/ui/PropertyPanel.tsx).

6) The new country exists in files but not in the UI
- Update [app/page.tsx](app/page.tsx), [components/ui/PropertyPanel.tsx](components/ui/PropertyPanel.tsx), and [lib/data/normalizer.ts](lib/data/normalizer.ts).
- Make sure the raw `house_url` values actually contain the new country slug.

7) Property images fail for the new country
- Add the country to `ALLOWED_COUNTRIES` in [app/api/property-images/[id]/route.ts](app/api/property-images/%5Bid%5D/route.ts).
- Make sure the API request passes the correct `country` and `city` query params.

---

## Example: add Birmingham, UK

```bash
# 1) Download raw data
npx tsx scripts/fetch-city-houses.ts --pair=birmingham,uk

# 2) Add cityConfigs in scripts/process-data.ts

# 3) Add { country: 'uk', city: 'birmingham' } to hooks/useProperties.ts

# 4) Generate properties
npx tsx scripts/process-data.ts

# 5) Generate amenities and buildings
npx tsx scripts/fetch-city-amenities.ts --country=uk --city=birmingham
npx tsx scripts/fetch-city-buildings.ts --country=uk --city=birmingham

# 6) Run the app
npm run dev
```

---

## Example: add Shanghai, China

```bash
# 1) Download raw data
npx tsx scripts/fetch-city-houses.ts --pair=shanghai,china

# 2) Add cityConfigs in scripts/process-data.ts

# 3) Add { country: 'china', city: 'shanghai' } to hooks/useProperties.ts

# 4) Update country/city helpers in app/page.tsx

# 5) Update country/city slug helpers in components/ui/PropertyPanel.tsx and lib/data/normalizer.ts

# 6) Update app/api/property-images/[id]/route.ts if you use it

# 7) Generate properties, amenities, and buildings
npx tsx scripts/process-data.ts
npx tsx scripts/fetch-city-amenities.ts --country=china --city=shanghai
npx tsx scripts/fetch-city-buildings.ts --country=china --city=shanghai

# 8) Run the app
npm run dev
```

---

## If you need to remove a city

- Remove it from `CITY_SOURCES` in [hooks/useProperties.ts](hooks/useProperties.ts).
- Delete `public/data/<country>/<city>/`.
- Remove the matching `cityConfigs` entry from [scripts/process-data.ts](scripts/process-data.ts) if you no longer want to regenerate it.

---

## Case Study: Adding Australia (AU)

Here is a summary of the changes made to add Australia (`au`) and its cities (Adelaide, Brisbane, Canberra, Gold Coast, Melbourne, Newcastle, Perth, Sydney) to the project:

### 1. Register the Cities
Added all Australian cities to `CITY_SOURCES` in `hooks/useProperties.ts`:

**Before:**
```ts
const CITY_SOURCES: CitySource[] = [
  { country: 'uk', city: 'manchester', legacySlug: 'manchester' },
  ...
  { country: 'uk', city: 'york', legacySlug: 'york' },
];
```

**After:**
```ts
const CITY_SOURCES: CitySource[] = [
  { country: 'uk', city: 'manchester', legacySlug: 'manchester' },
  ...
  { country: 'uk', city: 'york', legacySlug: 'york' },
  { country: 'au', city: 'melbourne', legacySlug: 'melbourne' },
  { country: 'au', city: 'adelaide', legacySlug: 'adelaide' },
  { country: 'au', city: 'brisbane', legacySlug: 'brisbane' },
  { country: 'au', city: 'canberra', legacySlug: 'canberra' },
  { country: 'au', city: 'gold-coast', legacySlug: 'gold-coast' },
  { country: 'au', city: 'newcastle', legacySlug: 'newcastle' },
  { country: 'au', city: 'perth', legacySlug: 'perth' },
  { country: 'au', city: 'sydney', legacySlug: 'sydney' },
];
```

### 2. Update Country Helpers in `app/page.tsx`
Updated the country parser, city-slug parser, and map defaults to support Australia:

**Before (in `extractCitySlug`):**
```ts
const countryIndex = lower.findIndex((part) => part === 'uk' || part === 'us');
```
**After (in `extractCitySlug`):**
```ts
const countryIndex = lower.findIndex((part) => part === 'uk' || part === 'us' || part === 'au');
```

**Before (in `getPropertyCountry`):**
```ts
const match = normalized.match(/(^|\/)(uk|us)\//);
if (match?.[2] === 'us') return 'US';
return 'UK';
```
**After (in `getPropertyCountry`):**
```ts
const match = normalized.match(/(^|\/)(uk|us|au)\//);
if (match?.[2] === 'us') return 'US';
if (match?.[2] === 'uk') return 'UK';
if (match?.[2] === 'au') return 'AU';
```

**Before (in `resolveCountryZoom`):**
```ts
if (country === 'US') return 3.2;
if (country === 'UK') return 4.4;
return 4.0;
```
**After (in `resolveCountryZoom`):**
```ts
if (country === 'US') return 3.2;
if (country === 'UK') return 4.4;
if (country === 'AU') return 3.5;
return 4.0;
```

### 3. Update Slugs in Components and Normalizer
Updated `components/ui/PropertyPanel.tsx` and `lib/data/normalizer.ts` to identify the Australian country and city structure.

**Before (in `components/ui/PropertyPanel.tsx`):**
```ts
function getPropertyCountrySlug(property: Property): string {
  const url = property.houseUrl?.toLowerCase() ?? '';
  if (url.includes('/us/')) return 'us';
  return 'uk';
}
```
**After (in `components/ui/PropertyPanel.tsx`):**
```ts
function getPropertyCountrySlug(property: Property): string {
  const url = property.houseUrl?.toLowerCase() ?? '';
  if (url.includes('/us/')) return 'us';
  if (url.includes('/au/')) return 'au';
  return 'uk';
}
```

**Before (in `lib/data/normalizer.ts`):**
```ts
export function getPropertyCountrySlug(houseUrl: string): string {
  const path = houseUrl.toLowerCase();
  if (path.includes('/us/')) return 'us';
  return 'uk';
}
```
**After (in `lib/data/normalizer.ts`):**
```ts
export function getPropertyCountrySlug(houseUrl: string): string {
  const path = houseUrl.toLowerCase();
  if (path.includes('/us/')) return 'us';
  if (path.includes('/au/')) return 'au';
  return 'uk';
}
```

### 4. Update the Image Route Allowed Lists
Added Australia and Australian cities to the whitelist inside `app/api/property-images/[id]/route.ts`.

**Before:**
```ts
const ALLOWED_COUNTRIES = ['uk', 'us'];
const ALLOWED_CITIES = ['london', 'manchester', 'coventry', 'nottingham', 'birmingham', 'durham', 'aberdeen', ...];
```
**After:**
```ts
const ALLOWED_COUNTRIES = ['uk', 'us', 'au'];
const ALLOWED_CITIES = [
  'london', 'manchester', 'coventry', 'nottingham', 'birmingham', 'durham', 'aberdeen', ...,
  'melbourne', 'adelaide', 'brisbane', 'canberra', 'gold-coast', 'newcastle', 'perth', 'sydney'
];
```

### 5. Configured Overpass API Mirror Resilience
Large Australian cities like Melbourne and Sydney triggered Overpass timeout/rate limit issues during amenities and building exports. The scripts `scripts/fetch-city-amenities.ts` and `scripts/fetch-city-buildings.ts` were updated with a fallback mirror architecture:
```ts
const OVERPASS_MIRRORS = [
  'https://overpass-api.de/api/interpreter',
  'https://lz4.overpass-api.de/api/interpreter',
  'https://z.overpass-api.de/api/interpreter',
  'https://overpass.kumi.systems/api/interpreter',
  'https://maps.mail.ru/osm/tools/overpass/api/interpreter'
];
```

---

## Legacy data note

Older flat files such as `public/data/manchester-properties.json` are still supported as a fallback. New work should use the country/city folder structure.
