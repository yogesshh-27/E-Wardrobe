'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  Home,
  Shirt,
  UploadCloud,
  Plane,
  Sparkles,
  Compass,
  Layers,
  Heart,
  ShoppingBag,
  User,
  Sliders,
  HelpCircle,
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
  const { logout } = useAuthStore();

  const navLinks = [
    { label: 'Home', href: '/', icon: Home },
    { label: 'My Wardrobe', href: '/wardrobe', icon: Shirt },
    { label: 'Upload Clothes', href: '/wardrobe/upload', icon: UploadCloud, badge: 'AI' },
    { label: 'Travel Planner', href: '/travel', icon: Plane },
    { label: 'Occasion Stylist', href: '/occasions', icon: Sparkles },
    { label: 'AI Recommendations', href: '/recommendations', icon: Compass },
    { label: 'My Outfits', href: '/outfits', icon: Layers },
    { label: 'Favorites', href: '/favorites', icon: Heart },
    { label: 'Shopping', href: '/shopping', icon: ShoppingBag },
  ];

  const bottomLinks = [
    { label: 'Style Profile', href: '/profile', icon: User },
    { label: 'Settings', href: '/settings', icon: Sliders },
    { label: 'Help & Support', href: '/help', icon: HelpCircle },
  ];

  const handleLogout = async () => {
    await logout();
    router.push('/login');
  };

  return (
    <>
      {/* Mobile Backdrop overlay */}
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 z-40 bg-black/30 backdrop-blur-xs lg:hidden"
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-40 flex flex-col w-64 bg-[#FAF8F5] border-r border-[#E7E0D6] transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Header */}
        <div className="flex h-16 items-center justify-between px-6 border-b border-[#E7E0D6]">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#B4533C] text-white shadow-xs">
              <Sparkles className="h-4 w-4" />
            </div>
            <span className="font-serif text-xl font-bold tracking-tight text-[#1C1917]">
              E-Wardrobe
            </span>
          </Link>

          <button
            onClick={onClose}
            className="lg:hidden p-1.5 rounded-lg text-[#57534E] hover:bg-[#E7E0D6] transition-colors"
            aria-label="Close menu"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
        </div>

        {/* Main Navigation Links */}
        <div className="flex-1 overflow-y-auto px-4 py-4 space-y-1">
          <p className="px-3 pb-2 text-[11px] font-semibold tracking-wider uppercase text-[#78716C]">
            Wardrobe & Styling
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
                className={`group flex items-center justify-between rounded-xl px-3 py-2.5 text-xs font-semibold transition-all ${
                  isActive
                    ? 'bg-[#B4533C] text-white shadow-xs'
                    : 'text-[#57534E] hover:bg-[#F4EFEA] hover:text-[#1C1917]'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon
                    className={`h-4 w-4 transition-transform group-hover:scale-110 ${
                      isActive ? 'text-white' : 'text-[#78716C] group-hover:text-[#1C1917]'
                    }`}
                  />
                  <span>{item.label}</span>
                </div>
                {item.badge && (
                  <span
                    className={`rounded-full px-1.5 py-0.2 text-[10px] font-bold ${
                      isActive ? 'bg-white/20 text-white' : 'bg-[#B4533C]/10 text-[#B4533C]'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </Link>
            );
          })}

          <div className="pt-5 pb-2">
            <p className="px-3 pb-2 text-[11px] font-semibold tracking-wider uppercase text-[#78716C]">
              Preferences
            </p>
            {bottomLinks.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => {
                    if (window.innerWidth < 1024) onClose();
                  }}
                  className={`group flex items-center gap-3 rounded-xl px-3 py-2.5 text-xs font-semibold transition-all ${
                    isActive
                      ? 'bg-[#B4533C] text-white shadow-xs'
                      : 'text-[#57534E] hover:bg-[#F4EFEA] hover:text-[#1C1917]'
                  }`}
                >
                  <Icon
                    className={`h-4 w-4 ${
                      isActive ? 'text-white' : 'text-[#78716C] group-hover:text-[#1C1917]'
                    }`}
                  />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </div>
        </div>

        {/* Footer Logout */}
        <div className="p-4 border-t border-[#E7E0D6]">
          <button
            onClick={handleLogout}
            className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-xs font-semibold text-[#B4533C] hover:bg-[#B4533C]/10 transition-colors"
          >
            <LogOut className="h-4 w-4" />
            <span>Log Out</span>
          </button>
        </div>
      </aside>
    </>
  );
};
