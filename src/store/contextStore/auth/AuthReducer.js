export const AuthReducer = (state, action) => {
  switch (action.type) {
    case "LOADING":
      return {
        ...state,
        loading: action.payload,
      };
    case "LOADINGS":
      return {
        ...state,
        loadings: {
          ...state.loadings,
          ...action.payload,
        },
      };
    case "UPDATE_USERNAME":
      return {
        ...state,
        user: {
          ...state.user,
          ...action.payload,
        },
      };

    case "LOGIN":
      return {
        ...state,
        isAuthenticated: true,
        user: action.payload,
        firstLogin: {},
      };
    case "FIRST_LOGIN":
      return {
        ...state,
        firstLogin: action.payload,
      };

    case "LOGOUT":
      return {
        isAuthenticated: false,
        user: {},
        firstLogin: {},
      };
    case "ROUTE":
      return {
        ...state,
        route: action.payload,
      };
    default:
      return state;
  }
};
