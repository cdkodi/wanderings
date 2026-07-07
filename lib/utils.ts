export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
}

export function formatDate(year: number, month: string): string {
  return `${month} ${year}`;
}

/**
 * Insert Cloudinary delivery transformations into a stored URL so images are
 * served as AVIF/WebP at auto quality, capped at `width` px. Client-safe (no
 * SDK). Non-Cloudinary URLs pass through unchanged.
 */
export function optimizedImageUrl(url: string, width: number): string {
  if (!url.includes('res.cloudinary.com') || !url.includes('/upload/')) return url;
  return url.replace('/upload/', `/upload/f_auto,q_auto,c_limit,w_${width}/`);
}
