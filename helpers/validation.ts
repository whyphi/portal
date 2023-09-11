export function isValidUSPhoneNumber(phoneNumber: string): boolean {
  const phoneNumberPattern = /^(?:\+?1\s*(?:[.-]\s*)?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}$/;
  return phoneNumberPattern.test(phoneNumber);
}

export function isValidEmail(email: string): boolean {
  const emailPattern = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;
  return emailPattern.test(email);
}

export function isValidLink(link: string): boolean {
  const linkPattern = /^(https?:\/\/)?([\w-]+\.)+[\w-]+(\/[\w-./?%&=]*)?$/;
  return linkPattern.test(link);
}
