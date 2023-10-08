import { Notifications, notifications, tabs } from "webextension-polyfill";
import { BadgeNumberManagerInterface } from "./BadgeNumberManager";
import { NtfyNotification } from "../types/ntfy";
import { storage } from "webextension-polyfill";
import { NOTIFICATIONS_CACHE_STORAGE_KEY } from "./constants";

export default class NtfyNotificationManager {
  private static instance: NtfyNotificationManager;

  private notificationCache: NtfyNotification[] = [];

  restorePromise: Promise<void> = new Promise(() => {});

  constructor(private badgeNumberManager: BadgeNumberManagerInterface) {}

  static async init(badgeNumberManager: BadgeNumberManagerInterface) {
    if (NtfyNotificationManager.instance) {
      return NtfyNotificationManager.instance;
    }
    NtfyNotificationManager.instance = new NtfyNotificationManager(
      badgeNumberManager
    );

    await storage.local
      .get([NOTIFICATIONS_CACHE_STORAGE_KEY])
      .then((storage) => {
        const value = storage[NOTIFICATIONS_CACHE_STORAGE_KEY];
        if (!value) return;

        NtfyNotificationManager.instance.notificationCache = value;
      })
      .catch(console.error);

    return NtfyNotificationManager.instance;
  }

  getNotificationById(notificationId: string) {
    return this.notificationCache.find(
      (notification) => notification.id === notificationId
    );
  }

  getAll() {
    return [...this.notificationCache].reverse();
  }

  private async addToCache(notification: NtfyNotification) {
    this.notificationCache.push(notification);

    // Remove the oldest notification when the limit is reached
    // TODO: make this configurable?
    if (this.notificationCache.length > 50) {
      this.notificationCache.shift();
    }

    await storage.local
      .set({ [NOTIFICATIONS_CACHE_STORAGE_KEY]: this.notificationCache })
      .catch(console.error);
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
      eventTime: notification.time * 1000,
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
    await this.addToCache(notification);

    this.badgeNumberManager.higher();
  }

  startClickListener() {
    notifications.onClicked.addListener((notificationId) => {
      return this.onClick(notificationId).then(() => {
        this.badgeNumberManager.lower();
      });
    });
  }
}
