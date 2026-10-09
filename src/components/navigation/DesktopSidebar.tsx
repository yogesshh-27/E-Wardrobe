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
import { motion } from 'framer-motion';

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
        <div className="flex h-20 items-center justify-between px-6 border-b border-[#E2E8F0] bg-white/60">
          <Link href="/" className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-[#E87A90] to-[#0284C7] text-white shadow-xs">
              <Sparkles className="h-5 w-5" />
            </div>
            <div>
              <span className="font-sans text-lg font-black tracking-tight text-[#1C1917] block">
                WARDROBE
              </span>
              <span className="text-[9px] uppercase tracking-widest text-[#64748B] block -mt-0.5 font-medium">
                Atelier
              </span>
            </div>
          </Link>

          <button
            onClick={onClose}
            className="lg:hidden p-1.5 rounded-lg text-[#475569] hover:bg-[#E2E8F0] transition-colors"
            aria-label="Close menu"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
        </div>

        {/* Navigation Items */}
        <div className="flex-1 overflow-y-auto px-4 py-5 space-y-1.5">
          <p className="px-3 pb-2 text-[10px] font-bold tracking-widest uppercase text-[#64748B]">
            Main Atelier
          </p>

          {navLinks.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;

            return (
              <motion.div
                key={item.href}
                whileHover={{ x: 2 }}
                whileTap={{ scale: 0.98 }}
                transition={{ duration: 0.16 }}
              >
                <Link
                  href={item.href}
                  onClick={() => {
                    if (window.innerWidth < 1024) onClose();
                  }}
                  className={`group flex items-center justify-between rounded-2xl px-3.5 py-3 text-xs font-semibold transition-all ${
                    isActive
                      ? 'bg-gradient-to-r from-[#0284C7] to-[#38BDF8] text-white shadow-sm'
                      : 'text-[#475569] hover:bg-white hover:text-[#1C1917] hover:shadow-2xs'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon
                      className={`h-4 w-4 transition-transform group-hover:scale-110 ${
                        isActive ? 'text-white' : 'text-[#64748B] group-hover:text-[#0284C7]'
                      }`}
                    />
                    <span>{item.label}</span>
                  </div>
                  {item.badge && (
                    <span
                      className={`rounded-full px-2 py-0.5 text-[9px] font-bold tracking-wide uppercase ${
                        isActive ? 'bg-white/20 text-white' : 'bg-[#E0F2FE] text-[#0284C7]'
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </Link>
              </motion.div>
            );
          })}
        </div>

        {/* Bottom User Profile Card */}
        <div className="p-4 border-t border-[#E2E8F0] bg-white/70 space-y-3">
          <Link
            href="/profile"
            className="flex items-center gap-3 p-2 rounded-2xl hover:bg-[#FAF8F5] transition-colors group"
          >
            {user?.profileImage ? (
              <img
                src={user.profileImage}
                alt={user.name || 'User'}
                className="h-10 w-10 rounded-xl object-cover border border-[#E2E8F0] shadow-2xs group-hover:border-[#0284C7] transition-colors"
              />
            ) : (
              <div className="h-10 w-10 rounded-xl bg-[#E0F2FE] border border-[#BAE6FD] flex items-center justify-center font-sans text-sm font-bold text-[#0284C7] group-hover:border-[#0284C7] transition-colors">
                {userInitial}
              </div>
            )}

            <div className="min-w-0 flex-1">
              <p className="text-xs font-bold text-[#1C1917] truncate leading-tight group-hover:text-[#0284C7] transition-colors">
                {user?.name || 'Alex Rivera'}
              </p>
              <p className="text-[10px] text-[#64748B] truncate mt-0.5 font-medium">
                {styleSummary}
              </p>
            </div>
          </Link>

          <button
            onClick={handleLogout}
            className="flex w-full items-center justify-center gap-2 rounded-xl py-2 text-[11px] font-semibold text-[#64748B] hover:text-[#E87A90] hover:bg-rose-50 transition-colors"
          >
            <LogOut className="h-3.5 w-3.5" />
            <span>Log Out</span>
          </button>
        </div>
      </aside>
    </>
  );
};
