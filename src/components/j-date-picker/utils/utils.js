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

export const isSameMonth = (date1, date2) => {
  const newDate1 = new Date(date1.getFullYear(), date1.getMonth(), 1);
  const newDate2 = new Date(date2.getFullYear(), date2.getMonth(), 1);

  if (newDate1.toDateString() === newDate2.toDateString()) return true

  return false
}

export const dateDiffInDays = (a, b) => {
  const _MS_PER_DAY = 1000 * 60 * 60 * 24;

  // Discard the time and time-zone information.
  const utc1 = Date.UTC(a.getFullYear(), a.getMonth(), a.getDate());
  const utc2 = Date.UTC(b.getFullYear(), b.getMonth(), b.getDate());

  return Math.floor((utc2 - utc1) / _MS_PER_DAY);
}