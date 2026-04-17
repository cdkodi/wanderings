import { db } from '@/lib/db';
import { trips, photos } from '@/lib/db/schema';
import { asc, eq } from 'drizzle-orm';
import Image from 'next/image';
import PhotoUploader from '@/components/PhotoUploader';
import DeletePhotoButton from '@/components/DeletePhotoButton';
import EditCaptionForm from '@/components/EditCaptionForm';

export default async function AdminPhotosPage() {
  const allTrips = await db.select({ id: trips.id, title: trips.title }).from(trips).orderBy(asc(trips.title));

  const allPhotos = await db
    .select({
      id: photos.id,
      tripId: photos.tripId,
      cloudinaryId: photos.cloudinaryId,
      url: photos.url,
      caption: photos.caption,
      sortOrder: photos.sortOrder,
      tripTitle: trips.title,
    })
    .from(photos)
    .innerJoin(trips, eq(photos.tripId, trips.id))
    .orderBy(asc(trips.title), asc(photos.sortOrder));

  // Group by trip
  const byTrip = new Map<string, typeof allPhotos>();
  for (const photo of allPhotos) {
    const key = photo.tripTitle;
    if (!byTrip.has(key)) byTrip.set(key, []);
    byTrip.get(key)!.push(photo);
  }

  return (
    <div className="space-y-8">
      <h1 className="font-playfair text-2xl text-ink">Photos</h1>

      <PhotoUploader trips={allTrips} />

      {byTrip.size === 0 ? (
        <p className="font-lato text-sm text-muted py-8 text-center">No photos yet.</p>
      ) : (
        Array.from(byTrip.entries()).map(([tripTitle, tripPhotos]) => (
          <section key={tripTitle}>
            <h2 className="font-playfair text-lg text-ink mb-3">{tripTitle}</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {tripPhotos.map((photo) => (
                <div key={photo.id} className="bg-white rounded-xl border border-pale overflow-hidden">
                  {photo.url ? (
                    <div className="relative aspect-square bg-pale">
                      <Image
                        src={photo.url}
                        alt={photo.caption ?? ''}
                        fill
                        className="object-cover"
                        sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                      />
                    </div>
                  ) : (
                    <div className="aspect-square bg-pale flex items-center justify-center text-muted font-lato text-xs">
                      No image
                    </div>
                  )}
                  <div className="p-3 space-y-2">
                    <EditCaptionForm photoId={photo.id} initialCaption={photo.caption ?? ''} />
                    <DeletePhotoButton photoId={photo.id} />
                  </div>
                </div>
              ))}
            </div>
          </section>
        ))
      )}
    </div>
  );
}
