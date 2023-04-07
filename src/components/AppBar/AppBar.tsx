import React from "react";
import {
  AppBar as MaterialAppBar,
  Box,
  Toolbar,
  Typography,
} from "@mui/material";
import theme from "../../utils/theme";

export default function AppBar({ title }: { title: string }) {
  return (
    <>
      <MaterialAppBar
        position="fixed"
        sx={{
          width: "100%",
        }}
      >
        <Toolbar
          sx={{
            paddingRight: "24px",
            background: `linear-gradient(150deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
          }}
        >
          <Box
            component="img"
            src="icon.svg"
            sx={{
              display: { xs: "none", sm: "block" },
              marginRight: "10px",
              height: "28px",
            }}
          />
          <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1 }}>
            {title}
          </Typography>
        </Toolbar>
      </MaterialAppBar>
      <Toolbar />
    </>
  );
}
