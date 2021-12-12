import Terminal from '../../components/Visualisation/Controller/Terminal/Terminal';

export default {
    // Can create directories on storybook like this:
    title: 'Learning Dashboard/Terminal',
    component: Terminal,
    argTypes: {},
};

const Template = (args) => <Terminal {...args} />;

export const BasicTerminal = Template.bind({});
BasicTerminal.args = {};
