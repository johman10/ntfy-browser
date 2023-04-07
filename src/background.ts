import { runtime, i18n } from "webextension-polyfill";
import {
  EventMessage,
  EventResponse,
  EventResponseType,
} from "./types/extension";
import { BadgeNumberManager } from "./utils/BadgeNumberManager";
import { NtfyNotificationManager } from "./utils/NtfyNotificationManager";
import { assertNever } from "./utils/types";
import BrowserNotificationManager from "./utils/BrowserNotificationManager";
import TopicSubscriptionManager from "./utils/TopicSubscriptionManager";

const badgeNumberManager = new BadgeNumberManager();
const ntfyNotificationManager = new NtfyNotificationManager(badgeNumberManager);
const browserNotificationManager = new BrowserNotificationManager();
const topicSubscriptionManager = new TopicSubscriptionManager(
  ntfyNotificationManager
);

function reportError(error: any, failedTopicNames?: string) {
  console.error(error);

  if (!failedTopicNames) {
    return;
  }

  browserNotificationManager.publish(
    crypto.randomUUID(),
    {
      type: "basic",
      iconUrl: "../ntfy-512.png",
      title: i18n.getMessage(
        "connectFailureNotificationTitle",
        failedTopicNames
      ),
      message: i18n.getMessage("connectFailureNotificationMessage"),
      isClickable: true,
    },
    runtime.getURL("options.html")
  );
}

runtime.onMessage.addListener(
  (message: EventMessage): Promise<EventResponse[]> => {
    if (message.event === "configSave") {
      topicSubscriptionManager.unsubscribeAll();
      return topicSubscriptionManager
        .subscribeAll()
        .then((connectionResults) => {
          const failedResponses = connectionResults.filter(
            (eventResponse) =>
              eventResponse.event === EventResponseType.CONNECTION_FAILED
          );
          if (failedResponses.length) {
            let failedTopicNames = failedResponses
              .map((eventResponse) => eventResponse.topicConfig.name)
              .join(", ");
            reportError(
              new Error(
                `[ntfy-browser] Unable to connect to ${failedTopicNames}`
              ),
              failedTopicNames
            );
          }

          return connectionResults;
        })
        .catch((error) => {
          reportError(error);
          throw error;
        });
    }

    assertNever(message.event);
    return Promise.resolve([]);
  }
);

browserNotificationManager.startClickListener();
ntfyNotificationManager.startClickListener();
topicSubscriptionManager.subscribeAll().catch(reportError);
