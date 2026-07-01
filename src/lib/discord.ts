export function sanitizeEmbedText(value: string, maxLength = 500): string {
  return value
    .replace(/@everyone|@here|<@&?\d+>/gi, "[mención]")
    .slice(0, maxLength);
}
