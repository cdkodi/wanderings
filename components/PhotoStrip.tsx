'use client';

import { useState } from 'react';
import Image from 'next/image';
import type { Photo } from '@/lib/db/schema';
import { optimizedImageUrl } from '@/lib/utils';
import Lightbox from './Lightbox';

export default function PhotoStrip({ photos }: { photos: Photo[] }) {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  if (photos.length === 0) return null;

  const lbPhotos = photos.map((p) => ({ url: p.url ?? '', caption: p.caption }));

  return (
    <>
      <div className="flex gap-4 overflow-x-auto pb-4 snap-x snap-mandatory scrollbar-hide -mx-6 px-6">
        {photos.map((photo, i) => (
          <button
            key={photo.id}
            onClick={() => setLightboxIndex(i)}
            className="relative shrink-0 w-72 aspect-[4/3] rounded-xl overflow-hidden snap-start bg-pale group cursor-zoom-in"
          >
            {photo.url ? (
              <Image
                src={optimizedImageUrl(photo.url, 800)}
                alt={photo.caption ?? ''}
                fill
                sizes="288px"
                className="object-cover transition-transform duration-300 group-hover:scale-105"
              />
            ) : null}
            {photo.caption && (
              <div className="absolute bottom-0 inset-x-0 bg-ink/60 text-sand text-xs font-lato px-3 py-2 leading-snug">
                {photo.caption}
              </div>
            )}
          </button>
        ))}
      </div>

      {lightboxIndex !== null && (
        <Lightbox
          photos={lbPhotos}
          index={lightboxIndex}
          onClose={() => setLightboxIndex(null)}
          onNext={() => setLightboxIndex((lightboxIndex + 1) % photos.length)}
          onPrev={() =>
            setLightboxIndex((lightboxIndex - 1 + photos.length) % photos.length)
          }
        />
      )}
    </>
  );
}
