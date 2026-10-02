#!/usr/bin/env node
/**
 * Data Processing Script
 * Run with: npx tsx scripts/process-data.ts
 *
 * Converts raw city exports into compact property, amenities, and
 * building-footprint JSON files used by the 3D map.
 */

import { readFileSync, writeFileSync, mkdirSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const ROOT = join(__dirname, '..');

interface RawHouse {
  house_id: string;
  title: string;
  lat: string;
  lng: string;
  rent_amount_value: string;
  rent_amount_abbr: string;
  address: string;
  school_name: string;
  school_distance: string;
  review_avg_score: string | null;
  about: string | null;
  media_updated_images: string[] | null;
  media_image_paths?: string | null;
  house_url: string;
  total_floor: string;
  bed_num: string;
  supplier_name?: string;
  room_types?: string;
  near_by_location_json?: string | null;
}

interface CleanProperty {
  id: string;
  name: string;
  lat: number;
  lng: number;
  price: number;
  currency: string;
  address: string;
  university: string;
  distance: number;
  rating: number | null;
  about: string;
  images: string[];
  houseUrl: string;
  operator: string;
  floors: number;
  beds: number;
  roomTypes: string;
}

interface CityConfig {
  name: string;
  country: string;
  city: string;
  inputFile: string;
  outputProperties?: string;
  outputAmenities?: string;
  outputBuildings?: string;
}

interface NearByItem {
  title?: string;
  name?: string;
  distance?: number;
  location?: {
    lat?: number;
    lng?: number;
  };
}

interface NearByGroup {
  name?: string;
  type?: string;
  items?: NearByItem[];
}

interface AmenityFeature {
  type: 'Feature';
  properties: {
    name: string;
    category: string;
    height: number;
    base_height: number;
    distance_m?: number;
    osm_id: string | number;
  };
  geometry: GeoJSON.Polygon;
}

interface BuildingRecord {
  geometry: GeoJSON.Polygon;
  height: number;
  osmId: number;
  name?: string;
}

type BuildingCache = Record<string, BuildingRecord>;

const cityConfigs: CityConfig[] = [
  //   {
  //     name: 'Manchester',
  //     country: 'uk',
  //     city: 'manchester',
  //     inputFile: 'Manchester All Data.json',
  //     outputProperties: 'properties.json',
  //   },
  //   {
  //     name: 'London',
  //     country: 'uk',
  //     city: 'london',
  //     inputFile: 'london All Data.json',
  //     outputProperties: 'properties.json',
  //   },
  //   {
  //     name: 'Coventry',
  //     country: 'uk',
  //     city: 'coventry',
  //     inputFile: 'coventry_properties_data.json',
  //     outputProperties: 'properties.json',
  //   },
  //   {
  //     name: 'Nottingham',
  //     country: 'uk',
  //     city: 'nottingham',
  //     inputFile: 'nottingham_Properties_Data (1).json',
  //     outputProperties: 'properties.json',
  //   },
  //   {
  //     name: 'Birmingham',
  //     country: 'uk',
  //     city: 'birmingham',
  //     inputFile: 'Birmingham UK All Data.json',
  //     outputProperties: 'properties.json',
  //   },
  //   {
  //     name: 'Birmingham',
  //     country: 'us',
  //     city: 'birmingham',
  //     inputFile: 'full json/Birmingham US All Data.json',
  //     outputProperties: 'properties.json',
  //   },

  //   {
  //   name: 'Aberdeen UK',
  //   country: 'uk',
  //   city: 'aberdeen',
  //   inputFile: 'full json/Aberdeen UK All Data.json',
  //   outputProperties: 'properties.json',
  // },

  // {
  //   name: 'Bath UK',
  //   country: 'uk',
  //   city: 'bath',
  //   inputFile: 'full json/Bath UK All Data.json',
  //   outputProperties: 'properties.json',
  // },

  // {
  //   name: 'Belfast UK',
  //   country: 'uk',
  //   city: 'belfast',
  //   inputFile: 'full json/Belfast UK All Data.json',
  //   outputProperties: 'properties.json',
  // },

  // {
  //   name: 'Brighton UK',
  //   country: 'uk',
  //   city: 'brighton',
  //   inputFile: 'full json/Brighton UK All Data.json',
  //   outputProperties: 'properties.json',
  // },

  // {
  //   name: 'Bristol UK',
  //   country: 'uk',
  //   city: 'bristol',
  //   inputFile: 'full json/Bristol UK All Data.json',
  //   outputProperties: 'properties.json',
  // },

  // {
  //   name: 'Canterbury UK',
  //   country: 'uk',
  //   city: 'canterbury',
  //   inputFile: 'full json/Canterbury UK All Data.json',
  //   outputProperties: 'properties.json',
  // },

  // {
  //   name: 'Cardiff UK',
  //   country: 'uk',
  //   city: 'cardiff',
  //   inputFile: 'full json/Cardiff UK All Data.json',
  //   outputProperties: 'properties.json',
  // },

  // {
  //   name: 'Colchester UK',
  //   country: 'uk',
  //   city: 'colchester',
  //   inputFile: 'full json/Colchester UK All Data.json',
  //   outputProperties: 'properties.json',
  // },

  // {
  //   name: 'Dundee UK',
  //   country: 'uk',
  //   city: 'dundee',
  //   inputFile: 'full json/Dundee UK All Data.json',
  //   outputProperties: 'properties.json',
  // },

  // {
  //   name: 'Durham UK',
  //   country: 'uk',
  //   city: 'durham',
  //   inputFile: 'full json/Durham UK All Data.json',
  //   outputProperties: 'properties.json',
  // },

  // {
  //   name: 'Durham US',
  //   country: 'us',
  //   city: 'durham',
  //   inputFile: 'full json/Durham US All Data.json',
  //   outputProperties: 'properties.json',
  // },

  // {
  //   name: 'Edinburgh UK',
  //   country: 'uk',
  //   city: 'edinburgh',
  //   inputFile: 'full json/Edinburgh UK All Data.json',
  //   outputProperties: 'properties.json',
  // },

  // {
  //   name: 'Exeter UK',
  //   country: 'uk',
  //   city: 'exeter',
  //   inputFile: 'full json/Exeter UK All Data.json',
  //   outputProperties: 'properties.json',
  // },

  // {
  //   name: 'Glasgow UK',
  //   country: 'uk',
  //   city: 'glasgow',
  //   inputFile: 'full json/Glasgow UK All Data.json',
  //   outputProperties: 'properties.json',
  // },

  // {
  //   name: 'Guildford UK',
  //   country: 'uk',
  //   city: 'guildford',
  //   inputFile: 'full json/Guildford UK All Data.json',
  //   outputProperties: 'properties.json',
  // },

  // {
  //   name: 'Lancaster UK',
  //   country: 'uk',
  //   city: 'lancaster',
  //   inputFile: 'full json/Lancaster UK All Data.json',
  //   outputProperties: 'properties.json',
  // },

  // {
  //   name: 'Leeds UK',
  //   country: 'uk',
  //   city: 'leeds',
  //   inputFile: 'full json/Leeds UK All Data.json',
  //   outputProperties: 'properties.json',
  // },

  // {
  //   name: 'Liverpool UK',
  //   country: 'uk',
  //   city: 'liverpool',
  //   inputFile: 'full json/Liverpool UK All Data.json',
  //   outputProperties: 'properties.json',
  // },

  // {
  //   name: 'Loughborough UK',
  //   country: 'uk',
  //   city: 'loughborough',
  //   inputFile: 'full json/Loughborough UK All Data.json',
  //   outputProperties: 'properties.json',
  // },

  // {
  //   name: 'Norwich UK',
  //   country: 'uk',
  //   city: 'norwich',
  //   inputFile: 'full json/Norwich UK All Data.json',
  //   outputProperties: 'properties.json',
  // },

  // {
  //   name: 'Portsmouth UK',
  //   country: 'uk',
  //   city: 'portsmouth',
  //   inputFile: 'full json/Portsmouth UK All Data.json',
  //   outputProperties: 'properties.json',
  // },

  // {
  //   name: 'Reading UK',
  //   country: 'uk',
  //   city: 'reading',
  //   inputFile: 'full json/Reading UK All Data.json',
  //   outputProperties: 'properties.json',
  // },

  // {
  //   name: 'Sheffield UK',
  //   country: 'uk',
  //   city: 'sheffield',
  //   inputFile: 'full json/Sheffield UK All Data.json',
  //   outputProperties: 'properties.json',
  // },

  // {
  //   name: 'Southampton UK',
  //   country: 'uk',
  //   city: 'southampton',
  //   inputFile: 'full json/Southampton UK All Data.json',
  //   outputProperties: 'properties.json',
  // },

  // {
  //   name: 'St Andrews UK',
  //   country: 'uk',
  //   city: 'st-andrews',
  //   inputFile: 'full json/St Andrews UK All Data.json',
  //   outputProperties: 'properties.json',
  // },

  // {
  //   name: 'Swansea UK',
  //   country: 'uk',
  //   city: 'swansea',
  //   inputFile: 'full json/Swansea UK All Data.json',
  //   outputProperties: 'properties.json',
  // },

  // {
  //   name: 'York UK',
  //   country: 'uk',
  //   city: 'york',
  //   inputFile: 'full json/York UK All Data.json',
  //   outputProperties: 'properties.json',
  // },

  // {
  //   name: 'Melbourne AU',
  //   country: 'au',
  //   city: 'melbourne',
  //   inputFile: 'full json/Melbourne AU All Data.json',
  //   outputProperties: 'properties.json',
  // },

  // {
  //   name: 'Sydney AU',
  //   country: 'au',
  //   city: 'sydney',
  //   inputFile: 'full json/Sydney AU All Data.json',
  //   outputProperties: 'properties.json',
  // },

  // {
  //   name: 'Brisbane AU',
  //   country: 'au',
  //   city: 'brisbane',
  //   inputFile: 'full json/Brisbane AU All Data.json',
  //   outputProperties: 'properties.json',
  // },

  // {
  //   name: 'Perth AU',
  //   country: 'au',
  //   city: 'perth',
  //   inputFile: 'full json/Perth AU All Data.json',
  //   outputProperties: 'properties.json',
  // },

  // {
  //   name: 'Canberra AU',
  //   country: 'au',
  //   city: 'canberra',
  //   inputFile: 'full json/Canberra AU All Data.json',
  //   outputProperties: 'properties.json',
  // },

  // {
  //   name: 'Adelaide AU',
  //   country: 'au',
  //   city: 'adelaide',
  //   inputFile: 'full json/Adelaide AU All Data.json',
  //   outputProperties: 'properties.json',
  // },

  // {
  //   name: 'Gold Coast AU',
  //   country: 'au',
  //   city: 'gold-coast',
  //   inputFile: 'full json/Gold Coast AU All Data.json',
  //   outputProperties: 'properties.json',
  // },

  // {
  //   name: 'Newcastle AU',
  //   country: 'au',
  //   city: 'newcastle',
  //   inputFile: 'full json/Newcastle AU All Data.json',
  //   outputProperties: 'properties.json',
  // },

  // {
  //   name: 'Boston US',
  //   country: 'us',
  //   city: 'boston',
  //   inputFile: 'full json/Boston US All Data.json',
  //   outputProperties: 'properties.json',
  // },

  // {
  //   name: 'Los Angeles US',
  //   country: 'us',
  //   city: 'los-angeles',
  //   inputFile: 'full json/Los Angeles US All Data.json',
  //   outputProperties: 'properties.json',
  // },

  // {
  //   name: 'Tempe US',
  //   country: 'us',
  //   city: 'tempe',
  //   inputFile: 'full json/Tempe US All Data.json',
  //   outputProperties: 'properties.json',
  // },

  // {
  //   name: 'Richardson US',
  //   country: 'us',
  //   city: 'richardson',
  //   inputFile: 'full json/Richardson US All Data.json',
  //   outputProperties: 'properties.json',
  // },

  // {
  //   name: 'Urbana Champaign US',
  //   country: 'us',
  //   city: 'urbana-champaign',
  //   inputFile: 'full json/Urbana Champaign US All Data.json',
  //   outputProperties: 'properties.json',
  // },

  // {
  //   name: 'Pittsburgh US',
  //   country: 'us',
  //   city: 'pittsburgh',
  //   inputFile: 'full json/Pittsburgh US All Data.json',
  //   outputProperties: 'properties.json',
  // },

  // {
  //   name: 'West Lafayette US',
  //   country: 'us',
  //   city: 'west-lafayette',
  //   inputFile: 'full json/West Lafayette US All Data.json',
  //   outputProperties: 'properties.json',
  // },

  // {
  //   name: 'Berkeley US',
  //   country: 'us',
  //   city: 'berkeley',
  //   inputFile: 'full json/Berkeley US All Data.json',
  //   outputProperties: 'properties.json',
  // },

  // {
  //   name: 'Ann Arbor US',
  //   country: 'us',
  //   city: 'ann-arbor',
  //   inputFile: 'full json/Ann Arbor US All Data.json',
  //   outputProperties: 'properties.json',
  // },

  // {
  //   name: 'College Station US',
  //   country: 'us',
  //   city: 'college-station',
  //   inputFile: 'full json/College Station US All Data.json',
  //   outputProperties: 'properties.json',
  // },

  // {
  //   name: 'Atlanta US',
  //   country: 'us',
  //   city: 'atlanta',
  //   inputFile: 'full json/Atlanta US All Data.json',
  //   outputProperties: 'properties.json',
  // },

  // {
  //   name: 'Philadelphia US',
  //   country: 'us',
  //   city: 'philadelphia',
  //   inputFile: 'full json/Philadelphia US All Data.json',
  //   outputProperties: 'properties.json',
  // },

  // {
  //   name: 'San Diego US',
  //   country: 'us',
  //   city: 'san-diego',
  //   inputFile: 'full json/San Diego US All Data.json',
  //   outputProperties: 'properties.json',
  // },

  // {
  //   name: 'Raleigh US',
  //   country: 'us',
  //   city: 'raleigh',
  //   inputFile: 'full json/Raleigh US All Data.json',
  //   outputProperties: 'properties.json',
  // },

  // {
  //   name: 'Buffalo US',
  //   country: 'us',
  //   city: 'buffalo',
  //   inputFile: 'full json/Buffalo US All Data.json',
  //   outputProperties: 'properties.json',
  // },

  // {
  //   name: 'Arlington US',
  //   country: 'us',
  //   city: 'arlington',
  //   inputFile: 'full json/Arlington US All Data.json',
  //   outputProperties: 'properties.json',
  // },

  // {
  //   name: 'New York US',
  //   country: 'us',
  //   city: 'new-york',
  //   inputFile: 'full json/New York US All Data.json',
  //   outputProperties: 'properties.json',
  // },

  // {
  //   name: 'Munchen DE',
  //   country: 'de',
  //   city: 'munchen',
  //   inputFile: 'full json/Munchen DE All Data.json',
  //   outputProperties: 'properties.json',
  // },

  // {
  //   name: 'Aachen DE',
  //   country: 'de',
  //   city: 'aachen',
  //   inputFile: 'full json/Aachen DE All Data.json',
  //   outputProperties: 'properties.json',
  // },

  // {
  //   name: 'Berlin DE',
  //   country: 'de',
  //   city: 'berlin',
  //   inputFile: 'full json/Berlin DE All Data.json',
  //   outputProperties: 'properties.json',
  // },

  // {
  //   name: 'Stuttgart DE',
  //   country: 'de',
  //   city: 'stuttgart',
  //   inputFile: 'full json/Stuttgart DE All Data.json',
  //   outputProperties: 'properties.json',
  // },

  // {
  //   name: 'Bonn DE',
  //   country: 'de',
  //   city: 'bonn',
  //   inputFile: 'full json/Bonn DE All Data.json',
  //   outputProperties: 'properties.json',
  // },

  // {
  //   name: 'Freiburg DE',
  //   country: 'de',
  //   city: 'freiburg',
  //   inputFile: 'full json/Freiburg DE All Data.json',
  //   outputProperties: 'properties.json',
  // },

  // {
  //   name: 'Hamburg DE',
  //   country: 'de',
  //   city: 'hamburg',
  //   inputFile: 'full json/Hamburg DE All Data.json',
  //   outputProperties: 'properties.json',
  // },

  // {
  //   name: 'Frankfurt Am Main DE',
  //   country: 'de',
  //   city: 'frankfurt-am-main',
  //   inputFile: 'full json/Frankfurt Am Main DE All Data.json',
  //   outputProperties: 'properties.json',
  // },

  // {
  //   name: 'Darmstadt DE',
  //   country: 'de',
  //   city: 'darmstadt',
  //   inputFile: 'full json/Darmstadt DE All Data.json',
  //   outputProperties: 'properties.json',
  // },

  // {
  //   name: 'Mannheim DE',
  //   country: 'de',
  //   city: 'mannheim',
  //   inputFile: 'full json/Mannheim DE All Data.json',
  //   outputProperties: 'properties.json',
  // },

  // {
  //   name: 'Hannover DE',
  //   country: 'de',
  //   city: 'hannover',
  //   inputFile: 'full json/Hannover DE All Data.json',
  //   outputProperties: 'properties.json',
  // },

  // {
  //   name: 'Koln DE',
  //   country: 'de',
  //   city: 'koln',
  //   inputFile: 'full json/Koln DE All Data.json',
  //   outputProperties: 'properties.json',
  // },

  // {
  //   name: 'Dortmund DE',
  //   country: 'de',
  //   city: 'dortmund',
  //   inputFile: 'full json/Dortmund DE All Data.json',
  //   outputProperties: 'properties.json',
  // },

  // {
  //   name: 'Essen DE',
  //   country: 'de',
  //   city: 'essen',
  //   inputFile: 'full json/Essen DE All Data.json',
  //   outputProperties: 'properties.json',
  // },

  // {
  //   name: 'Potsdam DE',
  //   country: 'de',
  //   city: 'potsdam',
  //   inputFile: 'full json/Potsdam DE All Data.json',
  //   outputProperties: 'properties.json',
  // },

  // {
  //   name: 'Fontainebleau FR',
  //   country: 'fr',
  //   city: 'fontainebleau',
  //   inputFile: 'full json/Fontainebleau FR All Data.json',
  //   outputProperties: 'properties.json',
  // },

  // {
  //   name: 'Cergy FR',
  //   country: 'fr',
  //   city: 'cergy',
  //   inputFile: 'full json/Cergy FR All Data.json',
  //   outputProperties: 'properties.json',
  // },

  // {
  //   name: 'Lille FR',
  //   country: 'fr',
  //   city: 'lille',
  //   inputFile: 'full json/Lille FR All Data.json',
  //   outputProperties: 'properties.json',
  // },

  // {
  //   name: 'Reims FR',
  //   country: 'fr',
  //   city: 'reims',
  //   inputFile: 'full json/Reims FR All Data.json',
  //   outputProperties: 'properties.json',
  // },

  // {
  //   name: 'Bordeaux FR',
  //   country: 'fr',
  //   city: 'bordeaux',
  //   inputFile: 'full json/Bordeaux FR All Data.json',
  //   outputProperties: 'properties.json',
  // },

  // {
  //   name: 'Paris FR',
  //   country: 'fr',
  //   city: 'paris',
  //   inputFile: 'full json/Paris FR All Data.json',
  //   outputProperties: 'properties.json',
  // },

  // {
  //   name: 'Lyon FR',
  //   country: 'fr',
  //   city: 'lyon',
  //   inputFile: 'full json/Lyon FR All Data.json',
  //   outputProperties: 'properties.json',
  // },

  // {
  //   name: 'Grenoble FR',
  //   country: 'fr',
  //   city: 'grenoble',
  //   inputFile: 'full json/Grenoble FR All Data.json',
  //   outputProperties: 'properties.json',
  // },

  // {
  //   name: 'Toulouse FR',
  //   country: 'fr',
  //   city: 'toulouse',
  //   inputFile: 'full json/Toulouse FR All Data.json',
  //   outputProperties: 'properties.json',
  // },

  // {
  //   name: 'Nantes FR',
  //   country: 'fr',
  //   city: 'nantes',
  //   inputFile: 'full json/Nantes FR All Data.json',
  //   outputProperties: 'properties.json',
  // },

  // {
  //   name: 'Nancy FR',
  //   country: 'fr',
  //   city: 'nancy',
  //   inputFile: 'full json/Nancy FR All Data.json',
  //   outputProperties: 'properties.json',
  // },

  // {
  //   name: 'Madrid ES',
  //   country: 'es',
  //   city: 'madrid',
  //   inputFile: 'full json/Madrid ES All Data.json',
  //   outputProperties: 'properties.json',
  // },

  // {
  //   name: 'Barcelona ES',
  //   country: 'es',
  //   city: 'barcelona',
  //   inputFile: 'full json/Barcelona ES All Data.json',
  //   outputProperties: 'properties.json',
  // },

  // {
  //   name: 'Pamplona ES',
  //   country: 'es',
  //   city: 'pamplona',
  //   inputFile: 'full json/Pamplona ES All Data.json',
  //   outputProperties: 'properties.json',
  // },

  {
    name: 'Hertfordshire UK',
    country: 'uk',
    city: 'hertfordshire',
    inputFile: 'full json/Hertfordshire UK All Data.json',
    outputProperties: 'properties.json',
  },

  {
    name: 'Leicestershire UK',
    country: 'uk',
    city: 'leicestershire',
    inputFile: 'full json/Leicestershire UK All Data.json',
    outputProperties: 'properties.json',
  },

  {
    name: 'Newcastle UK',
    country: 'uk',
    city: 'newcastle',
    inputFile: 'full json/Newcastle UK All Data.json',
    outputProperties: 'properties.json',
  },

  {
    name: 'Chicago US',
    country: 'us',
    city: 'chicago',
    inputFile: 'full json/Chicago US All Data.json',
    outputProperties: 'properties.json',
  },

  {
    name: 'Kitchener CA',
    country: 'ca',
    city: 'kitchener',
    inputFile: 'full json/Kitchener CA All Data.json',
    outputProperties: 'properties.json',
  },

  {
    name: 'Toronto CA',
    country: 'ca',
    city: 'toronto',
    inputFile: 'full json/Toronto CA All Data.json',
    outputProperties: 'properties.json',
  },

  {
    name: 'Oakville CA',
    country: 'ca',
    city: 'oakville',
    inputFile: 'full json/Oakville CA All Data.json',
    outputProperties: 'properties.json',
  },

  {
    name: 'London CA',
    country: 'ca',
    city: 'london',
    inputFile: 'full json/London CA All Data.json',
    outputProperties: 'properties.json',
  },

  {
    name: 'Waterloo CA',
    country: 'ca',
    city: 'waterloo',
    inputFile: 'full json/Waterloo CA All Data.json',
    outputProperties: 'properties.json',
  },

  {
    name: 'Vancouver CA',
    country: 'ca',
    city: 'vancouver',
    inputFile: 'full json/Vancouver CA All Data.json',
    outputProperties: 'properties.json',
  },

  {
    name: 'Montreal CA',
    country: 'ca',
    city: 'montreal',
    inputFile: 'full json/Montreal CA All Data.json',
    outputProperties: 'properties.json',
  },

  {
    name: 'Calgary CA',
    country: 'ca',
    city: 'calgary',
    inputFile: 'full json/Calgary CA All Data.json',
    outputProperties: 'properties.json',
  },

  {
    name: 'Ottawa CA',
    country: 'ca',
    city: 'ottawa',
    inputFile: 'full json/Ottawa CA All Data.json',
    outputProperties: 'properties.json',
  },

  {
    name: 'Burnaby CA',
    country: 'ca',
    city: 'burnaby',
    inputFile: 'full json/Burnaby CA All Data.json',
    outputProperties: 'properties.json',
  },

  {
    name: 'Hamilton CA',
    country: 'ca',
    city: 'hamilton',
    inputFile: 'full json/Hamilton CA All Data.json',
    outputProperties: 'properties.json',
  },

  {
    name: 'Edmonton CA',
    country: 'ca',
    city: 'edmonton',
    inputFile: 'full json/Edmonton CA All Data.json',
    outputProperties: 'properties.json',
  },

];

const TYPE_TO_CATEGORY: Record<string, string | null> = {
  bus_station: 'Bus Stop',
  train_station: 'Train Station',
  tram_stop: 'Tram Stop',
  metro_station: 'Metro Station',
  subway_station: 'Metro Station',
  supermarket: 'Supermarket',
  convenience_store: 'Convenience Store',
  shopping_mall: 'Convenience Store',
  shopping_center: 'Convenience Store',
  restaurant: 'Restaurant',
  cafe: 'Cafe',
  bar: 'Bar',
  pub: 'Pub',
  nightclub: 'Nightclub',
  gym: 'Gym',
  fitness: 'Gym',
  park: 'Park',
  library: 'Library',
  pharmacy: 'Pharmacy',
  hospital: 'Hospital',
  church: 'Church',
  school: 'Library',
  bank: null,
  airport: null,
};

function parseRoomTypes(roomTypesStr?: string): string {
  if (!roomTypesStr) return '';
  try {
    const arr = JSON.parse(roomTypesStr);
    if (!Array.isArray(arr)) return '';
    return arr
      .map((item: string | Record<string, unknown>) => {
        try {
          const obj = typeof item === 'string' ? JSON.parse(item) : item;
          return typeof obj?.name === 'string' ? obj.name : '';
        } catch {
          return '';
        }
      })
      .filter(Boolean)
      .join(', ');
  } catch {
    return '';
  }
}

function parseImagePaths(house: RawHouse): string[] {
  if (Array.isArray(house.media_updated_images) && house.media_updated_images.length > 0) {
    return house.media_updated_images.slice(0, 5);
  }

  if (!house.media_image_paths) return [];
  const raw = String(house.media_image_paths);
  const matches = raw.match(/https?:\/\/[^"}]+|image\/[^"}]+/g) ?? [];
  return matches.map(normalizeImageRef).filter(Boolean).slice(0, 5);
}

