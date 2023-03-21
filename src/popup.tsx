import React, { useEffect } from "react";
import { createRoot } from "react-dom/client";
import { BadgeNumberManager } from "./utils/BadgeNumberManager";
import browser from "webextension-polyfill";

const Popup = () => {
  useEffect(() => {
    new BadgeNumberManager().reset();
  }, []);

  const openOptions = () => {
    if (browser.runtime.openOptionsPage) {
      browser.runtime.openOptionsPage();
    } else {
      window.open(browser.runtime.getURL("options.html"));
    }
  };

  return (
    <div style={{ minWidth: "700px" }}>
      This will be filled with notification history soon
      <button onClick={openOptions}>Options</button>
    </div>
  );
};

const rootElement = document.getElementById("root")!;
const root = createRoot(rootElement);
root.render(
  <React.StrictMode>
    <Popup />
  </React.StrictMode>
);
