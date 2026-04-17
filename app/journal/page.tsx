import type { Metadata } from 'next';
import { db } from '@/lib/db';

export const metadata: Metadata = {
  title: 'Journal — Our Wanderings',
  description: 'All our trips, told as stories. Newest first.',
  openGraph: { title: 'Journal — Our Wanderings', description: 'All our trips, told as stories. Newest first.' },
};
import { trips, photos } from '@/lib/db/schema';
import { eq, count } from 'drizzle-orm';
import JournalEntry from '@/components/JournalEntry';

async function getJournalTrips() {
  const tripsWithCount = await db
    .select({
      id: trips.id,
      slug: trips.slug,
      title: trips.title,
      country: trips.country,
      region: trips.region,
      year: trips.year,
      month: trips.month,
      duration: trips.duration,
      travelWith: trips.travelWith,
      story: trips.story,
      tips: trips.tips,
      emoji: trips.emoji,
      coverImageUrl: trips.coverImageUrl,
      published: trips.published,
      createdAt: trips.createdAt,
      updatedAt: trips.updatedAt,
      photoCount: count(photos.id),
    })
    .from(trips)
    .leftJoin(photos, eq(photos.tripId, trips.id))
    .where(eq(trips.published, true))
    .groupBy(trips.id)
    .orderBy(trips.year);

  // Sort newest first after groupBy
  return tripsWithCount.sort((a, b) => b.year - a.year || b.month.localeCompare(a.month));
}

export default async function JournalPage() {
  const allTrips = await getJournalTrips();

  return (
    <main className="max-w-4xl mx-auto px-6 py-14">
      <header className="mb-12">
        <p className="font-lato text-xs uppercase tracking-[0.3em] text-muted">Reading view</p>
        <h1 className="font-playfair text-4xl md:text-5xl text-ink mt-2">Journal</h1>
        {allTrips.length > 0 && (
          <p className="font-lato text-muted mt-2 text-base">
            {allTrips.length} trip{allTrips.length !== 1 ? 's' : ''}, newest first
          </p>
        )}
      </header>

      {allTrips.length === 0 ? (
        <p className="font-lato text-muted text-center py-20">No trips published yet.</p>
      ) : (
        <div>
          {allTrips.map((trip) => (
            <JournalEntry key={trip.id} trip={trip} />
          ))}
        </div>
      )}
    </main>
  );
}
