export const formatMongoDate = (dateString: string): string => {
  const date = new Date(dateString);

  const year = date.getFullYear();
  const month = `0${date.getMonth() + 1}`.slice(-2);
  const day = `0${date.getDate()}`.slice(-2);

  let hours = date.getHours();
  const ampm = hours >= 12 ? 'PM' : 'AM';
  hours = hours % 12;
  hours = hours ? hours : 12; // the hour '0' should be '12'

  const minutes = `0${date.getMinutes()}`.slice(-2);

  return `${year}.${month}.${day} (${hours}:${minutes} ${ampm})`;
};

export const addTwoHours = (date: Date): Date => {
  return new Date(date.getTime() + 2 * 60 * 60 * 1000);
}