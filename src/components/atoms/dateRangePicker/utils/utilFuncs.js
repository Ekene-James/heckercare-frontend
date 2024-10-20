export function pad(number, length) {
  var str = "" + number;
  while (str.length < length) {
    str = "0" + str;
  }
  return str;
}

export const months = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];
function isLeapyear(year) {
  return year % 100 === 0 ? year % 400 === 0 : year % 4 === 0;
}
export const daysInMonth = (year) =>
  isLeapyear(year)
    ? [31, 29, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31]
    : [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
export const days = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];
export const hours = new Array(24).fill(0).map((_, ind) => {
  const meridain = ind > 11 ? "pm" : "am";
  if ((ind + 12) % 12 === 0) {
    return (ind === 0 ? ind + 12 : 12) + ":00" + meridain;
  } else {
    return pad((ind + 12) % 12, 2) + ":00" + meridain;
  }
});
export const getYearsFrom = (year) => {
  const options = [];
  const thisYear = new Date().getFullYear();
  const yearsDifference = thisYear - year;
  for (let i = 0; i <= yearsDifference; i++) {
    options.push(thisYear - i);
  }
  return options;
};
export const convertToLocalTime = (str) => {
  try {
    const date = new Date(str);

    const timeLocal = date.toLocaleTimeString();
    const transformedTime = timeLocal.split(":").map(Number);
    // new Date(
    //   date.getFullYear(),
    //   date.getMonth(),
    //   date.getDate(),
    //   transformedTime[0],
    //   transformedTime[1],
    //   transformedTime[2]
    // );
    return date;
  } catch (err) {
    return str;
  }
};

export const getMeridian = (str) => {
  const date = convertToLocalTime(str);
  if (typeof date === "string") return str;
  return date.getHours() >= 12 ? "pm" : "am";
};

export const getDateSurfix = (date) => {
  return (
    date.getDate() +
    (date.getDate() % 10 == 1 && date.getDate() != 11
      ? "st"
      : date.getDate() % 10 == 2 && date.getDate() != 12
      ? "nd"
      : date.getDate() % 10 == 3 && date.getDate() != 13
      ? "rd"
      : "th")
  );
};

export const getMonthFormat = (dateStr, format = "MM" || "MMMM" || "mm") => {
  const date = convertToLocalTime(dateStr);
  if (typeof date === "string") return dateStr;
  let res;
  if (format === "MM") {
    res = months[date.getMonth()].substring(0, 3);
  }
  if (format === "MMMM") {
    res = months[date.getMonth()];
  }
  if (format === "mm") {
    res = date.getMonth() + 1;
  }
  return res;
};

//   function getTimeLeft(numberInSecs)
//   function getTimeLeft(endDateStr)
function getTimeLeft(value) {
  if (typeof value === "string") {
    const today = convertToLocalTime(new Date().toISOString());
    const endDate = convertToLocalTime(value);
    if (typeof today === "string" || typeof endDate === "string") return value;
    const numberOfDays = getNumberOfDays(today, endDate);
    const numberOfHours = getHoursRemaining(numberOfDays, endDate);
    const numberOfMinutes = getMinutesRemaining(numberOfDays, endDate);

    return [numberOfDays, numberOfHours, numberOfMinutes];
  } else {
    const realNumber = Number(value);
    if (isNaN(realNumber)) return value;
    const rawDays = value / (24 * 60 * 60);
    const numberOfDays = Math.floor(rawDays);
    const rawHours = (rawDays - numberOfDays) * 24;
    const numberOfHours = Math.floor(rawHours);
    const numberOfMinutes = Math.floor((rawHours - numberOfHours) * 60);

    return [numberOfDays, numberOfHours, numberOfMinutes];
  }
}

export const isDayPreviousToThatDay = (thatDay, dayAgainst) => {
  return (
    Math.floor(thatDay.getTime() / (1000 * 60 * 60 * 24)) >
    Math.floor(dayAgainst.getTime() / (1000 * 60 * 60 * 24))
  );
};

export const isThatDay = (thatDay, dayAgainst) => {
  return (
    thatDay.getMonth() === dayAgainst.getMonth() &&
    thatDay.getDate() === dayAgainst.getDate() &&
    thatDay.getFullYear() === dayAgainst.getFullYear()
  );
};

export const isYesterday = (day) => {
  const today = new Date();
  return (
    today.getMonth() === day.getMonth() &&
    today.getDate() - 1 === day.getDate() &&
    today.getFullYear() === day.getFullYear()
  );
};
export const isToday = (day) => {
  const today = new Date();
  return (
    today.getMonth() === day.getMonth() &&
    today.getDate() === day.getDate() &&
    today.getFullYear() === day.getFullYear()
  );
};

