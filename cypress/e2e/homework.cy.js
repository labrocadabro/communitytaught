/// <reference types="cypress" />

const domain = Cypress.config().baseUrl;

beforeEach(() => {
	cy.visit(`${domain}/hw/all`);
});

describe("homework page when not logged in", () => {
	it("displays correctly", () => {
		cy.get("h1").should("have.text", "All Homework");
	});
	it("doesn't show checkboxes", () => {
		cy.get("input[type='checkbox']").should("not.exist");
	});
});

describe("homework page when logged in", () => {
	beforeEach(() => {
		cy.get("a").contains("Log in").click();
		cy.get("#email").type("test@test.com");
		cy.get("#pwd").type("testtest");
		cy.get("button[type='submit']").click();
		cy.get("a").contains("Homework").click();
	});
	const item = Math.floor(Math.random() * 50);
	const extra = Math.floor(Math.random() * 20);

	it("shows checkboxes", () => {
		cy.get("input[type='checkbox']").should("exist");
	});
	it("marks items complete", () => {
		cy.get("input[type='checkbox'].item").eq(item).click({ force: true });
		cy.reload();
		cy.get("input[type='checkbox'].item").eq(item).should("be.checked");
	});
	it("marks items incomplete", () => {
		cy.get("input[type='checkbox'].item").eq(item).click({ force: true });
		cy.reload();
		cy.get("input[type='checkbox'].item").eq(item).should("not.be.checked");
	});
	it("marks extras complete", () => {
		cy.get("input[type='checkbox'].extra").eq(extra).click({ force: true });
		cy.reload();
		cy.get("input[type='checkbox'].extra").eq(extra).should("be.checked");
	});
	it("marks extras incomplete", () => {
		cy.get("input[type='checkbox'].extra").eq(extra).click({ force: true });
		cy.reload();
		cy.get("input[type='checkbox'].extra").eq(extra).should("not.be.checked");
	});
});
