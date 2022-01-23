/**
 * Given a title like 'Linked Lists', converts characters to lowercase,
 * substitutes/removes characters that are special in URL parsing and
 * converts whitespace to hyphens.
 */
export const titleToUrl = (title: string): string =>
// TODO: substitute or remove special URL characters like /
  title.toLowerCase().replaceAll(' ', '-')
;

// The inverse of `titleToUrl`
export const urlToTitle = (url: string): string => toTitleCase(url.replaceAll('-', ' '));

const toTitleCase = (str: string): string => str.replace(/\w\S*/g, (txt) => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase());

export const extractQueryParameter = (url: string, param: string): string => {
  const urlObj = new URL(url);
  const params = Object.fromEntries(new URLSearchParams(urlObj.search));
  return params[param];
};
