'use client';

import { useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';

export default function EditCaptionForm({ photoId, initialCaption }: { photoId: number; initialCaption: string }) {
  const router = useRouter();
  const [caption, setCaption] = useState(initialCaption);
  const [saving, setSaving] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setSaving(true);
    await fetch(`/api/photos/${photoId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ caption }),
    });
    setSaving(false);
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="flex items-center gap-1">
      <input
        type="text"
        value={caption}
        onChange={(e) => setCaption(e.target.value)}
        placeholder="Caption…"
        className="flex-1 min-w-0 border border-muted/20 rounded px-2 py-1 font-lato text-xs text-ink focus:outline-none focus:ring-1 focus:ring-accent/40"
      />
      <button
        type="submit"
        disabled={saving}
        className="font-lato text-xs text-accent2 hover:underline disabled:opacity-50 shrink-0"
      >
        {saving ? '…' : 'Save'}
      </button>
    </form>
  );
}
