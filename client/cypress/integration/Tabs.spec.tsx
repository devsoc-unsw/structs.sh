import React from 'react';
import { mount } from '@cypress/react';

describe("Testing the visualiser dashboard's tabs", () => {
    beforeEach(() => {
        cy.visit('http://localhost:3000/visualiser/linked-list');
    });

    it('Has lesson', () => {
        cy.contains('Lesson');
    });
});
