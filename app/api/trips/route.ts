import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { db } from '@/lib/db';
import { trips, stays, activities } from '@/lib/db/schema';
import { slugify } from '@/lib/utils';
import { eq } from 'drizzle-orm';

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const allTrips = await db.query.trips.findMany({
    orderBy: (t, { desc }) => [desc(t.createdAt)],
  });
  return NextResponse.json(allTrips);
}

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const body = await request.json();
  const { staysData, activitiesData, ...tripData } = body;

  // Generate a unique slug
  const baseSlug = slugify(`${tripData.title} ${tripData.year}`);
  let slug = baseSlug;
  let suffix = 2;
  while (true) {
    const existing = await db.query.trips.findFirst({ where: eq(trips.slug, slug) });
    if (!existing) break;
    slug = `${baseSlug}-${suffix++}`;
  }

  const [trip] = await db.insert(trips).values({ ...tripData, slug }).returning();

  if (staysData?.length) {
    await db.insert(stays).values(
      staysData.map((s: { name: string; location: string; description: string }, i: number) => ({
        tripId: trip.id,
        name: s.name,
        location: s.location,
        description: s.description,
        sortOrder: i,
      }))
    );
  }

  if (activitiesData?.length) {
    await db.insert(activities).values(
      activitiesData.map((name: string, i: number) => ({
        tripId: trip.id,
        name,
        sortOrder: i,
      }))
    );
  }

  return NextResponse.json(trip, { status: 201 });
}
