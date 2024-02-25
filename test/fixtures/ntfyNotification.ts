import { NtfyNotification } from "../../src/types/ntfy";

export const ntfyNotificationMinimal: NtfyNotification = {
  id: crypto.randomUUID(),
  time: Date.now(),
  expires: Date.now() + 1000,
  event: "message",
  topic: "Test Topic",
};

export const ntfyNotificationClick: NtfyNotification = {
  id: crypto.randomUUID(),
  time: Date.now(),
  expires: Date.now() + 1000,
  event: "message",
  topic: "Test Topic",
  click: "https://google.com",
};

export const ntfyNotificationImageAttachment: NtfyNotification = {
  id: crypto.randomUUID(),
  time: Date.now(),
  expires: Date.now() + 1000,
  event: "message",
  topic: "Test Topic",
  attachment: {
    name: "Test attachment",
    url: "https://google.com/something.png",
    type: "image/png",
    size: 100,
    expires: Date.now() + 1000,
  },
};

export const ntfyNotificationFileAttachment: NtfyNotification = {
  id: crypto.randomUUID(),
  time: Date.now(),
  expires: Date.now() + 1000,
  event: "message",
  topic: "Test Topic",
  attachment: {
    name: "Test attachment",
    url: "https://google.com/something.pdf",
    type: "application/pdf",
    size: 100,
    expires: Date.now() + 1000,
  },
};

export const ntfyNotificationTitle: NtfyNotification = {
  id: crypto.randomUUID(),
  time: Date.now(),
  expires: Date.now() + 1000,
  event: "message",
  topic: "Test Topic",
  title: "This is the title",
  message: "This is the message",
};

export const ntfyNotificationPriority: NtfyNotification = {
  id: crypto.randomUUID(),
  time: Date.now(),
  expires: Date.now() + 1000,
  event: "message",
  topic: "Test Topic",
  priority: 5,
};
