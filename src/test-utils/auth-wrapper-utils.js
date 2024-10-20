import { render } from "@testing-library/react";
import React from "react";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";

import AuthContextProvider from "store/contextStore/auth/AuthStore";
import ThemeContextProvider from "store/contextStore/theme/ThemeStore";
import { BrowserRouter } from "react-router-dom";

global.ResizeObserver = require("resize-observer-polyfill");
jest.mock("recharts", () => {
  const OriginalModule = jest.requireActual("recharts");
  return {
    ...OriginalModule,
    ResponsiveContainer: ({ children }) => (
      <OriginalModule.ResponsiveContainer width={"100%"} height={800}>
        {children}
      </OriginalModule.ResponsiveContainer>
    ),
  };
});

const Provider = ({ children }) => {
  return (
    <AuthContextProvider>
      <ThemeContextProvider>
        <BrowserRouter>
          <LocalizationProvider dateAdapter={AdapterDateFns}>
            {children}
          </LocalizationProvider>
        </BrowserRouter>
      </ThemeContextProvider>
    </AuthContextProvider>
  );
};

const renderWithContext = (ui, options) =>
  render(ui, { wrapper: Provider, ...options });

// re-export everything
export * from "@testing-library/react";

// override render method
export { renderWithContext as render };
