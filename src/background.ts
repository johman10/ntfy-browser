import BadgeNumberManager from "./utils/BadgeNumberManager";
import NtfyNotificationManager from "./utils/NtfyNotificationManager";
import BrowserNotificationManager from "./utils/BrowserNotificationManager";
import TopicSubscriptionManager from "./utils/TopicSubscriptionManager";
import BackgroundMessageHandler from "./utils/messages/BackgroundMessageHandler";
import ErrorHandler from "./utils/ErrorHandler";

async function init() {
  const badgeNumberManager = await BadgeNumberManager.init();
  badgeNumberManager.startStorageChangeListener();
  const ntfyNotificationManager =
    await NtfyNotificationManager.init(badgeNumberManager);
  const browserNotificationManager = new BrowserNotificationManager();
  const errorHandler = new ErrorHandler(browserNotificationManager);
  const topicSubscriptionManager = new TopicSubscriptionManager(
    ntfyNotificationManager
  );
  const backgroundMessageHandler = new BackgroundMessageHandler(
    topicSubscriptionManager,
    errorHandler
  );

  browserNotificationManager.startClickListener();
  ntfyNotificationManager.startClickListener();
  topicSubscriptionManager.subscribeAll();
  backgroundMessageHandler.init();
}

init();
