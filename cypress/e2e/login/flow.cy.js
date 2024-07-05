/// <reference types="cypress" />

import { USER } from "../../mocks/entities";

describe("loginPage", () => {
  it("Login expect sucess on click submit button", () => {
    cy.login(USER);

    cy.contains("span", "Sancla Centro")
  });
});
