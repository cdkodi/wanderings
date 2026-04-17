'use client';

import { useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import type { Trip, Stay, Activity } from '@/lib/db/schema';

type StayInput = { name: string; location: string; description: string };

interface Props {
  trip?: Trip & { stays: Stay[]; activities: Activity[] };
}

const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];

export default function AdminTripForm({ trip }: Props) {
  const router = useRouter();
  const isEdit = !!trip;

  const [title, setTitle] = useState(trip?.title ?? '');
  const [country, setCountry] = useState(trip?.country ?? '');
  const [region, setRegion] = useState(trip?.region ?? '');
  const [year, setYear] = useState(String(trip?.year ?? new Date().getFullYear()));
  const [month, setMonth] = useState(trip?.month ?? 'January');
  const [duration, setDuration] = useState(trip?.duration ?? '');
  const [travelWith, setTravelWith] = useState(trip?.travelWith ?? '');
  const [emoji, setEmoji] = useState(trip?.emoji ?? '');
  const [coverImageUrl, setCoverImageUrl] = useState(trip?.coverImageUrl ?? '');
  const [story, setStory] = useState(trip?.story ?? '');
  const [tips, setTips] = useState(trip?.tips ?? '');
  const [published, setPublished] = useState(trip?.published ?? false);

  const [staysData, setStaysData] = useState<StayInput[]>(
    trip?.stays?.map((s) => ({ name: s.name, location: s.location ?? '', description: s.description ?? '' })) ?? [{ name: '', location: '', description: '' }]
  );

  const [activitiesData, setActivitiesData] = useState<string[]>(
    trip?.activities?.map((a) => a.name) ?? ['']
  );

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Stays helpers
  function updateStay(i: number, field: keyof StayInput, value: string) {
    setStaysData((prev) => prev.map((s, idx) => idx === i ? { ...s, [field]: value } : s));
  }
  function addStay() {
    setStaysData((prev) => [...prev, { name: '', location: '', description: '' }]);
  }
  function removeStay(i: number) {
    setStaysData((prev) => prev.filter((_, idx) => idx !== i));
  }

  // Activities helpers
  function updateActivity(i: number, value: string) {
    setActivitiesData((prev) => prev.map((a, idx) => idx === i ? value : a));
  }
  function addActivity() {
    setActivitiesData((prev) => [...prev, '']);
  }
  function removeActivity(i: number) {
    setActivitiesData((prev) => prev.filter((_, idx) => idx !== i));
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError('');

    if (!title.trim() || !country.trim() || !region.trim()) {
      setError('Title, country, and region are required.');
      return;
    }

    setLoading(true);

    const payload = {
      title: title.trim(),
      country: country.trim(),
      region: region.trim(),
      year: parseInt(year, 10),
      month,
      duration: duration.trim(),
      travelWith: travelWith.trim(),
      emoji: emoji.trim() || null,
      coverImageUrl: coverImageUrl.trim() || null,
      story: story.trim() || null,
      tips: tips.trim() || null,
      published,
      staysData: staysData.filter((s) => s.name.trim()),
      activitiesData: activitiesData.filter((a) => a.trim()),
    };

    const url = isEdit ? `/api/trips/${trip!.slug}` : '/api/trips';
    const method = isEdit ? 'PUT' : 'POST';

    const res = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    setLoading(false);

    if (!res.ok) {
      const body = await res.json().catch(() => ({}));
      setError(body.error ?? 'Something went wrong.');
      return;
    }

    router.push('/admin');
    router.refresh();
  }

  const inputClass = 'w-full border border-muted/30 rounded-lg px-4 py-2.5 font-lato text-sm text-ink bg-white focus:outline-none focus:ring-2 focus:ring-accent/40 focus:border-accent';
  const labelClass = 'block font-lato text-sm text-ink mb-1.5 font-medium';
  const textareaClass = `${inputClass} resize-y`;

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {error && (
        <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-4 py-2">
          {error}
        </p>
      )}

      {/* Core details */}
      <section className="bg-white rounded-2xl border border-pale p-6 space-y-5">
        <h2 className="font-playfair text-lg text-ink">Trip details</h2>

        <div>
          <label htmlFor="title" className={labelClass}>Title *</label>
          <input id="title" type="text" required value={title} onChange={(e) => setTitle(e.target.value)} className={inputClass} placeholder="e.g. Kyoto & Tokyo" />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="country" className={labelClass}>Country *</label>
            <input id="country" type="text" required value={country} onChange={(e) => setCountry(e.target.value)} className={inputClass} placeholder="e.g. Japan" />
          </div>
          <div>
            <label htmlFor="region" className={labelClass}>Region *</label>
            <input id="region" type="text" required value={region} onChange={(e) => setRegion(e.target.value)} className={inputClass} placeholder="e.g. Asia" />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="month" className={labelClass}>Month</label>
            <select id="month" value={month} onChange={(e) => setMonth(e.target.value)} className={inputClass}>
              {MONTHS.map((m) => <option key={m}>{m}</option>)}
            </select>
          </div>
          <div>
            <label htmlFor="year" className={labelClass}>Year</label>
            <input id="year" type="number" min="1900" max="2100" value={year} onChange={(e) => setYear(e.target.value)} className={inputClass} />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="duration" className={labelClass}>Duration</label>
            <input id="duration" type="text" value={duration} onChange={(e) => setDuration(e.target.value)} className={inputClass} placeholder="e.g. 10 days" />
          </div>
          <div>
            <label htmlFor="travelWith" className={labelClass}>Travel with</label>
            <input id="travelWith" type="text" value={travelWith} onChange={(e) => setTravelWith(e.target.value)} className={inputClass} placeholder="e.g. Family" />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="emoji" className={labelClass}>Emoji</label>
            <input id="emoji" type="text" value={emoji} onChange={(e) => setEmoji(e.target.value)} className={inputClass} placeholder="e.g. 🗾" />
          </div>
          <div>
            <label htmlFor="coverImageUrl" className={labelClass}>Cover image URL</label>
            <input id="coverImageUrl" type="url" value={coverImageUrl} onChange={(e) => setCoverImageUrl(e.target.value)} className={inputClass} placeholder="Cloudinary URL" />
          </div>
        </div>

        <div className="flex items-center gap-3">
          <input
            id="published"
            type="checkbox"
            checked={published}
            onChange={(e) => setPublished(e.target.checked)}
            className="w-4 h-4 accent-accent"
          />
          <label htmlFor="published" className="font-lato text-sm text-ink">Published (visible to visitors)</label>
        </div>
      </section>

      {/* Story */}
      <section className="bg-white rounded-2xl border border-pale p-6 space-y-4">
        <h2 className="font-playfair text-lg text-ink">Our Story</h2>
        <div>
          <label htmlFor="story" className={labelClass}>Narrative (Markdown)</label>
          <textarea id="story" rows={10} value={story} onChange={(e) => setStory(e.target.value)} className={textareaClass} placeholder="Write your trip story here…" />
        </div>
      </section>

      {/* Tips */}
      <section className="bg-white rounded-2xl border border-pale p-6 space-y-4">
        <h2 className="font-playfair text-lg text-ink">Tips &amp; Advice</h2>
        <div>
          <label htmlFor="tips" className={labelClass}>Travel tips (Markdown)</label>
          <textarea id="tips" rows={6} value={tips} onChange={(e) => setTips(e.target.value)} className={textareaClass} placeholder="Practical advice for future travellers…" />
        </div>
      </section>

      {/* Stays */}
      <section className="bg-white rounded-2xl border border-pale p-6 space-y-4">
        <h2 className="font-playfair text-lg text-ink">Where we stayed</h2>
        {staysData.map((stay, i) => (
          <div key={i} className="border border-pale rounded-xl p-4 space-y-3">
            <div className="flex items-center justify-between">
              <p className="font-lato text-sm font-medium text-muted">Stay {i + 1}</p>
              {staysData.length > 1 && (
                <button type="button" onClick={() => removeStay(i)} className="font-lato text-xs text-red-400 hover:text-red-600">
                  Remove
                </button>
              )}
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className={labelClass}>Property name</label>
                <input type="text" value={stay.name} onChange={(e) => updateStay(i, 'name', e.target.value)} className={inputClass} placeholder="Hotel / villa / hostel name" />
              </div>
              <div>
                <label className={labelClass}>Location</label>
                <input type="text" value={stay.location} onChange={(e) => updateStay(i, 'location', e.target.value)} className={inputClass} placeholder="City or area" />
              </div>
            </div>
            <div>
              <label className={labelClass}>Notes</label>
              <textarea rows={3} value={stay.description} onChange={(e) => updateStay(i, 'description', e.target.value)} className={textareaClass} placeholder="Personal notes or mini review…" />
            </div>
          </div>
        ))}
        <button type="button" onClick={addStay} className="font-lato text-sm text-accent2 hover:underline tracking-wide">
          + Add another stay
        </button>
      </section>

      {/* Activities */}
      <section className="bg-white rounded-2xl border border-pale p-6 space-y-4">
        <h2 className="font-playfair text-lg text-ink">What we did</h2>
        <div className="space-y-2">
          {activitiesData.map((activity, i) => (
            <div key={i} className="flex items-center gap-2">
              <input
                type="text"
                value={activity}
                onChange={(e) => updateActivity(i, e.target.value)}
                className={`${inputClass} flex-1`}
                placeholder={`Activity ${i + 1}`}
              />
              {activitiesData.length > 1 && (
                <button type="button" onClick={() => removeActivity(i)} className="text-red-400 hover:text-red-600 text-lg leading-none px-1">
                  ×
                </button>
              )}
            </div>
          ))}
        </div>
        <button type="button" onClick={addActivity} className="font-lato text-sm text-accent2 hover:underline tracking-wide">
          + Add activity
        </button>
      </section>

      {/* Submit */}
      <div className="flex items-center justify-between pb-8">
        <button
          type="button"
          onClick={() => router.push('/admin')}
          className="font-lato text-sm text-muted hover:text-ink transition-colors"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={loading}
          className="bg-accent text-white font-lato text-sm tracking-wide px-6 py-2.5 rounded-lg hover:bg-accent/90 transition-colors disabled:opacity-50"
        >
          {loading ? 'Saving…' : isEdit ? 'Save changes' : 'Create trip'}
        </button>
      </div>
    </form>
  );
}
