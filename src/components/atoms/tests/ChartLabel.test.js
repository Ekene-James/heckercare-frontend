const { render, screen } = require("test-utils/auth-wrapper-utils");
const { default: ChartLabel } = require("../ChartLabel");

describe("Chart label component", () => {
  test("render with the right number of labels", () => {
    const data = [
      {
        fill: "red",
        name: "beds",
        value: 20,
      },
      {
        fill: "blue",
        name: "chairs",
        value: 200,
      },
    ];
    render(<ChartLabel data={data} />);
    const chartLabel = screen.getByLabelText("chart-label-grid");
    const bedLabel = screen.getByText("beds");
    const chairLabel = screen.getByText("chairs");

    expect(chartLabel).toBeInTheDocument();
    expect(bedLabel).toBeInTheDocument();
    expect(chairLabel).toBeInTheDocument();
  });

  test("Not to show values of each label if showValue is true", () => {
    const data = [
      {
        fill: "red",
        name: "beds",
        value: 20,
      },
    ];
    const showValue = false;
    render(<ChartLabel data={data} showValue={showValue} />);

    const noLabelValue = screen.queryByText(20);

    expect(noLabelValue).toBeNull();
  });
});
