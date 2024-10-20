export const TabReducer = (state, action) => {
  switch (action.type) {
    case "SET_CURRENT_TAB":
      return {
        currentTab: action.payload,
      };

    default:
      return state;
  }
};
