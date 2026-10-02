# 📊 3D Location Accuracy, Match & Amenity Coverage Report

This report details the geolocation accuracy of properties mapped to 3D buildings in OpenStreetMap (OSM), and quantifies the coverage and density of amenities cached for each accommodation.

## 🌐 Global Accuracy Summary (Properties)

| Metric | Value | Description |
| :--- | :--- | :--- |
| **Total Properties Mapped** | **6827** | Total accommodations processed across all datasets |
| **OSM Footprint Match Rate** | **98.4%** | Properties successfully snapped to real OSM structures (6718/6827) |
| **Direct Containment Rate** | **68.8%** | Matched markers lying directly inside their building footprints (4619/6718) |
| **Fallback Footprint Rate** | **1.6%** | Properties utilizing estimated fallback boundary geometries |
| **Average Location Proximity Offset** | **16.7 m** | Average distance from marker pin to actual building centroid |

## 🏙️ Detailed City Breakdown (Properties & Accuracy)

| Country | City | Total | Matched | Contained | Fallbacks | Match Rate | Direct Containment | Avg Offset (m) |
| :--- | :--- | :---: | :---: | :---: | :---: | :---: | :---: | :---: |
| AU | PERTH | 39 | 39 | 32 | 0 | 100% | 82.1% | 17.3 m |
| CA | BURNABY | 16 | 16 | 10 | 0 | 100% | 62.5% | 17.4 m |
| CA | CALGARY | 19 | 19 | 11 | 0 | 100% | 57.9% | 17.7 m |
| CA | EDMONTON | 65 | 65 | 36 | 0 | 100% | 55.4% | 20.1 m |
| CA | HAMILTON | 40 | 40 | 24 | 0 | 100% | 60% | 19 m |
| CA | KITCHENER | 6 | 6 | 5 | 0 | 100% | 83.3% | 14.1 m |
| CA | LONDON | 61 | 61 | 47 | 0 | 100% | 77% | 17.9 m |
| CA | MONTREAL | 47 | 47 | 31 | 0 | 100% | 66% | 19.4 m |
| CA | OTTAWA | 140 | 140 | 107 | 0 | 100% | 76.4% | 11.1 m |
| CA | TORONTO | 217 | 217 | 153 | 0 | 100% | 70.5% | 22.1 m |
| CA | VANCOUVER | 85 | 85 | 59 | 0 | 100% | 69.4% | 12 m |
| CA | WATERLOO | 45 | 45 | 35 | 0 | 100% | 77.8% | 17.8 m |
| DE | AACHEN | 5 | 5 | 4 | 0 | 100% | 80% | 4.8 m |
| DE | BERLIN | 217 | 217 | 181 | 0 | 100% | 83.4% | 16.1 m |
| DE | BONN | 15 | 15 | 0 | 0 | 100% | 0% | 18.1 m |
| DE | DARMSTADT | 10 | 10 | 2 | 0 | 100% | 20% | 24.1 m |
| DE | DORTMUND | 4 | 4 | 0 | 0 | 100% | 0% | 41.4 m |
| DE | ESSEN | 8 | 8 | 5 | 0 | 100% | 62.5% | 12.6 m |
| DE | FRANKFURT-AM-MAIN | 217 | 217 | 186 | 0 | 100% | 85.7% | 12 m |
| DE | FREIBURG | 3 | 3 | 3 | 0 | 100% | 100% | 5.1 m |
| DE | HAMBURG | 120 | 120 | 89 | 0 | 100% | 74.2% | 11.8 m |
| DE | HANNOVER | 5 | 5 | 5 | 0 | 100% | 100% | 11.6 m |
| DE | KOLN | 8 | 8 | 3 | 0 | 100% | 37.5% | 11.5 m |
| DE | MANNHEIM | 6 | 6 | 2 | 0 | 100% | 33.3% | 33.4 m |
| DE | MUNCHEN | 217 | 217 | 160 | 0 | 100% | 73.7% | 13.3 m |
| DE | POTSDAM | 2 | 2 | 0 | 0 | 100% | 0% | 32.1 m |
| DE | STUTTGART | 74 | 74 | 72 | 0 | 100% | 97.3% | 6.7 m |
| ES | PAMPLONA | 2 | 2 | 0 | 0 | 100% | 0% | 49.5 m |
| FR | BORDEAUX | 49 | 49 | 35 | 0 | 100% | 71.4% | 15 m |
| FR | CERGY | 2 | 2 | 0 | 0 | 100% | 0% | 38.3 m |
| FR | FONTAINEBLEAU | 1 | 1 | 1 | 0 | 100% | 100% | 25.2 m |
| FR | GRENOBLE | 23 | 23 | 12 | 0 | 100% | 52.2% | 9.9 m |
| FR | LILLE | 71 | 71 | 57 | 0 | 100% | 80.3% | 16.8 m |
| FR | LYON | 217 | 217 | 169 | 0 | 100% | 77.9% | 9.9 m |
| FR | NANCY | 9 | 9 | 5 | 0 | 100% | 55.6% | 16.6 m |
| FR | NANTES | 14 | 14 | 6 | 0 | 100% | 42.9% | 13.4 m |
| FR | PARIS | 217 | 217 | 112 | 0 | 100% | 51.6% | 17.6 m |
| FR | REIMS | 4 | 4 | 1 | 0 | 100% | 25% | 12 m |
| FR | TOULOUSE | 62 | 62 | 50 | 0 | 100% | 80.6% | 12.5 m |
| UK | ABERDEEN | 24 | 24 | 15 | 0 | 100% | 62.5% | 15.6 m |
| UK | BATH | 9 | 9 | 5 | 0 | 100% | 55.6% | 18.1 m |
| UK | BELFAST | 18 | 18 | 8 | 0 | 100% | 44.4% | 22.4 m |
| UK | BIRMINGHAM | 217 | 217 | 174 | 0 | 100% | 80.2% | 9.6 m |
| UK | BRIGHTON | 45 | 45 | 19 | 0 | 100% | 42.2% | 14.5 m |
| UK | BRISTOL | 61 | 61 | 33 | 0 | 100% | 54.1% | 16.5 m |
| UK | CANTERBURY | 11 | 11 | 7 | 0 | 100% | 63.6% | 22.6 m |
| UK | CARDIFF | 61 | 61 | 16 | 0 | 100% | 26.2% | 27.1 m |
| UK | COLCHESTER | 4 | 4 | 1 | 0 | 100% | 25% | 44.7 m |
| UK | COVENTRY | 177 | 177 | 116 | 0 | 100% | 65.5% | 15.6 m |
| UK | DUNDEE | 13 | 13 | 8 | 0 | 100% | 61.5% | 13 m |
| UK | DURHAM | 19 | 19 | 12 | 0 | 100% | 63.2% | 15.4 m |
| UK | EDINBURGH | 78 | 78 | 51 | 0 | 100% | 65.4% | 17.3 m |
| UK | EXETER | 70 | 70 | 53 | 0 | 100% | 75.7% | 10.9 m |
| UK | GUILDFORD | 8 | 8 | 6 | 0 | 100% | 75% | 14.1 m |
| UK | LANCASTER | 153 | 153 | 126 | 0 | 100% | 82.4% | 6.5 m |
| UK | LEEDS | 217 | 217 | 137 | 0 | 100% | 63.1% | 13.3 m |
| UK | LONDON | 217 | 217 | 161 | 0 | 100% | 74.2% | 19.3 m |
| UK | LOUGHBOROUGH | 14 | 14 | 8 | 0 | 100% | 57.1% | 18.5 m |
| UK | MANCHESTER | 50 | 50 | 30 | 0 | 100% | 60% | 22.4 m |
| UK | NEWCASTLE | 81 | 81 | 50 | 0 | 100% | 61.7% | 28.8 m |
| UK | NORWICH | 50 | 50 | 33 | 0 | 100% | 66% | 11.5 m |
| UK | NOTTINGHAM | 178 | 178 | 119 | 0 | 100% | 66.9% | 17.4 m |
| UK | PORTSMOUTH | 18 | 18 | 11 | 0 | 100% | 61.1% | 21.2 m |
| UK | READING | 17 | 17 | 14 | 0 | 100% | 82.4% | 10.9 m |
| UK | SOUTHAMPTON | 72 | 72 | 40 | 0 | 100% | 55.6% | 14.2 m |
| UK | ST-ANDREWS | 3 | 3 | 0 | 0 | 100% | 0% | 27.7 m |
| UK | YORK | 21 | 21 | 11 | 0 | 100% | 52.4% | 17.5 m |
| US | ANN-ARBOR | 30 | 30 | 25 | 0 | 100% | 83.3% | 19.3 m |
| US | ARLINGTON | 2 | 2 | 2 | 0 | 100% | 100% | 4.2 m |
| US | BERKELEY | 65 | 65 | 53 | 0 | 100% | 81.5% | 10.1 m |
| US | BOSTON | 92 | 92 | 71 | 0 | 100% | 77.2% | 14.7 m |
| US | BUFFALO | 7 | 7 | 3 | 0 | 100% | 42.9% | 31.1 m |
| US | CHICAGO | 91 | 91 | 84 | 0 | 100% | 92.3% | 16.3 m |
| US | COLLEGE-STATION | 22 | 22 | 11 | 0 | 100% | 50% | 25.1 m |
| US | DURHAM | 1 | 1 | 1 | 0 | 100% | 100% | 2 m |
| US | LOS-ANGELES | 217 | 217 | 162 | 0 | 100% | 74.7% | 13.3 m |
| US | NEW-YORK | 151 | 151 | 133 | 0 | 100% | 88.1% | 10 m |
| US | PHILADELPHIA | 43 | 43 | 32 | 0 | 100% | 74.4% | 20.9 m |
| US | PITTSBURGH | 23 | 23 | 21 | 0 | 100% | 91.3% | 15.1 m |
| US | RALEIGH | 24 | 24 | 18 | 0 | 100% | 75% | 19 m |
| US | RICHARDSON | 1 | 1 | 0 | 0 | 100% | 0% | 41.9 m |
| US | SAN-DIEGO | 12 | 12 | 8 | 0 | 100% | 66.7% | 16.3 m |
| US | TEMPE | 14 | 14 | 5 | 0 | 100% | 35.7% | 37.1 m |
| US | URBANA-CHAMPAIGN | 134 | 134 | 104 | 0 | 100% | 77.6% | 14.3 m |
| US | WEST-LAFAYETTE | 15 | 15 | 14 | 0 | 100% | 93.3% | 19.5 m |
| UK | GLASGOW | 217 | 216 | 68 | 1 | 99.5% | 31.5% | 21.8 m |
| UK | LIVERPOOL | 217 | 216 | 187 | 1 | 99.5% | 86.6% | 10.7 m |
| UK | SHEFFIELD | 217 | 216 | 100 | 1 | 99.5% | 46.3% | 22.7 m |
| UK | LEICESTERSHIRE | 107 | 106 | 62 | 1 | 99.1% | 58.5% | 20.2 m |
| AU | CANBERRA | 65 | 63 | 33 | 2 | 96.9% | 52.4% | 32.6 m |
| US | ATLANTA | 26 | 25 | 16 | 1 | 96.2% | 64% | 34.7 m |
| AU | ADELAIDE | 84 | 80 | 62 | 4 | 95.2% | 77.5% | 15.1 m |
| AU | BRISBANE | 142 | 135 | 100 | 7 | 95.1% | 74.1% | 20.4 m |
| ES | BARCELONA | 15 | 14 | 8 | 1 | 93.3% | 57.1% | 22.5 m |
| ES | MADRID | 25 | 23 | 16 | 2 | 92% | 69.6% | 16.5 m |
| AU | SYDNEY | 217 | 195 | 127 | 22 | 89.9% | 65.1% | 22.6 m |
| UK | HERTFORDSHIRE | 9 | 8 | 3 | 1 | 88.9% | 37.5% | 27.3 m |
| UK | SWANSEA | 18 | 15 | 6 | 3 | 83.3% | 40% | 31.2 m |
| AU | MELBOURNE | 217 | 175 | 106 | 42 | 80.6% | 60.6% | 31.4 m |
| AU | GOLD-COAST | 6 | 4 | 1 | 2 | 66.7% | 25% | 58.1 m |
| AU | NEWCASTLE | 31 | 15 | 3 | 16 | 48.4% | 20% | 40.4 m |
| CA | OAKVILLE | 1 | 0 | 0 | 1 | 0% | 0% | 0 m |
| US | BIRMINGHAM | 1 | 0 | 0 | 1 | 0% | 0% | 0 m |

## 🏪 Global Amenity Summary

Amenities are fetched directly from OpenStreetMap. Their locations and structural geometries are 100% accurate to OSM by definition. Below is an analysis of amenity coverage and density.

| Metric | Value | Description |
| :--- | :--- | :--- |
| **Total Unique Amenities Mapped** | **141123** | Unique physical amenity features cached across all cities |
| **Average Proximity Density** | **60.2** | Average number of amenities cached within walking distance of each property |
| **Total Proximity References** | **418244** | Total associations between properties and nearby amenities |

### 🏷️ Global Amenity Category Distribution

| Category | Unique Features Count | Percentage |
| :--- | :---: | :---: |
| Bus Stop | 31132 | 22.1% |
| Park | 26430 | 18.7% |
| Restaurant | 26351 | 18.7% |
| Cafe | 12620 | 8.9% |
| Sports Pitch | 10347 | 7.3% |
| Bar | 10140 | 7.2% |
| Convenience Store | 6783 | 4.8% |
| Church | 3477 | 2.5% |
| Supermarket | 2926 | 2.1% |
| Pharmacy | 2403 | 1.7% |
| Gym | 1798 | 1.3% |
| University | 1598 | 1.1% |
| Hospital | 1267 | 0.9% |
| Sports Centre | 1222 | 0.9% |
| Metro Station | 1212 | 0.9% |
| Library | 717 | 0.5% |
| Nightclub | 700 | 0.5% |

## 🏙️ Detailed City Breakdown (Amenities)

