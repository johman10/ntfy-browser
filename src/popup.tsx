import React, { useEffect, useState } from "react";
import { createRoot } from "react-dom/client";
import BadgeNumberManager from "./utils/BadgeNumberManager";
import { runtime } from "webextension-polyfill";
import AppBar from "./components/AppBar";
import { IconButton, ThemeProvider } from "@mui/material";
import PopupContent from "./components/PopupContent";
import SettingsIcon from "@mui/icons-material/Settings";
import theme from "./utils/theme";
import Loader from "./components/Loader";
import NtfyNotificationManager from "./utils/NtfyNotificationManager";
import { NtfyNotification } from "./types/ntfy";

const Popup = () => {
  const [badgeNumberManager, setBadgeNumberManager] =
    useState<BadgeNumberManager>();
  const [loading, setLoading] = useState(true);
  const [notifications, setNotifications] = useState<NtfyNotification[]>([]);

  useEffect(() => {
    BadgeNumberManager.init()
      .then((badgeManager) => {
        badgeManager.startStorageChangeListener();
        setBadgeNumberManager(badgeManager);

        return NtfyNotificationManager.init(badgeManager);
      })
      .then((ntfyManager) => {
        setNotifications(ntfyManager.getAll());
        setLoading(false);
      })
      .catch(console.error);
  }, []);

  useEffect(() => {
    if (!badgeNumberManager) return;
    badgeNumberManager.reset();
  }, [badgeNumberManager]);

  const openOptions = () => {
    if (runtime.openOptionsPage) {
      runtime.openOptionsPage();
    } else {
      window.open(runtime.getURL("options.html"));
    }
  };

  if (loading) {
    return (
      <ThemeProvider theme={theme}>
        <Loader />
      </ThemeProvider>
    );
  }

  return (
    <ThemeProvider theme={theme}>
      <div style={{ minWidth: "700px" }}>
        <AppBar title="ntfy">
          <IconButton onClick={openOptions} color="inherit">
            <SettingsIcon />
          </IconButton>
        </AppBar>
        <PopupContent notifications={notifications} />
      </div>
    </ThemeProvider>
  );
};

// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
const rootElement = document.getElementById("root")!;
const root = createRoot(rootElement);
root.render(
  <React.StrictMode>
    <Popup />
  </React.StrictMode>
);
