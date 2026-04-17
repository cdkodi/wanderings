import { notFound } from 'next/navigation';
import { db } from '@/lib/db';
import { trips, stays, activities } from '@/lib/db/schema';
import { eq, asc } from 'drizzle-orm';
import AdminTripForm from '@/components/AdminTripForm';

interface Props {
  params: { slug: string };
}

export default async function EditTripPage({ params }: Props) {
  const trip = await db.query.trips.findFirst({ where: eq(trips.slug, params.slug) });
  if (!trip) notFound();

  const tripStays = await db.select().from(stays).where(eq(stays.tripId, trip.id)).orderBy(asc(stays.sortOrder));
  const tripActivities = await db.select().from(activities).where(eq(activities.tripId, trip.id)).orderBy(asc(activities.sortOrder));

  return (
    <div>
      <h1 className="font-playfair text-2xl text-ink mb-6">Edit: {trip.title}</h1>
      <AdminTripForm trip={{ ...trip, stays: tripStays, activities: tripActivities }} />
    </div>
  );
}
