import { action } from "webextension-polyfill";

export interface BadgeNumberManagerInterface {
  lower: () => Promise<void>;
  higher: () => Promise<void>;
  reset: () => Promise<void>;
}

export default class BadgeNumberManager implements BadgeNumberManagerInterface {
  private static instance: BadgeNumberManager | null = null;

  // TODO: Sync number between instances by using storage.local API
  private currentNumber = 0;

  constructor() {
    if (BadgeNumberManager.instance) {
      return BadgeNumberManager.instance;
    }
    BadgeNumberManager.instance = this;
  }

  reset() {
    this.currentNumber = 0;
    return this.setText();
  }

  lower() {
    if (!this.currentNumber) return Promise.resolve();

    this.currentNumber -= 1;
    return this.setText();
  }

  higher() {
    this.currentNumber += 1;
    return this.setText();
  }

  private setText() {
    let text = this.currentNumber.toString();
    if (this.currentNumber < 1) {
      text = "";
    }
    return action.setBadgeText({ text });
  }
}
