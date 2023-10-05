import MessageHandler from "./MessageHandler";
import { BackgroundMessageType } from "./BackgroundMessageHandler";
import {
  SubscriptionResult,
  SubscriptionResultStatus,
} from "../../types/extension";

export const enum OptionsMessageType {}

export interface OptionsMessage {
  type: OptionsMessageType;
  data: any;
}

export default class OptionsMessageHandler extends MessageHandler<
  OptionsMessage,
  BackgroundMessageType
> {
  async reconnectTopics() {
    const response = await this.sendMessage<SubscriptionResult[]>(
      BackgroundMessageType.RECONNECT_TOPICS
    );
    if (response) {
      return response.filter(
        (eventResponse) =>
          eventResponse.status === SubscriptionResultStatus.FAILURE
      );
    } else {
      return [];
    }
  }
}
