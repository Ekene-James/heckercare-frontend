export const useSanitizeQueryParams = (queryString) => {
  const [url, params] = queryString.split("?");
  const queryParams = params.split("&");
  const validParams = {};
  queryParams.forEach((query) => {
    const [key, value] = query.split("=");
    if (
      value !== null &&
      value !== undefined &&
      value !== "" &&
      value !== "undefined" &&
      value !== "null"
    )
      validParams[key] = value;
  });

  const cleanString = Object.entries(validParams)
    .map(([key, value]) => `${key}=${value}`)
    .join("&");
  return `${url}?${cleanString}`;
};
