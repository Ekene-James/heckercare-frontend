export const hasDashboard = (role) => {
  if (
    role === "nurse" ||
    role === "doctor" ||
    role === "admin" ||
    role === "front-desk"
  )
    return true;
  return false;
};
