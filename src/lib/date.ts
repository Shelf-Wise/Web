export const formatDate = (date: Date | string): string => {
  const options: Intl.DateTimeFormatOptions = {
    day: "2-digit",
    month: "short",
    year: "numeric",
  };
  return new Date(date).toLocaleDateString("en-GB", options).replace(",", "");
};
