export const currencyFormatter = (number) => {
  const formatter = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "NGN",
  });
  return formatter.format(number);
};
export const numberFormatter = (number, approx = 3) => {
  const formatter = new Intl.NumberFormat("en-US", {
    style: "decimal",
    maximumSignificantDigits: approx,
  });
  return formatter.format(number);
};
