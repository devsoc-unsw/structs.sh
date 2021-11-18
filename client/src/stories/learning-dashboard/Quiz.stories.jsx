import Quiz from '../../components/Quiz/Quiz';

export default {
    // Can create directories on storybook like this:
    title: 'Learning Dashboard/Quiz',
    component: Quiz,
    argTypes: {},
};

const Template = (args) => <Quiz {...args} />;

export const BasicQuiz = Template.bind({});
BasicQuiz.args = {};
