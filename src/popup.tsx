import React, { useEffect } from "react";
import { createRoot } from "react-dom/client";
import BadgeNumberManager from "./utils/BadgeNumberManager";
import { runtime } from "webextension-polyfill";
import AppBar from "./components/AppBar/AppBar";
import { IconButton, Typography } from "@mui/material";
import SettingsIcon from "@mui/icons-material/Settings";

const badgeNumberManager = new BadgeNumberManager();

const Popup = () => {
  useEffect(() => {
    badgeNumberManager.reset();
  }, []);

  const openOptions = () => {
    if (runtime.openOptionsPage) {
      runtime.openOptionsPage();
    } else {
      window.open(runtime.getURL("options.html"));
    }
  };

  return (
    <div style={{ minWidth: "700px" }}>
      <AppBar title="ntfy">
        <IconButton onClick={openOptions} color="inherit">
          <SettingsIcon />
        </IconButton>
      </AppBar>
      <Typography>
        This will soon show some more information, such as previous notification
        and the option to push notifications
      </Typography>
    </div>
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
