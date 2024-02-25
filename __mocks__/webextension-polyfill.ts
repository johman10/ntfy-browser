import type {
  Action,
  Notifications,
  Storage,
  Tabs,
} from "webextension-polyfill";

type DeepPartial<T> = T extends object
  ? {
      [P in keyof T]?: DeepPartial<T[P]>;
    }
  : T;

let storedValues: Record<string, unknown> = {};
export const storage: DeepPartial<Storage.Static> = {
  local: {
    set: jest.fn((values: Record<string, unknown>) => {
      storedValues = { ...storedValues, ...values };
      return Promise.resolve();
    }),
    get: jest.fn((keys: string[]) => {
      return Promise.resolve(
        keys.reduce<Record<string, unknown>>((acc, key) => {
          acc[key] = storedValues[key];
          return acc;
        }, {})
      );
    }),
    clear: jest.fn(() => {
      storedValues = {};
      return Promise.resolve;
    }),
  },
};

export const action: Partial<Action.Static> = {
  setBadgeText: jest.fn().mockResolvedValue(undefined),
};

let notificationClickListeners: ((notificationId: string) => void)[] = [];
const __triggerNotificationClickListeners = (notificationId: string) => {
  return Promise.all(
    notificationClickListeners.map((callback) => callback(notificationId))
  );
};

export const notifications: Partial<Notifications.Static> & {
  triggerClick: typeof __triggerNotificationClickListeners;
} = {
  create: jest.fn().mockResolvedValue(""),
  onClicked: {
    removeListener: jest.fn(() => {
      notificationClickListeners = [];
    }),
    hasListener: jest.fn((callback) => {
      return notificationClickListeners.includes(callback);
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

export const tabs: Partial<Tabs.Static> = {
  create: jest.fn().mockResolvedValue({}),
};

export default {
  action,
  storage,
  notifications,
  tabs,
  __triggerNotificationClickListeners,
};
