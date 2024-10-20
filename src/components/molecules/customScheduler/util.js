import { borderTopColors, cellHeight, cellWidth } from "./staticData";

export function daysOfThWeek(currentdate = new Date()) {
  let week = [];
  const current = new Date(currentdate);
  // Starting  Sunday

  /**
   * lets say current.getDate() = 25, and current.getDay()=5(5 means friday, 1 is monday, 0 sunday),
   * so 25-5 = 20, meaning that 20th will be a sunday, this way, we can always start from sunday
   */
  current.setDate(current.getDate() - current.getDay());

  for (let i = 0; i < 7; i++) {
    week.push(new Date(current));
    current.setDate(current.getDate() + 1);
  }

  return week;
}
export function findDay(apiData, day) {
  if (apiData?.length) {
    return apiData.filter((d) => +d.day === +day);
  }
  return [];
}
export function findTime(interval, shifts) {
  if (shifts?.length) {
    const shift = shifts.filter((shift) => shift.startTime === interval);
    if (shift?.length) return shift[0];
    return {};
  }
  return {};
}
export function findAppointmentDayAndTime(apiData, weekDay, time) {
  if (apiData?.length) {
    const shift = apiData.filter((shift) => {
      const currentdate = new Date(weekDay);
      const currentYr = currentdate.getFullYear();
      const currentMonth = currentdate.getMonth();
      const currentDay = currentdate.getDate();

      const apiDate = new Date(shift.startDateTime);

      const apiYr = apiDate.getFullYear();
      const apiMonth = apiDate.getMonth();
      const apiDay = apiDate.getDate();

      const apiTime = shift.startTime.split(":");

      const hour = +apiTime[0];

      return (
        apiYr === currentYr &&
        apiMonth === currentMonth &&
        apiDay === currentDay &&
        hour === time.militaryTime
      );
    });
    // if (shift.length) {
    //   console.log(shift);
    //   console.log(weekDay);
    //   console.log(time);
    // }
    return shift;
  }
  return [];
}
export function findDateTime(interval, shifts, currentDate) {
  if (shifts?.length) {
    const shift = shifts.filter((shift) => {
      const apiTime = shift.startTime.split(":");

      const hour = +apiTime[0];
      let mins = +apiTime[1];

      if (mins <= 29) mins = 0;
      if (mins >= 30) mins = 30;
      const timeStr = `${hour}.${mins}`;
      const time = Number(timeStr);

      return time === interval;
    });

    if (shift?.length) return shift;
    return {};
  }
  return {};
}
export function findDayInMonth(apiData, day) {
  if (apiData?.length) {
    const shift = apiData.filter((shift) => {
      const currentdate = new Date(day);
      const currentYr = currentdate.getFullYear();
      const currentMonth = currentdate.getMonth();
      const currentDay = currentdate.getDate();

      const apiDate = new Date(shift.startDateTime);

      const apiYr = apiDate.getFullYear();
      const apiMonth = apiDate.getMonth();
      const apiDay = apiDate.getDate();

      return (
        apiYr === currentYr &&
        apiMonth === currentMonth &&
        apiDay === currentDay
      );
    });

    return shift;
  }
  return [];
}

export const randomBorderTopColor = () => {
  const max = 3;
  const min = 0;
  const randomNum = Math.floor(Math.random() * (max - min + 1)) + min;

  return borderTopColors[randomNum];
};
export const isCurrentMonth = (current, api) => {
  return current === new Date(api).getMonth() + 1;
};
export const isCurrentYear = (current, api) => {
  return current === new Date(api).getFullYear();
};
export const getCellHeight = (day) => {
  let realCellHeight = cellHeight;
  const duration = Math.abs(day?.endTime - day?.startTime);
  if (duration) realCellHeight = cellHeight * duration;
  return realCellHeight;
};
export const getAppointmentCellHeight = (day) => {
  const start = day?.startTime.split(":");
  const startHour = +start[0];

  const end = day?.endTime.split(":");
  const endHour = +end[0];
  const endMin = +end[1];

  // if 60 mins is 140px, then 1 minute = 2.33px approx
  const minuteLength = endMin * 2.33;

  const hourDifference = endHour - startHour;
  let duration = 0;
  if (hourDifference < 1) duration = cellHeight + minuteLength;

  duration = hourDifference * cellHeight + minuteLength;

  return duration;
};

export const getCellWidth = (shift) => {
  // let realCellWidth = cellWidth * 2;
  // const start = shift.startTime.split(":");
  // const end = shift.endTime.split(":");

  // const startHour = +start[0];
  // const startMins = +start[1];
  // const startTime = `${startHour}.${startMins}`;

  // const endHour = +end[0];
  // let endMins = +end[1];

  // //make 30 mins = 0.5, i.e. 1 mins =0.17 approx
  // endMins = Math.floor(0.17 * endMins);

  // const endTime = `${endHour}.${endMins}`;

  // const duration = Math.abs(Number(endTime) - Number(startTime));

  // if (duration) {
  //   const durationWidth = Math.floor((duration * 60) / 30);

  //   realCellWidth = cellWidth + cellWidth * durationWidth;
  // }
  // return realCellWidth;

  //The width is for 30mins, so 1 hour will be *2
  const realCellWidth = cellWidth * 2;

  const start = shift?.startTime?.split(":");
  const end = shift?.endTime?.split(":");

  const startHour = +start[0];

  const endHour = +end[0];
  const endMins = +end[1];

  // if 30 mins is 150px, then 1 minute = 5px
  const minuteWidth = endMins * 5;

  const hourDifference = endHour - startHour;
  let duration = 0;

  //if start time and end time is same hour, return realCellWidth + the minute width
  if (hourDifference < 1) duration = realCellWidth + minuteWidth;

  duration = hourDifference * realCellWidth + minuteWidth;

  return duration;
};
export const getdaysInAMonth = (month, year) => {
  const date = new Date(year, month, 1);
  let days = [];

  while (date.getMonth() === month) {
    days.push(new Date(date));
    date.setDate(date.getDate() + 1);
  }

  return days;
};
export const fillMissingDaysInMonth = (month, year) => {
  let cureentMonthArr = getdaysInAMonth(month, year);

  //if month == jan, month params will be dec i.e.=11, and year params will be prev year
  const previousMonthArr = getdaysInAMonth(
    month === 0 ? 11 : month - 1,
    month === 0 ? year - 1 : year
  );

  //if month == december, month params will be jan i.e.=1, and year params will be next year
  const nextMonthArr = getdaysInAMonth(
    month === 11 ? 0 : month + 1,
    month === 11 ? year + 1 : year
  );
  const firstDayOfCurrentMonth = cureentMonthArr[0].getDay();
  const lastDayOfCurrentMonth =
    cureentMonthArr[cureentMonthArr.length - 1].getDay();
  const previousMonth =
    firstDayOfCurrentMonth === 0
      ? []
      : previousMonthArr.slice(firstDayOfCurrentMonth * -1);
  const nextMonth = nextMonthArr.slice(0, 6 - lastDayOfCurrentMonth);
  cureentMonthArr = previousMonth.concat(cureentMonthArr);
  cureentMonthArr = cureentMonthArr.concat(nextMonth);

  return cureentMonthArr;
};
