import { i18n, runtime } from "webextension-polyfill";
import BrowserNotificationManager from "./BrowserNotificationManager";

export default class ErrorHandler {
  constructor(private browserNotificationManager: BrowserNotificationManager) {}

  report(error: Error, failedTopicNames?: string) {
    console.error(error);

    if (!failedTopicNames) {
      return;
    }

    this.browserNotificationManager.publish(
      crypto.randomUUID(),
      {
        type: "basic",
        iconUrl: "../ntfy-512.png",
        title: i18n.getMessage(
          "connectFailureNotificationTitle",
          failedTopicNames,
        ),
        message: i18n.getMessage("connectFailureNotificationMessage"),
        isClickable: true,
      },
      runtime.getURL("options.html"),
    );
  }
}
