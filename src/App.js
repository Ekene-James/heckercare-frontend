import React from "react";
import AppRoutes from "./routes/Routes";
import "./App.css";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { ReactQueryDevtools } from "react-query/devtools";
import { CssBaseline } from "@mui/material";
import { useThemeCtx } from "./store/contextStore/theme/ThemeStore";
import { blue, grey, red } from "@mui/material/colors";
import shadows from "@mui/material/styles/shadows";
import { QueryClient, QueryClientProvider } from "react-query";

const queryClient = new QueryClient();

function App() {
  const { state } = useThemeCtx();

  const theme = createTheme({
    shadows: shadows.map(() => "none"),
    palette: {
      mode: state.lightTheme ? "light" : "dark",
      ...(state.lightTheme
        ? {
            // palette values for light mode
            primary: {
              main: grey[900],
              custom: grey[300],
              gray: "#F8F8F8",
              lightest: grey[50],
              formLabel: "#020011",
              lightGrey: "#979797",
              darkGrey: "#828282",
              disabled: "rgba(245, 245, 245, 1)",
              success: "#008435",
              error: "#E64034",
            },
            secondary: {
              main: "#6956E5",
              light: "#ECF0FF",
            },
            text: {
              primary: "#222222",
              custom: grey[500],
              tertiary: "#515151",
            },

            background: {
              light: grey[100],
              lightest: grey[50],
              custom: grey[200],
              gray3: grey[300],
              gray4: grey[400],
              gray5: grey[500],
              black: grey[900],
              lightBlue: "rgba(233, 232, 242, 0.6)",
              lightSuccess: "rgba(0, 132, 53, 0.1)",
              lightOrange: "rgba(255, 129, 96, 0.1)",

              lightBlue1: "#ECF0FF",
              disabled: "rgba(224, 224, 224, 1)",
              white: "#FFFFFF",
            },
          }
        : {
            primary: {
              main: grey[300],
              custom: grey[50],
              lightest: grey[900],
              gray: "#F8F8F8",
              formLabel: grey[50],
              lightGrey: grey[100],
              darkGrey: grey[400],
              disabled: grey[800],
              success: "#008435",
              error: "#E64034",
            },
            secondary: {
              main: blue[400],
              light: grey[200],
            },
            background: {
              light: grey[800],
              lightest: grey[900],
              custom: grey[900],
              black: grey[400],
              gray3: grey[600],
              gray4: grey[400],
              gray5: grey[500],
              lightBlue: "rgba(105, 86, 229, 0.05)",
              lightBlue1: "rgba(105, 86, 229, 0.05)",
              lightSuccess: "rgba(0, 132, 53, 0.05)",
              lightOrange: "rgba(255, 129, 96, 0.1)",
              disabled: grey[600],
              white: grey[50],
            },
          }),
    },
    typography: {
      fontFamily: "Mulish, Segoe UI",
      fontSize: 14,
      fontWeightLight: 300,
      fontWeightRegular: 400,
      fontWeightMedium: 500,
      subhead: {
        fontSize: "1.25rem",
      },
      body1: {
        fontSize: "0.875rem",
        fontWeight: "400",
        lineHeight: "1.125rem",
      },
      caption: {
        fontSize: "0.75rem",
        fontWeight: "400",
      },
      small: {
        fontSize: "0.563rem",
      },
      button: {
        fontWeight: "600",
        fontSize: "0.875rem",
      },
      subheading: {
        fontWeight: "500",
        fontSize: "0.75rem",
      },
      heading: {
        fontWeight: "700",
        fontSize: "1rem",
      },
      displaySm: {
        fontWeight: "700",
        fontSize: "1.25rem",
      },
      displayMd: {
        fontWeight: "700",
        fontSize: "1.5rem",
      },
      displayLg: {
        fontWeight: "800",
        fontSize: "1.75rem",
        lineHeight: "170%",
      },
      displayXl: {
        fontWeight: "900",
        fontSize: "2.625rem",
      },
    },
    //
    components: {
      MuiButton: {
        styleOverrides: {
          root: ({ ownerState }) => ({
            textTransform: "capitalize",
            ...(ownerState.variant === "outlined" &&
              ownerState.color === "primary" && {
                border: "1px solid rgba(132, 132, 132, 0.15)",
                color: "rgba(151, 151, 151, 1)",
              }),
          }),
        },
      },
    },
  });
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <QueryClientProvider client={queryClient}>
        <AppRoutes />
        <ReactQueryDevtools initialIsOpen={false} position="bottom-right" />
      </QueryClientProvider>
    </ThemeProvider>
  );
}

export default App;
