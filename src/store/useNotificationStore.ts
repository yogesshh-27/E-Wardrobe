import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { NotificationItem } from '@/types';
import { notificationService } from '@/services/notificationService';

interface NotificationState {
  notifications: NotificationItem[];
  unreadCount: number;

  // Actions
  loadNotifications: () => Promise<void>;
  markAsRead: (id: string) => Promise<void>;
  markAllAsRead: () => Promise<void>;
  addNotification: (title: string, body: string, actionUrl?: string) => Promise<void>;
}

export const useNotificationStore = create<NotificationState>()(
  persist(
    (set, get) => ({
      notifications: [],
      unreadCount: 0,

      loadNotifications: async () => {
        const notifs = await notificationService.getNotifications();
        const unread = notifs.filter((n) => !n.read).length;
        set({ notifications: notifs, unreadCount: unread });
      },

      markAsRead: async (id) => {
        await notificationService.markAsRead(id);
        const updated = get().notifications.map((n) =>
          n.id === id ? { ...n, read: true } : n
        );
        set({
          notifications: updated,
          unreadCount: updated.filter((n) => !n.read).length,
        });
      },

      markAllAsRead: async () => {
        await notificationService.markAllAsRead();
        const updated = get().notifications.map((n) => ({ ...n, read: true }));
        set({
          notifications: updated,
          unreadCount: 0,
        });
      },

      addNotification: async (title, body, actionUrl) => {
        const newNotif = await notificationService.generateContextualNotification(title, {
          body,
          actionUrl,
        });
        set((state) => ({
          notifications: [newNotif, ...state.notifications],
          unreadCount: state.unreadCount + 1,
        }));
      },
    }),
    {
      name: 'ewardrobe_notification_store',
    }
  )
);
