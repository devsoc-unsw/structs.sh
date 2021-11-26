import { render } from '@testing-library/react';
import React from 'react';
import Tabs from './Tabs';

describe('Tabs tests', () => {
    it('should display buttons for the given tabs', () => {
        // `render` renders the component into document.body and returns an object with lots of query functions
        const { getByRole } = render(<Tabs tabs={['First tab', 'Second tab']} />);

        expect(getByRole('button', { name: /First tab/i })).toBeDefined();
        expect(getByRole('button', { name: /Second tab/i })).toBeDefined();

        // Source: https://stackoverflow.com/questions/58408178/query-a-button-with-specific-text/64673103
    });
});
