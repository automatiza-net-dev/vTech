export function isValidDate(date: any): boolean {
  const parsedDate = new Date(date);
  return !isNaN(parsedDate.getTime());
}
