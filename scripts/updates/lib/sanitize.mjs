/** Texto plano seguro: sin tags HTML ni caracteres de control. */
export function sanitizeUpdateText(text, maxLength = 2000) {
  if (text == null) return "";
  return String(text)
    .replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g, "")
    .replace(/<[^>]*>/g, "")
    .trim()
    .slice(0, maxLength);
}
