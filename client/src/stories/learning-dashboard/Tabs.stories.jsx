import Tabs from '../../components/Tabs/Tabs';

export default {
    title: 'Learning Dashboard/Tabs',
    component: Tabs,
    argTypes: {},
};

const Template = (args) => <Tabs {...args} />;

export const BasicTabs = Template.bind({});
BasicTabs.args = {};
