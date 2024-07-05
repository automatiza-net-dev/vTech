// support/index.d.ts
/// <reference types="cypress" />

declare namespace Cypress {
  interface Chainable {
    login(params: { email: string, password: string }): void;
    getElement(value: string): Cypress.Chainable<JQuery<HTMLElement>>;
  }
}
