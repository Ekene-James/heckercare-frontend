import React from "react";

function ErrorComponent({
  error = "Network Error, please refresh and try again later",
}) {
  return <div>{error}</div>;
}

export default ErrorComponent;
