const { toast } = require("react-toastify");

export const handleOnError = (error) => {
  if (typeof error.message === "object" && error.message.length) {
    return error.message.map((msg) => toast.error(msg));
  }

  return toast.error(error.message);
};
