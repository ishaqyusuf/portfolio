// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
/// <reference types="cypress" />
import { curryRight } from "cypress/types/lodash";

// -- This is a parent command --
Cypress.Commands.add("login", (email, password) => {
  cy.goto("LOGIN");
  const form = {
    email,
    password,
  };
  ["email", "password"].map((e) => cy.typee(form[e], `name=${e}`));
  cy.get("input[type=checkbox]").type("Cypress.io{enter}");
  cy.clickBtnByName("submit");
});
Cypress.Commands.add("logout", () => {
  cy.contains("Login").should("not.exist");
  //   cy.get(".avatar").click();
  cy.contains("Logout").click();
  cy.contains("Login");
});

Cypress.Commands.add("resetPassword", (email) => {
  cy.typeEmail(email);
  cy.clickBtnById("submit");
});
Cypress.Commands.add("createAccount", (form) => {
  cy.visit("/register");
  ["first_name", "last_name", "email", "password"].map((e) =>
    cy.typee(form[e], `name=${e}`)
  );
  cy.clickBtnByName("submit");
});
