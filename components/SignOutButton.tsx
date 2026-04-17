'use client';

import { signOut } from 'next-auth/react';

export default function SignOutButton() {
  return (
    <button
      onClick={() => signOut({ callbackUrl: '/admin/login' })}
      className="font-lato text-xs text-sand/50 hover:text-sand/80 transition-colors tracking-wide"
    >
      Sign out
    </button>
  );
}
