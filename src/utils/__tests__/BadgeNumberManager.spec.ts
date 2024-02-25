jest.mock("webextension-polyfill");

import { action } from "webextension-polyfill";

type BadgeNumberManagerImport = typeof import("../BadgeNumberManager");

describe("BadgeNumberManager", () => {
  let BadgeNumberManager: BadgeNumberManagerImport["default"];

  beforeEach(() => {
    jest.clearAllMocks();

    jest.isolateModules(() => {
      const module = jest.requireActual<BadgeNumberManagerImport>(
        "../BadgeNumberManager"
      );
      BadgeNumberManager = module.default;
    });
  });

  it("is a singleton", async () => {
    const badgeNumberManager1 = await BadgeNumberManager.init();
    const badgeNumberManager2 = await BadgeNumberManager.init();

    expect(badgeNumberManager1).toBe(badgeNumberManager2);
  });

  it("can higher the badge text", async () => {
    const badgeNumberManager = await BadgeNumberManager.init();

    await badgeNumberManager.higher();
    expect(action.setBadgeText).toHaveBeenNthCalledWith(1, {
      text: "1",
    });

    await badgeNumberManager.higher();
    expect(action.setBadgeText).toHaveBeenNthCalledWith(2, {
      text: "2",
    });
  });

  it("can lower the badge text", async () => {
    const badgeNumberManager = await BadgeNumberManager.init();

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

  it("can reset the badge text", async () => {
    const badgeNumberManager = await BadgeNumberManager.init();

    await badgeNumberManager.higher();

    await badgeNumberManager.reset();
    expect(action.setBadgeText).toHaveBeenNthCalledWith(2, {
      text: "",
    });
  });
});
