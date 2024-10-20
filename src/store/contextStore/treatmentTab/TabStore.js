import React, { createContext } from "react";
import { TabReducer } from "./TabReducer";

export const TabContext = createContext();

export default function TabContextProvider(props) {
  const initialState = {
    currentTab: 1,
  };
  const [state, dispatch] = React.useReducer(TabReducer, initialState);

  const value = {
    state,
    dispatch,
  };
  return (
    <TabContext.Provider value={value}>{props.children}</TabContext.Provider>
  );
}
export const useTabCtx = () => React.useContext(TabContext);
