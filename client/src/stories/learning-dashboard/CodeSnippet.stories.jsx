import CodeSnippet from '../../components/CodeSnippet/CodeSnippet';

export default {
    // Can create directories on storybook like this:
    title: 'Learning Dashboard/Code Snippet',
    component: CodeSnippet,
    argTypes: {},
};

const Template = (args) => <CodeSnippet {...args} />;

export const BasicCodeSnippet = Template.bind({});
BasicCodeSnippet.args = {};
