'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Shirt, Plus, Sparkles, User } from 'lucide-react';

export const MobileBottomNav: React.FC = () => {
  const pathname = usePathname();

  const navItems = [
    { label: 'Home', href: '/', icon: Home },
    { label: 'Wardrobe', href: '/wardrobe', icon: Shirt },
    { label: 'Upload', href: '/wardrobe/upload', isCenter: true },
    { label: 'Stylist', href: '/occasions', icon: Sparkles },
    { label: 'Profile', href: '/profile', icon: User },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-30 flex h-16 items-center justify-around border-t border-[#E7E0D6] bg-white/95 px-2 backdrop-blur-lg lg:hidden">
      {navItems.map((item) => {
        const isActive = pathname === item.href;

        if (item.isCenter) {
          return (
            <Link
              key={item.href}
              href={item.href}
              className="relative -top-4 flex flex-col items-center group"
              aria-label="Upload clothes"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#B4533C] text-white shadow-lg shadow-[#B4533C]/30 transition-transform active:scale-95 group-hover:scale-105">
                <Plus className="h-6 w-6 stroke-[2.5]" />
              </div>
              <span className="text-[10px] font-semibold text-[#B4533C] mt-1">
                Upload
              </span>
            </Link>
          );
        }

        const Icon = item.icon!;
        return (
          <Link
            key={item.href}
            href={item.href}
            className={`flex min-h-[44px] min-w-[44px] flex-col items-center justify-center rounded-xl p-1 transition-colors ${
              isActive ? 'text-[#B4533C]' : 'text-[#78716C] hover:text-[#1C1917]'
            }`}
          >
            <Icon className="h-5 w-5" />
            <span className="text-[10px] font-medium mt-0.5">{item.label}</span>
          </Link>
        );
      })}
    </nav>
  );
};
