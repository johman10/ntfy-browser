import browser from "webextension-polyfill";

export class BadgeNumberManager {
  private static instance: BadgeNumberManager | null = null;

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
    return browser.action.setBadgeText({ text });
  }
}
