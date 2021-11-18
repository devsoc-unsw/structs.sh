// Following official docs: https://storybook.js.org/docs/react/configure/theming
import { create } from '@storybook/theming';

export default create({
    base: 'light',
    brandTitle: 'Structs.sh Storybook',
    brandUrl: 'https://structs.netlify.app/',
    brandImage: 'https://github.com/csesoc/Structs.sh/blob/master/images/logo-64x64.png?raw=true',
});