import { notFound } from 'next/navigation';
import Image from 'next/image';
import { eq } from 'drizzle-orm';
import type { Metadata } from 'next';
import { db } from '@/lib/db';
import { trips } from '@/lib/db/schema';
import MarkdownRenderer from '@/components/MarkdownRenderer';
import PhotoStrip from '@/components/PhotoStrip';

type Props = { params: { slug: string } };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const trip = await db.query.trips.findFirst({ where: eq(trips.slug, params.slug) });
  if (!trip || !trip.published) return {};
  const description = trip.story?.replace(/[#*`_~[\]]/g, '').slice(0, 160) ?? `${trip.country} · ${trip.month} ${trip.year}`;
  return {
    title: `${trip.title} — Our Wanderings`,
    description,
    openGraph: {
      title: trip.title,
      description,
      ...(trip.coverImageUrl && { images: [{ url: trip.coverImageUrl }] }),
    },
  };
}

async function getTrip(slug: string) {
  return db.query.trips.findFirst({
    where: eq(trips.slug, slug),
    with: {
      stays: { orderBy: (s, { asc }) => [asc(s.sortOrder)] },
      activities: { orderBy: (a, { asc }) => [asc(a.sortOrder)] },
      photos: { orderBy: (p, { asc }) => [asc(p.sortOrder)] },
    },
  });
}

export default async function TripDetailPage({ params }: Props) {
  const trip = await getTrip(params.slug);

  if (!trip || !trip.published) notFound();

  return (
    <main>
      {/* 1 — Hero image */}
      <section className="relative w-full aspect-[16/7] bg-pale overflow-hidden">
        {trip.coverImageUrl ? (
          <Image
            src={trip.coverImageUrl}
            alt={trip.title}
            fill
            priority
            sizes="100vw"
            className="object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-sand">
            <span className="text-[10rem] select-none leading-none">
              {trip.emoji ?? '✈️'}
            </span>
          </div>
        )}
        {/* gradient overlay so header text reads cleanly below */}
        <div className="absolute inset-0 bg-gradient-to-t from-ink/50 via-transparent to-transparent" />
      </section>

      <div className="max-w-4xl mx-auto px-6">
        {/* 2 — Trip header */}
        <header className="pt-10 pb-8 border-b border-pale">
          <p className="font-lato text-xs uppercase tracking-[0.3em] text-muted">
            {trip.country}
          </p>
          <h1 className="font-playfair text-4xl md:text-5xl text-ink mt-2 leading-tight">
            {trip.title}
          </h1>
          <p className="font-lato text-muted mt-3 text-base">
            {trip.month} {trip.year} · {trip.duration} · with {trip.travelWith}
          </p>
        </header>

        {/* 3 — Info pills */}
        <div className="flex flex-wrap gap-2 py-6 border-b border-pale">
          <Pill icon="📅">{trip.month} {trip.year}</Pill>
          <Pill icon="⏱">{trip.duration}</Pill>
          <Pill icon="👥">{trip.travelWith}</Pill>
          {trip.photos.length > 0 && (
            <Pill icon="📷">
              {trip.photos.length} photo{trip.photos.length !== 1 ? 's' : ''}
            </Pill>
          )}
        </div>

        {/* 4 — Our Story */}
        {trip.story && (
          <section className="py-10 border-b border-pale">
            <SectionHeading>Our Story</SectionHeading>
            <MarkdownRenderer content={trip.story} />
          </section>
        )}

        {/* 5 — Where We Stayed */}
        {trip.stays.length > 0 && (
          <section className="py-10 border-b border-pale">
            <SectionHeading>Where We Stayed</SectionHeading>
            <div className="space-y-7">
              {trip.stays.map((stay) => (
                <div key={stay.id}>
                  <div className="flex items-baseline gap-3 flex-wrap">
                    <h3 className="font-playfair text-xl text-ink">{stay.name}</h3>
                    {stay.location && (
                      <span className="text-xs font-lato text-muted uppercase tracking-[0.15em]">
                        {stay.location}
                      </span>
                    )}
                  </div>
                  {stay.description && (
                    <p className="font-lato text-sm text-muted mt-1.5 leading-relaxed">
                      {stay.description}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* 6 — What We Did (2-column activity grid) */}
        {trip.activities.length > 0 && (
          <section className="py-10 border-b border-pale">
            <SectionHeading>What We Did</SectionHeading>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-x-10 gap-y-3">
              {trip.activities.map((activity) => (
                <li
                  key={activity.id}
                  className="flex items-start gap-2.5 font-lato text-sm text-ink/90"
                >
                  <span className="text-accent mt-0.5 shrink-0 text-xs">✦</span>
                  {activity.name}
                </li>
              ))}
            </ul>
          </section>
        )}

        {/* 7 — Photos (horizontal scrollable strip) */}
        {trip.photos.length > 0 && (
          <section className="py-10 border-b border-pale">
            <SectionHeading>Photos</SectionHeading>
            <PhotoStrip photos={trip.photos} />
          </section>
        )}

        {/* 8 — Tips & Advice (teal callout box) */}
        {trip.tips && (
          <section className="py-10 pb-16">
            <SectionHeading>Tips & Advice</SectionHeading>
            <div className="bg-accent2/10 border border-accent2/25 rounded-2xl px-6 py-7 md:px-8 md:py-8">
              <MarkdownRenderer content={trip.tips} />
            </div>
          </section>
        )}
      </div>
    </main>
  );
}

function SectionHeading({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="font-playfair text-2xl md:text-3xl text-ink mb-6">{children}</h2>
  );
}

function Pill({ icon, children }: { icon: string; children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center gap-1.5 bg-pale text-ink text-sm font-lato px-3 py-1.5 rounded-full">
      <span aria-hidden="true">{icon}</span>
      {children}
    </span>
  );
}
