import { action, storage } from "webextension-polyfill";
import { BADGE_NUMBER_MANAGER_STORAGE_KEY } from "./constants";

export interface BadgeNumberManagerInterface {
  lower: () => Promise<void>;
  higher: () => Promise<void>;
  reset: () => Promise<void>;
}

export default class BadgeNumberManager implements BadgeNumberManagerInterface {
  private static instance: BadgeNumberManager;

  private currentNumber = 0;

  private constructor() {}

  static async init() {
    if (BadgeNumberManager.instance) {
      return BadgeNumberManager.instance;
    }
    BadgeNumberManager.instance = new BadgeNumberManager();

    const storageValue = await storage.local.get([
      BADGE_NUMBER_MANAGER_STORAGE_KEY,
    ]);
    const value = storageValue?.[BADGE_NUMBER_MANAGER_STORAGE_KEY];
    if (value) {
      BadgeNumberManager.instance.currentNumber = value.currentNumber;
    }

    return BadgeNumberManager.instance;
  }

  private async storeValue() {
    const storageValue = await storage.local.get([
      BADGE_NUMBER_MANAGER_STORAGE_KEY,
    ]);
    const classStorageValue =
      storageValue?.[BADGE_NUMBER_MANAGER_STORAGE_KEY] || {};
    await storage.local.set({
      [BADGE_NUMBER_MANAGER_STORAGE_KEY]: {
        ...classStorageValue,
        currentNumber: this.currentNumber,
      },
    });
  }

  async reset() {
    this.currentNumber = 0;
    await this.storeValue();
    await this.setText();
  }

  async lower() {
    if (!this.currentNumber) return Promise.resolve();

    this.currentNumber -= 1;
    await this.storeValue();
    await this.setText();
  }

  async higher() {
    this.currentNumber += 1;
    await this.storeValue();
    await this.setText();
  }

  private async setText() {
    let text = this.currentNumber.toString();
    if (this.currentNumber < 1) {
      text = "";
    }
    return await action.setBadgeText({ text });
  }

  startStorageChangeListener() {
    storage.local.onChanged.addListener((changes) => {
      const newValue = changes[BADGE_NUMBER_MANAGER_STORAGE_KEY]?.newValue;
      if (!newValue) return;

      this.currentNumber = newValue.currentNumber;
    });
  }
}
