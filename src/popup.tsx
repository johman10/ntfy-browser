import React, { useEffect } from "react";
import { createRoot } from "react-dom/client";
import BadgeNumberManager from "./utils/BadgeNumberManager";
import { runtime } from "webextension-polyfill";
import AppBar from "./components/AppBar";
import { IconButton, ThemeProvider } from "@mui/material";
import PopupContent from "./components/PopupContent";
import SettingsIcon from "@mui/icons-material/Settings";
import theme from "./utils/theme";

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
    <ThemeProvider theme={theme}>
      <div style={{ minWidth: "700px" }}>
        <AppBar title="ntfy">
          <IconButton onClick={openOptions} color="inherit">
            <SettingsIcon />
          </IconButton>
        </AppBar>
        <PopupContent badgeNumberManager={badgeNumberManager} />
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
  </React.StrictMode>,
);
