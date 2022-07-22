describe('Linked list visualiser tests', () => {
  // The user should be able to navigate to the linked list visualiser from
  // the homepage.
  it('should be accessible from the homepage', () => {
    cy.visit('/');
    cy.wait(1000);

    // When the user clicks on the element containing the text 'Linked List',
    // they should be navigated to the linked list visualiser page and the
    // canvas should be visible.
    cy.contains(/Linked List/i).click();
    cy.url().should('contain', 'linked-list');
    cy.get('#visualiser-canvas').should('be.visible');
    cy.wait(1000);
  });

  it('should allow the user to append a single value to the list', () => {
    cy.visit('/visualiser/linked-lists');
    cy.wait(1000);

    // Clicking 'append' in the menu should expand the form.
    // Try submitting the append form to insert 42 to the list.
    cy.get('[aria-label="append operation"]').click();
    cy.get('[data-testid="append value"]').should('be.visible').type('42');

    cy.wait(1000);
    cy.get('[aria-label="run append"]').click();

    // Check that the linked list visually contains `head -> 42`.
    // We do this by getting all <text> elements in the canvas, checking two
    // properties:
    //   1. The right text elements exist (in this case, 'head' and '42').
    //   2. They appear in the right order. We do this by comparing the DOM
    //      coordinate's horizontal displacement.

    // Checking `head` and `42` exist, then giving them the aliases `headPtr`
    // and `firstNode` respectively.
    cy.get('#visualiser-canvas text').contains(/head/i).as('headPtr');
    cy.get('#visualiser-canvas text').contains(/42/).as('firstNode');

    // Checking that the `head` pointer is positioned before 42.
    const expectedOrder = ['@headPtr', '@firstNode'];
    let maxDisplacement = Number.NEGATIVE_INFINITY;
    cy.wrap(expectedOrder).each((alias: string) => {
      cy.get(alias).then((elem) => {
        if (elem.position().left >= maxDisplacement) {
          maxDisplacement = elem.position().left;
        } else {
          throw `Incorrect order of elements in the linked list. Expected the order: ${expectedOrder}`;
        }
      });
    });
    cy.wait(1000);
  });
});
