/// <reference types="cypress" />

const domain = Cypress.config().baseUrl;

beforeEach(() => {
	cy.visit(domain);
});

describe("homepage", () => {
	it("displays correctly", () => {
		cy.get("h1").should("have.text", "100Devs Progress Tracker");
	});
});

describe("about page", () => {
	it("displays correctly", () => {
		cy.get("a").contains("About the project").click();
		cy.get("h1").should("have.text", "About the 100Devs Progress Tracker");
	});
});
