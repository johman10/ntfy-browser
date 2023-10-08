import { Backdrop, CircularProgress } from "@mui/material";
import React from "react";

export default function Loader() {
  return (
    <Backdrop
      open
      sx={{
        zIndex: 100000,
        backgroundColor: ({ palette }) =>
          palette.mode === "light" ? palette.grey[100] : palette.grey[900],
      }}
    >
      <CircularProgress color="success" disableShrink />
    </Backdrop>
  );
}
