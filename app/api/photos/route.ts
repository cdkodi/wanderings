import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { db } from '@/lib/db';
import { photos } from '@/lib/db/schema';
import { eq, max } from 'drizzle-orm';

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { tripId, cloudinaryId, url, caption, takenAt } = await request.json();

  if (!tripId || !cloudinaryId || !url) {
    return NextResponse.json({ error: 'tripId, cloudinaryId, and url are required' }, { status: 400 });
  }

  // Append at end of trip's photo list
  const result = await db
    .select({ maxOrder: max(photos.sortOrder) })
    .from(photos)
    .where(eq(photos.tripId, tripId));
  const nextOrder = (result[0]?.maxOrder ?? -1) + 1;

  const [photo] = await db
    .insert(photos)
    .values({ tripId, cloudinaryId, url, caption, takenAt, sortOrder: nextOrder })
    .returning();

  return NextResponse.json(photo, { status: 201 });
}
