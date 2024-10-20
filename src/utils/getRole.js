export const getRole = (user) => {
  let lowerCaseRole = user?.role?.name.toLowerCase();

  switch (lowerCaseRole) {
    case "superadmin":
      lowerCaseRole = "admin";
      break;
    case "frontdesk":
      lowerCaseRole = "front-desk";
      break;

    default:
      break;
  }
  return lowerCaseRole;
};
