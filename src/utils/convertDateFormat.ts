export const convertDateFormat = (dateString: string): string => {
  const [year, month, day] = dateString.split('-');
  const formattedDate = `${year}.${month}.${day}`;

  return formattedDate;
};
