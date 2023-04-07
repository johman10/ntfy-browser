import React, { useEffect } from "react";
import { createRoot } from "react-dom/client";
import { BadgeNumberManager } from "./utils/BadgeNumberManager";
import { runtime } from "webextension-polyfill";

const Popup = () => {
  useEffect(() => {
    new BadgeNumberManager().reset();
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
      This will be filled with notification history soon
      <button onClick={openOptions}>Options</button>
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