| Country | City | Unique Amenities | Avg Density (per Property) | Top Amenity Category |
| :--- | :--- | :---: | :---: | :--- |
| AU | PERTH | 1100 | 45.1 | Bus Stop (337) |
| CA | BURNABY | 208 | 23.8 | Restaurant (51) |
| CA | CALGARY | 386 | 25.9 | Bus Stop (113) |
| CA | EDMONTON | 642 | 21.4 | Bus Stop (252) |
| CA | HAMILTON | 665 | 41.6 | Bus Stop (182) |
| CA | KITCHENER | 161 | 28.2 | Bus Stop (51) |
| CA | LONDON | 354 | 13.6 | Restaurant (82) |
| CA | MONTREAL | 1610 | 77.3 | Restaurant (441) |
| CA | OTTAWA | 1830 | 43.4 | Bus Stop (727) |
| CA | TORONTO | 4642 | 102.7 | Park (1215) |
| CA | VANCOUVER | 1962 | 33.8 | Restaurant (496) |
| CA | WATERLOO | 359 | 31.7 | Restaurant (94) |
| DE | AACHEN | 253 | 64.8 | Bus Stop (70) |
| DE | BERLIN | 5169 | 46.8 | Restaurant (1123) |
| DE | BONN | 231 | 144.2 | Park (75) |
| DE | DARMSTADT | 54 | 23 | Bus Stop (18) |
| DE | DORTMUND | 166 | 43.8 | Bus Stop (37) |
| DE | ESSEN | 104 | 38.4 | Bus Stop (27) |
| DE | FRANKFURT-AM-MAIN | 2616 | 50.6 | Bus Stop (682) |
| DE | FREIBURG | 29 | 29 | Bus Stop (13) |
| DE | HAMBURG | 1437 | 37.2 | Restaurant (352) |
| DE | HANNOVER | 123 | 42 | Restaurant (36) |
| DE | KOLN | 454 | 58.6 | Restaurant (133) |
| DE | MANNHEIM | 82 | 20.3 | Bus Stop (24) |
| DE | MUNCHEN | 3961 | 47.6 | Bus Stop (1139) |
| DE | POTSDAM | 15 | 7.5 | Bus Stop (8) |
| DE | STUTTGART | 971 | 44.2 | Bus Stop (279) |
| ES | PAMPLONA | 83 | 41.5 | Bus Stop (22) |
| FR | BORDEAUX | 1522 | 45.3 | Bus Stop (442) |
| FR | CERGY | 201 | 100.5 | Restaurant (73) |
| FR | FONTAINEBLEAU | 13 | 13 | Bus Stop (6) |
| FR | GRENOBLE | 714 | 54.3 | Restaurant (175) |
| FR | LILLE | 1411 | 46.6 | Bus Stop (376) |
| FR | LYON | 4983 | 106.4 | Restaurant (1222) |
| FR | NANCY | 354 | 43.4 | Bus Stop (110) |
| FR | NANTES | 309 | 40.8 | Park (72) |
| FR | PARIS | 14438 | 118.2 | Restaurant (4767) |
| FR | REIMS | 121 | 39.5 | Bus Stop (51) |
| FR | TOULOUSE | 1755 | 79 | Restaurant (488) |
| UK | ABERDEEN | 591 | 59.6 | Park (166) |
| UK | BATH | 288 | 40 | Bus Stop (71) |
| UK | BELFAST | 357 | 46.4 | Restaurant (81) |
| UK | BIRMINGHAM | 1464 | 31.6 | Bus Stop (427) |
| UK | BRIGHTON | 1000 | 61 | Restaurant (214) |
| UK | BRISTOL | 1434 | 100.2 | Bus Stop (328) |
| UK | CANTERBURY | 219 | 33.6 | Bus Stop (61) |
| UK | CARDIFF | 861 | 50.2 | Park (296) |
| UK | COLCHESTER | 53 | 14 | Bus Stop (21) |
| UK | COVENTRY | 834 | 29.3 | Bus Stop (296) |
| UK | DUNDEE | 363 | 48.5 | Park (113) |
| UK | DURHAM | 361 | 35.8 | Bus Stop (77) |
| UK | EDINBURGH | 7585 | 197.9 | Park (5566) |
| UK | EXETER | 617 | 39.3 | Bus Stop (204) |
| UK | GUILDFORD | 173 | 24.3 | Bus Stop (60) |
| UK | LANCASTER | 636 | 68.9 | Bus Stop (239) |
| UK | LEEDS | 1438 | 29.1 | Bus Stop (495) |
| UK | LONDON | 9155 | 70.8 | Bus Stop (2137) |
| UK | LOUGHBOROUGH | 221 | 41.8 | Bus Stop (54) |
| UK | MANCHESTER | 4686 | 352 | Sports Pitch (4006) |
| UK | NEWCASTLE | 1013 | 64.5 | Bus Stop (331) |
| UK | NORWICH | 669 | 60.9 | Bus Stop (134) |
| UK | NOTTINGHAM | 1674 | 50.6 | Bus Stop (517) |
| UK | PORTSMOUTH | 256 | 47.3 | Bus Stop (80) |
| UK | READING | 384 | 50.5 | Bus Stop (88) |
| UK | SOUTHAMPTON | 765 | 62.4 | Bus Stop (251) |
| UK | ST-ANDREWS | 21 | 7.7 | Bus Stop (7) |
| UK | YORK | 1275 | 120.2 | Park (943) |
| US | ANN-ARBOR | 436 | 47.3 | Bus Stop (114) |
| US | ARLINGTON | 47 | 23.5 | Bus Stop (14) |
| US | BERKELEY | 958 | 68.7 | Bus Stop (364) |
| US | BOSTON | 1707 | 30.8 | Bus Stop (448) |
| US | BUFFALO | 29 | 5.3 | Sports Pitch (8) |
| US | CHICAGO | 4311 | 112.7 | Park (1753) |
| US | COLLEGE-STATION | 139 | 12 | Sports Pitch (42) |
| US | DURHAM | 0 | 0 | None |
| US | LOS-ANGELES | 1738 | 17.8 | Bus Stop (724) |
| US | NEW-YORK | 7967 | 112.8 | Restaurant (1950) |
| US | PHILADELPHIA | 570 | 29.7 | Restaurant (101) |
| US | PITTSBURGH | 629 | 40.3 | Bus Stop (232) |
| US | RALEIGH | 179 | 10.9 | Bus Stop (82) |
| US | RICHARDSON | 26 | 26 | Bus Stop (11) |
| US | SAN-DIEGO | 236 | 20.6 | Bus Stop (70) |
| US | TEMPE | 239 | 34.8 | Bus Stop (99) |
| US | URBANA-CHAMPAIGN | 639 | 30.9 | Bus Stop (280) |
| US | WEST-LAFAYETTE | 140 | 27.6 | Restaurant (46) |
| UK | GLASGOW | 3581 | 47.2 | Park (1127) |
| UK | LIVERPOOL | 1789 | 50.4 | Bus Stop (406) |
| UK | SHEFFIELD | 1682 | 95.7 | Park (531) |
| UK | LEICESTERSHIRE | 619 | 39.9 | Bus Stop (115) |
| AU | CANBERRA | 966 | 47.5 | Bus Stop (248) |
| US | ATLANTA | 341 | 28.5 | Restaurant (113) |
| AU | ADELAIDE | 1454 | 82 | Park (335) |
| AU | BRISBANE | 2482 | 60.5 | Bus Stop (729) |
| ES | BARCELONA | 1249 | 94.9 | Bus Stop (336) |
| ES | MADRID | 1522 | 80.7 | Bus Stop (442) |
| AU | SYDNEY | 5414 | 60.8 | Bus Stop (1324) |
| UK | HERTFORDSHIRE | 131 | 18.6 | Bus Stop (50) |
| UK | SWANSEA | 459 | 34.6 | Bus Stop (138) |
| AU | MELBOURNE | 5209 | 51.9 | Bus Stop (1171) |
| AU | GOLD-COAST | 43 | 10.5 | Park (21) |
| AU | NEWCASTLE | 558 | 24.9 | Bus Stop (190) |
| CA | OAKVILLE | 1 | 1 | Park (1) |
| US | BIRMINGHAM | 17 | 17 | Bus Stop (6) |

## ⚠️ Location Accuracy Outliers (>50 meters offset)

The following properties are successfully matched to an OSM building, but their geocoded coordinates have a physical distance offset of more than 50 meters from the building's centroid. These should be reviewed for coordinate accuracy.