function normalizeImageRef(value: string): string {
  const trimmed = value.trim();
  if (!trimmed) return '';

  if (/^https?:\/\//i.test(trimmed)) {
    try {
      const url = new URL(trimmed);
      const parts = url.pathname.split('/').filter(Boolean);
      return parts.length > 0 ? parts[parts.length - 1] : trimmed;
    } catch {
      return trimmed;
    }
  }

  return trimmed.replace(/^\/+/, '');
}

function parseNearByLocation(raw?: string | null): NearByGroup[] {
  if (!raw) return [];
  const attempts = [raw, raw.replace(/\\"/g, '"')];

  for (const attempt of attempts) {
    try {
      const parsed = JSON.parse(attempt) as unknown;
      return normalizeNearByParsed(parsed);
    } catch {
      continue;
    }
  }

  return [];
}

function normalizeNearByParsed(parsed: unknown): NearByGroup[] {
  if (!parsed) return [];
  if (Array.isArray(parsed)) {
    return parsed.filter((entry): entry is NearByGroup => isNearByGroup(entry));
  }

  if (typeof parsed === 'object') {
    if (isNearByGroup(parsed)) return [parsed];

    const record = parsed as Record<string, unknown>;
    const groups: NearByGroup[] = [];

    for (const value of Object.values(record)) {
      if (isNearByGroup(value)) {
        groups.push(value);
        continue;
      }
      if (typeof value === 'string') {
        try {
          const nested = JSON.parse(value);
          if (isNearByGroup(nested)) groups.push(nested);
        } catch {
          // ignore
        }
      }
    }

    for (const key of Object.keys(record)) {
      try {
        const nested = JSON.parse(key);
        if (isNearByGroup(nested)) groups.push(nested);
      } catch {
        // ignore
      }
    }

    return groups;
  }

  return [];
}

function isNearByGroup(value: unknown): value is NearByGroup {
  if (!value || typeof value !== 'object') return false;
  const record = value as Record<string, unknown>;
  return 'items' in record || 'type' in record || 'name' in record;
}

function mapNearbyCategory(group: NearByGroup): string | null {
  const type = (group.type ?? '').toLowerCase().replace(/\s+/g, '_');
  if (type in TYPE_TO_CATEGORY) return TYPE_TO_CATEGORY[type] ?? null;

  const name = (group.name ?? '').toLowerCase();
  if (name.includes('cafe')) return 'Cafe';
  if (name.includes('restaurant')) return 'Restaurant';
  if (name.includes('supermarket')) return 'Supermarket';
  if (name.includes('gym') || name.includes('fitness')) return 'Gym';
  if (name.includes('bus')) return 'Bus Stop';
  if (name.includes('train')) return 'Train Station';
  if (name.includes('park')) return 'Park';
  return null;
}

function createSquarePolygon(lat: number, lng: number, sizeMeters = 8): GeoJSON.Polygon {
  const metersPerDegLat = 111_320;
  const metersPerDegLng = 111_320 * Math.cos((lat * Math.PI) / 180);
  const dLat = (sizeMeters / 2) / metersPerDegLat;
  const dLng = (sizeMeters / 2) / metersPerDegLng;

  return {
    type: 'Polygon',
    coordinates: [[
      [lng - dLng, lat - dLat],
      [lng + dLng, lat - dLat],
      [lng + dLng, lat + dLat],
      [lng - dLng, lat + dLat],
      [lng - dLng, lat - dLat],
    ]],
  };
}

function buildAmenityFeatures(groups: NearByGroup[]): AmenityFeature[] {
  const features: AmenityFeature[] = [];
  let counter = 0;

  for (const group of groups) {
    const category = mapNearbyCategory(group);
    if (!category) continue;

    const items = Array.isArray(group.items) ? group.items : [];
    for (const item of items) {
      const lat = item.location?.lat;
      const lng = item.location?.lng;
      if (!Number.isFinite(lat) || !Number.isFinite(lng)) continue;

      const name = item.title || item.name || group.name || 'Amenity';
      features.push({
        type: 'Feature',
        properties: {
          name,
          category,
          height: 6,
          base_height: 0,
          distance_m: item.distance,
          osm_id: `nearby-${counter++}`,
        },
        geometry: createSquarePolygon(lat as number, lng as number),
      });
    }
  }

  return features;
}

/**
 * Fallback rectangular footprint when no OSM polygon is available.
 * At Coventry ~52.4°N: 1 m ≈ 8.983e-6° lat, 1 m ≈ 1.49e-5° lng.
 */
function buildFallbackFootprint(lat: number, lng: number, halfM: number): GeoJSON.Polygon {
  const dLat = halfM * 8.983e-6;
  const dLng = halfM * 1.49e-5;
  return {
    type: 'Polygon',
    coordinates: [[
      [lng - dLng, lat - dLat],
      [lng + dLng, lat - dLat],
      [lng + dLng, lat + dLat],
      [lng - dLng, lat + dLat],
      [lng - dLng, lat - dLat],
    ]],
  };
}

function estimateHeight(property: CleanProperty): number {
  if (property.floors && property.floors > 0) return property.floors * 3.5;
  if (property.price > 280) return 35;
  if (property.price > 200) return 21;
  return 14;
}

function main() {
  console.log('Reading raw JSON files...');

  const outDir = join(ROOT, 'public', 'data');
  mkdirSync(outDir, { recursive: true });

  for (const config of cityConfigs) {
    console.log(`\nProcessing ${config.name}...`);
    const rawPath = join(ROOT, config.inputFile);
    const cityOutDir = join(outDir, config.country, config.city);
    mkdirSync(cityOutDir, { recursive: true });

    let raw: { data?: { houses?: RawHouse[] } } | null = null;
    try {
      raw = JSON.parse(readFileSync(rawPath, 'utf-8'));
    } catch (e) {
      console.error(`  Failed to read or parse ${config.inputFile}:`, e);
      continue;
    }

    const houses: RawHouse[] = raw?.data?.houses ?? [];
    console.log(`  Found ${houses.length} raw entries.`);

    const properties: CleanProperty[] = [];
    const amenities: Record<string, { name: string; features: AmenityFeature[] }> = {};
    let skipped = 0;

    const COORDINATE_OVERRIDES: Record<string, { lat: number; lng: number }> = {
      '1456857': { lat: 34.0456, lng: -118.4616 }, // 11635 Idaho Ave (bad geocode Hanford, CA -> West LA)
      '1587336': { lat: 34.0264, lng: -118.2797 }, // Victory on 28th (bad geocode San Bernardino -> USC)
      '794785': { lat: 40.1063307, lng: -88.2369009 }, // Armory House (us/urbana-champaign)
      '1407103': { lat: 33.9475273, lng: -83.4182926 }, // Georgia Heights (us/atlanta)
      '1494943': { lat: 30.6215729, lng: -96.3461699 }, // The Hudson (us/college-station)
      '1506080': { lat: 43.0629527, lng: -77.6910448 }, // The Feywild (us/new-york)
      '1551989': { lat: -33.8211462, lng: 151.0202678 }, // APX Parramatta (au/sydney)
      '1562800': { lat: 40.1142151, lng: -88.2466921 }, // 302 S. State St Champaign IL (us/urbana-champaign)
      '1562821': { lat: 40.1124409, lng: -88.2469004 }, // 407 S. State St Champaign IL (us/urbana-champaign)
      '1567094': { lat: -33.865875, lng: 151.1292915 }, // 4/26 East Street,Five Dock,New South Wales 2046 (au/sydney)
      '1567128': { lat: -33.7698876, lng: 151.0564046 }, // 2/3 Alexander Street,Coogee,New South Wales 2034 (au/sydney)
      '1567227': { lat: -33.9408479, lng: 151.1459918 }, // 303/116 Princes Highway,Arncliffe,New South Wales 2205 (au/sydney)
      '1567228': { lat: -33.8905693, lng: 151.2027515 }, // 305/35 George Street,Rockdale,New South Wales 2216 (au/sydney)
      '1567236': { lat: -33.907357, lng: 151.1247952 }, // 203/8 Princess Street,BRIGHTON-LE-SANDS,New South Wales 2216 (au/sydney)
      '1567237': { lat: -33.907357, lng: 151.1247952 }, // 408/8 Princess Street,Brighton Le Sands,New South Wales 2216 (au/sydney)
      '1567283': { lat: -33.804542, lng: 151.060209 }, // 1301/2 Chester Street,Epping,New South Wales 2121 (au/sydney)
      '1567948': { lat: -37.6682893, lng: 144.5683151 }, // 3 Park Lane, Mount Helen (au/melbourne)
      '1567953': { lat: -37.9032872, lng: 144.6341361 }, // 1/33 Foster Street, Redan (au/melbourne)
      '1581134': { lat: 42.7348168, lng: -73.6874075 }, // Incite at Troy (us/new-york)
      '1581552': { lat: 48.1404761, lng: 11.5611371 }, // studio near Bahnhofplatz (de/munchen)
      '1641908': { lat: 40.1104719, lng: -88.0393247 }, // 507 S 4th St (us/urbana-champaign)
      '18893': { lat: 33.7889406, lng: -84.4006154 }, // The Flats at Atlantic Station (us/atlanta)
      '1511227': { lat: -33.8138659, lng: 151.1062196 }, // UKO Top Ryde (au/sydney)
      '1518417': { lat: -32.8943379, lng: 151.6921598 }, // Entire Place·6B2B···14 Lee Cres Birmingham Gardens (au/newcastle)
      '1518419': { lat: -32.8935381, lng: 151.6901357 }, // Entire Place·4B1B···25 Fussell St Birmingham Gardens (au/newcastle)
      '1518425': { lat: -32.8940231, lng: 151.6856833 }, // Shared Place·4B2B···4 Englund Street, Birmingham Gardens (au/newcastle)
      '1518426': { lat: -32.8940231, lng: 151.6856833 }, // Entire Place·4B2B···4 Englund Street, Birmingham Gardens (au/newcastle)
      '1518429': { lat: -32.8937307, lng: 151.688179 }, // Entire Place·7B2B···16 Burke Place, BIRMINGHAM GARDENS (au/newcastle)
      '1518430': { lat: -32.896217, lng: 151.6940494 }, // Entire Place·1B1B···28 Moore Street, Birmingham Gardens (au/newcastle)
      '1518453': { lat: -32.9488451, lng: 151.6566295 }, // Entire Place·3B1B···102 Macquarie Road, Cardiff (au/newcastle)
      '1518454': { lat: -32.9609698, lng: 151.6958938 }, // Entire Place·2B2B···Unit 310/ 314-316 Charlestown Road, Charlestown (au/newcastle)
      '1518455': { lat: -32.9311419, lng: 151.7719697 }, // Shared Place·4B3B···330A Darby Street, Cooks Hill (au/newcastle)
      '1518458': { lat: -32.9179734, lng: 151.6770804 }, // Entire Place·3B1B···89A Croudace Road, Elermore Vale (au/newcastle)
      '1518460': { lat: -32.9091997, lng: 151.7349919 }, // Shared Place·4B2B···34 Brett Street, Georgetown (au/newcastle)
      '1518474': { lat: -32.9177733, lng: 151.7044382 }, // Shared Place·5B2B···18 Florida Avenue, Lambton (au/newcastle)
      '1518476': { lat: -32.9019532, lng: 151.7359513 }, // Entire Place·1B1B···58 Sunderland St Mayfield (au/newcastle)
      '1518641': { lat: -32.8826957, lng: 151.6941094 }, // Entire Place·3B1B···9 Mawson Street, SHORTLAND (au/newcastle)
      '1518642': { lat: -32.8849569, lng: 151.691785 }, // Shared Place·7B2B···35 Milne Street, Shortland (au/newcastle)
      '1522433': { lat: 40.3859575, lng: -3.9406309 }, // Coliseo Europea (es/madrid)
      '1551306': { lat: -33.9034651, lng: 151.1425193 }, // Marrickville Road Studios (au/sydney)
      '1560845': { lat: -33.9034651, lng: 151.1425193 }, // 2stay Sydney Homestay (au/sydney)
      '1567097': { lat: -33.9082092, lng: 151.1064412 }, // 2/93-95 Clissold Parade,Campsie,New South Wales 2194 (au/sydney)
      '1567100': { lat: -33.8075161, lng: 151.1822855 }, // 5/156 Hampden Road,Abbotsford,New South Wales 2046 (au/sydney)
      '1567123': { lat: -33.9449138, lng: 151.2495391 }, // 8/88 Duncan Street,Maroubra,New South Wales 2035 (au/sydney)
      '1567125': { lat: -33.9401547, lng: 151.2554043 }, // 2/311-313 Malabar Road,Maroubra,New South Wales 2035 (au/sydney)
      '1567155': { lat: -33.8589477, lng: 151.2033706 }, // 102/39 Kent Road,Mascot,New South Wales 2020 (au/sydney)
      '1567242': { lat: -33.9612634, lng: 151.1561152 }, // 19/134 The Grand Parade,BRIGHTON-LE-SANDS,New South Wales 2216 (au/sydney)
      '1567248': { lat: -33.8556409, lng: 151.154406 }, // 10/38 Tranmere Street,Drummoyne,New South Wales 2047 (au/sydney)
      '1567249': { lat: -33.8784753, lng: 151.104049 }, // 23/280-284 Burwood Road,Belmore,New South Wales 2192 (au/sydney)
      '1567251': { lat: -33.9130231, lng: 151.1170149 }, // 402/680 Canterbury Road,Belmore,New South Wales 2192 (au/sydney)
      '1567904': { lat: -37.7308774, lng: 145.0497667 }, // 5/435 Waterdale Road, Heidelberg West (au/melbourne)
      '1567981': { lat: -37.7773775, lng: 144.9231269 }, // 1882 Mount Macedon Road, Woodend (au/melbourne)
      '1569067': { lat: 40.4469749, lng: -3.7785555 }, // Nido Aravaca (es/madrid)
      '1620878': { lat: 51.6222841, lng: -3.9109795 }, // WERN FAWR ROAD (uk/swansea)
      '1644673': { lat: -32.8966899, lng: 151.7202495 }, // 107 Lorna Street, Waratah West (au/newcastle)
      '1675679': { lat: 41.4858818, lng: 2.1148151 }, // Alba Viu (es/barcelona)
      '1683157': { lat: -34.8658726, lng: 138.7148858 }, // 22B Kirkevue Road (au/adelaide)
      '1688358': { lat: -27.6632337, lng: 153.0270556 }, // 10 Spruce Cct (au/brisbane)
      '1711050': { lat: -27.6586442, lng: 153.0234455 }, // 155 Peverell St (au/brisbane)
      '1712735': { lat: -37.8017381, lng: 144.8840566 }, // West Footscray (au/melbourne)
      '1713610': { lat: 53.4089474, lng: -2.959247 }, // 65 Hall Lane (uk/liverpool)
    };

    for (const h of houses) {
      let lat = parseFloat(h.lat);
      let lng = parseFloat(h.lng);

      const override = COORDINATE_OVERRIDES[h.house_id];
      if (override) {
        lat = override.lat;
        lng = override.lng;
      }

      const price = parseFloat(h.rent_amount_value);

      if (isNaN(lat) || isNaN(lng) || isNaN(price)) {
        skipped++;
        continue;
      }

      const property: CleanProperty = {
        id: String(h.house_id),
        name: h.title?.trim() || 'Unknown Property',
        lat,
        lng,
        price,
        currency: h.rent_amount_abbr || 'GBP',
        address: h.address?.trim() || '',
        university: h.school_name?.trim() || '',
        distance: parseFloat(h.school_distance) || 0,
        rating: h.review_avg_score ? parseFloat(h.review_avg_score) : null,
        about: h.about?.trim() || '',
        images: parseImagePaths(h),
        houseUrl: h.house_url || '',
        operator: h.supplier_name?.trim() || '',
        floors: parseInt(h.total_floor, 10) || 0,
        beds: parseInt(h.bed_num, 10) || 0,
        roomTypes: parseRoomTypes(h.room_types),
      };

      properties.push(property);

      if (config.outputAmenities && h.near_by_location_json) {
        const groups = parseNearByLocation(h.near_by_location_json);
        const features = buildAmenityFeatures(groups);
        if (features.length > 0) {
          amenities[property.id] = {
            name: property.name,
            features,
          };
        }
      }
    }

    console.log(`  Processed: ${properties.length} | Skipped (bad coords): ${skipped}`);

    const propertiesOut = join(cityOutDir, config.outputProperties ?? 'properties.json');
    writeFileSync(propertiesOut, JSON.stringify(properties, null, 2));
    const sizeKB = (Buffer.byteLength(JSON.stringify(properties)) / 1024).toFixed(1);
    console.log(`  Wrote ${propertiesOut} (${sizeKB} KB)`);

    if (config.outputAmenities) {
      const amenitiesOut = join(cityOutDir, config.outputAmenities);
      writeFileSync(amenitiesOut, JSON.stringify(amenities, null, 2));
      console.log(`  Wrote ${amenitiesOut}`);
    }

    if (config.outputBuildings) {
      const buildingCache: BuildingCache = {};
      for (const property of properties) {
        const halfM = property.beds && property.beds > 200 ? 22 : property.beds && property.beds > 50 ? 16 : 12;
        buildingCache[property.id] = {
          geometry: buildFallbackFootprint(property.lat, property.lng, halfM),
          height: estimateHeight(property),
          osmId: 0,
          name: property.name,
        };
      }
      const buildingsOut = join(cityOutDir, config.outputBuildings);
      writeFileSync(buildingsOut, JSON.stringify(buildingCache, null, 2));
      console.log(`  Wrote ${buildingsOut}`);
    }

    const unis = [...new Set(properties.map((p) => p.university).filter(Boolean))].sort();
    console.log(`  Universities (${unis.length}): ${unis.join(', ')}`);
  }
}

main();
