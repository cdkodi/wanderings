import Link from 'next/link';
import { db } from '@/lib/db';
import { trips } from '@/lib/db/schema';
import { desc } from 'drizzle-orm';
import DeleteTripButton from '@/components/DeleteTripButton';

export default async function AdminDashboard() {
  const allTrips = await db.select().from(trips).orderBy(desc(trips.createdAt));

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-playfair text-2xl text-ink">Trips</h1>
        <Link
          href="/admin/trips/new"
          className="bg-accent text-white font-lato text-sm tracking-wide px-4 py-2 rounded-lg hover:bg-accent/90 transition-colors"
        >
          + New Trip
        </Link>
      </div>

      {allTrips.length === 0 ? (
        <p className="font-lato text-sm text-muted py-12 text-center">No trips yet. Add your first one!</p>
      ) : (
        <div className="space-y-3">
          {allTrips.map((trip) => (
            <div
              key={trip.id}
              className="bg-white rounded-xl border border-pale px-5 py-4 flex items-center justify-between gap-4"
            >
              <div className="flex items-center gap-3 min-w-0">
                <span className="text-xl">{trip.emoji ?? '✈️'}</span>
                <div className="min-w-0">
                  <p className="font-playfair text-ink text-base truncate">{trip.title}</p>
                  <p className="font-lato text-xs text-muted tracking-wide">
                    {trip.country} · {trip.month} {trip.year}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3 shrink-0">
                <span
                  className={`font-lato text-xs px-2.5 py-1 rounded-full tracking-wide ${
                    trip.published
                      ? 'bg-green-100 text-green-700'
                      : 'bg-yellow-100 text-yellow-700'
                  }`}
                >
                  {trip.published ? 'Published' : 'Draft'}
                </span>
                <Link
                  href={`/trips/${trip.slug}`}
                  target="_blank"
                  className="font-lato text-xs text-accent2 hover:underline tracking-wide"
                >
                  View
                </Link>
                <Link
                  href={`/admin/trips/${trip.slug}/edit`}
                  className="font-lato text-xs text-accent hover:underline tracking-wide"
                >
                  Edit
                </Link>
                <DeleteTripButton slug={trip.slug} title={trip.title} />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
