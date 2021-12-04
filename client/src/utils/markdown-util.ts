import marked from 'marked';

// Strips the frontmatter from the given markdown string
const bypassFrontmatter = (markdownBody: string): string => {
    return markdownBody ? markdownBody.replace(/^---$.*^---$/ms, '') : '';
};

const renderMarkdown = (rawMarkdown: string): string => {
    return marked(bypassFrontmatter(rawMarkdown));
};

export default renderMarkdown;
