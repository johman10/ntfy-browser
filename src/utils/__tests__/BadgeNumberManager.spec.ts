jest.mock("webextension-polyfill");

import { action, storage } from "webextension-polyfill";
import { BADGE_NUMBER_MANAGER_STORAGE_KEY } from "../constants";

type BadgeNumberManagerImport = typeof import("../BadgeNumberManager");

describe("BadgeNumberManager", () => {
  let BadgeNumberManager: BadgeNumberManagerImport["default"];

  beforeEach(() => {
    jest.clearAllMocks();
    storage.local.clear();

    jest.isolateModules(() => {
      const module = jest.requireActual<BadgeNumberManagerImport>(
        "../BadgeNumberManager"
      );
      BadgeNumberManager = module.default;
    });
  });

  it("is a singleton", async () => {
    const badgeNumberManager1 = await BadgeNumberManager.init(true);
    const badgeNumberManager2 = await BadgeNumberManager.init();

    expect(badgeNumberManager1).toBe(badgeNumberManager2);
  });

  it("restores values from storage", async () => {
    await storage.local.set({
      [BADGE_NUMBER_MANAGER_STORAGE_KEY]: {
        currentNumber: 2,
      },
    });

    const badgeNumberManager = await BadgeNumberManager.init(true);
    await badgeNumberManager.higher();
    expect(action.setBadgeText).toHaveBeenNthCalledWith(1, {
      text: "3",
    });
  });

  describe("higher", () => {
    it("can higher the badge text", async () => {
      const badgeNumberManager = await BadgeNumberManager.init(true);

      await badgeNumberManager.higher();
      expect(action.setBadgeText).toHaveBeenNthCalledWith(1, {
        text: "1",
      });

      await badgeNumberManager.higher();
      expect(action.setBadgeText).toHaveBeenNthCalledWith(2, {
        text: "2",
      });
    });

    it("stores the new value", async () => {
      const badgeNumberManager = await BadgeNumberManager.init(true);

      await badgeNumberManager.higher();
      expect(storage.local.set).toHaveBeenCalledTimes(1);
      expect(storage.local.set).toHaveBeenCalledWith({
        [BADGE_NUMBER_MANAGER_STORAGE_KEY]: { currentNumber: 1 },
      });
    });
  });

  describe("lower", () => {
    it("can lower the badge text", async () => {
      const badgeNumberManager = await BadgeNumberManager.init(true);

      await badgeNumberManager.higher();
      await badgeNumberManager.higher();

      await badgeNumberManager.lower();
      expect(action.setBadgeText).toHaveBeenNthCalledWith(3, {
        text: "1",
      });

      await badgeNumberManager.lower();
      expect(action.setBadgeText).toHaveBeenNthCalledWith(4, {
        text: "",
      });
    });

    it("stores the new value", async () => {
      const badgeNumberManager = await BadgeNumberManager.init(true);

      await badgeNumberManager.higher();
      await badgeNumberManager.lower();
      expect(storage.local.set).toHaveBeenCalledTimes(2);
      expect(storage.local.set).toHaveBeenNthCalledWith(2, {
        [BADGE_NUMBER_MANAGER_STORAGE_KEY]: { currentNumber: 0 },
      });
    });
  });

  describe("reset", () => {
    it("can reset the badge text", async () => {
      const badgeNumberManager = await BadgeNumberManager.init(true);

      await badgeNumberManager.higher();

      await badgeNumberManager.reset();
      expect(action.setBadgeText).toHaveBeenNthCalledWith(2, {
        text: "",
      });
    });

    it("stores the new value", async () => {
      const badgeNumberManager = await BadgeNumberManager.init(true);

      await badgeNumberManager.higher();
      await badgeNumberManager.reset();
      expect(storage.local.set).toHaveBeenCalledTimes(2);
      expect(storage.local.set).toHaveBeenNthCalledWith(2, {
        [BADGE_NUMBER_MANAGER_STORAGE_KEY]: { currentNumber: 0 },
      });
    });
  });
});
