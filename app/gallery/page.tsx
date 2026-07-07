export const dynamic = 'force-dynamic';

import { eq } from 'drizzle-orm';
import type { Metadata } from 'next';
import { db } from '@/lib/db';
import { trips } from '@/lib/db/schema';

export const metadata: Metadata = {
  title: 'Gallery — Our Wanderings',
  description: 'Photos from all our travels, organised by region.',
  openGraph: { title: 'Gallery — Our Wanderings', description: 'Photos from all our travels, organised by region.' },
};
import GalleryGrid, { type GalleryPhoto, type GalleryGroup } from '@/components/GalleryGrid';

async function getGalleryGroups(): Promise<GalleryGroup[]> {
  const tripsWithPhotos = await db.query.trips.findMany({
    where: eq(trips.published, true),
    with: {
      photos: { orderBy: (p, { asc }) => [asc(p.sortOrder)] },
    },
    orderBy: (t, { asc }) => [asc(t.region), asc(t.year)],
  });

  // Flatten photos with trip metadata
  const allPhotos: GalleryPhoto[] = tripsWithPhotos.flatMap((trip) =>
    trip.photos.map((photo) => ({
      id: photo.id,
      url: photo.url,
      caption: photo.caption,
      tripTitle: trip.title,
      tripSlug: trip.slug,
      region: trip.region,
    }))
  );

  // Group by region, preserving order
  const map = new Map<string, GalleryPhoto[]>();
  for (const photo of allPhotos) {
    if (!map.has(photo.region)) map.set(photo.region, []);
    map.get(photo.region)!.push(photo);
  }

  return Array.from(map.entries()).map(([region, photos]) => ({ region, photos }));
}

export default async function GalleryPage() {
  const groups = await getGalleryGroups();
  const totalPhotos = groups.reduce((n, g) => n + g.photos.length, 0);

  return (
    <main className="max-w-6xl mx-auto px-6 py-14">
      <header className="mb-12">
        <p className="font-lato text-xs uppercase tracking-[0.3em] text-muted">Collection</p>
        <h1 className="font-playfair text-4xl md:text-5xl text-ink mt-2">Gallery</h1>
        {totalPhotos > 0 && (
          <p className="font-lato text-muted mt-2 text-base">
            {totalPhotos} photo{totalPhotos !== 1 ? 's' : ''} across{' '}
            {groups.length} region{groups.length !== 1 ? 's' : ''}
          </p>
        )}
      </header>

      {totalPhotos === 0 ? (
        <p className="font-lato text-muted text-center py-20">No photos yet.</p>
      ) : (
        <GalleryGrid groups={groups} />
      )}
    </main>
  );
}
