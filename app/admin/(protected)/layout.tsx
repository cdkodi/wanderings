import { getServerSession } from 'next-auth/next';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { authOptions } from '@/lib/auth';
import SignOutButton from '@/components/SignOutButton';

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await getServerSession(authOptions);
  if (!session) redirect('/admin/login');

  return (
    <div className="min-h-screen bg-pale">
      <header className="bg-ink text-sand/80 px-6 py-4">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-6">
            <Link href="/admin" className="font-playfair text-lg text-sand hover:text-sand/80 transition-colors">
              Admin
            </Link>
            <nav className="flex items-center gap-5">
              <Link href="/admin/trips/new" className="font-lato text-sm hover:text-sand transition-colors tracking-wide">
                + New Trip
              </Link>
              <Link href="/admin/photos" className="font-lato text-sm hover:text-sand transition-colors tracking-wide">
                Photos
              </Link>
            </nav>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/" className="font-lato text-xs text-sand/50 hover:text-sand/80 transition-colors tracking-wide">
              View site
            </Link>
            <SignOutButton />
          </div>
        </div>
      </header>
      <main className="max-w-5xl mx-auto px-6 py-8">{children}</main>
    </div>
  );
}
