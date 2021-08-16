export const daysInMonth = (year, month) => {
  return new Date(year, month, 0).getDate();
}

export const firstDayOfMonth = (year, month) => {
  return new Date(year, month, 1);
}

export const lastDayOfMonth = (year, month) => {
  return new Date(year, month, 0);
}

export const isSameDate = (date1, date2) => {
  const newDate1 = new Date(date1);
  const newDate2 = new Date(date2);

  if (newDate1.toDateString() === newDate2.toDateString()) return true

  return false
}