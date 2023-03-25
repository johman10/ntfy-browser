import { createTheme } from "@mui/material";
import { red } from "@mui/material/colors";

export default createTheme({
  palette: {
    primary: {
      main: "#338574",
    },
    secondary: {
      main: "#6cead0",
    },
    error: {
      main: red.A400,
    },
  },
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
});
