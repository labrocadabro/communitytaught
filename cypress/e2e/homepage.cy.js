/// <reference types="cypress" />

describe("homepage", () => {
	beforeEach(() => {
		cy.visit("0.0.0.0:3000");
	});

	it("displays correctly", () => {
		cy.get("h1").should("have.text", "100Devs Progress Tracker");
	});
});
