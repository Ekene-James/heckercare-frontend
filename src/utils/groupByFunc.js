export const groupBy = (data, name) =>
  data.reduce((x, y) => {
    (x[y[name]] = x[y[name]] || []).push(y);
    return x;
  }, {});
