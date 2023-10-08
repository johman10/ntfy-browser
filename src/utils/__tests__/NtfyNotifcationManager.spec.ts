import MockBadgeNumberManager from "../__mocks__/BadgeNumberManager";

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

  it("is a singleton", async () => {
    const badgeNumberManager1 = await NtfyNotificationManager.init(
      mockBadgeNumberManager,
    );
    const badgeNumberManager2 = await NtfyNotificationManager.init(
      mockBadgeNumberManager,
    );

    expect(badgeNumberManager1).toBe(badgeNumberManager2);
  });
});
