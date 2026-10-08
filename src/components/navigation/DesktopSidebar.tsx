'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  Home,
  Shirt,
  Plane,
  Sparkles,
  Compass,
  Dna,
  User,
  Sliders,
  LogOut,
  ChevronLeft,
} from 'lucide-react';
import { useAuthStore } from '@/store/useAuthStore';

interface DesktopSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export const DesktopSidebar: React.FC<DesktopSidebarProps> = ({ isOpen, onClose }) => {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout } = useAuthStore();

  const navLinks = [
    { label: 'Home', href: '/', icon: Home },
    { label: 'My Wardrobe', href: '/wardrobe', icon: Shirt },
    { label: 'Travel', href: '/travel', icon: Plane, badge: 'USP' },
    { label: 'Occasion', href: '/occasions', icon: Sparkles },
    { label: 'Recommendations', href: '/recommendations', icon: Compass },
    { label: 'Style Profile', href: '/style-profile', icon: Dna },
    { label: 'Profile', href: '/profile', icon: User },
    { label: 'Settings', href: '/settings', icon: Sliders },
  ];

  const handleLogout = async () => {
    await logout();
    router.push('/login');
  };

  const styleSummary =
    user?.stylePreferences && user.stylePreferences.length > 0
      ? user.stylePreferences.slice(0, 2).join(' × ')
      : 'Classic × Streetwear';

  const userInitial = user?.name ? user.name.charAt(0).toUpperCase() : 'W';

  return (
    <>
      {/* Mobile Backdrop overlay */}
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 z-40 bg-black/40 backdrop-blur-xs lg:hidden"
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-40 flex flex-col w-64 bg-[#FAF8F5] border-r border-[#E7E0D6] transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Header Branding */}
        <div className="flex h-20 items-center justify-between px-6 border-b border-[#E7E0D6] bg-white/60">
          <Link href="/" className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#B4533C] text-white shadow-xs">
              <Sparkles className="h-5 w-5" />
            </div>
            <div>
              <span className="font-serif text-xl font-bold tracking-tight text-[#1C1917] block">
                WARDROBE AI
              </span>
              <span className="text-[9px] uppercase tracking-widest text-[#78716C] block -mt-0.5 font-medium">
                Digital Atelier
              </span>
            </div>
          </Link>

          <button
            onClick={onClose}
            className="lg:hidden p-1.5 rounded-lg text-[#57534E] hover:bg-[#E7E0D6] transition-colors"
            aria-label="Close menu"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
        </div>

        {/* Navigation Items */}
        <div className="flex-1 overflow-y-auto px-4 py-5 space-y-1.5">
          <p className="px-3 pb-2 text-[10px] font-bold tracking-widest uppercase text-[#78716C]">
            Main Atelier
          </p>

          {navLinks.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => {
                  if (window.innerWidth < 1024) onClose();
                }}
                className={`group flex items-center justify-between rounded-2xl px-3.5 py-3 text-xs font-semibold transition-all ${
                  isActive
                    ? 'bg-[#B4533C] text-white shadow-xs'
                    : 'text-[#57534E] hover:bg-white hover:text-[#1C1917] hover:shadow-2xs'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon
                    className={`h-4 w-4 transition-transform group-hover:scale-110 ${
                      isActive ? 'text-white' : 'text-[#78716C] group-hover:text-[#B4533C]'
                    }`}
                  />
                  <span>{item.label}</span>
                </div>
                {item.badge && (
                  <span
                    className={`rounded-full px-2 py-0.5 text-[9px] font-bold tracking-wide uppercase ${
                      isActive ? 'bg-white/20 text-white' : 'bg-[#B4533C]/10 text-[#B4533C]'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </Link>
            );
          })}
        </div>

        {/* Bottom User Profile Card */}
        <div className="p-4 border-t border-[#E7E0D6] bg-white/70 space-y-3">
          <Link
            href="/profile"
            className="flex items-center gap-3 p-2 rounded-2xl hover:bg-[#FAF8F5] transition-colors group"
          >
            {user?.profileImage ? (
              <img
                src={user.profileImage}
                alt={user.name || 'User'}
                className="h-10 w-10 rounded-xl object-cover border border-[#E7E0D6] shadow-2xs group-hover:border-[#B4533C] transition-colors"
              />
            ) : (
              <div className="h-10 w-10 rounded-xl bg-[#FAF8F5] border border-[#E7E0D6] flex items-center justify-center font-serif text-sm font-bold text-[#B4533C] group-hover:border-[#B4533C] transition-colors">
                {userInitial}
              </div>
            )}

            <div className="min-w-0 flex-1">
              <p className="text-xs font-bold text-[#1C1917] truncate leading-tight group-hover:text-[#B4533C] transition-colors">
                {user?.name || 'Aarav Sharma'}
              </p>
              <p className="text-[10px] text-[#78716C] truncate mt-0.5 font-medium">
                {styleSummary}
              </p>
            </div>
          </Link>

          <button
            onClick={handleLogout}
            className="flex w-full items-center justify-center gap-2 rounded-xl py-2 text-[11px] font-semibold text-[#78716C] hover:text-[#B4533C] hover:bg-[#B4533C]/10 transition-colors"
          >
            <LogOut className="h-3.5 w-3.5" />
            <span>Log Out</span>
          </button>
        </div>
      </aside>
    </>
  );
};
