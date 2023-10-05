import MockBadgeNumberManager from "../__mocks__/BadgeNumberManager";

jest.mock("webextension-polyfill");

type NtfyNotificationManagerImport =
  typeof import("../NtfyNotificationManager");

describe("NtfyNotificationManager", () => {
  const mockBadgeNumberManager = new MockBadgeNumberManager();
  let NtfyNotificationManager: NtfyNotificationManagerImport["default"];

  beforeEach(async () => {
    jest.resetAllMocks();

    jest.isolateModules(() => {
      const module = jest.requireActual<NtfyNotificationManagerImport>(
        "../NtfyNotificationManager",
      );
      NtfyNotificationManager = module.default;
    });
  });

  it("is a singleton", () => {
    const badgeNumberManager1 = new NtfyNotificationManager(
      mockBadgeNumberManager,
    );
    const badgeNumberManager2 = new NtfyNotificationManager(
      mockBadgeNumberManager,
    );

    expect(badgeNumberManager1).toBe(badgeNumberManager2);
  });
});
