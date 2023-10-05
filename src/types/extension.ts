import { BROWSER_TOPIC_CONFIGS_STORAGE_KEY } from "../utils/constants";

export interface Topic {
  id: string;
  name: string;
  hostname: string;
  token?: string;
}

export enum SubscriptionResultStatus {
  SUCCESS = "SUCCESS",
  FAILURE = "FAILURE",
}

export interface SubscriptionResultFailure {
  status: SubscriptionResultStatus.FAILURE;
  topic: Topic;
}

export interface SubscriptionResultSuccess {
  status: SubscriptionResultStatus.SUCCESS;
  topic: Topic;
}

export type SubscriptionResult =
  | SubscriptionResultFailure
  | SubscriptionResultSuccess;

export interface BrowserStorage {
  [BROWSER_TOPIC_CONFIGS_STORAGE_KEY]: Topic[];
}
