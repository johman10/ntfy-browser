import { createTheme, Direction, type ThemeOptions } from "@mui/material";

const baseThemeOptions: ThemeOptions = {
  components: {
    MuiListItemIcon: {
      styleOverrides: {
        root: {
          minWidth: "36px",
        },
      },
    },
    MuiCardContent: {
      styleOverrides: {
        root: {
          ":last-child": {
            paddingBottom: "16px",
          },
        },
      },
    },
  },
};

// https://github.com/binwiederhier/ntfy-android/blob/main/app/src/main/res/values/colors.xml
export const lightTheme: ThemeOptions = {
  ...baseThemeOptions,
  components: {
    ...baseThemeOptions.components,
  },
  palette: {
    mode: "light",
    primary: {
      main: "#338574",
    },
    secondary: {
      main: "#6cead0",
    },
    error: {
      main: "#c30000",
    },
  },
};

// TODO: Support dark theme
export const darkTheme: ThemeOptions = {
  ...baseThemeOptions,
  components: {
    ...baseThemeOptions.components,
    MuiSnackbarContent: {
      styleOverrides: {
        root: {
          color: "#000",
          backgroundColor: "#aeaeae",
        },
      },
    },
  },
  palette: {
    mode: "dark",
    background: {
      paper: "#1b2124",
    },
    primary: {
      main: "#65b5a3",
    },
    secondary: {
      main: "#6cead0",
    },
    error: {
      main: "#fe4d2e",
    },
  },
};

export default createTheme({
  ...lightTheme,
  direction: getComputedStyle(document.body).direction as Direction,
});
