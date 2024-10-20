import { daysInMonth } from "components/atoms/dateRangePicker/utils/utilFuncs";
import { useMemo } from "react";

const useDisplayDays = (currentDate) => {
  return useMemo(() => {
    const days = [];
    const firstDayOfMonth = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth(),
      1
    );
    const firstDayOfMonthInAWeek = firstDayOfMonth.getDay();
    const lastDayOfMonth = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth(),
      daysInMonth(currentDate.getFullYear())[currentDate.getMonth()]
    );
    for (let i = firstDayOfMonthInAWeek; i > 0; i--) {
      days.push(
        new Date(
          firstDayOfMonth.getFullYear(),
          firstDayOfMonth.getMonth(),
          firstDayOfMonth.getDate() - i
        )
      );
    }
    for (
      let i = firstDayOfMonth.getDate();
      i <= lastDayOfMonth.getDate();
      i++
    ) {
      days.push(
        new Date(firstDayOfMonth.getFullYear(), firstDayOfMonth.getMonth(), i)
      );
    }

    if (days.length < 36) {
      const curLength = days.length;
      for (let i = 0; i < 35 - curLength; i++) {
        days.push(
          new Date(
            firstDayOfMonth.getFullYear(),
            firstDayOfMonth.getMonth() + 1,
            i + 1
          )
        );
      }
    }

    return days;
  }, [currentDate]);
};

export default useDisplayDays;
