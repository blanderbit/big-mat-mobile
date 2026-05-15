/** True when the string contains HTML tags (e.g. `<p>…</p>`), not plain text. */
export const isHtmlString = (value: string): boolean =>
  /<\s*\/?[a-z][\w-]*(\s[^>]*)?\/?>/i.test(value.trim());
