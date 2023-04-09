import { Action, Notifications } from "webextension-polyfill";

export const action: Partial<Action.Static> = {
  setBadgeText: jest.fn().mockResolvedValue(undefined),
};

const __triggerNotificationClickListeners = (notificationId: string) => {
  notificationClickListeners.forEach((callback) => callback(notificationId));
};

let notificationClickListeners: ((notificationId: string) => void)[] = [];
export const notifications: Partial<Notifications.Static> & {
  triggerClick: typeof __triggerNotificationClickListeners;
} = {
  create: jest.fn().mockResolvedValue(undefined),
  onClicked: {
    removeListener: jest.fn((callback) => {
      notificationClickListeners = notificationClickListeners.filter(
        (rc) => rc !== callback
      );
    }),
    hasListener: jest.fn(() => {
      return !!notificationClickListeners.length;
    }),
    hasListeners: jest.fn(() => {
      return !!notificationClickListeners.length;
    }),
    addListener: jest.fn((callback) => {
      notificationClickListeners.push(callback);
    }),
  },
  triggerClick: __triggerNotificationClickListeners,
};

export default {
  action,
  notifications,
  __triggerNotificationClickListeners,
};
