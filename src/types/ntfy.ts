interface NtfyNotificationAttachment {
  name: string;
  url: string;
  type: string;
  size: number;
  expires: number;
}

interface NtfyNotification {
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
  // TODO: Declare type
  actions?: [];
  attachment?: NtfyNotificationAttachment;
}