export const isDayInBetweenDaysInclusive = (day, startDate, endDate) => {
  const isInMonth =
    day.getMonth() >= startDate.getMonth() &&
    day.getMonth() <= endDate.getMonth();
  const isInYear =
    day.getFullYear() >= startDate.getFullYear() &&
    day.getFullYear() <= endDate.getFullYear();
  if (!isInMonth || !isInYear) return false;
  return (
    Math.floor(day.getTime() / (1000 * 60 * 60 * 24)) * 12 >=
      Math.floor(startDate.getTime() / (1000 * 60 * 60 * 24)) * 12 &&
    Math.floor(day.getTime() / (1000 * 60 * 60 * 24)) * 12 <=
      Math.floor(endDate.getTime() / (1000 * 60 * 60 * 24)) * 12
  );
};
export const getDaysBetweenInclusive = (startDate, endDate) => {
  const dates = [];

  let currentDate = startDate;
  while (currentDate <= endDate) {
    dates.push(new Date(currentDate));
    const date = new Date(currentDate);
    date.setDate(date.getDate() + 1);
    currentDate = date;
  }

  return dates;
};
export const getHoursBetweenInclusive = (startDate, endDate) => {
  const dates = [];

  let currentDate = startDate;
  while (currentDate <= endDate) {
    dates.push(new Date(currentDate));
    const date = new Date(currentDate);
    date.setHours(date.getHours() + 1);
    currentDate = date;
  }

  return dates;
};
export const isDayFutureToThatDay = (thatDay, dayAgainst) => {
  return (
    Math.floor(thatDay.getTime() / (1000 * 60 * 60 * 24)) <
    Math.floor(dayAgainst.getTime() / (1000 * 60 * 60 * 24))
  );
};
export const isFutureDays = (day) => {
  const today = new Date();
  return (
    Math.floor(today.getTime() / (1000 * 60 * 60 * 24)) <
    Math.floor(day.getTime() / (1000 * 60 * 60 * 24))
  );
};
export const isPrevDays = (day) => {
  const today = new Date();

  return (
    Math.floor(today.getTime() / (1000 * 60 * 60 * 24)) >
    Math.floor(day.getTime() / (1000 * 60 * 60 * 24))
  );
};
export const isPrevMonth = (selectedDay, day) =>
  (selectedDay.getFullYear() === day.getFullYear() &&
    selectedDay.getMonth() === day.getMonth() + 1) ||
  (selectedDay.getFullYear() === day.getFullYear() + 1 &&
    selectedDay.getMonth() === 0 &&
    day.getMonth() === 11);
export const isNextMonth = (selectedDay, day) =>
  (selectedDay.getFullYear() === day.getFullYear() &&
    selectedDay.getMonth() === day.getMonth() - 1) ||
  (selectedDay.getFullYear() === day.getFullYear() - 1 &&
    selectedDay.getMonth() - 11 === day.getMonth());

export const getDateString = (date) => {
  return `${date.getFullYear()}-${pad(date.getMonth() + 1, 2)}-${pad(
    date.getDate(),
    2
  )}`;
};
export { getTimeLeft };
export const getNumberOfDays = (startDate, endDate) => {
  let days = 0;
  if (startDate.getFullYear() != endDate.getFullYear()) {
    days += (endDate.getFullYear() - startDate.getFullYear()) * 365;
  }
  if (startDate.getMonth() != endDate.getMonth()) {
    for (let i = startDate.getMonth(); i < endDate.getMonth(); i++) {
      days += daysInMonth(startDate.getFullYear())[i];
    }
  }
  days += endDate.getDate() - startDate.getDate();
  return days;
};

export const getHoursRemaining = (nDays, endDate) => {
  const today = convertToLocalTime(new Date().toISOString());
  const millisecondsSofar = nDays * 24 * 60 * 60 * 1000;
  const timeBetween = endDate.getTime() - today.getTime();

  return Math.floor((timeBetween - millisecondsSofar) / (1000 * 60 * 60));
};

export const getMinutesRemaining = (nDays, endDate) => {
  const today = convertToLocalTime(new Date().toISOString());
  const millisecondsSofar = nDays * 24 * 60 * 60 * 1000;
  const timeBetween = endDate.getTime() - today.getTime();
  const hours = (timeBetween - millisecondsSofar) / (1000 * 60 * 60);
  const minute = (hours - Math.floor(hours)) * 60;
  return Math.floor(minute);
};
