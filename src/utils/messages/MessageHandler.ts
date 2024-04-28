import { Runtime, runtime } from "webextension-polyfill";
import {
  BackgroundMessage,
  BackgroundMessageType,
} from "./BackgroundMessageHandler";
import { OptionsMessage, OptionsMessageType } from "./OptionsMessageHandler";

export default class MessageHandler<
  MessageToHandle extends BackgroundMessage | OptionsMessage,
  SendingMessageType extends BackgroundMessageType | OptionsMessageType,
> {
  requests = new Map<
    MessageToHandle["type"],
    (data: unknown, sender: Runtime.MessageSender) => void
  >();

  registerMessengerRequests() {
    throw new Error(
      "Implementation error: missing overwrite for registerMessengerRequests"
    );
  }

  listenForMessages() {
    runtime.onMessage.addListener((message: MessageToHandle, sender) => {
      const { type, data } = message;
      const handler = this.requests.get(type);
      if (!handler) {
        console.warn("Ignored message", message, sender);
        return;
      }
      return handler(data, sender);
    });
  }

  protected async sendMessage<T>(
    type: SendingMessageType,
    data: unknown = null
  ): Promise<T | null> {
    try {
      const response = await runtime.sendMessage({ type, data });
      return response;
    } catch (error) {
      console.error("sendMessage error: ", error);
      return null;
    }
  }

  init() {
    // 1. Create a mapping for message listeners
    this.registerMessengerRequests();

    // 2. Listen for messages and run the listener from the map
    this.listenForMessages();
  }
}
