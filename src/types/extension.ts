import { BROWSER_TOPIC_CONFIGS_STORAGE_KEY } from "../utils/constants";

export interface Topic {
  id: string;
  name: string;
  hostname: string;
  token?: string;
}

export interface EventMessage {
  event: "configSave";
}

export enum EventResponseType {
  CONNECTION_SUCCESS = "connectionSuccess",
  CONNECTION_FAILED = "connectionFailed",
}
export interface EventResponse {
  event: EventResponseType;
  topicConfig: Topic;
}

export interface BrowserStorage {
  [BROWSER_TOPIC_CONFIGS_STORAGE_KEY]: Topic[];
}
