import { NotificationItem } from '@/types';
import { INotificationService } from './interfaces';

const INITIAL_NOTIFICATIONS: NotificationItem[] = [
  {
    id: 'n-1',
    userId: 'user-default',
    type: 'daily_look',
    title: "Today's Style Curated: 'Minimal Monday'",
    body: 'We paired your White Poplin Shirt with Charcoal Pleated Trousers for an effortless start to the week.',
    read: false,
    actionUrl: '/recommendations',
    createdAt: new Date(Date.now() - 1000 * 60 * 45).toISOString(),
  },
  {
    id: 'n-2',
    userId: 'user-default',
    type: 'occasion',
    title: 'Upcoming Occasion: Cocktail Dinner',
    body: 'Your camel blazer is ready. Try pairing with tailored trousers and oxford shoes.',
    read: false,
    actionUrl: '/occasions',
    createdAt: new Date(Date.now() - 1000 * 60 * 180).toISOString(),
  },
  {
    id: 'n-3',
    userId: 'user-default',
    type: 'shopping',
    title: 'Complete Your Look with Chelsea Boots',
    body: 'We noticed a missing boot pairing for winter evenings. 40% off on Amazon.',
    read: true,
    actionUrl: '/shopping',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
  },
  {
    id: 'n-4',
    userId: 'user-default',
    type: 'packing_reminder',
    title: 'Goa Trip: 4 items left to pack',
    body: 'Your linen kurta and sunscreen are still unpacked on your smart list.',
    read: true,
    actionUrl: '/travel',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString(),
  },
];

export class NotificationService implements INotificationService {
  private notifications: NotificationItem[] = [...INITIAL_NOTIFICATIONS];

  async getNotifications(): Promise<NotificationItem[]> {
    return [...this.notifications];
  }

  async markAsRead(notificationId: string): Promise<void> {
    this.notifications = this.notifications.map((n) =>
      n.id === notificationId ? { ...n, read: true } : n
    );
  }

  async markAllAsRead(): Promise<void> {
    this.notifications = this.notifications.map((n) => ({ ...n, read: true }));
  }

  async generateContextualNotification(
    event: string,
    meta?: Record<string, unknown>
  ): Promise<NotificationItem> {
    const newNotif: NotificationItem = {
      id: `n-${Date.now()}`,
      userId: 'user-default',
      type: 'ai_recommendation',
      title: `AI Stylist: ${event}`,
      body: (meta?.body as string) || 'Your wardrobe intelligence has been updated with new matching outfits.',
      read: false,
      actionUrl: (meta?.actionUrl as string) || '/recommendations',
      createdAt: new Date().toISOString(),
    };
    this.notifications.unshift(newNotif);
    return newNotif;
  }
}

export const notificationService = new NotificationService();
