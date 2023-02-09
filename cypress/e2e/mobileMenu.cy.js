/// <reference types="cypress" />

const domain = Cypress.config().baseUrl;

beforeEach(() => {
	cy.visit(domain);
});

describe("mobile menu button", () => {
	it("displays correctly on small screens", () => {
		cy.viewport(779, 1024);
		cy.get("#mobile-menu").should("be.visible");
	});
	it("toggles the mobile menu when clicked", () => {
		cy.viewport(779, 1024);
		cy.get("#mobile-menu").click();
		cy.get("h1").should("not.be.visible");
		cy.get("#mobile-menu").click();
		cy.get("h1").should("be.visible");
	});
	it("doesn't display on large screens", () => {
		cy.viewport(780, 1024);
		cy.get("#mobile-menu").should("be.hidden");
	});
});
