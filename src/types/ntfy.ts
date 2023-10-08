interface NtfyNotificationAttachment {
  name: string;
  url: string;
  type: string;
  size: number;
  expires: number;
}

export interface NtfyViewAction {
  action: "view";
  label: string;
  url: string;
  clear?: boolean;
}

interface NtfyBroadcastAction {
  action: "broadcast";
  label: string;
  intent?: string;
  extras?: Record<string, string>;
  clear?: boolean;
}

interface NtfyHttpAction {
  action: "http";
  label: string;
  url: string;
  method?:
    | "CONNECT"
    | "DELETE"
    | "GET"
    | "HEAD"
    | "OPTIONS"
    | "PATCH"
    | "POST"
    | "PUT"
    | "TRACE";
  body?: string;
  headers?: Record<string, string>;
  clear?: boolean;
}

export type NtfyNotificationAction =
  | NtfyViewAction
  | NtfyBroadcastAction
  | NtfyHttpAction;

export interface NtfyNotification {
  id: string;
  time: number;
  expires: number;
  event: "open" | "keepalive" | "message" | "poll_request";
  topic: string;
  message?: string;
  title?: string;
  tags?: string[];
  priority?: 1 | 2 | 3 | 4 | 5;
  click?: string;
  actions?: NtfyNotificationAction[];
  attachment?: NtfyNotificationAttachment;
}
