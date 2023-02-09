/// <reference types="cypress" />

const domain = Cypress.config().baseUrl;

beforeEach(() => {
	cy.visit(domain);
});

describe("resources page", () => {
	it("displays correctly", () => {
		cy.get("a").contains("Resources").click();
		cy.get("h1").should("have.text", "Additional Resources");
	});
});
