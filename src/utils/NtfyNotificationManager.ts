import { Notifications, notifications, tabs } from "webextension-polyfill";
import { BadgeNumberManager } from "./BadgeNumberManager";
import { NtfyNotification } from "../types/ntfy";

export class NtfyNotificationManager {
  private static instance: NtfyNotificationManager;

  private notificationCache: NtfyNotification[] = [];
  private badgeNumberManager: BadgeNumberManager | null = null;

  constructor(badgeNumberManager: BadgeNumberManager) {
    if (NtfyNotificationManager.instance) {
      return NtfyNotificationManager.instance;
    }
    NtfyNotificationManager.instance = this;
    this.badgeNumberManager = badgeNumberManager;
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

    return tabs.create({
      url: notification.click || notification.attachment?.url,
    });
  }

  private getBaseNotificationOptions(
    notification: NtfyNotification
  ): Omit<Notifications.CreateNotificationOptions, "type"> {
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
  ): Notifications.CreateNotificationOptions {
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
    await notifications.create(
      notification.id,
      this.getNotificationOptions(notification)
    );
    this.addToCache(notification);

    this.badgeNumberManager?.higher();
  }

  startClickListener() {
    notifications.onClicked.addListener((notificationId) => {
      return this.onClick(notificationId).then(() => {
        this.badgeNumberManager?.lower();
      });
    });
  }
}
