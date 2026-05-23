import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

type AmenityFeature = {
  properties?: {
    category?: string;
    name?: string;
  };
} & Record<string, unknown>;

function isSportsFieldName(name: string): boolean {
  return /(pitch|playing field|sports ground|football|rugby|cricket|astroturf|athletic|track|tennis)/i.test(name);
}

function normalizeAmenityCategory(feature: AmenityFeature): string | undefined {
  const category = feature.properties?.category;
  if (!category) return undefined;

  if (category === 'University') return undefined;

  if (category === 'Sports Field') return 'Sports Pitch';
  if (category === 'Park' && isSportsFieldName(feature.properties?.name ?? '')) return 'Sports Pitch';

  return category;
}

function getAmenityFilePaths(): string[] {
  const dataDir = path.join(process.cwd(), 'public', 'data');
  if (!fs.existsSync(dataDir)) return [];

  const nestedPaths: string[] = [];
  const legacyPaths: string[] = [];
  const entries = fs.readdirSync(dataDir, { withFileTypes: true });

  for (const entry of entries) {
    if (entry.isFile() && entry.name.endsWith('_amenities.json')) {
      legacyPaths.push(path.join(dataDir, entry.name));
      continue;
    }

    if (!entry.isDirectory()) continue;

    const countryDir = path.join(dataDir, entry.name);
    const cityEntries = fs.readdirSync(countryDir, { withFileTypes: true });
    for (const cityEntry of cityEntries) {
      if (!cityEntry.isDirectory()) continue;
      const amenitiesPath = path.join(countryDir, cityEntry.name, 'amenities.json');
      if (fs.existsSync(amenitiesPath)) {
        nestedPaths.push(amenitiesPath);
      }
    }
  }

  return [...nestedPaths, ...legacyPaths];
}

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const amenityFiles = getAmenityFilePaths();
    let propertyAmenities = null;

    for (const amenityPath of amenityFiles) {
      try {
        const data = JSON.parse(fs.readFileSync(amenityPath, 'utf8'));
        if (data[id]) {
          propertyAmenities = data[id];
          break;
        }
      } catch {
        continue;
      }
    }

    if (!propertyAmenities) {
      return NextResponse.json({ 
        features: [],
        summary: {}
      });
    }

    const normalizedFeatures: AmenityFeature[] = (propertyAmenities.features && Array.isArray(propertyAmenities.features))
      ? propertyAmenities.features
          .map((feature: AmenityFeature): AmenityFeature | null => {
            const normalizedCategory = normalizeAmenityCategory(feature);
            if (!normalizedCategory) return null;

            return {
              ...feature,
              properties: {
                ...feature.properties,
                category: normalizedCategory,
              },
            };
          })
            .filter((feature: AmenityFeature | null): feature is AmenityFeature => feature !== null)
      : [];

    // Calculate summary statistics
    const summary: Record<string, number> = {};
    if (normalizedFeatures.length > 0) {
      normalizedFeatures.forEach((feature: { properties?: { category?: string } }) => {
        const category = feature.properties?.category;
        if (category) {
          summary[category] = (summary[category] || 0) + 1;
        }
      });
    }

    return NextResponse.json({
      name: propertyAmenities.name,
      features: normalizedFeatures,
      summary
    });
  } catch (error) {
    console.error('Error fetching amenities:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
