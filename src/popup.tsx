import React, { useEffect } from "react";
import ReactDOM from "react-dom";
import { BadgeNumberManager } from "./utils/BadgeNumberManager";

const Popup = () => {
  useEffect(() => {
    new BadgeNumberManager().reset();
  }, []);

  return (
    <div style={{ minWidth: "700px" }}>
      This will be filled with notification history soon
    </div>
  );
};

ReactDOM.render(
  <React.StrictMode>
    <Popup />
  </React.StrictMode>,
  document.getElementById("root")
);
