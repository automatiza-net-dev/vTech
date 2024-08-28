export function formatPhone(phone: string) {
  return phone
    ?.replace("(", "")
    .replace(")", "")
    .replace("-", "")
    .replace(" ", "");
}
