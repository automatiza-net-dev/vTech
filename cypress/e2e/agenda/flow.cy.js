/// <reference types="cypress" />

import { USER } from "../../mocks/entities";

function filterPatients() {
  cy.findByText("Agenda horário alternativo", { timeout: 10000 }).click({
    force: true,
  });

  cy.contains("Nenhum paciente encontrado", { timeout: 10000 }).should(
    "be.visible"
  );

  cy.findByText("Filtrar", { timeout: 10000 }).click({ force: true });

  cy.get("tr", { timeout: 10000 }).should("have.length.greaterThan", 1);
}

describe("Agenda", () => {
  before(() => {
    cy.login(USER);
    cy.visit("/dashboard/agenda");

    filterPatients();
  });

  it("Selecionar tutor ativo", () => {
    const client = Cypress.env("client");

    if (client === "sancla") {

      cy.getElement("table_patients").find("tbody").first().find("tr").first().then($tr => {
        cy.log("TR encontrado:", $tr.text());
        cy.wrap($tr)
          .find('[data-cy="add_tutor"]')
          .should("be.visible")
          .click({ force: true });

          cy.wait(1000)

          //Pegar o primeiro valor do select para armazenar qual é a opção que foi selecionada
          //Selecionar a primeira opção
          //após clicar em vincular verificar se o $tr que está aqui no escopo a listagem dos tutores a opção selecionada está dentro de um strong ou alguma forma de saber que ela é a ativa.

          cy.findByText("Vincular", { timeout: 10000 }).click({
            force: true,
          });
      });
    }
  });
});
