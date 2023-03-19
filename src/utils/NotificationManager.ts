import browser from "webextension-polyfill";

export class NotificationManager {
  private static instance: NotificationManager | null = null;

  private notificationCache: NtfyNotification[] = [];

  constructor() {
    if (NotificationManager.instance) {
      return NotificationManager.instance;
    }
    NotificationManager.instance = this;
  }

  getNotificationById(notificationId: string) {
    return this.notificationCache.find(
      (notification) => notification.id === notificationId
    );
  }

  private addToCache(notification: NtfyNotification) {
    this.notificationCache.push(notification);
  }

  onClick(notificationId: string) {
    const notification = this.getNotificationById(notificationId);
    if (
      !notification ||
      (!notification.click && !notification.attachment?.url)
    ) {
      return Promise.resolve();
    }

    return browser.tabs.create({
      url: notification.click || notification.attachment?.url,
    });
  }

  private getBaseNotificationOptions(
    notification: NtfyNotification
  ): Omit<browser.Notifications.CreateNotificationOptions, "type"> {
    let priority = (notification.priority || 0) - 3;
    if (priority < 0) {
      priority = 0;
    }

    return {
      iconUrl: "../ntfy-512.png",
      title: notification.title || notification.topic,
      message: notification.message || "",
      priority,
      eventTime: notification.time,
      isClickable: !!notification.click,
    };
  }

  private getNotificationOptions(
    notification: NtfyNotification
  ): browser.Notifications.CreateNotificationOptions {
    if (
      notification.attachment &&
      notification.attachment.type.startsWith("image/")
    ) {
      return {
        type: "image",
        imageUrl: notification.attachment.url,
        ...this.getBaseNotificationOptions(notification),
      };
    }

    return {
      type: "basic",
      ...this.getBaseNotificationOptions(notification),
    };
  }

  async publish(notification: NtfyNotification) {
    await browser.notifications.create(
      notification.id,
      this.getNotificationOptions(notification)
    );
    this.addToCache(notification);
  }
}
