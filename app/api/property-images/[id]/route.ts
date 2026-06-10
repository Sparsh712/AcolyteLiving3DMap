import { NextRequest, NextResponse } from 'next/server';

const BASE_URL = 'https://acolyteliving.com/properties';
const ALLOWED_COUNTRIES = new Set(['uk', 'us', 'au', 'de', 'es', 'fr']);
const ALLOWED_CITIES = new Set([
  'manchester',
  'london',
  'coventry',
  'nottingham',
  'birmingham',
  'aberdeen',
  'bath',
  'belfast',
  'brighton',
  'bristol',
  'canterbury',
  'cardiff',
  'colchester',
  'dundee',
  'durham',
  'edinburgh',
  'exeter',
  'glasgow',
  'guildford',
  'lancaster',
  'leeds',
  'liverpool',
  'loughborough',
  'norwich',
  'portsmouth',
  'reading',
  'sheffield',
  'southampton',
  'st-andrews',
  'swansea',
  'york',
  'melbourne',
  'adelaide',
  'brisbane',
  'canberra',
  'gold-coast',
  'newcastle',
  'perth',
  'sydney',
  // New US Cities
  'boston',
  'los-angeles',
  'tempe',
  'richardson',
  'urbana-champaign',
  'pittsburgh',
  'west-lafayette',
  'berkeley',
  'ann-arbor',
  'college-station',
  'atlanta',
  'philadelphia',
  'san-diego',
  'raleigh',
  'buffalo',
  'arlington',
  'new-york',
  // DE (Germany) Cities
  'munchen',
  'aachen',
  'berlin',
  'stuttgart',
  'bonn',
  'freiburg',
  'hamburg',
  'frankfurt-am-main',
  'darmstadt',
  'mannheim',
  'hannover',
  'koln',
  'dortmund',
  'essen',
  'potsdam',
  // FR (France) Cities
  'fontainebleau',
  'cergy',
  'lille',
  'reims',
  'bordeaux',
  'paris',
  'lyon',
  'grenoble',
  'toulouse',
  'nantes',
  'nancy',
  // ES (Spain) Cities
  'madrid',
  'barcelona',
  'pamplona',
]);

/**
 * GET /api/property-images/[id]
 * Server-side fetches the Acolyte Living property page, extracts image URLs
 * from og:image tags, standard <img> sources, and Next.js image blobs,
 * and returns them as a JSON array.
 */
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  if (!id) {
    return NextResponse.json({ images: [] }, { status: 400 });
  }
  const countryParam = req.nextUrl.searchParams.get('country')?.toLowerCase() ?? '';
  const cityParam = req.nextUrl.searchParams.get('city')?.toLowerCase() ?? '';
  if (!countryParam || !cityParam) {
    return NextResponse.json({ images: [], error: 'Missing country or city query param.' }, { status: 400 });
  }
  if (!ALLOWED_COUNTRIES.has(countryParam) || !ALLOWED_CITIES.has(cityParam)) {
    return NextResponse.json({ images: [], error: 'Invalid country or city.' }, { status: 400 });
  }
  const country = countryParam;
  const city = cityParam;
  const url = `${BASE_URL}/${country}/${city}/apartments-${id}`;

  try {
    const res = await fetch(url, {
      headers: {
        'User-Agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 ' +
          '(KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
        Accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
        'Accept-Language': 'en-GB,en;q=0.9',
        Referer: 'https://acolyteliving.com/',
      },
      next: { revalidate: 3600 }, // cache per-property for 1 h
    });

    if (!res.ok) {
      return NextResponse.json({ images: [], error: `HTTP ${res.status}` });
    }

    const html = await res.text();
    const images: string[] = [];

    // ── 1. og:image meta tags (highest quality) ────────────────────────────
    const ogRe = /<meta[^>]+property=["']og:image["'][^>]+content=["']([^"']+)["']/gi;
    let m: RegExpExecArray | null;
    while ((m = ogRe.exec(html)) !== null) {
      const src = m[1];
      if (src && !images.includes(src)) images.push(src);
    }

    // ── 2. JSON-LD / __NEXT_DATA__ image arrays ────────────────────────────
    const jsonDataRe = /<script[^>]*id="__NEXT_DATA__"[^>]*>([\s\S]*?)<\/script>/i;
    const jsonMatch = jsonDataRe.exec(html);
    if (jsonMatch) {
      try {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const walk = (obj: any) => {
          if (!obj || typeof obj !== 'object') return;
          if (Array.isArray(obj)) { obj.forEach(walk); return; }
          for (const [k, v] of Object.entries(obj)) {
            if (
              (k === 'url' || k === 'src' || k === 'image' || k === 'photo') &&
              typeof v === 'string' &&
              /\.(jpg|jpeg|webp|png)/i.test(v) &&
              !images.includes(v)
            ) {
              images.push(v);
            }
            walk(v);
          }
        };
        walk(JSON.parse(jsonMatch[1]));
      } catch { /* ignore parse errors */ }
    }

    // ── 3. <img> tags with sizeable dimension hints or known CDN patterns ──
    const imgRe = /<img[^>]+src=["']([^"']+)["'][^>]*>/gi;
    while ((m = imgRe.exec(html)) !== null) {
      const src = m[1];
      if (
        src &&
        !src.startsWith('data:') &&
        /\.(jpg|jpeg|webp|png)/i.test(src) &&
        !images.includes(src) &&
        // exclude tiny icons / logos
        !src.includes('logo') &&
        !src.includes('icon') &&
        !src.includes('favicon') &&
        !src.includes('sprite')
      ) {
        images.push(src.startsWith('http') ? src : `https://acolyteliving.com${src}`);
      }
    }

    // ── 4. srcset parsing for Next.js image URLs ───────────────────────────
    const srcsetRe = /srcset=["']([^"']+)["']/gi;
    while ((m = srcsetRe.exec(html)) !== null) {
      const parts = m[1].split(',').map((s) => s.trim().split(/\s+/)[0]);
      for (const src of parts) {
        if (
          src &&
          !src.startsWith('data:') &&
          /\.(jpg|jpeg|webp|png)/i.test(src) &&
          !images.includes(src) &&
          !src.includes('logo') &&
          !src.includes('icon')
        ) {
          images.push(src.startsWith('http') ? src : `https://acolyteliving.com${src}`);
        }
      }
    }

    // Deduplicate and cap
    const unique = [...new Set(images)].slice(0, 12);
    return NextResponse.json({ images: unique });
  } catch (err) {
    return NextResponse.json({ images: [], error: String(err) });
  }
}
