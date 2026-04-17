'use client';

import { useEffect, useCallback } from 'react';
import Image from 'next/image';

type LightboxPhoto = {
  url: string;
  caption?: string | null;
  tripTitle?: string;
};

type Props = {
  photos: LightboxPhoto[];
  index: number;
  onClose: () => void;
  onNext: () => void;
  onPrev: () => void;
};

export default function Lightbox({ photos, index, onClose, onNext, onPrev }: Props) {
  const photo = photos[index];

  const handleKey = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowRight') onNext();
      if (e.key === 'ArrowLeft') onPrev();
    },
    [onClose, onNext, onPrev]
  );

  useEffect(() => {
    document.addEventListener('keydown', handleKey);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', handleKey);
      document.body.style.overflow = '';
    };
  }, [handleKey]);

  if (!photo) return null;

  return (
    <div
      className="fixed inset-0 z-50 bg-ink/95 flex items-center justify-center"
      onClick={onClose}
    >
      {/* Image + caption */}
      <div
        className="relative max-w-5xl w-full mx-4"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="relative w-full aspect-[4/3]">
          <Image
            src={photo.url}
            alt={photo.caption ?? ''}
            fill
            sizes="(max-width: 768px) 100vw, 80vw"
            className="object-contain"
            priority
          />
        </div>

        {(photo.caption || photo.tripTitle) && (
          <div className="mt-3 text-center space-y-0.5">
            {photo.caption && (
              <p className="text-sand font-lato text-sm">{photo.caption}</p>
            )}
            {photo.tripTitle && (
              <p className="text-muted font-lato text-xs">{photo.tripTitle}</p>
            )}
          </div>
        )}
      </div>

      {/* Close button */}
      <button
        className="absolute top-4 right-5 text-sand/60 hover:text-sand text-4xl font-thin leading-none transition-colors"
        onClick={onClose}
        aria-label="Close"
      >
        ×
      </button>

      {/* Prev / Next */}
      {photos.length > 1 && (
        <>
          <button
            className="absolute left-4 top-1/2 -translate-y-1/2 text-sand/50 hover:text-sand text-5xl font-thin leading-none transition-colors px-2"
            onClick={(e) => { e.stopPropagation(); onPrev(); }}
            aria-label="Previous photo"
          >
            ‹
          </button>
          <button
            className="absolute right-4 top-1/2 -translate-y-1/2 text-sand/50 hover:text-sand text-5xl font-thin leading-none transition-colors px-2"
            onClick={(e) => { e.stopPropagation(); onNext(); }}
            aria-label="Next photo"
          >
            ›
          </button>
        </>
      )}

      {/* Counter */}
      {photos.length > 1 && (
        <p className="absolute bottom-5 left-1/2 -translate-x-1/2 text-sand/40 font-lato text-xs tabular-nums">
          {index + 1} / {photos.length}
        </p>
      )}
    </div>
  );
}
