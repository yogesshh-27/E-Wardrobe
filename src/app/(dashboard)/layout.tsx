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
  const isShowcase = pathname === '/showcase';
  const { isAuthenticated } = useAuthStore();
  const [isReady, setIsReady] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { selectedItem, setSelectedItem } = useWardrobeStore();

  useEffect(() => {
    async function initSession() {
      // Check active Supabase or stored session
      const user = await useAuthStore.getState().checkSession();
      setIsReady(true);
      if (!isHome && !isShowcase && !user && !useAuthStore.getState().isAuthenticated) {
        router.replace('/');
      }
    }
    initSession();
  }, [router, isHome, isShowcase]);

  // If on the root landing page (login window) or showcase page, render directly without dashboard shell
  if (isHome || isShowcase) {
    return <>{children}</>;
  }

  // For protected studio routes, wait until auth check completes
  if (!isReady || !isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#FAF8F5] flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 rounded-full border-2 border-[#0284C7] border-t-transparent animate-spin" />
          <span className="text-xs font-semibold text-[#64748B] tracking-wider uppercase">Loading Atelier...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FAF8F5] text-[#1C1917] flex flex-col relative overflow-x-hidden">
      {/* Ambient Animated Luxury Background Glow */}
      <AmbientBackground />
      {/* Sidebar - only for dashboard subpages */}
      <DesktopSidebar
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col lg:pl-64 transition-all duration-300">
        <TopNavbar onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} />

        <main className="flex-1 pb-24 lg:pb-12">
          {children}
        </main>
      </div>

      {/* Bottom Navigation for Mobile */}
      <MobileBottomNav />

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
