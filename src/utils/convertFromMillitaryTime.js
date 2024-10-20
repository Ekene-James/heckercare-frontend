import moment from "moment";

export const convertFromMilitaryTime = (input) => {
  return moment(input, "HH:mm").format("h:mm A");
};
