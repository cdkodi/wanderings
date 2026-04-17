'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';

interface Props {
  trips: { id: number; title: string }[];
}

declare global {
  interface Window {
    cloudinary: {
      createUploadWidget: (
        options: Record<string, unknown>,
        callback: (error: unknown, result: { event: string; info: { public_id: string; secure_url: string } }) => void
      ) => { open: () => void };
    };
  }
}

export default function PhotoUploader({ trips }: Props) {
  const router = useRouter();
  const [tripId, setTripId] = useState<number>(trips[0]?.id ?? 0);
  const [caption, setCaption] = useState('');
  const [status, setStatus] = useState('');
  const widgetRef = useRef<{ open: () => void } | null>(null);

  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://upload-widget.cloudinary.com/global/all.js';
    script.async = true;
    document.body.appendChild(script);
    return () => { document.body.removeChild(script); };
  }, []);

  function openWidget() {
    if (!tripId) { setStatus('Select a trip first.'); return; }
    setStatus('');

    widgetRef.current = window.cloudinary.createUploadWidget(
      {
        cloudName: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
        uploadPreset: 'wanderings_uploads',
        multiple: true,
        folder: 'wanderings',
        sources: ['local', 'camera'],
      },
      async (error, result) => {
        if (error) { setStatus('Upload failed.'); return; }
        if (result?.event === 'success') {
          const { public_id, secure_url } = result.info;
          await fetch('/api/photos', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ tripId, cloudinaryId: public_id, url: secure_url, caption: caption.trim() || null }),
          });
          setStatus('Photo uploaded.');
          setCaption('');
          router.refresh();
        }
      }
    );
    widgetRef.current.open();
  }

  return (
    <div className="bg-white rounded-2xl border border-pale p-6 space-y-4">
      <h2 className="font-playfair text-lg text-ink">Upload photos</h2>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block font-lato text-sm text-ink mb-1.5 font-medium">Trip</label>
          <select
            value={tripId}
            onChange={(e) => setTripId(Number(e.target.value))}
            className="w-full border border-muted/30 rounded-lg px-4 py-2.5 font-lato text-sm text-ink bg-white focus:outline-none focus:ring-2 focus:ring-accent/40"
          >
            {trips.map((t) => (
              <option key={t.id} value={t.id}>{t.title}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block font-lato text-sm text-ink mb-1.5 font-medium">Caption (optional)</label>
          <input
            type="text"
            value={caption}
            onChange={(e) => setCaption(e.target.value)}
            placeholder="Applied to all photos in this batch"
            className="w-full border border-muted/30 rounded-lg px-4 py-2.5 font-lato text-sm text-ink bg-white focus:outline-none focus:ring-2 focus:ring-accent/40"
          />
        </div>
      </div>

      <div className="flex items-center gap-4">
        <button
          type="button"
          onClick={openWidget}
          className="bg-accent text-white font-lato text-sm tracking-wide px-5 py-2.5 rounded-lg hover:bg-accent/90 transition-colors"
        >
          Choose photos
        </button>
        {status && <p className="font-lato text-sm text-muted">{status}</p>}
      </div>

      <p className="font-lato text-xs text-muted">
        Requires a <code>wanderings_uploads</code> unsigned upload preset in your Cloudinary account.
      </p>
    </div>
  );
}
