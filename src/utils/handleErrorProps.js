export const handleErrorProps = (isTouched, errMsg) => {
  if (isTouched && errMsg) {
    return {
      error: true,
      helperText: errMsg,
    };
  } else {
    return {
      error: false,
    };
  }
};
