const { render, screen } = require("test-utils/auth-wrapper-utils");
const { default: CustomTab } = require("../CustomTab");

const mockedUsedNavigate = jest.fn();

jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => mockedUsedNavigate,
}));

describe("Test Custom Tab reusable component", () => {
  test("should display on screen with the right number of navs", () => {
    const navItems = [
      {
        label: "Vital Signs",
        id: 0,
      },
      {
        label: "Allergies",
        id: 1,
      },
    ];
    const value = 1;
    const setValue = jest.fn;
    render(<CustomTab navItems={navItems} value={value} setValue={setValue} />);

    const nav = screen.getByLabelText("nav tabs example");
    const allNavs = screen.getAllByRole("tab");

    expect(nav).toBeInTheDocument();
    expect(allNavs).toHaveLength(2);
  });
});
