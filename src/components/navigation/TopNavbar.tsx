'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Bell,
  Search,
  Sparkles,
  Menu,
  CheckCheck,
  ExternalLink,
  User,
  Sliders,
  LogOut,
} from 'lucide-react';
import { useAuthStore } from '@/store/useAuthStore';
import { useNotificationStore } from '@/store/useNotificationStore';
import { GlobalSearchModal } from './GlobalSearchModal';

interface TopNavbarProps {
  onToggleSidebar?: () => void;
}

export const TopNavbar: React.FC<TopNavbarProps> = ({ onToggleSidebar }) => {
  const router = useRouter();
  const { user, logout } = useAuthStore();
  const { notifications, unreadCount, loadNotifications, markAsRead, markAllAsRead } =
    useNotificationStore();

  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);

  const notifRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    loadNotifications();
  }, [loadNotifications]);

  // Click outside listener for dropdowns
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
        setIsNotifOpen(false);
      }
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) {
        setIsProfileMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Keyboard shortcut Ctrl/Cmd+K to open search
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsSearchOpen(true);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleLogout = async () => {
    await logout();
    router.push('/login');
  };

  return (
    <>
      <header className="sticky top-0 z-30 flex h-16 w-full items-center justify-between border-b border-[#E7E0D6] bg-[#FAF8F5]/90 px-4 backdrop-blur-md transition-all md:px-8">
        <div className="flex items-center gap-3">
          {onToggleSidebar && (
            <button
              onClick={onToggleSidebar}
              className="rounded-lg p-2 text-[#57534E] hover:bg-[#F4EFEA] hover:text-[#1C1917] transition-colors"
              aria-label="Toggle navigation menu"
            >
              <Menu className="h-5 w-5" />
            </button>
          )}

          <Link href="/" className="flex items-center gap-2 group">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#B4533C] text-white shadow-sm transition-transform group-hover:scale-105">
              <Sparkles className="h-4 w-4" />
            </div>
            <div className="flex flex-col">
              <span className="font-serif text-xl font-bold tracking-tight text-[#1C1917]">
                E-Wardrobe
              </span>
            </div>
          </Link>
        </div>

        {/* Global Search Bar (Trigger) */}
        <div className="hidden md:flex flex-1 max-w-md mx-6">
          <button
            onClick={() => setIsSearchOpen(true)}
            className="flex w-full items-center justify-between rounded-full border border-[#E7E0D6] bg-white/80 px-4 py-2 text-sm text-[#78716C] shadow-xs hover:border-[#D5CCC0] hover:bg-white transition-all"
          >
            <div className="flex items-center gap-2.5">
              <Search className="h-4 w-4 text-[#78716C]" />
              <span>Search clothing, folders, outfits...</span>
            </div>
            <kbd className="hidden sm:inline-block rounded border border-[#E7E0D6] bg-[#F4EFEA] px-1.5 py-0.5 text-[10px] font-medium text-[#78716C]">
              ⌘K
            </kbd>
          </button>
        </div>

        {/* Right Action Icons: Search (mobile), Notifications, Profile Avatar */}
        <div className="flex items-center gap-2 sm:gap-3">
          <button
            onClick={() => setIsSearchOpen(true)}
            className="md:hidden rounded-full p-2 text-[#57534E] hover:bg-[#F4EFEA] transition-colors"
            aria-label="Open search"
          >
            <Search className="h-5 w-5" />
          </button>

          {/* Notifications Popover */}
          <div className="relative" ref={notifRef}>
            <button
              onClick={() => setIsNotifOpen(!isNotifOpen)}
              className="relative rounded-full p-2 text-[#57534E] hover:bg-[#F4EFEA] hover:text-[#1C1917] transition-colors"
              aria-label="Notifications"
            >
              <Bell className="h-5 w-5" />
              {unreadCount > 0 && (
                <span className="absolute top-1.5 right-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-[#B4533C] text-[10px] font-bold text-white shadow-xs animate-pulse">
                  {unreadCount}
                </span>
              )}
            </button>

            {isNotifOpen && (
              <div className="absolute right-0 mt-2 w-80 sm:w-96 rounded-2xl glass-dropdown p-4 shadow-xl z-50 animate-in fade-in zoom-in-95 duration-150">
                <div className="flex items-center justify-between border-b border-[#E7E0D6] pb-3 mb-2">
                  <div className="flex items-center gap-2">
                    <h3 className="font-serif font-bold text-base text-[#1C1917]">
                      Notifications
                    </h3>
                    {unreadCount > 0 && (
                      <span className="rounded-full bg-[#B4533C]/10 px-2 py-0.5 text-xs font-semibold text-[#B4533C]">
                        {unreadCount} new
                      </span>
                    )}
                  </div>
                  {unreadCount > 0 && (
                    <button
                      onClick={markAllAsRead}
                      className="flex items-center gap-1 text-xs text-[#B4533C] hover:underline font-medium"
                    >
                      <CheckCheck className="h-3.5 w-3.5" />
                      Mark all read
                    </button>
                  )}
                </div>

                <div className="max-h-80 overflow-y-auto space-y-2 divide-y divide-[#F4EFEA]">
                  {notifications.length === 0 ? (
                    <p className="py-6 text-center text-xs text-[#78716C]">
                      No notifications yet.
                    </p>
                  ) : (
                    notifications.map((notif) => (
                      <div
                        key={notif.id}
                        onClick={() => {
                          markAsRead(notif.id);
                          if (notif.actionUrl) {
                            router.push(notif.actionUrl);
                            setIsNotifOpen(false);
                          }
                        }}
                        className={`pt-2.5 pb-2 px-2 rounded-xl cursor-pointer transition-colors ${
                          notif.read
                            ? 'hover:bg-[#F4EFEA]/60 opacity-80'
                            : 'bg-[#B4533C]/5 hover:bg-[#B4533C]/10'
                        }`}
                      >
                        <div className="flex items-start justify-between gap-2">
                          <p className="text-xs font-semibold text-[#1C1917]">
                            {notif.title}
                          </p>
                          {!notif.read && (
                            <span className="h-2 w-2 rounded-full bg-[#B4533C] shrink-0 mt-1" />
                          )}
                        </div>
                        <p className="text-xs text-[#57534E] mt-1 line-clamp-2">
                          {notif.body}
                        </p>
                        <span className="text-[10px] text-[#78716C] mt-1 block">
                          {new Date(notif.createdAt).toLocaleTimeString([], {
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </span>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Profile Dropdown */}
          <div className="relative" ref={profileRef}>
            <button
              onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
              className="flex items-center gap-2 rounded-full p-1 hover:ring-2 hover:ring-[#B4533C]/30 transition-all"
              aria-label="User profile menu"
            >
              {user?.profileImage ? (
                <img
                  src={user.profileImage}
                  alt={user.name || 'User'}
                  className="h-8 w-8 rounded-full object-cover border border-[#E7E0D6]"
                />
              ) : (
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#E7E0D6] text-xs font-semibold text-[#57534E]">
                  {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
                </div>
              )}
            </button>

            {isProfileMenuOpen && (
              <div className="absolute right-0 mt-2 w-56 rounded-2xl glass-dropdown p-2 shadow-xl z-50 animate-in fade-in zoom-in-95 duration-150">
                <div className="border-b border-[#E7E0D6] px-3 py-2.5">
                  <p className="text-sm font-semibold text-[#1C1917] truncate">
                    {user?.name || 'Aarav Sharma'}
                  </p>
                  <p className="text-xs text-[#78716C] truncate">
                    {user?.email || user?.phone || 'Style Enthusiast'}
                  </p>
                </div>
                <div className="py-1">
                  <Link
                    href="/profile"
                    onClick={() => setIsProfileMenuOpen(false)}
                    className="flex items-center gap-2.5 rounded-lg px-3 py-2 text-xs font-medium text-[#57534E] hover:bg-[#F4EFEA] hover:text-[#1C1917] transition-colors"
                  >
                    <User className="h-4 w-4" />
                    My Style Profile
                  </Link>
                  <Link
                    href="/settings"
                    onClick={() => setIsProfileMenuOpen(false)}
                    className="flex items-center gap-2.5 rounded-lg px-3 py-2 text-xs font-medium text-[#57534E] hover:bg-[#F4EFEA] hover:text-[#1C1917] transition-colors"
                  >
                    <Sliders className="h-4 w-4" />
                    Settings & Demo Data
                  </Link>
                </div>
                <div className="border-t border-[#E7E0D6] pt-1">
                  <button
                    onClick={handleLogout}
                    className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-xs font-medium text-[#B4533C] hover:bg-[#B4533C]/10 transition-colors"
                  >
                    <LogOut className="h-4 w-4" />
                    Log out
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Global Search Modal */}
      <GlobalSearchModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
    </>
  );
};
