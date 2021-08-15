export const daysInMonth = (year, month) => {
  return new Date(year, month, 0).getDate();
}

export const firstDayOfMonth = (year, month) => {
  return new Date(year, month, 1);
}

export const lastDayOfMonth = (year, month) => {
  return new Date(year, month, 0);
}