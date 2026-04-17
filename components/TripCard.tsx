'use client';

import Link from 'next/link';
import Image from 'next/image';
import type { Trip } from '@/lib/db/schema';

type Props = {
  trip: Trip;
  photoCount: number;
};

function getExcerpt(story: string | null | undefined, length = 115): string {
  if (!story) return '';
  const text = story
    .split('\n')
    .filter((line) => !line.startsWith('#'))
    .join(' ')
    .replace(/\s+/g, ' ')
    .trim();
  return text.length > length ? text.slice(0, length).trimEnd() + '…' : text;
}

export default function TripCard({ trip, photoCount }: Props) {
  const excerpt = getExcerpt(trip.story);

  return (
    <Link href={`/trips/${trip.slug}`} className="group block">
      <article className="bg-white rounded-2xl overflow-hidden shadow-sm transition-all duration-200 group-hover:-translate-y-1.5 group-hover:shadow-xl h-full flex flex-col">
        {/* Image / emoji area */}
        <div className="relative aspect-[4/3] bg-pale overflow-hidden shrink-0">
          {trip.coverImageUrl ? (
            <Image
              src={trip.coverImageUrl}
              alt={trip.title}
              fill
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              className="object-cover transition-transform duration-300 group-hover:scale-105"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <span className="text-7xl select-none">{trip.emoji ?? '✈️'}</span>
            </div>
          )}
          {/* Year badge */}
          <span className="absolute top-3 right-3 bg-ink/80 backdrop-blur-sm text-sand text-xs font-bold font-lato px-2.5 py-1 rounded-full tracking-wide">
            {trip.year}
          </span>
        </div>

        {/* Card body */}
        <div className="p-5 flex flex-col flex-1">
          <p className="text-xs uppercase tracking-[0.2em] text-muted font-lato font-medium">
            {trip.country}
          </p>
          <h2 className="font-playfair text-xl text-ink font-semibold mt-1 leading-snug">
            {trip.title}
          </h2>

          {/* Meta pills */}
          <div className="flex flex-wrap gap-1.5 mt-2.5">
            <span className="text-xs bg-pale text-muted rounded-full px-2.5 py-0.5 font-lato">
              {trip.month} {trip.year}
            </span>
            <span className="text-xs bg-pale text-muted rounded-full px-2.5 py-0.5 font-lato">
              {trip.duration}
            </span>
            <span className="text-xs bg-pale text-muted rounded-full px-2.5 py-0.5 font-lato">
              {trip.travelWith}
            </span>
          </div>

          {/* Excerpt */}
          {excerpt && (
            <p className="text-sm text-muted mt-3 line-clamp-2 leading-relaxed font-lato flex-1">
              {excerpt}
            </p>
          )}

          {/* Footer */}
          <div className="mt-4 pt-3 border-t border-pale flex items-center justify-between">
            <span className="text-xs font-lato text-accent font-semibold tracking-wide uppercase">
              Read more →
            </span>
            {photoCount > 0 && (
              <span className="text-xs font-lato text-muted">
                {photoCount} photo{photoCount !== 1 ? 's' : ''}
              </span>
            )}
          </div>
        </div>
      </article>
    </Link>
  );
}
