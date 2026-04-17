'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function DeletePhotoButton({ photoId }: { photoId: number }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function handleDelete() {
    if (!confirm('Delete this photo? This cannot be undone.')) return;
    setLoading(true);
    await fetch(`/api/photos/${photoId}`, { method: 'DELETE' });
    router.refresh();
  }

  return (
    <button
      onClick={handleDelete}
      disabled={loading}
      className="font-lato text-xs text-red-500 hover:underline disabled:opacity-50"
    >
      {loading ? '…' : 'Delete'}
    </button>
  );
}
