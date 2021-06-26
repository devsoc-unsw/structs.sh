import marked from 'marked';

/**
 * Markdown renderer functions
 */

// Strips the frontmatter from the given markdown string
const bypassFrontmatter = markdownBody => {
    return markdownBody ? markdownBody.replace(/^---$.*^---$/ms, '') : '';
};

const renderMarkdown = rawMarkdown => {
    return marked(bypassFrontmatter(rawMarkdown));
};

export default renderMarkdown;
