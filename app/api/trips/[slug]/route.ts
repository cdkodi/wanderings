import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { db } from '@/lib/db';
import { trips, stays, activities } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';

export async function PUT(
  request: Request,
  { params }: { params: { slug: string } }
) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const body = await request.json();
  const { staysData, activitiesData, ...tripData } = body;

  const existing = await db.query.trips.findFirst({ where: eq(trips.slug, params.slug) });
  if (!existing) return NextResponse.json({ error: 'Not found' }, { status: 404 });

  const [updated] = await db
    .update(trips)
    .set({ ...tripData, updatedAt: new Date().toISOString() })
    .where(eq(trips.slug, params.slug))
    .returning();

  // Replace stays and activities wholesale
  if (staysData !== undefined) {
    await db.delete(stays).where(eq(stays.tripId, existing.id));
    if (staysData.length) {
      await db.insert(stays).values(
        staysData.map((s: { name: string; location: string; description: string }, i: number) => ({
          tripId: existing.id,
          name: s.name,
          location: s.location,
          description: s.description,
          sortOrder: i,
        }))
      );
    }
  }

  if (activitiesData !== undefined) {
    await db.delete(activities).where(eq(activities.tripId, existing.id));
    if (activitiesData.length) {
      await db.insert(activities).values(
        activitiesData.map((name: string, i: number) => ({
          tripId: existing.id,
          name,
          sortOrder: i,
        }))
      );
    }
  }

  return NextResponse.json(updated);
}

export async function DELETE(
  _request: Request,
  { params }: { params: { slug: string } }
) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const existing = await db.query.trips.findFirst({ where: eq(trips.slug, params.slug) });
  if (!existing) return NextResponse.json({ error: 'Not found' }, { status: 404 });

  await db.delete(trips).where(eq(trips.slug, params.slug));
  return NextResponse.json({ ok: true });
}
