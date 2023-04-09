import { storage } from "webextension-polyfill";
import { EventResponse, EventResponseType, Topic } from "../types/extension";
import { BROWSER_TOPIC_CONFIGS_STORAGE_KEY } from "./constants";
import NtfyNotificationManager from "./NtfyNotificationManager";
import { NtfyNotification } from "../types/ntfy";

export default class TopicSubscriptionManager {
  private static instance: TopicSubscriptionManager;

  private eventSources: EventSource[] = [];

  constructor(private ntfyNotificationManager: NtfyNotificationManager) {
    if (TopicSubscriptionManager.instance) {
      return TopicSubscriptionManager.instance;
    }
    TopicSubscriptionManager.instance = this;
    this.ntfyNotificationManager = ntfyNotificationManager;
  }

  private unsubscribe(eventSource: EventSource): void {
    eventSource.close();
    this.eventSources = this.eventSources.filter(
      (es) => es.url !== eventSource.url
    );
  }

  private async getTopicConfigs(): Promise<Topic[]> {
    const storedData = await storage.sync.get({
      [BROWSER_TOPIC_CONFIGS_STORAGE_KEY]: {},
    });
    return storedData[BROWSER_TOPIC_CONFIGS_STORAGE_KEY];
  }

  private getTopicQuery(token?: string): string {
    if (!token) {
      return "";
    }

    const authHeader = `Bearer ${token}`;
    const auth = window.btoa(authHeader).replace(/=+$/, "");
    const query = new URLSearchParams({ auth });
    return `?${query.toString()}`;
  }

  private subscribe(topicConfig: Topic) {
    return new Promise<EventResponse>((resolve) => {
      const query = this.getTopicQuery(topicConfig.token);
      const eventSourceUrl = new URL(
        `${topicConfig.name}/sse${query}`,
        topicConfig.hostname
      );
      const eventSource = new EventSource(eventSourceUrl);

      eventSource.onmessage = (e) => {
        const notificationData: NtfyNotification = JSON.parse(e.data);
        this.ntfyNotificationManager.publish(notificationData);
      };

      eventSource.onerror = () => {
        this.unsubscribe(eventSource);
        resolve({
          event: EventResponseType.CONNECTION_FAILED as const,
          topicConfig,
        });
      };

      eventSource.onopen = () => {
        if (!this.eventSources.includes(eventSource)) {
          this.eventSources = [...this.eventSources, eventSource];
        }
        resolve({
          event: EventResponseType.CONNECTION_SUCCESS as const,
          topicConfig,
        });
      };
    });
  }

  async subscribeAll() {
    const topicConfigs = await this.getTopicConfigs();
    const connectPromises = Object.values(topicConfigs).map(this.subscribe);
    return Promise.all(connectPromises);
  }

  unsubscribeAll() {
    this.eventSources.forEach(this.unsubscribe);
  }
}
