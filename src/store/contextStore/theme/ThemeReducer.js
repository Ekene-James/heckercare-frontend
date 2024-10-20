export const ThemeReducer = (state, action) => {
  switch (action.type) {
    case "TOGGLE_THEME":
      return {
        lightTheme: !state.lightTheme,
      };

    default:
      return state;
  }
};
