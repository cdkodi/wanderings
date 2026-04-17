import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { db } from '@/lib/db';
import { photos } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import { deleteImage } from '@/lib/cloudinary';

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const id = parseInt(params.id, 10);
  const { caption, sortOrder } = await request.json();

  const existing = await db.query.photos.findFirst({ where: eq(photos.id, id) });
  if (!existing) return NextResponse.json({ error: 'Not found' }, { status: 404 });

  const updates: Partial<{ caption: string; sortOrder: number }> = {};
  if (caption !== undefined) updates.caption = caption;
  if (sortOrder !== undefined) updates.sortOrder = sortOrder;

  const [updated] = await db.update(photos).set(updates).where(eq(photos.id, id)).returning();
  return NextResponse.json(updated);
}

export async function DELETE(
  _request: Request,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const id = parseInt(params.id, 10);
  const existing = await db.query.photos.findFirst({ where: eq(photos.id, id) });
  if (!existing) return NextResponse.json({ error: 'Not found' }, { status: 404 });

  if (existing.cloudinaryId) {
    await deleteImage(existing.cloudinaryId);
  }

  await db.delete(photos).where(eq(photos.id, id));
  return NextResponse.json({ ok: true });
}
