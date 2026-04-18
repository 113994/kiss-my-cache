'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export function BottomNav() {
  const pathname = usePathname();

  const navItems = [
    { href: '/feed', label: 'Feed', icon: '🍽️' },
    { href: '/post', label: 'Post', icon: '➕' },
    { href: '/profile', label: 'Profile', icon: '👤' },
  ];

  // Don't show nav on onboarding or login pages
  if (pathname === '/' || pathname === '/onboarding') {
    return null;
  }

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-neutral-border flex justify-around items-center py-3 bottom-nav-safe max-w-2xl mx-auto w-full md:rounded-t-2xl">
      {navItems.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          className={`flex flex-col items-center gap-1 flex-1 py-2 rounded-lg transition-colors ${
            pathname === item.href
              ? 'text-brand-primary'
              : 'text-neutral-muted hover:text-neutral-text'
          }`}
        >
          <span className="text-2xl">{item.icon}</span>
          <span className="text-xs font-medium">{item.label}</span>
        </Link>
      ))}
    </nav>
  );
}
