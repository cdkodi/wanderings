import Link from 'next/link';
import Image from 'next/image';
import type { Trip } from '@/lib/db/schema';

interface Props {
  trip: Trip & { photoCount: number };
}

export default function JournalEntry({ trip }: Props) {
  const excerpt = trip.story
    ? trip.story.replace(/[#*`_~[\]]/g, '').slice(0, 220).trimEnd() + '…'
    : null;

  return (
    <article className="group grid grid-cols-[auto_1fr] gap-6 md:gap-10 border-b border-pale py-10 last:border-0">
      {/* Year sidebar */}
      <div className="w-16 shrink-0 text-right pt-1">
        <span className="font-playfair text-2xl text-accent leading-none">{trip.year}</span>
        <p className="font-lato text-[10px] uppercase tracking-[0.2em] text-muted mt-1">{trip.month.slice(0, 3)}</p>
      </div>

      {/* Content */}
      <div className="min-w-0">
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0">
            <p className="font-lato text-xs uppercase tracking-[0.25em] text-muted">{trip.country}</p>
            <Link href={`/trips/${trip.slug}`} className="block mt-1">
              <h2 className="font-playfair text-2xl md:text-3xl text-ink leading-tight group-hover:text-accent transition-colors">
                {trip.title}
              </h2>
            </Link>
          </div>

          {/* Thumbnail */}
          {trip.coverImageUrl && (
            <Link href={`/trips/${trip.slug}`} className="shrink-0 hidden sm:block">
              <div className="relative w-24 h-16 md:w-32 md:h-20 rounded-lg overflow-hidden bg-pale">
                <Image
                  src={trip.coverImageUrl}
                  alt={trip.title}
                  fill
                  sizes="128px"
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
            </Link>
          )}
          {!trip.coverImageUrl && trip.emoji && (
            <div className="shrink-0 hidden sm:flex w-24 h-16 md:w-32 md:h-20 rounded-lg bg-sand items-center justify-center text-4xl">
              {trip.emoji}
            </div>
          )}
        </div>

        {/* Pills */}
        <div className="flex items-center flex-wrap gap-2 mt-3">
          {trip.duration && (
            <span className="font-lato text-xs text-muted bg-pale px-2.5 py-1 rounded-full">{trip.duration}</span>
          )}
          {trip.travelWith && (
            <span className="font-lato text-xs text-muted bg-pale px-2.5 py-1 rounded-full">with {trip.travelWith}</span>
          )}
          {trip.photoCount > 0 && (
            <span className="font-lato text-xs text-muted bg-pale px-2.5 py-1 rounded-full">{trip.photoCount} photo{trip.photoCount !== 1 ? 's' : ''}</span>
          )}
        </div>

        {/* Excerpt */}
        {excerpt && (
          <p className="font-lato text-muted text-base leading-relaxed mt-3 max-w-2xl line-clamp-3">{excerpt}</p>
        )}

        <Link
          href={`/trips/${trip.slug}`}
          className="inline-block font-lato text-sm text-accent hover:underline mt-4 tracking-wide"
        >
          Read the full story →
        </Link>
      </div>
    </article>
  );
}
