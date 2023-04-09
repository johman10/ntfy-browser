import { action } from "webextension-polyfill";

jest.mock("webextension-polyfill");

type BadgeNumberManagerImport = typeof import("../BadgeNumberManager");

describe("BadgeNumberManager", () => {
  let BadgeNumberManager: BadgeNumberManagerImport["default"];

  beforeEach(() => {
    jest.resetAllMocks();

    jest.isolateModules(() => {
      const module = jest.requireActual<BadgeNumberManagerImport>(
        "../BadgeNumberManager"
      );
      BadgeNumberManager = module.default;
    });
  });

  it("is a singleton", () => {
    const badgeNumberManager1 = new BadgeNumberManager();
    const badgeNumberManager2 = new BadgeNumberManager();

    expect(badgeNumberManager1).toBe(badgeNumberManager2);
  });

  it("can higher the badge text", async () => {
    const badgeNumberManager = new BadgeNumberManager();

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
    const badgeNumberManager = new BadgeNumberManager();

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
    const badgeNumberManager = new BadgeNumberManager();

    await badgeNumberManager.higher();

    await badgeNumberManager.reset();
    expect(action.setBadgeText).toHaveBeenNthCalledWith(2, {
      text: "",
    });
  });
});
