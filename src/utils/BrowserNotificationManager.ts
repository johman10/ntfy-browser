import { Notifications, notifications, tabs } from "webextension-polyfill";

type BrowserNotification = Notifications.CreateNotificationOptions & {
  id: string;
  click?: string;
};
export default class BrowserNotificationManager {
  private static instance: BrowserNotificationManager | null = null;

  private notificationCache: BrowserNotification[] = [];

  constructor() {
    if (BrowserNotificationManager.instance) {
      return BrowserNotificationManager.instance;
    }
    BrowserNotificationManager.instance = this;
  }

  private getNotificationById(notificationId: string) {
    return this.notificationCache.find(
      (notification) => notification.id === notificationId
    );
  }

  private addToCache(notification: BrowserNotification) {
    this.notificationCache.push(notification);
  }

  private onClick(notificationId: string) {
    const notification = this.getNotificationById(notificationId);
    if (!notification || !notification.isClickable) {
      return Promise.resolve();
    }

    return tabs.create({
      url: notification.click,
    });
  }

  async publish(
    id: string,
    notification: Notifications.CreateNotificationOptions,
    click?: string
  ) {
    await notifications.create(id, notification);
    this.addToCache({ ...notification, id, click });
  }

  startListeners() {
    notifications.onClicked.addListener((notificationId) => {
      return this.onClick(notificationId);
    });
  }
}
