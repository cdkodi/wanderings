'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function DeleteTripButton({ slug, title }: { slug: string; title: string }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function handleDelete() {
    if (!confirm(`Delete "${title}"? This cannot be undone.`)) return;
    setLoading(true);
    await fetch(`/api/trips/${slug}`, { method: 'DELETE' });
    router.refresh();
  }

  return (
    <button
      onClick={handleDelete}
      disabled={loading}
      className="font-lato text-xs text-red-500 hover:underline tracking-wide disabled:opacity-50"
    >
      {loading ? '…' : 'Delete'}
    </button>
  );
}
