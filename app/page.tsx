export const dynamic = 'force-dynamic';

import { db } from '@/lib/db';
import { trips, photos } from '@/lib/db/schema';
import { eq, count, countDistinct, min, max } from 'drizzle-orm';
import TripCard from '@/components/TripCard';

async function getStats() {
  const [tripStats] = await db
    .select({
      tripCount: count(trips.id),
      countryCount: countDistinct(trips.country),
      minYear: min(trips.year),
      maxYear: max(trips.year),
    })
    .from(trips)
    .where(eq(trips.published, true));

  const [photoStats] = await db
    .select({ photoCount: count(photos.id) })
    .from(photos)
    .innerJoin(trips, eq(photos.tripId, trips.id))
    .where(eq(trips.published, true));

  const yearRange =
    tripStats.minYear === tripStats.maxYear
      ? String(tripStats.minYear ?? '—')
      : `${tripStats.minYear ?? '—'}–${tripStats.maxYear ?? '—'}`;

  return {
    tripCount: tripStats.tripCount,
    countryCount: tripStats.countryCount,
    photoCount: photoStats.photoCount,
    yearRange,
  };
}

async function getTrips() {
  return db.query.trips.findMany({
    where: eq(trips.published, true),
    orderBy: (t, { desc }) => [desc(t.year)],
    with: { photos: true },
  });
}

function Stat({ value, label }: { value: number | string; label: string }) {
  return (
    <div>
      <p className="font-playfair text-4xl md:text-5xl text-accent leading-none tabular-nums">
        {value}
      </p>
      <p className="text-xs uppercase tracking-[0.2em] text-muted mt-2 font-lato">
        {label}
      </p>
    </div>
  );
}

export default async function HomePage() {
  const [stats, allTrips] = await Promise.all([getStats(), getTrips()]);

  return (
    <main>
      {/* ── Hero ── */}
      <section className="bg-sand px-6 py-24 md:py-36">
        <div className="max-w-5xl mx-auto">
          <p className="font-lato text-xs uppercase tracking-[0.35em] text-muted">
            A Personal Travel Journal
          </p>

          <h1 className="font-playfair text-[clamp(3.5rem,10vw,7.5rem)] text-ink leading-[1.02] mt-5">
            Our<br />
            Wanderings
          </h1>

          <p className="font-lato text-lg md:text-xl text-muted mt-6 max-w-md">
            Every journey, remembered. Places collected, stories kept.
          </p>

          {/* Stats row */}
          <div className="mt-14 pt-10 border-t border-muted/25 grid grid-cols-2 sm:grid-cols-4 gap-8 sm:gap-0 sm:divide-x sm:divide-muted/25">
            <div className="sm:pr-10">
              <Stat value={stats.tripCount} label="Trips" />
            </div>
            <div className="sm:px-10">
              <Stat value={stats.countryCount} label="Countries" />
            </div>
            <div className="sm:px-10">
              <Stat value={stats.photoCount} label="Photos" />
            </div>
            <div className="sm:pl-10">
              <Stat value={stats.yearRange} label="Explored" />
            </div>
          </div>
        </div>
      </section>

      {/* ── Trip grid ── */}
      <section className="bg-pale px-6 py-16 md:py-20">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-baseline justify-between mb-10">
            <h2 className="font-playfair text-3xl md:text-4xl text-ink">
              All Journeys
            </h2>
            <p className="font-lato text-sm text-muted hidden sm:block">
              {allTrips.length} trip{allTrips.length !== 1 ? 's' : ''}
            </p>
          </div>

          {allTrips.length === 0 ? (
            <p className="font-lato text-muted text-center py-20">
              No trips published yet.
            </p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 items-start">
              {allTrips.map((trip) => (
                <TripCard
                  key={trip.id}
                  trip={trip}
                  photoCount={trip.photos.length}
                />
              ))}
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
