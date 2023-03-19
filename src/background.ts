import browser from "webextension-polyfill";
import { EventMessage, TopicConfig } from "./types/extension";
import { BadgeNumberManager } from "./utils/BadgeNumberManager";
import { BROWSER_TOPIC_CONFIGS_STORAGE_KEY } from "./utils/constants";
import { NotificationManager } from "./utils/NotificationManager";
import { assertNever } from "./utils/types";

let eventSources: EventSource[] = [];
const notificationManager = new NotificationManager();
const badgeNumberManager = new BadgeNumberManager();

function getTopicConfigs(): Promise<TopicConfig[]> {
  return browser.storage.sync
    .get({
      [BROWSER_TOPIC_CONFIGS_STORAGE_KEY]: [],
    })
    .then((storage) => {
      return storage[BROWSER_TOPIC_CONFIGS_STORAGE_KEY];
    });
}

function closeEventSource(eventSource: EventSource): void {
  console.log("Closing eventSource", eventSource.url);
  eventSource.close();
  eventSources = eventSources.filter((es) => es.url !== eventSource.url);
}

function getTopicQuery(topicConfig: TopicConfig): string {
  const authHeader = `Bearer ${topicConfig.token}`;
  const auth = btoa(authHeader).replace(/=+$/, "");
  const query = new URLSearchParams({ auth });
  return query.toString();
}

function subscribe() {
  console.log("Subscribing");
  getTopicConfigs().then((topicConfigs) => {
    console.log("Found topicConfigs", topicConfigs);
    topicConfigs.forEach((topicConfig) => {
      const query = getTopicQuery(topicConfig);
      const eventSourceUrl = new URL(
        `${topicConfig.name}/sse?${query}`,
        topicConfig.hostname
      );
      const eventSource = new EventSource(eventSourceUrl);

      eventSource.onmessage = (e) => {
        const notificationData: NtfyNotification = JSON.parse(e.data);
        notificationManager.publish(notificationData).then(() => {
          return badgeNumberManager.higher();
        });
      };

      eventSource.onerror = () => {
        closeEventSource(eventSource);
      };

      eventSource.onopen = () => {
        console.log("EventSource opened", eventSource.url);
        if (!eventSources.includes(eventSource)) {
          eventSources = [...eventSources, eventSource];
        }
      };
    });
  });
}

function unsubscribe() {
  console.log("Unsubscribing");
  eventSources.forEach(closeEventSource);
}

subscribe();

browser.runtime.onMessage.addListener((message: EventMessage) => {
  console.log("messageListener", message);
  if (message.event === "configSave") {
    unsubscribe();
    subscribe();
    return;
  }

  assertNever(message.event);
});

browser.notifications.onClicked.addListener((notificationId) => {
  notificationManager.onClick(notificationId).then(() => {
    badgeNumberManager.lower();
  });
});

// This does not get triggered at the right time due to OS limitations
// https://bugs.chromium.org/p/chromium/issues/detail?id=1212142
browser.notifications.onClosed.addListener(
  (notificationId: string, byUser: boolean) => {
    console.log("reached");
    const notification =
      notificationManager.getNotificationById(notificationId);
    console.log("closed", notificationId, byUser, notification);
    if (!notification || !byUser) return;

    badgeNumberManager.lower();
  }
);
