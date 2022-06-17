/**
 * Given a title like 'Linked Lists', converts characters to lowercase,
 * substitutes/removes characters that are special in URL parsing and
 * converts whitespace to hyphens.
 */

// TODO: substitute or remove special URL characters like /
export const titleToUrl = (title: string): string => title.toLowerCase().replaceAll(' ', '-');

export const toTitleCase = (str: string): string =>
  str.replace(/\w\S*/g, (txt) => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase());

// The inverse of `titleToUrl`
export const urlToTitle = (url: string): string => url.replaceAll('-', ' ').toLowerCase();

export const extractQueryParameter = (url: string, param: string): string => {
  const urlObj = new URL(url);
  const params = Object.fromEntries(new URLSearchParams(urlObj.search));
  return params[param];
};
