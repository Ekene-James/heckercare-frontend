const getDateRange = (date) => {
  if (date) {
    const firstDay = date.getDate() - date.getDay();
    const lastDay = firstDay + 6;
    const startDate = new Date(date.setDate(firstDay));
    const endDate = new Date(date.setDate(lastDay));
    return [startDate, endDate];
  }
  return null;
};
export default getDateRange;
