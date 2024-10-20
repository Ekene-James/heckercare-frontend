import React, { createContext } from "react";
import { ThemeReducer } from "./ThemeReducer";

export const ThemeContext = createContext();

export default function ThemeContextProvider(props) {
  const initialState = {
    lightTheme: true,
  };
  const [state, dispatch] = React.useReducer(ThemeReducer, initialState);

  const value = {
    state,
    dispatch,
  };
  return (
    <ThemeContext.Provider value={value}>
      {props.children}
    </ThemeContext.Provider>
  );
}
export const useThemeCtx = () => React.useContext(ThemeContext);
