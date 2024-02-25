jest.mock("webextension-polyfill");

import {
  ntfyNotificationClick,
  ntfyNotificationMinimal,
  ntfyNotificationImageAttachment,
  ntfyNotificationTitle,
  ntfyNotificationPriority,
} from "../../../test/fixtures/ntfyNotification";
import MockBadgeNumberManager from "../__mocks__/BadgeNumberManager";
import { NTFY_NOTIFICATION_MANAGER_STORAGE_KEY } from "../constants";
import type NtfyNotificationManager from "../NtfyNotificationManager";
import { notifications, storage, tabs } from "webextension-polyfill";

type NtfyNotificationManagerImport =
  typeof import("../NtfyNotificationManager");

describe("NtfyNotificationManager", () => {
  const mockBadgeNumberManager = new MockBadgeNumberManager();
  let NtfyNotificationManager: NtfyNotificationManagerImport["default"];

  beforeEach(async () => {
    jest.clearAllMocks();
    await storage.local.clear();

    jest.isolateModules(() => {
      const module = jest.requireActual<NtfyNotificationManagerImport>(
        "../NtfyNotificationManager"
      );
      NtfyNotificationManager = module.default;
    });
  });

  it("is a singleton", async () => {
    const ntfyNotificationManager1 = await NtfyNotificationManager.init(
      mockBadgeNumberManager,
      true
    );
    const ntfyNotificationManager2 = await NtfyNotificationManager.init(
      mockBadgeNumberManager
    );

    expect(ntfyNotificationManager1).toBe(ntfyNotificationManager2);
  });

  it("restores values from storage", async () => {
    await storage.local.set({
      [NTFY_NOTIFICATION_MANAGER_STORAGE_KEY]: {
        notificationCache: [ntfyNotificationMinimal, ntfyNotificationClick],
      },
    });

    const ntfyNotificationManager = await NtfyNotificationManager.init(
      mockBadgeNumberManager,
      true
    );
    expect(ntfyNotificationManager.getAll()[0]).toBe(ntfyNotificationClick);
    expect(ntfyNotificationManager.getAll()[1]).toBe(ntfyNotificationMinimal);
  });

  describe("getAll", () => {
    let ntfyNotificationManager: NtfyNotificationManager;
    const notification1 = structuredClone(ntfyNotificationMinimal);
    notification1.id = crypto.randomUUID();
    const notification2 = structuredClone(ntfyNotificationMinimal);
    notification2.id = crypto.randomUUID();

    beforeEach(async () => {
      ntfyNotificationManager = await NtfyNotificationManager.init(
        mockBadgeNumberManager,
        true
      );

      ntfyNotificationManager.publish(notification1);
      ntfyNotificationManager.publish(notification2);
    });

    it("returns a list of notifications", () => {
      expect(ntfyNotificationManager.getAll()).toEqual(
        expect.arrayContaining([notification1, notification2])
      );
      expect(ntfyNotificationManager.getAll()).toHaveLength(2);
    });

    it("returns the newest notification first", () => {
      expect(ntfyNotificationManager.getAll()[0]).toBe(notification2);
      expect(ntfyNotificationManager.getAll()[1]).toBe(notification1);
    });
  });

  describe("publish", () => {
    let ntfyNotificationManager: NtfyNotificationManager;

    beforeEach(async () => {
      ntfyNotificationManager = await NtfyNotificationManager.init(
        mockBadgeNumberManager,
        true
      );
    });

    it("adds the notification to the cache", async () => {
      await ntfyNotificationManager.publish(ntfyNotificationMinimal);

      expect(ntfyNotificationManager.getAll()[0]).toBe(ntfyNotificationMinimal);
    });

    it("adds the notification to storage", async () => {
      await ntfyNotificationManager.publish(ntfyNotificationMinimal);

      expect(
        await storage.local.get([NTFY_NOTIFICATION_MANAGER_STORAGE_KEY])
      ).toEqual({
        [NTFY_NOTIFICATION_MANAGER_STORAGE_KEY]: {
          notificationCache: [ntfyNotificationMinimal],
        },
      });
    });

    it("only keeps 50 notifications in the cache", async () => {
      await Promise.all(
        Array.from(Array(55)).map(() => {
          ntfyNotificationManager.publish(ntfyNotificationMinimal);
        })
      );

      expect(ntfyNotificationManager.getAll()).toHaveLength(50);
      const storageValue = await storage.local.get([
        NTFY_NOTIFICATION_MANAGER_STORAGE_KEY,
      ]);
      const storedCache =
        storageValue[NTFY_NOTIFICATION_MANAGER_STORAGE_KEY].notificationCache;
      expect(storedCache).toHaveLength(50);
    });

    it("increases the badge number", async () => {
      await ntfyNotificationManager.publish(ntfyNotificationMinimal);

      expect(mockBadgeNumberManager.higher).toHaveBeenCalledTimes(1);
    });

    describe("triggers a browser notification", () => {
      it("with topic", async () => {
        await ntfyNotificationManager.publish(ntfyNotificationMinimal);

        expect(notifications.create).toHaveBeenCalledTimes(1);
        expect(notifications.create).toHaveBeenCalledWith(
          ntfyNotificationMinimal.id,
          {
            eventTime: ntfyNotificationMinimal.time * 1000,
            iconUrl: "../ntfy-512.png",
            isClickable: false,
            message: "",
            priority: 0,
            title: ntfyNotificationMinimal.topic,
            type: "basic",
          }
        );
      });

      it("with image", async () => {
        await ntfyNotificationManager.publish(ntfyNotificationImageAttachment);

        expect(notifications.create).toHaveBeenCalledTimes(1);
        expect(notifications.create).toHaveBeenCalledWith(
          ntfyNotificationImageAttachment.id,
          {
            eventTime: ntfyNotificationImageAttachment.time * 1000,
            iconUrl: "../ntfy-512.png",
            isClickable: false,
            message: "",
            priority: 0,
            title: ntfyNotificationImageAttachment.topic,
            imageUrl: "https://google.com/something.png",
            type: "image",
          }
        );
      });

      it("with url", async () => {
        await ntfyNotificationManager.publish(ntfyNotificationClick);

        expect(notifications.create).toHaveBeenCalledTimes(1);
        expect(notifications.create).toHaveBeenCalledWith(
          ntfyNotificationClick.id,
          {
            eventTime: ntfyNotificationClick.time * 1000,
            iconUrl: "../ntfy-512.png",
            isClickable: true,
            message: "",
            priority: 0,
            title: ntfyNotificationClick.topic,
            type: "basic",
          }
        );
      });

      it("with title", async () => {
        await ntfyNotificationManager.publish(ntfyNotificationTitle);

        expect(notifications.create).toHaveBeenCalledTimes(1);
        expect(notifications.create).toHaveBeenCalledWith(
          ntfyNotificationTitle.id,
          {
            eventTime: ntfyNotificationTitle.time * 1000,
            iconUrl: "../ntfy-512.png",
            isClickable: false,
            message: ntfyNotificationTitle.message,
            priority: 0,
            title: ntfyNotificationTitle.title,
            type: "basic",
          }
        );
      });

      it("with priority", async () => {
        await ntfyNotificationManager.publish(ntfyNotificationPriority);

        expect(notifications.create).toHaveBeenCalledTimes(1);
        expect(notifications.create).toHaveBeenCalledWith(
          ntfyNotificationPriority.id,
          {
            eventTime: ntfyNotificationPriority.time * 1000,
            iconUrl: "../ntfy-512.png",
            isClickable: false,
            message: "",
            priority: 2,
            title: "Test Topic",
            type: "basic",
          }
        );
      });
    });
  });

  describe("startListeners", () => {
    let ntfyNotificationManager: NtfyNotificationManager;

    beforeEach(async () => {
      ntfyNotificationManager = await NtfyNotificationManager.init(
        mockBadgeNumberManager,
        true
      );
      // Mocked version removes all previous listeners
      notifications.onClicked.removeListener(() => {});
    });

    it("adds an on click listener for notifications", () => {
      ntfyNotificationManager.startListeners();

      expect(notifications.onClicked?.addListener).toHaveBeenCalledTimes(1);
    });

    it("does not do anything when notification not found", async () => {
      ntfyNotificationManager.startListeners();

      await (
        notifications as unknown as {
          triggerClick: (id: string) => Promise<void>;
        }
      ).triggerClick(crypto.randomUUID());

      expect(tabs.create).toHaveBeenCalledTimes(0);
      expect(mockBadgeNumberManager.lower).toHaveBeenCalledTimes(0);
    });

    describe("notification with click", () => {
      beforeEach(async () => {
        ntfyNotificationManager.startListeners();

        await ntfyNotificationManager.publish(ntfyNotificationClick);

        await (
          notifications as unknown as {
            triggerClick: (id: string) => Promise<void>;
          }
        ).triggerClick(ntfyNotificationManager.getAll()[0].id);
      });

      it("opens the notification URL", async () => {
        expect(tabs.create).toHaveBeenCalledTimes(1);
        expect(tabs.create).toHaveBeenCalledWith({
          url: ntfyNotificationClick.click,
        });
      });

      it("lowers the badge number", () => {
        expect(mockBadgeNumberManager.lower).toHaveBeenCalledTimes(1);
      });
    });

    describe("notification with attachment", () => {
      beforeEach(async () => {
        ntfyNotificationManager.startListeners();

        await ntfyNotificationManager.publish(ntfyNotificationImageAttachment);

        await (
          notifications as unknown as {
            triggerClick: (id: string) => Promise<void>;
          }
        ).triggerClick(ntfyNotificationManager.getAll()[0].id);
      });

      it("opens the notification URL", () => {
        expect(tabs.create).toHaveBeenCalledTimes(1);
        expect(tabs.create).toHaveBeenCalledWith({
          url: ntfyNotificationImageAttachment.attachment!.url,
        });
      });

      it("lowers the badge number", () => {
        expect(mockBadgeNumberManager.lower).toHaveBeenCalledTimes(1);
      });
    });

    describe("without action", () => {
      beforeEach(async () => {
        ntfyNotificationManager.startListeners();

        await ntfyNotificationManager.publish(ntfyNotificationMinimal);

        await (
          notifications as unknown as {
            triggerClick: (id: string) => Promise<void>;
          }
        ).triggerClick(ntfyNotificationManager.getAll()[0].id);
      });

      it("opens the notification URL", () => {
        expect(tabs.create).toHaveBeenCalledTimes(0);
      });

      it("lowers the badge number", () => {
        expect(mockBadgeNumberManager.lower).toHaveBeenCalledTimes(1);
      });
    });
  });
});
