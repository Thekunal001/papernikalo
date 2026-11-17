const months = [
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

export function formatDate(iso: string) {
  const [year, month, day] = iso.split("-");
  const monthName = months[Number(month) - 1] ?? month;
  return `${Number(day)} ${monthName} ${year}`;
}

export function formatCount(value: number) {
  return new Intl.NumberFormat("en-IN").format(value);
}