| Offset | Location | Property Name (ID) | Contained? | Coords vs Centroid | Address |
| :---: | :--- | :--- | :---: | :--- | :--- |
| **203.4 m** | FR/PARIS | "Studéa Val d'Europe 1" (`1420106`) | ✅ Yes | Pin: `(48.85542, 2.783231)`<br>OSM: `(48.855443, 2.780455)` | 7, cours de la Garonne Serris, Paris, ile-de-france 77700 |
| **162.2 m** | CA/MONTREAL | "Harrington Housing - Olympic Village" (`1704456`) | ✅ Yes | Pin: `(45.569943, -73.553633)`<br>OSM: `(45.568536, -73.554177)` | 5333 Rue Sherbrooke Est, Montreal, Quebec H1T 4B6 |
| **155.1 m** | FR/LILLE | "Campuséa Lille Euralille" (`740235`) | ✅ Yes | Pin: `(50.636408, 3.073697)`<br>OSM: `(50.636405, 3.071500)` | 333 avenue Willy-Brandt, Lille, Nord 59800 |
| **124.9 m** | FR/BORDEAUX | "Campuséa Bordeaux Bassins à Flot" (`1419225`) | ✅ Yes | Pin: `(44.869294, -0.552042)`<br>OSM: `(44.869836, -0.553428)` | 46 sente des Radoubs, Bordeaux, Gironde 33300 |
| **119.2 m** | AU/MELBOURNE | "102E/78 Middleborough Road, Burwood East" (`1567961`) | ❌ No | Pin: `(-37.848164, 145.133466)`<br>OSM: `(-37.849118, 145.134080)` | 102e/78 Middleborough Rd, Melbourne, Victoria 3151 |
| **118.4 m** | AU/MELBOURNE | "548B Heidelberg - Kinglake Road, Wattle Glen" (`1567959`) | ❌ No | Pin: `(-37.663981, 145.183143)`<br>OSM: `(-37.663176, 145.182265)` | 548 Heidelberg - Kinglake Rd, Melbourne, Victoria 3096 |
| **118.2 m** | UK/NEWCASTLE | "10 Leazes Terrace" (`1509873`) | ❌ No | Pin: `(54.976343, -1.621131)`<br>OSM: `(54.976513, -1.619304)` | 10 Leazes Terrace, Newcastle NE1 4LY, United Kingdom |
| **115.9 m** | AU/MELBOURNE | "5/14 Parring Road, Balwyn" (`1567973`) | ❌ No | Pin: `(-37.812355, 145.09164)`<br>OSM: `(-37.811697, 145.092662)` | Unit 5/14 Parring Rd, Melbourne, Victoria 3103 |
| **115.7 m** | AU/MELBOURNE | "5/12 Evansdale Rd, Hawthorn" (`1567915`) | ❌ No | Pin: `(-37.823058, 145.023108)`<br>OSM: `(-37.822018, 145.023101)` | Unit 5/12 Evansdale Rd, Melbourne, Victoria 3122 |
| **114.2 m** | AU/MELBOURNE | "24B Albert Street, Mitcham" (`1567923`) | ❌ No | Pin: `(-37.816111, 145.190379)`<br>OSM: `(-37.816221, 145.191670)` | 24B Albert St, Melbourne, Victoria 3132 |
| **111.6 m** | UK/COLCHESTER | "The Maltings" (`19798`) | ❌ No | Pin: `(51.879505, 0.927806)`<br>OSM: `(51.878633, 0.928607)` | Haven Road, Colchester CO2 8FU, United Kingdom |
| **111.1 m** | AU/SYDNEY | "UKO Marrickville Village" (`1518435`) | ❌ No | Pin: `(-33.914999, 151.146983)`<br>OSM: `(-33.914069, 151.147418)` | 35 Warren Rd Marrickville, Sydney, New South Wales 2204 |
| **111 m** | US/TEMPE | "Sol Apartments" (`1680463`) | ❌ No | Pin: `(33.421963, -111.97818)`<br>OSM: `(33.422538, -111.979156)` | 1949 East University Drive, Tempe, Arizona 85281 |
| **110.6 m** | AU/CANBERRA | "217 Northbourne Ave" (`1642291`) | ❌ No | Pin: `(-35.262241, 149.131438)`<br>OSM: `(-35.262734, 149.132494)` | 217 Northbourne Ave, Braddon, Canberra, ACT 2612 |
| **110.6 m** | AU/CANBERRA | "217 Northbourne Avenue" (`1656886`) | ❌ No | Pin: `(-35.262241, 149.131438)`<br>OSM: `(-35.262734, 149.132494)` | 217 Northbourne Avenue, Turner, Canberra, ACT 2612 |
| **110.2 m** | AU/MELBOURNE | "15/14 May Road, Toorak" (`1567944`) | ❌ No | Pin: `(-37.847384, 145.004216)`<br>OSM: `(-37.848367, 145.004068)` | 15/14 May Rd, Melbourne, Victoria 3142 |
| **109.8 m** | AU/SYDNEY | "Enmore" (`1712805`) | ❌ No | Pin: `(-33.899963, 151.166922)`<br>OSM: `(-33.900907, 151.166579)` | Enmore, Sydney, New South Wales 2042 |
| **109.6 m** | AU/MELBOURNE | "4201/2 Connam Avenue" (`1657514`) | ✅ Yes | Pin: `(-37.919908, 145.140035)`<br>OSM: `(-37.920891, 145.140111)` | 2 Connam Avenue, Clayton, Melbourne, Victoria 3168 |
| **106.7 m** | AU/MELBOURNE | "3/1A Hawsleigh Avenue,Balaclava,Victoria 3183" (`1567048`) | ❌ No | Pin: `(-37.869877, 144.997794)`<br>OSM: `(-37.868930, 144.997607)` | 1A Hawsleigh, Melbourne, Victoria 3183 |
| **105.3 m** | AU/MELBOURNE | "6 Wilkinson Crescent, Bellfield" (`1567920`) | ❌ No | Pin: `(-37.750885, 145.039153)`<br>OSM: `(-37.749975, 145.039479)` | 6 Wilkinson Cres, Melbourne, Victoria 3081 |
| **105.2 m** | AU/MELBOURNE | "80 Cheltenham Road" (`1665263`) | ❌ No | Pin: `(-37.990012, 145.203665)`<br>OSM: `(-37.989339, 145.204507)` | 80 Cheltenham Road, Melbourne, Victoria 3175 |
| **105.2 m** | AU/NEWCASTLE | "Entire Place·6B2B···2 Elizabeth Street, Tighes Hill" (`1518680`) | ❌ No | Pin: `(-32.90717, 151.746203)`<br>OSM: `(-32.908085, 151.746484)` | 2 Elizabeth Street, Tighes Hill, Newcastle, New South Wales 2297 |
| **104.2 m** | AU/BRISBANE | "310 Turton Street" (`1665169`) | ❌ No | Pin: `(-27.573443, 153.046173)`<br>OSM: `(-27.574369, 153.046020)` | 310 Turton Street, Brisbane, Queensland 4108 |
| **103.9 m** | AU/BRISBANE | "228 Mains Rd" (`1665992`) | ❌ No | Pin: `(-27.577361, 153.062513)`<br>OSM: `(-27.576489, 153.062889)` | 228 Mains Rd, Sunnybank, Brisbane, Queensland 4109 |
| **103.9 m** | AU/SYDNEY | "3 Finch Drive" (`1714925`) | ❌ No | Pin: `(-33.942373, 151.224253)`<br>OSM: `(-33.943078, 151.223516)` | 3 Finch Drive, Sydney, New South Wales 2036 |
| **103.5 m** | UK/NEWCASTLE | "22 Leazes Terrace" (`1657777`) | ❌ No | Pin: `(54.977039, -1.621737)`<br>OSM: `(54.977867, -1.621003)` | 22 Leazes Terrace, Newcastle NE1 4LY, United Kingdom |
| **103.2 m** | AU/BRISBANE | "33 Clark St" (`1676746`) | ❌ No | Pin: `(-27.935277, 153.402688)`<br>OSM: `(-27.936143, 153.402312)` | 33 Clark St, Biggera Waters, Brisbane, Queensland 4216 |
| **103.2 m** | CA/LONDON | "The Saint James" (`1679981`) | ❌ No | Pin: `(42.996834, -81.25915)`<br>OSM: `(42.995960, -81.258725)` | 112 Saint James Street, London, Ontario N6A 1Y2 |
| **102.9 m** | AU/BRISBANE | "310B Turton St" (`1664530`) | ❌ No | Pin: `(-27.573446, 153.046074)`<br>OSM: `(-27.574369, 153.046020)` | 310B Turton St, Coopers Plains, Brisbane, Queensland 4108 |
| **102.8 m** | DE/BERLIN | "studio in Friedrichshain" (`1601012`) | ❌ No | Pin: `(52.505226, 13.440119)`<br>OSM: `(52.505904, 13.441149)` | Mühlenstr., Berlin, Berlin 10243 |
| **101.3 m** | CA/EDMONTON | "2-3 Bed Heritage Valley Heights Townhomes" (`1615043`) | ❌ No | Pin: `(53.412028, -113.559773)`<br>OSM: `(53.412578, -113.560990)` | 1250 Podersky Wynd SW, Edmonton, Alberta T6W 3M3 |
| **101.1 m** | AU/BRISBANE | "310A Turton St" (`1664645`) | ❌ No | Pin: `(-27.573469, 153.046162)`<br>OSM: `(-27.574369, 153.046020)` | 310A Turton St, Coopers Plains, Brisbane, Queensland 4108 |
| **100.6 m** | UK/COVENTRY | "3 Evesham Walk,Cannon Park" (`1520374`) | ❌ No | Pin: `(52.383714, -1.554837)`<br>OSM: `(52.384043, -1.553458)` | 3 Evesham Walk, Coventry CV4 7DR, United Kingdom |
| **100.5 m** | DE/BERLIN | "Flora 43, Berlin" (`1657671`) | ❌ No | Pin: `(52.53729, 13.36027)`<br>OSM: `(52.536451, 13.360817)` | Berlin, Berlin |
| **100.2 m** | AU/SYDNEY | "B701/22-24 Rhodes Street,Hillsdale,New South Wales 2036" (`1567112`) | ❌ No | Pin: `(-33.954458, 151.227515)`<br>OSM: `(-33.953579, 151.227751)` | 22-24 Rhodes Street, Sydney, New South Wales 2036 |
| **100 m** | AU/NEWCASTLE | "Entire Place·1B1B···11 Hanbury Street, Mayfield" (`1518477`) | ❌ No | Pin: `(-32.901334, 151.730029)`<br>OSM: `(-32.902231, 151.730099)` | 11 Hanbury Street, Mayfield, Newcastle, New South Wales 2304 |
| **99.9 m** | AU/SYDNEY | "Penthouse: 92 Majors Bay Road,Concord,New South Wales 2137" (`1567093`) | ❌ No | Pin: `(-33.856199, 151.102894)`<br>OSM: `(-33.857035, 151.103287)` | Penthouse: Majors Bay, Sydney, New South Wales 2137 |
| **99.7 m** | AU/MELBOURNE | "Malvern" (`1712783`) | ❌ No | Pin: `(-37.852403, 145.035735)`<br>OSM: `(-37.851733, 145.034982)` | Malvern, Melbourne, Victoria 3144 |
| **99.1 m** | UK/NOTTINGHAM | "Wharton" (`794915`) | ❌ No | Pin: `(52.919166, -1.215692)`<br>OSM: `(52.919444, -1.217095)` | Wharton, Nottingham NG9 1RJ, United Kingdom |
| **98.8 m** | UK/NOTTINGHAM | "Northdown Road" (`1713894`) | ❌ No | Pin: `(52.961475, -1.186324)`<br>OSM: `(52.961215, -1.184916)` | Northdown Road, Nottingham NG8 3PF, United Kingdom |
| **98.6 m** | AU/GOLD-COAST | "Margaret Street Student Residence" (`1551314`) | ❌ No | Pin: `(-27.976424, 153.402225)`<br>OSM: `(-27.975621, 153.402649)` | Margaret Street, Southport, Gold Coast, Queensland QLD 4215 |
| **98.6 m** | AU/GOLD-COAST | "AHN Gold Coast Homestay Booking Portal" (`1561129`) | ❌ No | Pin: `(-27.976424, 153.402225)`<br>OSM: `(-27.975621, 153.402649)` | Margaret Street, Southport, Gold Coast, Queensland QLD 4215 |
| **97.2 m** | AU/BRISBANE | "IHOME Studios" (`1575733`) | ❌ No | Pin: `(-27.57735, 153.062727)`<br>OSM: `(-27.576489, 153.062889)` | 226-230 Mains Road, Brisbane, Queensland 4109 |
| **97.2 m** | AU/BRISBANE | "226-230 Mains Road" (`1575993`) | ❌ No | Pin: `(-27.57735, 153.062727)`<br>OSM: `(-27.576489, 153.062889)` | 226-230 Mains Road, Brisbane, Queensland 4109 |
| **96.7 m** | UK/COVENTRY | "Vita Student Warwick Cannon Park" (`1518084`) | ❌ No | Pin: `(52.386747, -1.553442)`<br>OSM: `(52.385885, -1.553264)` | De Montfort Way, Coventry CV4 7FA, United Kingdom |
| **96.7 m** | UK/NEWCASTLE | "8 LEAZES TERRACE" (`1509872`) | ❌ No | Pin: `(54.976706, -1.62394)`<br>OSM: `(54.975856, -1.624248)` | 8 Leazes Terrace, Newcastle NE1 4LY, United Kingdom |
| **96.7 m** | UK/NEWCASTLE | "52 LEAZES TERRACE" (`1510057`) | ❌ No | Pin: `(54.976706, -1.62394)`<br>OSM: `(54.975856, -1.624248)` | 52 LEAZES TERRACE, Newcastle NE1 4LY, United Kingdom |
| **96.7 m** | UK/NEWCASTLE | "55 LEAZES TERRACE" (`1510059`) | ❌ No | Pin: `(54.976706, -1.62394)`<br>OSM: `(54.975856, -1.624248)` | 55 LEAZES TERRACE, Newcastle NE1 4LY, United Kingdom |
| **96.7 m** | UK/NEWCASTLE | "58 LEAZES TERRACE" (`1510061`) | ❌ No | Pin: `(54.976706, -1.62394)`<br>OSM: `(54.975856, -1.624248)` | 58 LEAZES TERRACE, Newcastle NE1 4LY, United Kingdom |
| **96.4 m** | UK/NEWCASTLE | "18 LEAZES TERRACE" (`1510009`) | ❌ No | Pin: `(54.976703, -1.62394)`<br>OSM: `(54.975856, -1.624248)` | 18 LEAZES TERRACE, Newcastle NE1 4LY, United Kingdom |
| **96 m** | AU/MELBOURNE | "18/36 Anderson Road, Hawthorn East" (`1567922`) | ❌ No | Pin: `(-37.841408, 145.050455)`<br>OSM: `(-37.841023, 145.051433)` | Unit 18/36 Anderson Rd, Melbourne, Victoria 3123 |
| **94.7 m** | UK/NOTTINGHAM | "The Loughborough Home" (`1652761`) | ❌ No | Pin: `(52.952933, -1.128048)`<br>OSM: `(52.953606, -1.127185)` | 56 Loughborough Avenue, Nottingham NG2 4LP, United Kingdom |
| **94.4 m** | AU/MELBOURNE | "12 Luckie Street,Nunawading,Victoria 3131" (`1567090`) | ❌ No | Pin: `(-37.816307, 145.174556)`<br>OSM: `(-37.815571, 145.174023)` | 12 Luckie, Melbourne, Victoria 3131 |
| **94.4 m** | CA/LONDON | "Bellevue" (`1521013`) | ❌ No | Pin: `(43.038581, -81.291756)`<br>OSM: `(43.038339, -81.290645)` | 200 Callaway Rd, London, Ontario N6G 0N8 |
| **94.1 m** | AU/MELBOURNE | "6/9 Irilbarra Road, Canterbury" (`1567985`) | ❌ No | Pin: `(-37.819111, 145.07009)`<br>OSM: `(-37.819871, 145.070559)` | Unit 6/9 Irilbarra Rd, Melbourne, Victoria 3126 |
| **93.9 m** | AU/MELBOURNE | "4/20 Kireep Road, Balwyn" (`1567938`) | ❌ No | Pin: `(-37.811738, 145.089583)`<br>OSM: `(-37.810976, 145.090039)` | Unit 4/20 Kireep Rd, Melbourne, Victoria 3103 |
| **93.9 m** | AU/SYDNEY | "2/5 Tiptrees Avenue,Carlingford,New South Wales 2118" (`1567296`) | ❌ No | Pin: `(-33.784069, 151.04593)`<br>OSM: `(-33.783313, 151.046379)` | 5 Tiptrees Avenue, Sydney, New South Wales 2118 |
| **93.5 m** | US/COLLEGE-STATION | "Berkeley House" (`1494945`) | ❌ No | Pin: `(30.599341, -96.33561)`<br>OSM: `(30.599643, -96.334700)` | 801 Wellborn Rd, College Station, Texas 77840 |
| **91.5 m** | FR/TOULOUSE | "Studéa Toulouse Ouest" (`1427420`) | ✅ Yes | Pin: `(43.605116, 1.428592)`<br>OSM: `(43.604936, 1.429700)` | 7 Avenue de l'Ancien Vélodrome, Toulouse, Haute-Garonne 31000 |
| **90.4 m** | AU/MELBOURNE | "7 White Street" (`1470019`) | ❌ No | Pin: `(-37.911836, 145.119709)`<br>OSM: `(-37.911113, 145.119242)` | 7 White St, Oakleigh East, Melbourne, Victoria 3166 |
| **90.1 m** | UK/NOTTINGHAM | "Victoria House" (`1617183`) | ✅ Yes | Pin: `(52.957448, -1.148429)`<br>OSM: `(52.956854, -1.147518)` | 76 Milton Street, Nottingham NG1 3RA, United Kingdom |
| **89.8 m** | UK/BRISTOL | "Avon Point" (`1652664`) | ❌ No | Pin: `(51.448514, -2.577365)`<br>OSM: `(51.448325, -2.576106)` | 12-16 Feeder Road, Bristol BS2 0PW, United Kingdom |
| **89 m** | AU/CANBERRA | "UniLodge on Gould" (`1519778`) | ❌ No | Pin: `(-35.272885, 149.1242)`<br>OSM: `(-35.272513, 149.123334)` | 22 Gould St, Turner, Canberra, ACT 2612 |
| **88.4 m** | AU/BRISBANE | "61 Hunter St" (`1678037`) | ❌ No | Pin: `(-27.512521, 153.048751)`<br>OSM: `(-27.512394, 153.047867)` | 61 Hunter St, Greenslopes, Brisbane, Queensland 4120 |
| **87.7 m** | UK/COVENTRY | "4A Evesham Walk Studio,Cannon Park" (`1519316`) | ❌ No | Pin: `(52.383662, -1.555063)`<br>OSM: `(52.383820, -1.556327)` | 4 Evesham Walk, Coventry CV4 7DR, United Kingdom |
| **87.7 m** | UK/COVENTRY | "4 Evesham Walk,Cannon Park" (`1519315`) | ❌ No | Pin: `(52.383662, -1.555063)`<br>OSM: `(52.383820, -1.556327)` | 4 Evesham Walk, Coventry CV4 7DR, United Kingdom |
| **87.4 m** | AU/NEWCASTLE | "Entire Place·1B1B···34 Sunset Boulevard, NORTH LAMBTON" (`1518584`) | ❌ No | Pin: `(-32.89889, 151.69607)`<br>OSM: `(-32.899317, 151.695285)` | 34 Sunset Boulevard, NORTH LAMBTON, Newcastle, New South Wales 2299 |
| **86.4 m** | AU/MELBOURNE | "210A/399 Burwood Highway,Burwood,Victoria 3125" (`1567052`) | ❌ No | Pin: `(-37.851561, 145.131825)`<br>OSM: `(-37.852323, 145.132013)` | 399 Burwood, Melbourne, Victoria 3151 |
| **85.7 m** | UK/MANCHESTER | "Allen Court" (`1510908`) | ❌ No | Pin: `(53.447737, -2.218277)`<br>OSM: `(53.448478, -2.218626)` | 1 Cromwell Range, Manchester M14 6FQ, United Kingdom |
| **85.3 m** | US/LOS-ANGELES | "1441 S Centinela Ave" (`1523563`) | ❌ No | Pin: `(34.031668, -118.457645)`<br>OSM: `(34.031946, -118.458507)` | 1441 South Centinela Avenue, Los Angeles, California 90025 |
| **84.8 m** | CA/EDMONTON | "Chappelle 28 Apartment" (`1615053`) | ❌ No | Pin: `(53.409865, -113.563366)`<br>OSM: `(53.409110, -113.563537)` | 14005 28 Avenue Southwest, Edmonton, Alberta T6W 0C3 |
| **84.2 m** | CA/EDMONTON | "Ascot Arms" (`1523562`) | ❌ No | Pin: `(53.483254, -113.506809)`<br>OSM: `(53.483632, -113.507911)` | 4605 106a St NW, Edmonton, Alberta T6H 5H1 |
| **83.5 m** | UK/SHEFFIELD | "Rhodes Street S2" (`1578498`) | ✅ Yes | Pin: `(53.37924, -1.457407)`<br>OSM: `(53.379595, -1.458515)` | Rhodes Street, Sheffield S2 5DT, United Kingdom |
| **83.4 m** | UK/LONDON | "Lit West Green House" (`1490270`) | ✅ Yes | Pin: `(51.585138, -0.082129)`<br>OSM: `(51.585282, -0.083312)` | 151 West Green Road, Tottenham, London N15 5EA, United Kingdom |
| **83.1 m** | AU/MELBOURNE | "502/26 Queens Road,Melbourne,Victoria 3004" (`1567023`) | ❌ No | Pin: `(-37.836328, 144.972926)`<br>OSM: `(-37.836071, 144.972039)` | 26 Queens, Melbourne, Victoria 3004 |
| **83 m** | FR/LILLE | "Daniel Cordier – Villeneuve d’Ascq" (`1619889`) | ✅ Yes | Pin: `(50.627239, 3.140487)`<br>OSM: `(50.626651, 3.139765)` | Rue de Lille, Lille, Nord 59650 |
| **83 m** | UK/HERTFORDSHIRE | "Boundary Way 26934#" (`1680842`) | ❌ No | Pin: `(51.69988, -0.39288)`<br>OSM: `(51.699720, -0.394055)` | 211 Boundary Way, Hertfordshire WD25 7SP, United Kingdom |
| **82.9 m** | UK/LONDON | "iQ Sterling Court" (`18594`) | ❌ No | Pin: `(51.557569, -0.283913)`<br>OSM: `(51.558117, -0.284724)` | 6 Lakeside Way, London HA9 0BU, United Kingdom |
| **82.9 m** | UK/LONDON | "Lit IQ Sterling Court" (`1629409`) | ❌ No | Pin: `(51.557569, -0.283913)`<br>OSM: `(51.558117, -0.284724)` | 6 Lakeside Way, London HA9 0BU, United Kingdom |
| **82.9 m** | UK/LONDON | "Gob Sterling Court (Wembley)" (`1523347`) | ❌ No | Pin: `(51.557569, -0.283913)`<br>OSM: `(51.558117, -0.284724)` | 6 Lakeside Way, London HA9 0BU, United Kingdom |
| **82.5 m** | UK/COVENTRY | "8 Evesham Walk,Cannon Park" (`1519325`) | ❌ No | Pin: `(52.383729, -1.555122)`<br>OSM: `(52.383820, -1.556327)` | 8 Evesham Walk, Coventry CV4 7DR, United Kingdom |
| **82.5 m** | UK/COVENTRY | "8A evesham walk studio cannon park" (`1522453`) | ❌ No | Pin: `(52.383729, -1.555122)`<br>OSM: `(52.383820, -1.556327)` | 8A Evesham Walk, Cannon Park, Coventry CV4 7DR, United Kingdom |
| **82.4 m** | UK/LEEDS | "Victoria Road 26497#" (`1679667`) | ✅ Yes | Pin: `(53.81488, -1.56262)`<br>OSM: `(53.814818, -1.563870)` | 1A Victoria Rd, Leeds LS6 1AS, United Kingdom |
| **82.4 m** | UK/LEEDS | "Victoria Road 26596#" (`1679825`) | ✅ Yes | Pin: `(53.81488, -1.56262)`<br>OSM: `(53.814818, -1.563870)` | 1A Victoria Rd, Leeds LS6 1AS, United Kingdom |
| **82.3 m** | US/ATLANTA | "Westmar Student Lofts" (`18838`) | ✅ Yes | Pin: `(33.778814, -84.412799)`<br>OSM: `(33.778241, -84.412237)` | 800 West Marietta Street Northwest, Atlanta, Georgia 30318 |
| **81.9 m** | AU/BRISBANE | "Beechcroft Street" (`1665165`) | ❌ No | Pin: `(-27.57055, 153.045674)`<br>OSM: `(-27.571145, 153.045186)` | Beechcroft Street, Brisbane, Queensland 4108 |
| **81.3 m** | AU/MELBOURNE | "527 Brunswick Street, Fitzroy North" (`1567928`) | ❌ No | Pin: `(-37.791254, 144.979373)`<br>OSM: `(-37.791052, 144.978485)` | 527 Brunswick St, Melbourne, Victoria 3068 |
| **81.1 m** | AU/SYDNEY | "815/42 Church Avenue,Mascot,New South Wales 2020" (`1567147`) | ❌ No | Pin: `(-33.921925, 151.186983)`<br>OSM: `(-33.922520, 151.187491)` | 42 Church Avenue, Sydney, New South Wales 2015 |
| **80.7 m** | AU/MELBOURNE | "4/314 Canterbury Road, Surrey Hills" (`1567970`) | ❌ No | Pin: `(-37.825856, 145.092444)`<br>OSM: `(-37.825227, 145.092901)` | Unit 4/314 Canterbury Rd, Melbourne, Victoria 3127 |
| **80.3 m** | UK/LOUGHBOROUGH | "Lemyngton Street" (`795134`) | ✅ Yes | Pin: `(52.772904, -1.203823)`<br>OSM: `(52.773077, -1.204980)` | 1 Lemyngton Street, Loughborough LE11 1UJ, United Kingdom |
| **80.3 m** | UK/NEWCASTLE | "24 Leazes Terrace" (`1657779`) | ❌ No | Pin: `(54.977287, -1.62175)`<br>OSM: `(54.977867, -1.621003)` | 24 Leazes Terrace, Newcastle NE1 4LY, United Kingdom |
| **80 m** | AU/SYDNEY | "48/548-568 Canterbury Road,Campsie,New South Wales 2194" (`1567246`) | ❌ No | Pin: `(-33.921157, 151.09777)`<br>OSM: `(-33.921508, 151.098525)` | 548-568 Canterbury, Sydney, New South Wales 2194 |
| **79.9 m** | UK/BELFAST | "Titanic Arc" (`1548735`) | ❌ No | Pin: `(54.605471, -5.911229)`<br>OSM: `(54.604956, -5.910366)` | 2k Queens Rd, Belfast BT3 9DE, United Kingdom |
| **79.8 m** | UK/NOTTINGHAM | "Fusion Nottingham" (`1664792`) | ✅ Yes | Pin: `(52.957069, -1.15276)`<br>OSM: `(52.956477, -1.152089)` | 1 King Edward Street, Nottingham NG1 1BN, United Kingdom |
| **79.6 m** | AU/BRISBANE | "14 Beechcroft St" (`1664529`) | ❌ No | Pin: `(-27.570822, 153.045906)`<br>OSM: `(-27.571145, 153.045186)` | 14 Beechcroft St, Coopers Plains, Brisbane, Queensland 4108 |
| **79.5 m** | CA/HAMILTON | "West Village Suites" (`1507918`) | ❌ No | Pin: `(43.257874, -79.936673)`<br>OSM: `(43.257357, -79.937349)` | unit1a 1686 Main Street West, Hamilton, Ontario L8S 0A2 |
| **79.5 m** | US/URBANA-CHAMPAIGN | "Yugo Champaign South 3rd Lofts" (`1483447`) | ❌ No | Pin: `(40.112224, -88.235032)`<br>OSM: `(40.112888, -88.234685)` | 512 South 3rd Street, Champaign, Illinois 61820 |
| **79.4 m** | AU/ADELAIDE | "2 Alexander Avenue" (`1683159`) | ❌ No | Pin: `(-34.969699, 138.585127)`<br>OSM: `(-34.969091, 138.585582)` | 2 Alexander Avenue, Adelaide, South Australia 5041 |
| **78.8 m** | UK/NORWICH | "NR3 6 guest house with parking" (`1614814`) | ✅ Yes | Pin: `(52.639803, 1.295829)`<br>OSM: `(52.639762, 1.294665)` | Guernsey Road, Norwich NR3 1JJ, United Kingdom |
| **78.3 m** | AU/SYDNEY | "304/250 Wardell Road,Marrickville,New South Wales 2204" (`1567229`) | ❌ No | Pin: `(-33.911919, 151.140934)`<br>OSM: `(-33.911253, 151.140660)` | 250 Wardell Road, Sydney, New South Wales 2204 |
| **77.6 m** | AU/NEWCASTLE | "116 Parry Street" (`1665038`) | ❌ No | Pin: `(-32.930176, 151.764071)`<br>OSM: `(-32.929511, 151.764321)` | 116 Parry Street, Newcastle, New South Wales 2302 |
| **77.4 m** | CA/LONDON | "Aria Serene Living" (`1675894`) | ❌ No | Pin: `(43.03222, -81.26624)`<br>OSM: `(43.032388, -81.267163)` | 420 Fanshawe Park Road East, London, Ontario N5X 0P3 |
| **77.2 m** | CA/OTTAWA | "One80five" (`467105`) | ✅ Yes | Pin: `(45.417305, -75.703256)`<br>OSM: `(45.417604, -75.702365)` | 185 Lyon St N, Ottawa, Ontario K1R 5W4 |
| **77 m** | US/URBANA-CHAMPAIGN | "610 E Springfield, Champaign, IL 61820" (`1562616`) | ❌ No | Pin: `(40.112906, -88.229321)`<br>OSM: `(40.112428, -88.229975)` | 610 East Springfield Avenue, Champaign, Illinois 61820 |
| **76.5 m** | US/LOS-ANGELES | "Kurve" (`1515909`) | ✅ Yes | Pin: `(34.0609, -118.2845)`<br>OSM: `(34.061447, -118.285003)` | 2801 Sunset Place, Los Angeles, California 90005 |
| **75.6 m** | UK/SWANSEA | "KILVEY TERRACE" (`1620740`) | ❌ No | Pin: `(51.624655, -3.932807)`<br>OSM: `(51.625176, -3.932106)` | 47 Kilvey Terrace, Swansea SA1 8BA, United Kingdom |
| **75.4 m** | FR/TOULOUSE | "Close to Campus de Rangueil Toulouse University" (`1624623`) | ❌ No | Pin: `(43.554818, 1.501075)`<br>OSM: `(43.554354, 1.500394)` | Toulouse - Cnes-ias, Toulouse, Haute-Garonne 31400 |
| **75.4 m** | UK/NEWCASTLE | "3 Leazes Terrace" (`1657630`) | ❌ No | Pin: `(54.976078, -1.62054)`<br>OSM: `(54.975701, -1.619560)` | 3 Leazes Terrace, Newcastle NE1 4LY, United Kingdom |
| **75.3 m** | US/ANN-ARBOR | "The Courtyards Student Apartments" (`1492019`) | ❌ No | Pin: `(42.296638, -83.723305)`<br>OSM: `(42.296825, -83.724184)` | 1780 Broadway Street, Ann Arbor, Michigan MI 48105 |
| **75.1 m** | UK/GLASGOW | "Lovely Spacious 2 bed Apartment with Hydro Views" (`1554680`) | ✅ Yes | Pin: `(55.85845, -4.281122)`<br>OSM: `(55.858014, -4.280205)` | 175 Finnieston Street, Glasgow G3 8HD, United Kingdom |
| **75.1 m** | UK/GLASGOW | "Lovely 2 Bedroom Duplex Apartment with Hydro Views" (`1554683`) | ✅ Yes | Pin: `(55.85845, -4.281122)`<br>OSM: `(55.858014, -4.280205)` | 171 Finnieston Street, Glasgow G3 8HD, United Kingdom |
| **75.1 m** | UK/GLASGOW | "Stunning Apartment at Glasgow Hydro&Secc" (`1554681`) | ✅ Yes | Pin: `(55.85845, -4.281122)`<br>OSM: `(55.858014, -4.280205)` | 175 Finnieston Street, Glasgow G3 8HD, United Kingdom |
| **74.5 m** | AU/CANBERRA | "9 McGowan Pl" (`1666326`) | ❌ No | Pin: `(-35.26029, 149.135593)`<br>OSM: `(-35.260226, 149.134778)` | 9 McGowan Pl, Dickson, Canberra, ACT 2602 |
| **74.4 m** | AU/PERTH | "Perth Hub" (`1677987`) | ❌ No | Pin: `(-31.949005, 115.853285)`<br>OSM: `(-31.949430, 115.853893)` | 80 Milligan Street, Perth, Western Australia 6000 |
| **74.1 m** | UK/CARDIFF | "Eclipse" (`209112`) | ❌ No | Pin: `(51.483006, -3.165973)`<br>OSM: `(51.482860, -3.167016)` | Newport Road Lane, Cardiff CF24 0SP, United Kingdom |
| **73.8 m** | AU/SYDNEY | "20/1A Hollingshed Street,Mascot,New South Wales 2020" (`1567126`) | ❌ No | Pin: `(-33.932533, 151.194501)`<br>OSM: `(-33.932684, 151.193722)` | 1A Hollingshed Street, Sydney, New South Wales 2020 |
| **73.5 m** | US/COLLEGE-STATION | "The Hudson" (`1494943`) | ❌ No | Pin: `(30.6215729, -96.3461699)`<br>OSM: `(30.621431, -96.345420)` | 410 Stasney St, College Station, Texas 77840 |
| **73.3 m** | AU/BRISBANE | "LIV Anura" (`1685329`) | ❌ No | Pin: `(-27.450209, 153.046206)`<br>OSM: `(-27.450812, 153.046504)` | 60 Skyring Terrace, Newstead, Brisbane, Queensland 4006 |
| **73.3 m** | DE/MUNCHEN | "studio near Gmunder Straße" (`1587570`) | ✅ Yes | Pin: `(48.097304, 11.528581)`<br>OSM: `(48.096658, 11.528397)` | Gmunder Straße, Munich, Freistaat Bayern 81379 |
| **72.9 m** | ES/PAMPLONA | "micampus Pamplona" (`1671077`) | ❌ No | Pin: `(42.804562, -1.652479)`<br>OSM: `(42.804902, -1.651716)` | Calle de Iturrama，21, Pamplona, Comunidad Foral de Navarra 31007 |
| **72.9 m** | UK/NEWCASTLE | "Wellington St Plaza" (`18763`) | ❌ No | Pin: `(54.97364, -1.624109)`<br>OSM: `(54.973711, -1.625243)` | Wellington Street, Newcastle NE4 5SA, United Kingdom |
| **72.4 m** | AU/MELBOURNE | "G22A/399 Burwood Highway,Burwood,Victoria 3125" (`1567051`) | ❌ No | Pin: `(-37.851691, 145.131816)`<br>OSM: `(-37.852323, 145.132013)` | 399 Burwood, Melbourne, Victoria 3125 |
| **72.4 m** | US/NEW-YORK | "The Cornerstone Westbury" (`1670013`) | ✅ Yes | Pin: `(40.754103, -73.581953)`<br>OSM: `(40.753860, -73.582749)` | 461 Railroad Avenue, New York, New York 11590 |
| **72 m** | DE/FRANKFURT-AM-MAIN | "Suite Double L" (`1592422`) | ✅ Yes | Pin: `(50.10261, 8.643854)`<br>OSM: `(50.102176, 8.643106)` | Kleyerstraße, Frankfurt am Main, Hessen 60326 |
| **72 m** | DE/FRANKFURT-AM-MAIN | "Suite Double M" (`1603582`) | ✅ Yes | Pin: `(50.10261, 8.643854)`<br>OSM: `(50.102176, 8.643106)` | Kleyerstraße, Frankfurt am Main, Hessen 60326 |
| **72 m** | DE/FRANKFURT-AM-MAIN | "Galerie XL" (`1603583`) | ✅ Yes | Pin: `(50.10261, 8.643854)`<br>OSM: `(50.102176, 8.643106)` | Kleyerstraße, Frankfurt am Main, Hessen 60326 |
| **72 m** | DE/FRANKFURT-AM-MAIN | "Galerie L" (`1603584`) | ✅ Yes | Pin: `(50.10261, 8.643854)`<br>OSM: `(50.102176, 8.643106)` | Kleyerstraße, Frankfurt am Main, Hessen 60326 |
| **72 m** | DE/FRANKFURT-AM-MAIN | "Galerie S" (`1603585`) | ✅ Yes | Pin: `(50.10261, 8.643854)`<br>OSM: `(50.102176, 8.643106)` | Kleyerstraße, Frankfurt am Main, Hessen 60326 |
| **72 m** | DE/FRANKFURT-AM-MAIN | "Suite XL" (`1603587`) | ✅ Yes | Pin: `(50.10261, 8.643854)`<br>OSM: `(50.102176, 8.643106)` | Kleyerstraße, Frankfurt am Main, Hessen 60326 |
| **72 m** | DE/FRANKFURT-AM-MAIN | "Suite S" (`1603589`) | ✅ Yes | Pin: `(50.10261, 8.643854)`<br>OSM: `(50.102176, 8.643106)` | Kleyerstraße, Frankfurt am Main, Hessen 60326 |
| **72 m** | DE/FRANKFURT-AM-MAIN | "Studio Business Comfort" (`1603590`) | ✅ Yes | Pin: `(50.10261, 8.643854)`<br>OSM: `(50.102176, 8.643106)` | Kleyerstraße, Frankfurt am Main, Hessen 60326 |
| **72 m** | DE/FRANKFURT-AM-MAIN | "Studio Business Large" (`1603591`) | ✅ Yes | Pin: `(50.10261, 8.643854)`<br>OSM: `(50.102176, 8.643106)` | Kleyerstraße, Frankfurt am Main, Hessen 60326 |
| **72 m** | DE/FRANKFURT-AM-MAIN | "Suite M" (`1603588`) | ✅ Yes | Pin: `(50.10261, 8.643854)`<br>OSM: `(50.102176, 8.643106)` | Kleyerstraße, Frankfurt am Main, Hessen 60326 |
| **72 m** | DE/FRANKFURT-AM-MAIN | "Suite XXL" (`1603586`) | ✅ Yes | Pin: `(50.10261, 8.643854)`<br>OSM: `(50.102176, 8.643106)` | Kleyerstraße, Frankfurt am Main, Hessen 60326 |
| **72 m** | DE/FRANKFURT-AM-MAIN | "Studio Business Smart" (`1603592`) | ✅ Yes | Pin: `(50.10261, 8.643854)`<br>OSM: `(50.102176, 8.643106)` | Kleyerstraße, Frankfurt am Main, Hessen 60326 |
| **71.8 m** | US/PHILADELPHIA | "The Greenery" (`1615296`) | ❌ No | Pin: `(39.982816, -75.158708)`<br>OSM: `(39.982208, -75.158429)` | North 15th Street, Philadelphia, Pennsylvania 19121 |
| **71.6 m** | AU/MELBOURNE | "104/193-195 Springvale Road,Nunawading,Victoria 3131" (`1567087`) | ❌ No | Pin: `(-37.821556, 145.175961)`<br>OSM: `(-37.821068, 145.176491)` | 193-195 Springvale, Melbourne, Victoria 3131 |
| **71.2 m** | AU/MELBOURNE | "2b2b/26 Foundation Boulevard,Burwood East,Victoria 3151" (`1567055`) | ❌ No | Pin: `(-37.852516, 145.135136)`<br>OSM: `(-37.852831, 145.134431)` | 26 Foundation, Melbourne, Victoria 3151 |
| **71.1 m** | AU/MELBOURNE | "Student Living - 590 Lygon" (`1518086`) | ❌ No | Pin: `(-37.792776, 144.966377)`<br>OSM: `(-37.792138, 144.966412)` | 590 Lygon Street, Carlton Victoria, Melbourne, Victoria 3053 |
| **71 m** | AU/CANBERRA | "4 Stockdale St" (`1676505`) | ❌ No | Pin: `(-35.257734, 149.134358)`<br>OSM: `(-35.257643, 149.133585)` | 4 Stockdale St, Dickson, Canberra, ACT 2602 |
| **70.8 m** | AU/SYDNEY | "Parramatta" (`1556588`) | ❌ No | Pin: `(-33.81995, 150.988572)`<br>OSM: `(-33.819503, 150.989117)` | 3 Patricia Street, Sydney, New South Wales 2145 |
| **70.8 m** | CA/MONTREAL | "Tour des Canadiens Condo" (`1470323`) | ❌ No | Pin: `(45.496958, -73.567565)`<br>OSM: `(45.497585, -73.567408)` | 910 Rue Peel, Montreal, Quebec H3C 2H8 |
| **70.2 m** | AU/SYDNEY | "2/341 Marrickville Road,Marrickville,New South Wales 2204" (`1567232`) | ❌ No | Pin: `(-33.907705, 151.150401)`<br>OSM: `(-33.907315, 151.149803)` | 341 Marrickville, Sydney, New South Wales 2204 |
| **70.2 m** | AU/SYDNEY | "101/43 Riley Street,Woolloomooloo,New South Wales 2011" (`1567264`) | ❌ No | Pin: `(-33.978262, 151.069749)`<br>OSM: `(-33.977879, 151.069145)` | 43 Riley Street, Sydney, New South Wales 2011 |
| **69.5 m** | AU/MELBOURNE | "1B1B/456 Haughton Road,Clayton South,Victoria 3169" (`1567073`) | ❌ No | Pin: `(-37.930625, 145.127652)`<br>OSM: `(-37.931243, 145.127533)` | 456 Haughton, Melbourne, Victoria 3169 |
| **69.3 m** | UK/COVENTRY | "12 Evesham Walk,Cannon Park" (`1519328`) | ❌ No | Pin: `(52.383707, -1.555324)`<br>OSM: `(52.383820, -1.556327)` | 12 Evesham Walk, Coventry CV4 7DR, United Kingdom |
| **69.3 m** | UK/COVENTRY | "12A Evesham Walk Studio Cannon Park" (`1520463`) | ❌ No | Pin: `(52.383707, -1.555324)`<br>OSM: `(52.383820, -1.556327)` | 12 Evesham Walk, Coventry CV4 7DR, United Kingdom |
| **69 m** | AU/SYDNEY | "Dayman  Apartments" (`1507363`) | ❌ No | Pin: `(-33.772347, 151.102021)`<br>OSM: `(-33.771928, 151.102572)` | 7 Dayman Place, Sydney, New South Wales 2122 |
| **69 m** | CA/VANCOUVER | "Austin Ave" (`1574245`) | ❌ No | Pin: `(49.24902, -122.895112)`<br>OSM: `(49.248545, -122.894502)` | Austin Road, Vancouver, British Columbia V3J 1N4 |
| **69 m** | UK/GLASGOW | "Elizabeth Street, G51 1AG" (`1573481`) | ❌ No | Pin: `(55.852272, -4.298229)`<br>OSM: `(55.851820, -4.297472)` | Elizabeth St, Glasgow G51 1AG, United Kingdom |
| **68.8 m** | AU/SYDNEY | "336 Parramatta Stanmore" (`1578011`) | ❌ No | Pin: `(-33.888537, 151.163376)`<br>OSM: `(-33.888447, 151.164112)` | 336 Parramatta Road, Sydney, New South Wales 2048 |
| **68.7 m** | DE/MUNCHEN | "Wilhelm-Riehl-Straße 28" (`1671277`) | ✅ Yes | Pin: `(48.135949, 11.518015)`<br>OSM: `(48.135960, 11.518939)` | Wilhelm-Riehl-Straße 28, Munich, Freistaat Bayern 80687 |
| **68.6 m** | CA/TORONTO | "412 - 15 Richardson Street" (`1685604`) | ❌ No | Pin: `(43.644969, -79.368046)`<br>OSM: `(43.644552, -79.368674)` | 15 15 Richardson Street, Toronto, Ontario M5A0Y5 |
| **68.6 m** | US/URBANA-CHAMPAIGN | "704 W. Elm St" (`1634711`) | ❌ No | Pin: `(40.111743, -88.216668)`<br>OSM: `(40.111652, -88.215871)` | 704 West Elm Street, Champaign, Illinois 61801 |
| **68.5 m** | UK/NOTTINGHAM | "Bonington Student Village" (`18047`) | ❌ No | Pin: `(52.82938, -1.252876)`<br>OSM: `(52.829918, -1.253370)` | College Road, Nottingham LE12 5RD, United Kingdom |
| **68.5 m** | UK/NOTTINGHAM | "residence near College Rd" (`1619488`) | ❌ No | Pin: `(52.82938, -1.252876)`<br>OSM: `(52.829918, -1.253370)` | College Rd, Nottingham LE12 5RD, United Kingdom |
| **67.5 m** | UK/NOTTINGHAM | "Winfield Court" (`1576671`) | ❌ No | Pin: `(52.949505, -1.137051)`<br>OSM: `(52.949416, -1.138047)` | Winfield Court，The Island Quarter, Nottingham NG2 4RU, United Kingdom |
| **67.4 m** | US/ANN-ARBOR | "Willowtree Apartments and Tower" (`1492062`) | ❌ No | Pin: `(42.299226, -83.717122)`<br>OSM: `(42.299308, -83.717933)` | 1819 Willowtree Lane, Ann Arbor, Michigan 48105 |
| **67 m** | US/ATLANTA | "Inspire Atlanta" (`1606703`) | ❌ No | Pin: `(33.77035, -84.392515)`<br>OSM: `(33.770561, -84.391837)` | Centennial Olympic Park Drive Northwest, Atlanta, Georgia 30313 |
| **66.5 m** | AU/CANBERRA | "21 Marcus Clarke St" (`1677493`) | ❌ No | Pin: `(-35.284419, 149.125085)`<br>OSM: `(-35.284211, 149.124399)` | 21 Marcus Clarke St, Canberra, Canberra, ACT 2601 |
| **66.5 m** | AU/MELBOURNE | "219/1 Sergeant Street, Blackburn" (`1567978`) | ❌ No | Pin: `(-37.81945, 145.14263)`<br>OSM: `(-37.819816, 145.142032)` | Unit 219/1 Sergeant St, Melbourne, Victoria 3130 |
| **66.5 m** | CA/TORONTO | "York St & Bremner Blvd" (`1587354`) | ❌ No | Pin: `(43.642932, -79.381491)`<br>OSM: `(43.642422, -79.381921)` | York St & Bremner Blvd, Toronto, Ontario M5J 2V5 |
| **66.5 m** | UK/LIVERPOOL | "8 Talton Road, L15" (`1645250`) | ✅ Yes | Pin: `(53.397369, -2.934567)`<br>OSM: `(53.397922, -2.934190)` | 10 Talton Rd, Liverpool L15 0HS, United Kingdom |
| **66.1 m** | UK/SHEFFIELD | "Milton Street 29885#" (`1714956`) | ❌ No | Pin: `(53.37619, -1.47837)`<br>OSM: `(53.375804, -1.477614)` | 78 Milton St, Sheffield City Centre, United Kingdom |
| **66.1 m** | UK/SHEFFIELD | "Milton Street 29886#" (`1714955`) | ❌ No | Pin: `(53.37619, -1.47837)`<br>OSM: `(53.375804, -1.477614)` | 78 Milton St, Sheffield City Centre, United Kingdom |
| **66.1 m** | UK/SHEFFIELD | "Milton Street 29884#" (`1714957`) | ❌ No | Pin: `(53.37619, -1.47837)`<br>OSM: `(53.375804, -1.477614)` | 78 Milton St, Sheffield City Centre, United Kingdom |
| **66.1 m** | UK/SHEFFIELD | "Milton Street 29883#" (`1714958`) | ❌ No | Pin: `(53.37619, -1.47837)`<br>OSM: `(53.375804, -1.477614)` | 78 Milton St, Sheffield City Centre, United Kingdom |
| **65.9 m** | US/ATLANTA | "The Standard at Atlanta" (`1440578`) | ✅ Yes | Pin: `(33.77404, -84.389131)`<br>OSM: `(33.774631, -84.389180)` | 708 Spring St, Atlanta, Georgia 30308 |
| **65.9 m** | US/BOSTON | "The Abby" (`1512818`) | ✅ Yes | Pin: `(42.277112, -71.030135)`<br>OSM: `(42.276546, -71.029899)` | 255 Hancock Street, Boston, Massachusetts 02171 |
| **65.3 m** | UK/GLASGOW | "Laurel Place, G11 7RE" (`1569280`) | ❌ No | Pin: `(55.874148, -4.316751)`<br>OSM: `(55.873581, -4.316488)` | Laurel Pl, Glasgow G11 7RE, United Kingdom |
| **65.3 m** | US/LOS-ANGELES | "Opus Wilshire" (`1616945`) | ✅ Yes | Pin: `(34.062091, -118.301947)`<br>OSM: `(34.062677, -118.301924)` | 3545 Wilshire Boulevard, Los Angeles, California 90010 |
| **65.1 m** | CA/LONDON | "300 King Street" (`1677506`) | ✅ Yes | Pin: `(42.984401, -81.243144)`<br>OSM: `(42.984376, -81.243943)` | 300 King Street, London, Ontario N6B 1S2 |
| **64.7 m** | DE/MANNHEIM | "Käthe-Kollwitz-Straße - Studio" (`1583015`) | ❌ No | Pin: `(49.505678, 8.474903)`<br>OSM: `(49.506157, 8.474397)` | Käthe-Kollwitz-Straße, Mannheim, Baden-Württemberg 68169 |
| **64.7 m** | DE/MANNHEIM | "Käthe-Kollwitz-Straße - Superior" (`1583021`) | ❌ No | Pin: `(49.505678, 8.474903)`<br>OSM: `(49.506157, 8.474397)` | Käthe-Kollwitz-Straße, Mannheim, Baden-Württemberg 68169 |
| **64.5 m** | FR/CERGY | "Cergy 95e·80m²·F4·AppartementNo furniture" (`1627896`) | ❌ No | Pin: `(48.856602, 2.3522)`<br>OSM: `(48.857175, 2.352076)` | 6 Pl. de l'Hotel de Ville, Cergy, ile-de-france 95800 |
| **64.5 m** | FR/PARIS | "PARIS 16e·24m²·F2·Appartement·With furniture" (`1657457`) | ❌ No | Pin: `(48.856602, 2.3522)`<br>OSM: `(48.857175, 2.352076)` | 6 Pl. de l'Hotel de Ville, Paris, ile-de-france 75016 |
| **64.5 m** | FR/PARIS | "PARIS 15e·25m²·F2·AppartementNo furniture" (`1669947`) | ❌ No | Pin: `(48.856602, 2.3522)`<br>OSM: `(48.857175, 2.352076)` | 6 Pl. de l'Hotel de Ville, Paris, ile-de-france 75015 |
| **64.5 m** | FR/PARIS | "PARIS 7e·61m²·F2·Appartement·With furniture" (`1669948`) | ❌ No | Pin: `(48.856602, 2.3522)`<br>OSM: `(48.857175, 2.352076)` | 6 Pl. de l'Hotel de Ville, Paris, ile-de-france 75007 |
| **64.5 m** | FR/PARIS | "PARIS 9e·18m²·F1·Studio·With furniture" (`1669949`) | ❌ No | Pin: `(48.856602, 2.3522)`<br>OSM: `(48.857175, 2.352076)` | 6 Pl. de l'Hotel de Ville, Paris, ile-de-france 75009 |
| **64.5 m** | FR/PARIS | "PARIS 11e·16m²·F1·Studio·With furniture" (`1657567`) | ❌ No | Pin: `(48.856602, 2.3522)`<br>OSM: `(48.857175, 2.352076)` | 6 Pl. de l'Hotel de Ville, Paris, ile-de-france 75011 |
| **64.5 m** | FR/PARIS | "PARIS 13e·57m²·F3·Maison·With furniture" (`1657570`) | ❌ No | Pin: `(48.856602, 2.3522)`<br>OSM: `(48.857175, 2.352076)` | 6 Pl. de l'Hotel de Ville, Paris, ile-de-france 75013 |
| **64.5 m** | FR/PARIS | "PARIS 11e·62m²·F3·AppartementNo furniture" (`1669954`) | ❌ No | Pin: `(48.856602, 2.3522)`<br>OSM: `(48.857175, 2.352076)` | 6 Pl. de l'Hotel de Ville, Paris, ile-de-france 75011 |
| **64.5 m** | FR/PARIS | "PARIS 13e·26m²·F1·Studio·With furniture" (`1657873`) | ❌ No | Pin: `(48.856602, 2.3522)`<br>OSM: `(48.857175, 2.352076)` | 6 Pl. de l'Hotel de Ville, Paris, ile-de-france 75013 |
| **64.5 m** | FR/PARIS | "PARIS 10e·35m²·F1·Studio·With furniture" (`1657874`) | ❌ No | Pin: `(48.856602, 2.3522)`<br>OSM: `(48.857175, 2.352076)` | 6 Pl. de l'Hotel de Ville, Paris, ile-de-france 75010 |
| **64.5 m** | FR/PARIS | "PARIS 13e·56m²·F2·Appartement·With furniture" (`1657879`) | ❌ No | Pin: `(48.856602, 2.3522)`<br>OSM: `(48.857175, 2.352076)` | 6 Pl. de l'Hotel de Ville, Paris, ile-de-france 75013 |
| **64.5 m** | FR/PARIS | "PARIS 16e·10m²·F1·Studio·With furniture" (`1657880`) | ❌ No | Pin: `(48.856602, 2.3522)`<br>OSM: `(48.857175, 2.352076)` | 6 Pl. de l'Hotel de Ville, Paris, ile-de-france 75016 |
| **64.5 m** | FR/PARIS | "PARIS 1e·30.92m²·F1·Studio·With furniture" (`1658030`) | ❌ No | Pin: `(48.856602, 2.3522)`<br>OSM: `(48.857175, 2.352076)` | 6 Pl. de l'Hotel de Ville, Paris, ile-de-france 75001 |
| **64.5 m** | FR/PARIS | "PARIS 9e·52m²·F2·AppartementNo furniture" (`1670945`) | ❌ No | Pin: `(48.856602, 2.3522)`<br>OSM: `(48.857175, 2.352076)` | 6 Pl. de l'Hotel de Ville, Paris, ile-de-france 75009 |
| **64.5 m** | FR/PARIS | "PARIS 11e·33m²·F2·Appartement·With furniture" (`1658172`) | ❌ No | Pin: `(48.856602, 2.3522)`<br>OSM: `(48.857175, 2.352076)` | 6 Pl. de l'Hotel de Ville, Paris, ile-de-france 75011 |
| **64.3 m** | UK/SHEFFIELD | "residence near 49 Wellington Street" (`1619539`) | ❌ No | Pin: `(53.378166, -1.476381)`<br>OSM: `(53.377626, -1.476722)` | 49 Wellington Street, Sheffield S1 4HG, United Kingdom |
| **64.2 m** | DE/BERLIN | "Wohnung in der Gustav-Tempel-Strasse" (`1654850`) | ❌ No | Pin: `(52.50136, 13.47455)`<br>OSM: `(52.500797, 13.474345)` | Gustav-Tempel-Straße, Berlin, Berlin 10317 |
| **64.2 m** | DE/BERLIN | "Wohnung in der Gustav-Tempel-Strasse" (`1654851`) | ❌ No | Pin: `(52.50136, 13.47455)`<br>OSM: `(52.500797, 13.474345)` | Gustav-Tempel-Straße, Berlin, Berlin 10317 |
| **64 m** | UK/NOTTINGHAM | "The Willow House" (`1652781`) | ❌ No | Pin: `(52.941208, -1.175682)`<br>OSM: `(52.941772, -1.175866)` | 12 Willow Road, Nottingham NG7 2WS, United Kingdom |
| **64 m** | US/ATLANTA | "The Hive" (`1653193`) | ❌ No | Pin: `(33.770387, -84.392496)`<br>OSM: `(33.770561, -84.391837)` | 566 Centennial Olympic Park Drive, Atlanta, Georgia 30332 |
| **63.9 m** | CA/OTTAWA | "The Revalie" (`1505593`) | ❌ No | Pin: `(45.373384, -75.688931)`<br>OSM: `(45.372894, -75.688506)` | 770 Brookfield Road, Ottawa, Ontario K1V 6J4 |
| **63.9 m** | UK/LEICESTERSHIRE | "162-164 London Road" (`1596912`) | ❌ No | Pin: `(52.625983, -1.117237)`<br>OSM: `(52.625619, -1.116506)` | London Road, Leicester LE2 1ND, United Kingdom |
| **63.8 m** | AU/PERTH | "31B Wanneroo Road" (`1689300`) | ❌ No | Pin: `(-31.906783, 115.844222)`<br>OSM: `(-31.906506, 115.844813)` | 31B Wanneroo Road, Perth, Western Australia 6060 |
| **63.8 m** | UK/MANCHESTER | "iQ Wilmslow Park" (`17661`) | ✅ Yes | Pin: `(53.458227, -2.226728)`<br>OSM: `(53.458799, -2.226782)` | 211 Hathersage Road, Manchester M13 0JQ, United Kingdom |
| **63.7 m** | UK/LEICESTERSHIRE | "150-152 London Road" (`1596909`) | ❌ No | Pin: `(52.626577, -1.118191)`<br>OSM: `(52.626084, -1.118671)` | London Road, Leicester LE2 1ND, United Kingdom |
| **63.7 m** | US/BOSTON | "Somerville #1205" (`1671593`) | ✅ Yes | Pin: `(42.350885, -71.069328)`<br>OSM: `(42.351328, -71.068838)` | 50 Columbus Avenue, Boston, Massachusetts 02143 |
| **63.5 m** | UK/LONDON | "Wellington Lodge" (`13712`) | ✅ Yes | Pin: `(51.499152, -0.106688)`<br>OSM: `(51.499586, -0.107284)` | 268-282 Waterloo Road, London SE1 8RQ, United Kingdom |
| **63.5 m** | US/TEMPE | "Alight Tempe" (`20604`) | ❌ No | Pin: `(33.415229, -111.904447)`<br>OSM: `(33.415604, -111.904961)` | 1900 E Apache Blvd, Tempe, Arizona 85281 |
| **63.4 m** | CA/TORONTO | "Harrington Housing - Waterfront" (`1505268`) | ❌ No | Pin: `(43.641889, -79.381048)`<br>OSM: `(43.641904, -79.381835)` | 12&14 York Street, Toronto, Ontario M5J 0A9 |
| **63 m** | UK/LONDON | "Scape Hammersmith" (`1654134`) | ❌ No | Pin: `(51.490679, -0.219416)`<br>OSM: `(51.490459, -0.218578)` | Talgarth Road, London W6 8DN, United Kingdom |
| **62.5 m** | AU/MELBOURNE | "4/649 Canterbury Road, Vermont" (`1567932`) | ❌ No | Pin: `(-37.831898, 145.212262)`<br>OSM: `(-37.831492, 145.212752)` | Unit 4/649 Canterbury Rd, Melbourne, Victoria 3133 |
| **62.5 m** | UK/NOTTINGHAM | "The Place" (`1580181`) | ❌ No | Pin: `(52.946492, -1.140861)`<br>OSM: `(52.946895, -1.141510)` | 33 Queen's Road, Nottingham NG2 3NA, United Kingdom |
| **62.2 m** | AU/SYDNEY | "4 carlton street" (`1577333`) | ❌ No | Pin: `(-33.906487, 151.25918)`<br>OSM: `(-33.906771, 151.258601)` | 4 Carlton Street, Sydney, New South Wales 2033 |
| **62.2 m** | UK/NEWCASTLE | "2 Leazes Terrace, Flat 5" (`1657791`) | ❌ No | Pin: `(54.975994, -1.620389)`<br>OSM: `(54.975701, -1.619560)` | 2 Leazes Terrace, Newcastle NE1 4LY, United Kingdom |
| **62 m** | US/BUFFALO | "Auden Buffalo" (`1635209`) | ✅ Yes | Pin: `(43.020323, -78.788502)`<br>OSM: `(43.020809, -78.788875)` | 2915 North Forest Road, Buffalo, New York 14068 |
| **61.9 m** | AU/CANBERRA | "6 Cape St" (`1642292`) | ❌ No | Pin: `(-35.251573, 149.137032)`<br>OSM: `(-35.251017, 149.137029)` | 6 Cape St, Dickson, Canberra, ACT 2602 |
| **61.7 m** | UK/BIRMINGHAM | "Canvas The Old Fire Station" (`1577194`) | ❌ No | Pin: `(52.485966, -1.889366)`<br>OSM: `(52.486425, -1.889877)` | Aston Street, Birmingham B4 7DA, United Kingdom |
| **61.5 m** | UK/LEICESTERSHIRE | "Leicester One" (`1565510`) | ✅ Yes | Pin: `(52.632735, -1.128767)`<br>OSM: `(52.632230, -1.129135)` | 103 Granby Street, Leicester LE1 6BN, United Kingdom |
| **61.3 m** | AU/MELBOURNE | "16 Puerta Street, Burwood" (`1567917`) | ❌ No | Pin: `(-37.844825, 145.106835)`<br>OSM: `(-37.845141, 145.106264)` | 16 Puerta St, Melbourne, Victoria 3125 |
| **61.3 m** | CA/EDMONTON | "The Village at Southgate" (`522488`) | ❌ No | Pin: `(53.483083, -113.508403)`<br>OSM: `(53.483605, -113.508700)` | 10711 47 Ave NW, Edmonton, Alberta T6H 5J1 |
| **61.3 m** | UK/LEICESTERSHIRE | "Liberty Park" (`19144`) | ❌ No | Pin: `(52.625007, -1.142527)`<br>OSM: `(52.625229, -1.141697)` | 101 Raw Dykes Road, Leicester LE2 7FP, United Kingdom |
| **61 m** | CA/TORONTO | "Beacon Condos(5180 Yonge)" (`1494996`) | ❌ No | Pin: `(43.770304, -79.415833)`<br>OSM: `(43.770834, -79.415642)` | 5180 Yonge St, Toronto, Ontario M2N 5P6 |
| **61 m** | UK/BIRMINGHAM | "Pershore Road B5" (`1577943`) | ❌ No | Pin: `(52.457521, -1.904534)`<br>OSM: `(52.456987, -1.904736)` | Pershore Road, Birmingham B5 7QF, United Kingdom |
| **61 m** | UK/SWANSEA | "Crown Place" (`1520222`) | ❌ No | Pin: `(51.621264, -3.93373)`<br>OSM: `(51.621025, -3.932935)` | 2 Kings Road，, Swansea SA1 8FE，, United Kingdom |
| **61 m** | US/URBANA-CHAMPAIGN | "Latitude" (`1416539`) | ❌ No | Pin: `(40.116654, -88.229764)`<br>OSM: `(40.116106, -88.229772)` | 608 East University Avenue, Champaign, Illinois 61820 |
| **60.8 m** | CA/TORONTO | "Beyond the Sea Star Tower(2230 Lake Shore)" (`1505990`) | ✅ Yes | Pin: `(43.621748, -79.482953)`<br>OSM: `(43.621389, -79.483521)` | 2230 Lake Shore Blvd W, Toronto, Ontario M8V 0B2 |
| **60.8 m** | UK/SHEFFIELD | "Westhill Hall" (`1520521`) | ❌ No | Pin: `(53.378653, -1.476617)`<br>OSM: `(53.379192, -1.476761)` | 61 Eldon Street, Sheffield S1 4NN, United Kingdom |
| **60.5 m** | DE/BERLIN | "studio in Lichtenberg" (`1654823`) | ❌ No | Pin: `(52.50129, 13.47472)`<br>OSM: `(52.500797, 13.474345)` | Gustav-Tempel-Straße, Berlin, Berlin 10317 |
| **60.5 m** | DE/BERLIN | "studio in Lichtenberg" (`1601801`) | ❌ No | Pin: `(52.50129, 13.47472)`<br>OSM: `(52.500797, 13.474345)` | Gustav-Tempel-Straße, Berlin, Berlin 10317 |
| **60.5 m** | UK/LONDON | "Brent Cross Town" (`1664791`) | ❌ No | Pin: `(51.570783, -0.223505)`<br>OSM: `(51.570583, -0.222692)` | Merchant Street, London NW2, United Kingdom |
| **60.2 m** | DE/FRANKFURT-AM-MAIN | "Frankfurt Bockenheim" (`1668259`) | ❌ No | Pin: `(50.117094, 8.630343)`<br>OSM: `(50.117056, 8.631184)` | Voltastraße 81, Frankfurt am Main, Hessen 60486 |
| **59.9 m** | CA/LONDON | "Forest Hill" (`1711707`) | ✅ Yes | Pin: `(42.982703, -81.284606)`<br>OSM: `(42.982432, -81.285241)` | 575 Proudfoot Lane, London, Ontario N6H 4R5 |
| **59.9 m** | UK/ST-ANDREWS | "East Shore" (`17462`) | ❌ No | Pin: `(56.332487, -2.77907)`<br>OSM: `(56.332929, -2.779624)` | East Sands, St Andrews KY16 8LH, United Kingdom |
| **59.6 m** | AU/SYDNEY | "4/49 Baird Avenue,Matraville,New South Wales 2036" (`1567118`) | ❌ No | Pin: `(-33.959081, 151.230508)`<br>OSM: `(-33.959039, 151.231151)` | 49 Baird Avenue, Sydney, New South Wales 2036 |
| **59.6 m** | CA/TORONTO | "Harrington Housing - Bleecker" (`1656711`) | ✅ Yes | Pin: `(43.670031, -79.375096)`<br>OSM: `(43.669496, -79.375071)` | 358 Bleecker Street, Toronto, Ontario M4X 1K7 |
| **59.6 m** | UK/LEICESTERSHIRE | "The 100 Apartments" (`1635064`) | ✅ Yes | Pin: `(52.638539, -1.136919)`<br>OSM: `(52.638140, -1.137507)` | 100 Vaughan Way, Leicester LE1 4SH, United Kingdom |
| **59.5 m** | UK/SHEFFIELD | "Rockingham House" (`144060`) | ❌ No | Pin: `(53.382816, -1.477321)`<br>OSM: `(53.382977, -1.476466)` | Newcastle Street, Sheffield S1 3PD, United Kingdom |
| **59.4 m** | AU/MELBOURNE | "601/9 Shuter Street, Moonee Ponds" (`1567972`) | ❌ No | Pin: `(-37.767764, 144.920512)`<br>OSM: `(-37.767285, 144.920215)` | Unit 601/9 Shuter St, Melbourne, Victoria 3039 |
| **59.4 m** | CA/WATERLOO | "MyRez On Lester" (`1507922`) | ❌ No | Pin: `(43.471348, -80.53472)`<br>OSM: `(43.471777, -80.534283)` | 181 Lester St, Waterloo, Ontario N2L 0C2 |
| **59.3 m** | UK/COVENTRY | "Entire Place·1B1B···45 Park Rd" (`1479935`) | ❌ No | Pin: `(52.402931, -1.511016)`<br>OSM: `(52.402511, -1.511552)` | 45 Park Rd, Coventry CV1 2LE, United Kingdom |
| **59 m** | US/RALEIGH | "Paloma Raleigh" (`1652102`) | ❌ No | Pin: `(35.785692, -78.727139)`<br>OSM: `(35.785636, -78.727788)` | 5701 Hillsborough St, Raleigh, North Carolina 27606 |
| **58.9 m** | DE/DORTMUND | "Studio B7+" (`1583012`) | ❌ No | Pin: `(51.451267, 7.268185)`<br>OSM: `(51.450820, 7.268638)` | Universitätsstraße, Dortmund, Nordrhein-Westfalen 44 |
| **58.9 m** | DE/DORTMUND | "Studio B4-6" (`1583011`) | ❌ No | Pin: `(51.451267, 7.268185)`<br>OSM: `(51.450820, 7.268638)` | Universitätsstraße, Dortmund, Nordrhein-Westfalen 44 |
| **58.9 m** | US/BOSTON | "Pelham Hall" (`1667236`) | ❌ No | Pin: `(42.346318, -71.106574)`<br>OSM: `(42.345797, -71.106446)` | 1284 Beacon Street, Boston, Massachusetts 02467 |
| **58.8 m** | UK/LIVERPOOL | "43 Egerton Road L15" (`1649507`) | ✅ Yes | Pin: `(53.396178, -2.937022)`<br>OSM: `(53.396692, -2.936817)` | 43 Egerton Rd, Liverpool L15 2HN, United Kingdom |
| **58.7 m** | US/PHILADELPHIA | "Avira Schuylkill Yards" (`1648361`) | ❌ No | Pin: `(39.956547, -75.186149)`<br>OSM: `(39.956458, -75.185470)` | 3025 John F Kennedy Boulevard, Philadelphia, Pennsylvania 19104 |
| **58.4 m** | AU/CANBERRA | "65 Cooyong Street" (`1617727`) | ❌ No | Pin: `(-35.278174, 149.13527)`<br>OSM: `(-35.278541, 149.135730)` | 65 Cooyong Street, Braddon, Canberra, ACT 2601 |
| **58.4 m** | AU/CANBERRA | "65 Cooyong St" (`1684122`) | ❌ No | Pin: `(-35.278174, 149.13527)`<br>OSM: `(-35.278541, 149.135730)` | 65 Cooyong St, Canberra, Canberra, ACT 2601 |
| **58.2 m** | UK/SHEFFIELD | "Milton Street 29887#" (`1714954`) | ❌ No | Pin: `(53.37625, -1.47807)`<br>OSM: `(53.375804, -1.477614)` | 199 Milton St, Sheffield City Centre, United Kingdom |
| **58.1 m** | UK/LIVERPOOL | "38 Ferndale Road, L15" (`1645195`) | ✅ Yes | Pin: `(53.391575, -2.929166)`<br>OSM: `(53.391984, -2.928623)` | 38 Ferndale Rd, Liverpool L15 3JZ, United Kingdom |
| **58 m** | DE/BERLIN | "residence in Friedrichshain" (`1581574`) | ✅ Yes | Pin: `(52.515076, 13.453213)`<br>OSM: `(52.514608, 13.452836)` | 5 Warschauer Strasse, Berlin, Berlin 10243 |
| **57.9 m** | FR/PARIS | "127 avenue de Flandre, 75019" (`1665525`) | ❌ No | Pin: `(48.891832, 2.37784)`<br>OSM: `(48.891485, 2.378429)` | 127 avenue de Flandre, Paris, ile-de-france 75019 |
| **57.8 m** | UK/BIRMINGHAM | "Entire Place·5B2B···70 Lodgehill Road, Selly Oak" (`1473614`) | ❌ No | Pin: `(52.438572, -1.948328)`<br>OSM: `(52.439045, -1.947977)` | 70 Lodgehill Road, Selly Oak, Birmingham B29 6NG, United Kingdom |
| **57.8 m** | UK/GLASGOW | "Parsonage Square, G4 0TH" (`1574234`) | ❌ No | Pin: `(55.858068, -4.239658)`<br>OSM: `(55.858584, -4.239766)` | Parsonage Square, Glasgow  G4 0TH, United Kingdom |
| **57.4 m** | AU/CANBERRA | "UniLodge @ UC – UC Lodge" (`19133`) | ❌ No | Pin: `(-35.234304, 149.083786)`<br>OSM: `(-35.234477, 149.084381)` | 20 Telita St Bruce, Canberra, ACT 2617 |
| **57.4 m** | UK/LONDON | "Bright House" (`1554452`) | ✅ Yes | Pin: `(51.407324, -0.305608)`<br>OSM: `(51.406906, -0.305124)` | Kingston Hall Road, Kingston upon Thames, London KT1 2BP, United Kingdom |
| **57.4 m** | UK/SHEFFIELD | "Sheffield 3" (`18364`) | ❌ No | Pin: `(53.388084, -1.478406)`<br>OSM: `(53.387907, -1.477594)` | 80 Hoyle Street, Sheffield S3 7LG, United Kingdom |
| **57.4 m** | US/BOSTON | "Alder Allston Yards" (`1596923`) | ❌ No | Pin: `(42.356728, -71.143502)`<br>OSM: `(42.357088, -71.144002)` | 301 Guest Street, Boston, Massachusetts 02134 |
| **57 m** | AU/SYDNEY | "4/153 Coogee Bay Road,Coogee,New South Wales 2034" (`1567130`) | ❌ No | Pin: `(-33.920509, 151.252557)`<br>OSM: `(-33.920041, 151.252807)` | 153 Coogee Bay Road, Sydney, New South Wales 2034 |
| **57 m** | FR/PARIS | "Studea Nanterre Joffre" (`1478555`) | ✅ Yes | Pin: `(48.884966, 2.19427)`<br>OSM: `(48.885156, 2.193546)` | 44 Avenue du Maréchal Joffre, Paris, ile-de-france 92000 |
| **57 m** | UK/MANCHESTER | "St Gabriels Court" (`1657291`) | ❌ No | Pin: `(53.457615, -2.221482)`<br>OSM: `(53.458027, -2.221992)` | Oxford Place, Manchester M14 5EE, United Kingdom |
| **56.9 m** | US/LOS-ANGELES | "Metro 417" (`1686373`) | ✅ Yes | Pin: `(34.049849, -118.251023)`<br>OSM: `(34.050268, -118.251376)` | 417 South Hill Street, Los Angeles, California 90013 |
| **56.8 m** | CA/VANCOUVER | "University Manor" (`1514194`) | ❌ No | Pin: `(49.263648, -123.21572)`<br>OSM: `(49.263646, -123.214938)` | 4640 West 10th Avenue, Vancouver, British Columbia V6R 2J5 |
| **56.8 m** | UK/CANTERBURY | "Palamon Court" (`368301`) | ❌ No | Pin: `(51.274818, 1.080041)`<br>OSM: `(51.274850, 1.080854)` | Rhodaus Town, Canterbury CT1 2YA, United Kingdom |
| **56.8 m** | UK/SHEFFIELD | "Egerton Lane 29892#" (`1714944`) | ❌ No | Pin: `(53.37651, -1.47841)`<br>OSM: `(53.376778, -1.479137)` | 6 Egerton Cl, Sheffield City Centre, United Kingdom |
| **56.8 m** | UK/SHEFFIELD | "Egerton Lane 29891#" (`1714945`) | ❌ No | Pin: `(53.37651, -1.47841)`<br>OSM: `(53.376778, -1.479137)` | 6 Egerton Cl, Sheffield City Centre, United Kingdom |
| **56.5 m** | AU/SYDNEY | "203/8 Princess Street,BRIGHTON-LE-SANDS,New South Wales 2216" (`1567236`) | ❌ No | Pin: `(-32.934674, 151.628914)`<br>OSM: `(-32.935152, 151.628709)` | 8 Princess Street, Sydney, New South Wales 2216 |
| **56.5 m** | AU/SYDNEY | "408/8 Princess Street,Brighton Le Sands,New South Wales 2216" (`1567237`) | ❌ No | Pin: `(-32.934674, 151.628914)`<br>OSM: `(-32.935152, 151.628709)` | 8 Princess Street, Sydney, New South Wales 2216 |
| **56.1 m** | DE/MUNCHEN | "Grete-Mosheim-Strasse Munich 80636 Germany" (`1592723`) | ❌ No | Pin: `(48.14353, 11.54509)`<br>OSM: `(48.143617, 11.545834)` | Grete-Mosheim-Straße, Munich, Freistaat Bayern 80636 |
| **56.1 m** | UK/LIVERPOOL | "42 Egerton road, L15" (`1618843`) | ✅ Yes | Pin: `(53.396154, -2.936746)`<br>OSM: `(53.396629, -2.936460)` | 40 Egerton Rd, Liverpool L15 2HW, United Kingdom |
| **56 m** | AU/MELBOURNE | "4/637 Malvern Road, Toorak" (`1567955`) | ❌ No | Pin: `(-37.848564, 145.008111)`<br>OSM: `(-37.848860, 145.007596)` | Unit 4/637 Malvern Rd, Melbourne, Victoria 3142 |
| **55.8 m** | UK/BRIGHTON | "Moulsecoomb Place" (`1638007`) | ❌ No | Pin: `(50.846497, -0.115728)`<br>OSM: `(50.846990, -0.115869)` | Lewes Road, Brighton BN2 4GA, United Kingdom |
| **55.8 m** | UK/LONDON | "New Orient House" (`1477588`) | ✅ Yes | Pin: `(51.47423, -0.184357)`<br>OSM: `(51.474449, -0.183632)` | Imperial Road, Fulham, London SW6 2EP, United Kingdom |
| **55.7 m** | UK/BRISTOL | "Brigg Point" (`1651569`) | ❌ No | Pin: `(51.450851, -2.575176)`<br>OSM: `(51.450571, -2.575842)` | Gas Lane, Bristol, United Kingdom |
| **55.7 m** | UK/MANCHESTER | "Dwell Weston Court" (`51739`) | ❌ No | Pin: `(53.447934, -2.217412)`<br>OSM: `(53.448199, -2.216699)` | 45 Cromwell Range, Manchester M14 5JR, United Kingdom |
| **55.7 m** | US/TEMPE | "Apollo Tempe" (`1514779`) | ❌ No | Pin: `(33.415309, -111.921974)`<br>OSM: `(33.415801, -111.921868)` | 1100 E. Apache Blvd, Tempe, Arizona 85281 |
| **55.6 m** | UK/ABERDEEN | "Mealmarket Exchange" (`1485066`) | ✅ Yes | Pin: `(57.150925, -2.094739)`<br>OSM: `(57.150822, -2.095641)` | Mealmarket Street, Aberdeen AB24 5SW, United Kingdom |
| **55.6 m** | UK/DURHAM | "ST-Old Dryburn Way" (`1655646`) | ❌ No | Pin: `(54.785804, -1.589223)`<br>OSM: `(54.786118, -1.588550)` | Old Dryburn Way, Durham DH1 5SE, United Kingdom |
| **55.5 m** | UK/SHEFFIELD | "residence near 80 Hoyle Street" (`1619542`) | ❌ No | Pin: `(53.388049, -1.478951)`<br>OSM: `(53.388387, -1.479566)` | 80 Hoyle Street, Sheffield S3 7LG, United Kingdom |
| **55.1 m** | CA/VANCOUVER | "5775 Hampton Pl" (`1632564`) | ❌ No | Pin: `(49.258179, -123.23592)`<br>OSM: `(49.257705, -123.236139)` | 5775 Hampton Place, Vancouver, British Columbia V6T 2G6 |
| **55.1 m** | DE/HAMBURG | "Sander Damm" (`1666342`) | ❌ No | Pin: `(53.489623, 10.202079)`<br>OSM: `(53.489962, 10.201472)` | Sander Damm, Hamburg, Freie und Hansestadt Hamburg 21031 |
| **54.8 m** | AU/NEWCASTLE | "Entire Place·3B1B···10 Macquarie Street, Boolaroo" (`1518452`) | ❌ No | Pin: `(-32.951789, 151.618906)`<br>OSM: `(-32.952233, 151.619159)` | 10 Macquarie Street, Boolaroo, Newcastle, New South Wales 2284 |
| **54.8 m** | FR/PARIS | "PARIS 11e·15m²·F1·Studio·With furniture" (`1655258`) | ❌ No | Pin: `(48.857807, 2.380051)`<br>OSM: `(48.857707, 2.379319)` | 75011 Paris, Paris, ile-de-france 75011 |
| **54.8 m** | UK/GLASGOW | "The Bonnie" (`1652661`) | ❌ No | Pin: `(55.865466, -4.284773)`<br>OSM: `(55.865915, -4.284411)` | 923 Sauchiehall Street, Glasgow G3 7TF, United Kingdom |
| **54.6 m** | UK/GLASGOW | "Middleton Street, Cessnock/Ibrox, GLASGOW, G51" (`1566191`) | ❌ No | Pin: `(55.852662, -4.2974)`<br>OSM: `(55.852644, -4.296527)` | 91 Middleton St, Glasgow G51 1AF, United Kingdom |
| **54.6 m** | UK/SHEFFIELD | "Royal Plaza B" (`1623234`) | ❌ No | Pin: `(53.380005, -1.477798)`<br>OSM: `(53.379589, -1.478233)` | 2 Westfield terrace, Sheffield S1 4GG, United Kingdom |
| **54.3 m** | AU/ADELAIDE | "188 Carrington Street" (`1683072`) | ❌ No | Pin: `(-34.931013, 138.607345)`<br>OSM: `(-34.931491, 138.607229)` | 188 Carrington Street, Adelaide, South Australia 5000 |
| **54.3 m** | UK/EDINBURGH | "Mayfield Residences" (`1518159`) | ❌ No | Pin: `(55.920707, -3.17043)`<br>OSM: `(55.920872, -3.169610)` | 224 Mayfield Road, Edinburgh EH9 3BE, United Kingdom |
| **54.1 m** | US/SAN-DIEGO | "Lucera Complex" (`1709790`) | ❌ No | Pin: `(32.86422, -117.200698)`<br>OSM: `(32.864492, -117.200218)` | 7181 Shoreline Drive, San Diego, California 92122 |
| **54 m** | AU/MELBOURNE | "6/9 Railway Parade,Murrumbeena,Victoria 3163" (`1567059`) | ❌ No | Pin: `(-37.890987, 145.067892)`<br>OSM: `(-37.890609, 145.068277)` | 9 Railway, Melbourne, Victoria 3163 |
| **54 m** | AU/SYDNEY | "503/3 Cary Street,Drummoyne,New South Wales 2047" (`1567250`) | ❌ No | Pin: `(-33.917437, 151.149544)`<br>OSM: `(-33.917888, 151.149330)` | 3 Cary Street, Sydney, New South Wales 2047 |
| **54 m** | US/URBANA-CHAMPAIGN | "Legacy202" (`1556592`) | ❌ No | Pin: `(40.108248, -88.236608)`<br>OSM: `(40.108733, -88.236618)` | 202 East Daniel Street, Champaign, Illinois 61820 |
| **53.9 m** | US/NEW-YORK | "40 Waterside Plaza" (`1710556`) | ✅ Yes | Pin: `(40.737793, -73.973625)`<br>OSM: `(40.737385, -73.973280)` | 40 Waterside Plaza, New York, New York 10010 |
| **53.8 m** | UK/MANCHESTER | "Dwell Manchester Student Village" (`17432`) | ✅ Yes | Pin: `(53.471797, -2.242006)`<br>OSM: `(53.472037, -2.242711)` | Lower Chatham Street, Manchester M1 5SX, United Kingdom |
| **53.7 m** | UK/COVENTRY | "Shared Place·4B4B··1·11A Lower Ford Street" (`789544`) | ❌ No | Pin: `(52.409091, -1.502518)`<br>OSM: `(52.409563, -1.502360)` | 11A Lower Ford Street, Coventry CV1 5PS, United Kingdom |
| **53.5 m** | AU/CANBERRA | "66 Allara St" (`1686974`) | ❌ No | Pin: `(-35.285207, 149.13098)`<br>OSM: `(-35.285309, 149.130405)` | 66 Allara St, Canberra, Canberra, ACT 2601 |
| **53.3 m** | AU/MELBOURNE | "4 Park Drive, Maribyrnong" (`1567954`) | ❌ No | Pin: `(-37.762964, 144.886123)`<br>OSM: `(-37.763223, 144.885614)` | 4 Park Dr, Melbourne, Victoria 3032 |
| **53.3 m** | AU/SYDNEY | "31/654 King Street,Newtown,New South Wales 2042" (`1567166`) | ❌ No | Pin: `(-33.868894, 151.2023)`<br>OSM: `(-33.868416, 151.202313)` | 654 King Street, Sydney, New South Wales 2043 |
| **53.3 m** | AU/SYDNEY | "12/1-3 Oxford Street,Epping,New South Wales 2121" (`1567280`) | ❌ No | Pin: `(-33.969681, 151.078632)`<br>OSM: `(-33.969202, 151.078632)` | 1-3 Oxford Street, Sydney, New South Wales 2121 |
| **53.3 m** | US/LOS-ANGELES | "Beaudry" (`1670981`) | ✅ Yes | Pin: `(34.049548, -118.261845)`<br>OSM: `(34.049123, -118.262112)` | 960 West 7th Street, Los Angeles, California 90017 |
| **53.3 m** | US/PHILADELPHIA | "Kardon Atlantic Apartments" (`1481549`) | ❌ No | Pin: `(39.979351, -75.15066)`<br>OSM: `(39.979668, -75.150191)` | 1801 North 10th Street, Philadelphia, Pennsylvania 19122 |
| **53.2 m** | UK/SHEFFIELD | "residence near Rhodes Street" (`1644763`) | ❌ No | Pin: `(53.379327, -1.457105)`<br>OSM: `(53.379287, -1.456307)` | Rhodes Street, Sheffield S2 5DT, United Kingdom |
| **53.2 m** | UK/SHEFFIELD | "Bailey Fields" (`674747`) | ❌ No | Pin: `(53.382457, -1.476874)`<br>OSM: `(53.382338, -1.476098)` | 4 Rockingham Street, Sheffield S1 4LZ, United Kingdom |
| **53.2 m** | US/LOS-ANGELES | "Circa" (`1414754`) | ✅ Yes | Pin: `(34.040953, -118.266722)`<br>OSM: `(34.041359, -118.266418)` | 1200 South Figueroa Street, Los Angeles, California 90015 |
| **53.1 m** | AU/MELBOURNE | "407/1 Elland Avenue, Box Hill" (`1567935`) | ❌ No | Pin: `(-37.817135, 145.123381)`<br>OSM: `(-37.816659, 145.123413)` | Apartment 407/1 Elland Ave, Melbourne, Victoria 3128 |
| **53.1 m** | US/BOSTON | "723: Dorchester" (`1656465`) | ❌ No | Pin: `(42.326296, -71.057004)`<br>OSM: `(42.326715, -71.056695)` | 723 Dorchester Avenue, Boston, Massachusetts 02127 |
| **53 m** | UK/LONDON | "Kingston Plaza" (`19556`) | ✅ Yes | Pin: `(51.412812, -0.288471)`<br>OSM: `(51.412392, -0.288832)` | 180-190 London Road, London KT2 6QW, United Kingdom |
| **52.9 m** | US/ATLANTA | "Catalyst Midtown" (`1664160`) | ✅ Yes | Pin: `(33.782943, -84.407206)`<br>OSM: `(33.782474, -84.407110)` | 1011 Northside Drive Northwest, Atlanta, Georgia 30318 |
| **52.8 m** | US/ANN-ARBOR | "The Yard" (`1492650`) | ❌ No | Pin: `(42.273331, -83.748622)`<br>OSM: `(42.273803, -83.748674)` | 615 South Main Street, Ann Arbor, Michigan 48104 |
| **52.7 m** | AU/CANBERRA | "81 Cooyong St" (`1682434`) | ❌ No | Pin: `(-35.280182, 149.136203)`<br>OSM: `(-35.279739, 149.136405)` | 8 81 Cooyong St, Reid, Canberra, ACT 2601 |
| **52.7 m** | DE/BERLIN | "3 Zimmer Wohnung in Berlin" (`1592447`) | ❌ No | Pin: `(52.54794, 13.42829)`<br>OSM: `(52.547577, 13.427790)` | Erich-Weinert-Straße, Berlin, Berlin 10439 |
| **52.7 m** | UK/LEICESTERSHIRE | "iQ Opal Court" (`1511698`) | ❌ No | Pin: `(52.625556, -1.1275)`<br>OSM: `(52.625435, -1.128255)` | 60 Lancaster Road, Leicester LE1 7HA, United Kingdom |
| **52.6 m** | AU/BRISBANE | "Ozihouse Homestay in Brisbane" (`1655663`) | ❌ No | Pin: `(-27.49767, 153.012866)`<br>OSM: `(-27.498128, 153.012734)` | brisbane, Brisbane, Queensland 4072 |
| **52.6 m** | DE/HAMBURG | "THE FIZZ Hamburg Altona" (`1522709`) | ✅ Yes | Pin: `(53.563508, 9.944873)`<br>OSM: `(53.563542, 9.944079)` | Kieler Str. 3, Hamburg, Freie und Hansestadt Hamburg 22769 |
| **52.6 m** | UK/LIVERPOOL | "87 Bagot Street, L15" (`1654312`) | ✅ Yes | Pin: `(53.397329, -2.934238)`<br>OSM: `(53.397780, -2.933999)` | 87 Bagot St, Liverpool L15 0HT, United Kingdom |
| **52.4 m** | UK/SHEFFIELD | "Soho Yard" (`1715160`) | ❌ No | Pin: `(53.387198, -1.468226)`<br>OSM: `(53.387611, -1.468606)` | 6 Soho Yard, Sheffield S3 8GY, United Kingdom |
| **52.3 m** | DE/HAMBURG | "Feldstraße" (`1666334`) | ❌ No | Pin: `(53.577664, 9.72793)`<br>OSM: `(53.577422, 9.727251)` | Feldstraße 120, Hamburg, Freie und Hansestadt Hamburg 22880 |
| **52.3 m** | US/URBANA-CHAMPAIGN | "202 E Chalmers St, Champaign, IL 61820" (`1562629`) | ❌ No | Pin: `(40.107017, -88.236751)`<br>OSM: `(40.106799, -88.237295)` | 202 East Chalmers Street, Champaign, Illinois 61820 |
| **52.2 m** | AU/MELBOURNE | "9 Renver Road" (`1665517`) | ❌ No | Pin: `(-37.9176, 145.143215)`<br>OSM: `(-37.917155, 145.143028)` | 9 Renver Road, Melbourne, Victoria 3168 |
| **52.2 m** | AU/SYDNEY | "5 Crescent St" (`1655098`) | ✅ Yes | Pin: `(-33.89759, 151.214198)`<br>OSM: `(-33.897694, 151.213647)` | 5 Crescent St, Waterloo, Sydney, New South Wales 2017 |
| **52.2 m** | FR/BORDEAUX | "Les Académies des Bassins" (`1419943`) | ❌ No | Pin: `(44.869131, -0.555995)`<br>OSM: `(44.869530, -0.555647)` | 30 Cours Henri Brunet, Bordeaux, Gironde 33300 |
| **52 m** | DE/BERLIN | "Apartment in Friedrichshain, Berlin" (`1603951`) | ❌ No | Pin: `(52.51525, 13.4733)`<br>OSM: `(52.515245, 13.474068)` | Pettenkoferstraße, Berlin, Berlin 10247 |
| **51.9 m** | DE/FRANKFURT-AM-MAIN | "Gervinusstraße" (`1587743`) | ❌ No | Pin: `(50.122158, 8.67338)`<br>OSM: `(50.122502, 8.672889)` | Gervinusstraße, Frankfurt am Main, Hessen 60322 |
| **51.9 m** | UK/BIRMINGHAM | "Entire Place·4B2.5B···320 Harborne Park Road, B17 0NE" (`1473038`) | ❌ No | Pin: `(52.450088, -1.951027)`<br>OSM: `(52.449650, -1.950763)` | 320 Harborne Park Road, Birmingham B17 0NE, United Kingdom |
| **51.9 m** | UK/EDINBURGH | "Vita Student Fountainbridge" (`683739`) | ✅ Yes | Pin: `(55.94332, -3.207927)`<br>OSM: `(55.942897, -3.207577)` | 125a Fountainbridge, Tollcross, Edinburgh EH3 9QG, United Kingdom |
| **51.7 m** | FR/TOULOUSE | "Kley Toulouse" (`782498`) | ❌ No | Pin: `(43.564064, 1.489881)`<br>OSM: `(43.564510, 1.490059)` | 2 rue René Cornemont, Toulouse, Haute-Garonne 31400 |
| **51.5 m** | UK/PORTSMOUTH | "Entire Place·2B2B···5 Centurion Court" (`1472559`) | ❌ No | Pin: `(50.79487, -1.106977)`<br>OSM: `(50.795133, -1.106375)` | 5 Centurion Court, Portsmouth PO1 3BQ, United Kingdom |
| **51.2 m** | AU/SYDNEY | "8/96 Tenterden Road,Botany,New South Wales 2019" (`1567120`) | ❌ No | Pin: `(-33.945377, 151.202162)`<br>OSM: `(-33.945047, 151.202547)` | 96 Tenterden Road, Sydney, New South Wales 2019 |
| **51.1 m** | UK/LEICESTERSHIRE | "Albion Court" (`587272`) | ❌ No | Pin: `(52.626303, -1.147729)`<br>OSM: `(52.626014, -1.147142)` | 131 Western Road, Leicester LE3 0GF, United Kingdom |
| **51.1 m** | UK/LONDON | "Lit South Bermondsey" (`1624642`) | ❌ No | Pin: `(51.479495, -0.053902)`<br>OSM: `(51.479375, -0.053191)` | 349 Ilderton Road, London SE15 1NW, United Kingdom |
| **51.1 m** | UK/LONDON | "YourTRIBE South Bermondsey" (`1578648`) | ❌ No | Pin: `(51.479495, -0.053902)`<br>OSM: `(51.479375, -0.053191)` | YourTRIBE South Bermondsey, London SE15 1NW, United Kingdom |
| **51.1 m** | UK/SHEFFIELD | "Eyewitness" (`1710729`) | ❌ No | Pin: `(53.375747, -1.479039)`<br>OSM: `(53.375469, -1.479652)` | 14 Thomas Street, Sheffield S3 7LQ, United Kingdom |
| **51 m** | FR/PARIS | "residence near Rue Marcel Paul" (`1581957`) | ❌ No | Pin: `(48.790584, 2.355866)`<br>OSM: `(48.790965, 2.355481)` | Rue Marcel Paul, Paris, ile-de-france 94800 |
| **50.8 m** | CA/EDMONTON | "2-3 Bed Duplexes in Paisley" (`1615045`) | ❌ No | Pin: `(53.413751, -113.556109)`<br>OSM: `(53.413528, -113.556777)` | 545-563  Paterson Way SW, Edmonton, Alberta T6W 2X1 |
| **50.8 m** | DE/HAMBURG | "Charming single bedroom in a 3-bedroom apartment in Stellingen" (`1685988`) | ❌ No | Pin: `(53.592184, 9.928615)`<br>OSM: `(53.592557, 9.929057)` | Kieler Straße, Hamburg, Freie und Hansestadt Hamburg 22769 |
| **50.7 m** | AU/PERTH | "Murdoch University Village" (`648453`) | ✅ Yes | Pin: `(-32.068882, 115.83026)`<br>OSM: `(-32.068721, 115.829758)` | 90 South Street Murdoch, Perth, Western Australia 6150 |
| **50.7 m** | UK/GLASGOW | "Hayburn Street, G11 6DE" (`1575263`) | ❌ No | Pin: `(55.869358, -4.310833)`<br>OSM: `(55.869728, -4.310359)` | Hayburn St, Glasgow G11 6DE, United Kingdom |
| **50.7 m** | UK/LIVERPOOL | "47 Woodcroft Road, L15" (`1645132`) | ✅ Yes | Pin: `(53.395713, -2.93601)`<br>OSM: `(53.395283, -2.936265)` | 47 Woodcroft Rd, Liverpool L15 2HG, United Kingdom |
| **50.6 m** | CA/TORONTO | "Studio 2(30 Nelson)" (`1469570`) | ✅ Yes | Pin: `(43.649063, -79.388658)`<br>OSM: `(43.649283, -79.388108)` | 30 Nelson St, Toronto, Ontario M5V 0H5 |
| **50.6 m** | UK/NOTTINGHAM | "Radford Bridge Road" (`1713925`) | ❌ No | Pin: `(52.958165, -1.194445)`<br>OSM: `(52.958533, -1.194890)` | Radford Bridge Road, Nottingham NG8, United Kingdom |
| **50.5 m** | AU/MELBOURNE | "25 O'Sullivan Road,Glen Waverley,Victoria 3150" (`1567069`) | ❌ No | Pin: `(-37.878553, 145.165533)`<br>OSM: `(-37.879000, 145.165432)` | 25 O'Sullivan, Melbourne, Victoria 3150 |
| **50.5 m** | CA/LONDON | "271 Platts Lane" (`1430882`) | ❌ No | Pin: `(42.992606, -81.272652)`<br>OSM: `(42.992347, -81.272142)` | 271 Platts Lane, London, Ontario N6G 3H1 |
| **50.5 m** | UK/SHEFFIELD | "Thomas Street 29876#" (`1714648`) | ❌ No | Pin: `(53.37654, -1.47849)`<br>OSM: `(53.376778, -1.479137)` | 6 Egerton Cl, Sheffield City Centre, United Kingdom |
| **50.5 m** | UK/SHEFFIELD | "Thomas Street 29878#" (`1714942`) | ❌ No | Pin: `(53.37654, -1.47849)`<br>OSM: `(53.376778, -1.479137)` | 6 Egerton Cl, Sheffield City Centre, United Kingdom |
| **50.5 m** | UK/SHEFFIELD | "Thomas Street 29875#" (`1714965`) | ❌ No | Pin: `(53.37654, -1.47849)`<br>OSM: `(53.376778, -1.479137)` | 6 Egerton Cl, Sheffield City Centre, United Kingdom |
| **50.5 m** | UK/SHEFFIELD | "Thomas Street 29877#" (`1714964`) | ❌ No | Pin: `(53.37654, -1.47849)`<br>OSM: `(53.376778, -1.479137)` | 6 Egerton Cl, Sheffield City Centre, United Kingdom |
| **50.5 m** | UK/SHEFFIELD | "Steelworks" (`1504216`) | ❌ No | Pin: `(53.382437, -1.47684)`<br>OSM: `(53.382338, -1.476098)` | 29 Rockingham St, Sheffield S1 4WB, United Kingdom |
| **50.4 m** | CA/TORONTO | "Entire Place·2B1B···1 Yonge St" (`1551910`) | ✅ Yes | Pin: `(43.642925, -79.374186)`<br>OSM: `(43.642475, -79.374261)` | 1 Yonge St, Toronto, Ontario ON M5E 1E5 |
| **50.4 m** | US/BOSTON | "The Laurent" (`1574109`) | ❌ No | Pin: `(42.390896, -71.144759)`<br>OSM: `(42.391348, -71.144799)` | 55 Wheeler Street, Boston, Massachusetts 02138 |
| **50.2 m** | UK/CARDIFF | "Anchor Works" (`1687360`) | ❌ No | Pin: `(51.46934, -3.172983)`<br>OSM: `(51.469299, -3.172262)` | Dumballs Road, Cardiff CF10 5FF, United Kingdom |
| **50 m** | UK/NOTTINGHAM | "Avalon Court Nottingham" (`1710768`) | ❌ No | Pin: `(52.956161, -1.145229)`<br>OSM: `(52.956585, -1.145478)` | Glasshouse Street, Nottingham NG1 3LP, United Kingdom |
| **50 m** | US/LOS-ANGELES | "2488 Sawtelle Blvd" (`1564414`) | ❌ No | Pin: `(34.033157, -118.436671)`<br>OSM: `(34.032872, -118.437090)` | 2488 Sawtelle Boulevard #202, Los Angeles, California 90064 |
