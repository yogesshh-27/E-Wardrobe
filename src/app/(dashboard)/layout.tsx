'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuthStore } from '@/store/useAuthStore';
import { TopNavbar } from '@/components/navigation/TopNavbar';
import { DesktopSidebar } from '@/components/navigation/DesktopSidebar';
import { MobileBottomNav } from '@/components/navigation/MobileBottomNav';
import { FloatingStylistButton } from '@/components/chat/FloatingStylistButton';
import { StylistChatDrawer } from '@/components/chat/StylistChatDrawer';
import { VirtualTryOnModal } from '@/components/stylist/VirtualTryOnModal';
import { ItemDetailModal } from '@/components/wardrobe/ItemDetailModal';
import { useWardrobeStore } from '@/store/useWardrobeStore';

import { AmbientBackground } from '@/components/ui/AmbientBackground';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const isHome = pathname === '/';
  const { isAuthenticated } = useAuthStore();
  const [isReady, setIsReady] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { selectedItem, setSelectedItem } = useWardrobeStore();

  useEffect(() => {
    if (useAuthStore.persist?.hasHydrated?.()) {
      setIsReady(true);
    } else {
      const unsub = useAuthStore.persist?.onFinishHydration?.(() => {
        setIsReady(true);
      });
      const timer = setTimeout(() => setIsReady(true), 80);
      return () => {
        unsub?.();
        clearTimeout(timer);
      };
    }
  }, []);

  useEffect(() => {
    // If authenticated check is ready and user is not authenticated, land on login page
    if (isReady && !isAuthenticated) {
      router.replace('/login');
    }
  }, [isReady, isAuthenticated, router]);

  if (!isReady || !isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-[#FAF8F5] text-[#1C1917] flex flex-col relative overflow-x-hidden">
      {/* Ambient Animated Luxury Background Glow */}
      <AmbientBackground />
      {/* Sidebar - only for dashboard subpages */}
      {!isHome && (
        <DesktopSidebar
          isOpen={isSidebarOpen}
          onClose={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Main Content Area */}
      <div className={`flex-1 flex flex-col ${isHome ? 'w-full' : 'lg:pl-64'} transition-all duration-300`}>
        {!isHome && <TopNavbar onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} />}

        <main className={`flex-1 ${isHome ? 'pb-0' : 'pb-24 lg:pb-12'}`}>
          {children}
        </main>
      </div>

      {/* Bottom Navigation for Mobile */}
      {!isHome && <MobileBottomNav />}

      {/* AI Assistant Floating Button & Chat Drawer */}
      <FloatingStylistButton />
      <StylistChatDrawer />

      {/* Global Virtual Try-on Simulation Modal */}
      <VirtualTryOnModal />

      {/* Global Wardrobe Item Details Modal */}
      <ItemDetailModal
        item={selectedItem}
        onClose={() => setSelectedItem(null)}
      />
    </div>
  );
}
