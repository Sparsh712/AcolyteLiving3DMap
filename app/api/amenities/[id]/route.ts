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

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const manchesterPath = path.join(process.cwd(), 'public', 'data', 'manchester_amenities.json');
    const londonPath = path.join(process.cwd(), 'public', 'data', 'london_amenities.json');
    const coventryPath = path.join(process.cwd(), 'public', 'data', 'coventry_amenities.json');
    const nottinghamPath = path.join(process.cwd(), 'public', 'data', 'nottingham_amenities.json');
    
    let propertyAmenities = null;

    if (fs.existsSync(manchesterPath)) {
      const data = JSON.parse(fs.readFileSync(manchesterPath, 'utf8'));
      if (data[id]) {
        propertyAmenities = data[id];
      }
    }

    if (!propertyAmenities && fs.existsSync(londonPath)) {
      const data = JSON.parse(fs.readFileSync(londonPath, 'utf8'));
      if (data[id]) {
        propertyAmenities = data[id];
      }
    }

    if (!propertyAmenities && fs.existsSync(coventryPath)) {
      const data = JSON.parse(fs.readFileSync(coventryPath, 'utf8'));
      if (data[id]) {
        propertyAmenities = data[id];
      }
    }

    if (!propertyAmenities && fs.existsSync(nottinghamPath)) {
      const data = JSON.parse(fs.readFileSync(nottinghamPath, 'utf8'));
      if (data[id]) {
        propertyAmenities = data[id];
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
