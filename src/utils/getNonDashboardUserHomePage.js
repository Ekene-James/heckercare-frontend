export const getNonDashboardUserHomePage = (role) => {
  const isAccountant = role.toLowerCase().includes("account");
  const isLab = role.toLowerCase().includes("lab");
  const isPharmacy = role.toLowerCase().includes("pharmac");

  if (isAccountant) {
    return "/home/accounting-overview";
  } else if (isLab) {
    return "/home/laboratory-overview";
  } else if (isPharmacy) {
    return "/home/pharmacy-overview";
  } else {
    return "/home/profile";
  }
};
