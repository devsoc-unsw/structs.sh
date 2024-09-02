// Strips the frontmatter from the given markdown string
export const bypassFrontmatter = (markdownBody: string): string =>
  markdownBody ? markdownBody.replace(/^---$.*^---$/ms, '') : '';

/**
 * Determines an estimate for the number of minutes it'd take to read through a markdown document
 * Sourced from: https://fireflysemantics.medium.com/calculating-reading-time-of-markdown-documents-in-javascript-fcc4e252e70b
 */
export const determineTimeToRead = (rawMarkdown: string) => {
  const WORDS_PER_MINUTE = 200;
  const regex = /\w+/g;
  const wordCount = (rawMarkdown || '').match(regex)?.length || 0;

  return Math.ceil(wordCount / WORDS_PER_MINUTE);
};
