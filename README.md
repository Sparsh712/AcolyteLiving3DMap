# AcolyteLiving: Interactive 3D Student Housing Explorer

An interactive, premium 3D student housing exploration platform built with Next.js and MapLibre GL JS.

The experience initiates in a global, immersive 2D Earth view where users select a country, narrow down to a city, and select a university to unlock detailed 3D property views, inspect accommodation amenities, and filter nearby environments.

---

## 🌟 Key Highlights

- **Immersive Global Start**: A interactive 2D world view that transitions dynamically into a highly detailed 3D map upon selecting a country and city.
- **Structured Navigation Flow**: Streamlined step-by-step navigation (Country → City → University) using customizable, fully searchable selectors.
- **Interactive 3D Visualizations**: Highly responsive 3D building extrusions, property markers, and surrounding amenity maps.
- **Smart Filtering & Controls**: University-level price filtering with dynamic bounds, auto-calculated step sizes, and category-specific amenity filters.
- **Cinematic Transitions**: Automatic camera panning, fly-ins, and rotational orbits upon selecting accommodations to provide a premium feel.
- **Amenity Normalization**: Intelligent API normalization across distinct data models to filter university details, parks, sports pitches, food venues, and transport.

---

## 🛠️ Tech Stack

- **Framework**: Next.js 16 (App Router)
- **UI Engine**: React 19
- **Language**: TypeScript
- **Mapping Engine**: MapLibre GL JS (with 3D building extrusions and terrain)
- **Styling**: Modern CSS with custom tokens and dark-mode themes
- **Linting**: ESLint

---

## 🚀 Getting Started

### 1. Install Dependencies
Initialize the project by installing all required package dependencies:
```bash
npm install
```

### 2. Configure Environment Settings
Optional: MapTiler is supported for premium basemap quality. You can set the following environment variable in your local environment configurations:
```bash
NEXT_PUBLIC_MAPTILER_KEY=your_key_here
```
> [!NOTE]
> If this environment variable is not defined, the application gracefully falls back to the public Carto DB dark basemap style.

### 3. Run Development Server
Start the local Next.js development server:
```bash
npm run dev
```

### 4. Access the Application
Open your browser and navigate to:
```
http://localhost:3000
```

---

## 📁 Key Directories & Architecture

### 🧭 Core Orchestration
- [page.tsx](file:///e:/Acolyte%20Intern%20Project/Acolyte%20Intern%20Project/AcolyteLiving3DMap/app/page.tsx) — Main page orchestrator coordinating the UI HUD, selections, and MapLibre cameras.
- [useProperties.ts](file:///e:/Acolyte%20Intern%20Project/Acolyte%20Intern%20Project/AcolyteLiving3DMap/hooks/useProperties.ts) — Data retrieval and state management hook aggregating property listings and GeoJSON features.

### 🗺️ Map Components (`components/map/`)
- [MapView.tsx](file:///e:/Acolyte%20Intern%20Project/Acolyte%20Intern%20Project/AcolyteLiving3DMap/components/map/MapView.tsx) — Handles MapLibre map initialization, 3D style layers, and terrain settings.
- [UniversityMarkers.tsx](file:///e:/Acolyte%20Intern%20Project/Acolyte%20Intern%20Project/AcolyteLiving3DMap/components/map/UniversityMarkers.tsx) — Renders custom indicators for universities on the map view.
- [PropertyMarkers.tsx](file:///e:/Acolyte%20Intern%20Project/Acolyte%20Intern%20Project/AcolyteLiving3DMap/components/map/PropertyMarkers.tsx) — Renders 3D extruded property layers, pricing details, and selection rings.
- [AmenityMarkers.tsx](file:///e:/Acolyte%20Intern%20Project/Acolyte%20Intern%20Project/AcolyteLiving3DMap/components/map/AmenityMarkers.tsx) — Renders surrounding amenities (transit, parks, shops) dynamically based on category toggles.

### 🖥️ User Interface Components (`components/ui/`)
- [HUD.tsx](file:///e:/Acolyte%20Intern%20Project/Acolyte%20Intern%20Project/AcolyteLiving3DMap/components/ui/HUD.tsx) — Displays user interface overlays, statistics, and system states.
- [FilterBar.tsx](file:///e:/Acolyte%20Intern%20Project/Acolyte%20Intern%20Project/AcolyteLiving3DMap/components/ui/FilterBar.tsx) — Houses the country, city, and university selectors.
- [CustomSelect.tsx](file:///e:/Acolyte%20Intern%20Project/Acolyte%20Intern%20Project/AcolyteLiving3DMap/components/ui/CustomSelect.tsx) — Fully customizable select dropdown with search filtering and clear controls.
- [PropertyPanel.tsx](file:///e:/Acolyte%20Intern%20Project/Acolyte%20Intern%20Project/AcolyteLiving3DMap/components/ui/PropertyPanel.tsx) — Slide-out details card displaying image carousels, pricing, and normalized amenity tags.
- [PlaneOverlay.tsx](file:///e:/Acolyte%20Intern%20Project/Acolyte%20Intern%20Project/AcolyteLiving3DMap/components/ui/PlaneOverlay.tsx) — HUD component for gamified navigation controls and plane mode indicators.

---

## 📊 Data Layer Structure

Runtime data resources are hosted locally and served static from:
`public/data/<country>/<city>/`

- `properties.json` — Property names, geolocations, rates, and imagery metadata.
- `amenities.json` — Categorized geospatial amenities surrounding the accommodation locations.
- `property-buildings.json` — 3D polygon footprints and heights used for extrusions.

### Backend Endpoints
- `GET /api/amenities/[id]` — Retrieves GeoJSON features and category summaries for selected accommodation nodes.

---

## ⚙️ City Integration Workflow

To expand coverage to new target cities and countries:

1. **Ingest City Data**: Obtain raw property and building datasets utilizing data-collection utilities.
2. **Register City Source**: Add the city information structure under the available source configurations in [useProperties.ts](file:///e:/Acolyte%20Intern%20Project/Acolyte%20Intern%20Project/AcolyteLiving3DMap/hooks/useProperties.ts).
3. **Compile Datasets**: Generate properties, amenities, and building footprint files. Place them into the matching paths within the `public/data/` folder structure.
4. **Expand Localization Support**: If you are introducing a brand new country:
   - Allowlist the image routes in [route.ts](file:///e:/Acolyte%20Intern%20Project/Acolyte%20Intern%20Project/AcolyteLiving3DMap/app/api/property-images/%5Bid%5D/route.ts) under `app/api/property-images/[id]/`
   - Incorporate fallbacks or customized logic inside [page.tsx](file:///e:/Acolyte%20Intern%20Project/Acolyte%20Intern%20Project/AcolyteLiving3DMap/app/page.tsx)
   - Ensure mapping slug lookups are configured inside [PropertyPanel.tsx](file:///e:/Acolyte%20Intern%20Project/Acolyte%20Intern%20Project/AcolyteLiving3DMap/components/ui/PropertyPanel.tsx) and [normalizer.ts](file:///e:/Acolyte%20Intern%20Project/Acolyte%20Intern%20Project/AcolyteLiving3DMap/lib/data/normalizer.ts)

---

## 📝 General Interaction Notes

- **Dynamic Navigation Reset**: Resetting or clearing the city select returns the view back to the global Earth 2D perspective.
- **Dynamic Count Banners**: Selecting a university updates the banner status showing filtered versus total available accommodations.
- **Cinematic Orbit Dismissal**: The camera's automatic orbital rotation stops instantly as soon as a user performs any mouse or pointer drag interactions.
