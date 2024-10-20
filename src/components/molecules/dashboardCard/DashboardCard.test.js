import AccessTimeFilledIcon from "@mui/icons-material/AccessTimeFilled";
const { render, screen } = require("test-utils/auth-wrapper-utils");
const { default: DashboardCard } = require("./DashboardCard");

describe("Dashboard card", () => {
  test("Dashboard Card to render", () => {
    const smallTxt = "small txt";
    const bigTxt = "big txt";
    const url = "url";
    const icon = <AccessTimeFilledIcon />;
    render(
      <DashboardCard
        icon={icon}
        bigTxt={bigTxt}
        url={url}
        smallTxt={smallTxt}
      />
    );
    const dashboardCard = screen.getByLabelText("dashboard-card");
    expect(dashboardCard).toBeInTheDocument();
  });
});
