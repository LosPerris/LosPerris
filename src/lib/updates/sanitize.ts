export function sanitizeUpdateText(text: string, maxLength = 2000): string {
  return text
    .replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g, "")
    .replace(/<[^>]*>/g, "")
    .trim()
    .slice(0, maxLength);
}

export function sanitizeUpdateEntry<
  T extends { title: string; description: string },
>(entry: T): T {
  return {
    ...entry,
    title: sanitizeUpdateText(entry.title, 200),
    description: sanitizeUpdateText(entry.description, 2000),
  };
}
