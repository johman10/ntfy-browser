import BadgeNumberManager from "./utils/BadgeNumberManager";
import NtfyNotificationManager from "./utils/NtfyNotificationManager";
import BrowserNotificationManager from "./utils/BrowserNotificationManager";
import TopicSubscriptionManager from "./utils/TopicSubscriptionManager";
import BackgroundMessageHandler from "./utils/messages/BackgroundMessageHandler";
import ErrorHandler from "./utils/ErrorHandler";

const badgeNumberManager = new BadgeNumberManager();
const ntfyNotificationManager = new NtfyNotificationManager(badgeNumberManager);
const browserNotificationManager = new BrowserNotificationManager();
const errorHandler = new ErrorHandler(browserNotificationManager);
const topicSubscriptionManager = new TopicSubscriptionManager(
  ntfyNotificationManager,
);
const backgroundMessageHandler = new BackgroundMessageHandler(
  topicSubscriptionManager,
  errorHandler,
);

browserNotificationManager.startClickListener();
ntfyNotificationManager.startClickListener();
topicSubscriptionManager.subscribeAll();
backgroundMessageHandler.init();
