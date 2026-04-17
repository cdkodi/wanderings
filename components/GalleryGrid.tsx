'use client';

import { useState } from 'react';
import Image from 'next/image';
import Lightbox from './Lightbox';

export type GalleryPhoto = {
  id: number;
  url: string | null;
  caption: string | null;
  tripTitle: string;
  tripSlug: string;
  region: string;
};

export type GalleryGroup = {
  region: string;
  photos: GalleryPhoto[];
};

type Props = { groups: GalleryGroup[] };

export default function GalleryGrid({ groups }: Props) {
  const [activeRegion, setActiveRegion] = useState<string>('all');
  const [lightboxPhotos, setLightboxPhotos] = useState<
    { url: string; caption: string | null; tripTitle: string }[]
  >([]);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const visibleGroups =
    activeRegion === 'all' ? groups : groups.filter((g) => g.region === activeRegion);

  const allVisible = visibleGroups.flatMap((g) => g.photos);

  function openLightbox(photo: GalleryPhoto) {
    const idx = allVisible.findIndex((p) => p.id === photo.id);
    setLightboxPhotos(
      allVisible.map((p) => ({ url: p.url ?? '', caption: p.caption, tripTitle: p.tripTitle }))
    );
    setLightboxIndex(idx);
  }

  return (
    <>
      {/* Filter tabs */}
      <div className="flex flex-wrap gap-2 mb-10">
        <FilterTab active={activeRegion === 'all'} onClick={() => setActiveRegion('all')}>
          All locations
        </FilterTab>
        {groups.map((g) => (
          <FilterTab
            key={g.region}
            active={activeRegion === g.region}
            onClick={() => setActiveRegion(g.region)}
          >
            {g.region}
          </FilterTab>
        ))}
      </div>

      {/* Groups */}
      <div className="space-y-12">
        {visibleGroups.map((group) => (
          <div key={group.region}>
            {/* Group heading with photo count badge */}
            <div className="flex items-center gap-3 mb-5">
              <h2 className="font-playfair text-2xl text-ink">{group.region}</h2>
              <span className="text-xs font-lato text-muted bg-pale px-2.5 py-0.5 rounded-full">
                {group.photos.length} photo{group.photos.length !== 1 ? 's' : ''}
              </span>
            </div>

            {/* Responsive square grid — auto-fill at 160px min */}
            <div
              className="grid gap-2"
              style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))' }}
            >
              {group.photos.map((photo) => (
                <button
                  key={photo.id}
                  onClick={() => openLightbox(photo)}
                  className="relative aspect-square overflow-hidden rounded-lg bg-pale group cursor-zoom-in"
                >
                  {photo.url && (
                    <Image
                      src={photo.url}
                      alt={photo.caption ?? photo.tripTitle}
                      fill
                      sizes="(max-width: 640px) 50vw, (max-width: 1024px) 25vw, 200px"
                      className="object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                  )}
                  {/* Caption overlay on hover */}
                  <div className="absolute inset-0 bg-ink/0 group-hover:bg-ink/50 transition-colors duration-200 flex items-end p-2">
                    {photo.caption && (
                      <p className="text-sand text-xs font-lato leading-snug opacity-0 group-hover:opacity-100 transition-opacity duration-200 line-clamp-2">
                        {photo.caption}
                      </p>
                    )}
                  </div>
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>

      {lightboxIndex !== null && (
        <Lightbox
          photos={lightboxPhotos}
          index={lightboxIndex}
          onClose={() => setLightboxIndex(null)}
          onNext={() =>
            setLightboxIndex((lightboxIndex + 1) % lightboxPhotos.length)
          }
          onPrev={() =>
            setLightboxIndex(
              (lightboxIndex - 1 + lightboxPhotos.length) % lightboxPhotos.length
            )
          }
        />
      )}
    </>
  );
}

function FilterTab({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      className={`font-lato text-sm px-4 py-1.5 rounded-full transition-colors ${
        active
          ? 'bg-ink text-sand'
          : 'bg-pale text-muted hover:bg-ink/10 hover:text-ink'
      }`}
    >
      {children}
    </button>
  );
}
