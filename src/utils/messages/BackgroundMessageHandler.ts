import MessageHandler from "./MessageHandler";
import TopicSubscriptionManager from "../TopicSubscriptionManager";
import ErrorHandler from "../ErrorHandler";
import {
  SubscriptionResultFailure,
  SubscriptionResultStatus,
} from "../../types/extension";
import { OptionsMessageType } from "./OptionsMessageHandler";

export const enum BackgroundMessageType {
  RECONNECT_TOPICS = "RECONNECT_TOPICS",
}

export interface BackgroundMessage {
  type: BackgroundMessageType;
  data: unknown;
}

export default class BackgroundMessageHandler extends MessageHandler<
  BackgroundMessage,
  OptionsMessageType
> {
  constructor(
    private topicSubscriptionManager: TopicSubscriptionManager,
    private errorHandler: ErrorHandler
  ) {
    super();
  }

  private reconnectTopics = async () => {
    this.topicSubscriptionManager.unsubscribeAll();
    try {
      const connectionResults =
        await this.topicSubscriptionManager.subscribeAll();
      const failedResponses = connectionResults.filter(
        (eventResponse): eventResponse is SubscriptionResultFailure =>
          eventResponse.status === SubscriptionResultStatus.FAILURE
      );
      if (failedResponses.length) {
        const failedTopicNames = failedResponses
          .map((eventResponse) => eventResponse.topic.name)
          .join(", ");
        this.errorHandler.report(
          new Error(`[ntfy-browser] Unable to connect to ${failedTopicNames}`),
          failedTopicNames
        );
      }
      return connectionResults;
    } catch (error) {
      this.errorHandler.report(error as Error);
      throw error;
    }
  };

  registerMessengerRequests() {
    this.requests.set(
      BackgroundMessageType.RECONNECT_TOPICS,
      this.reconnectTopics
    );
  }
}
