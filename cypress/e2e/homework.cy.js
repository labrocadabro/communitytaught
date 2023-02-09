/// <reference types="cypress" />

import { login } from "./utils.js";

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
		login();
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

describe("homework page when logged in then logged out", () => {
	beforeEach(() => {
		login();
		cy.get("a").contains("Homework").click();
	});
	const item = Math.floor(Math.random() * 50);
	const extra = Math.floor(Math.random() * 20);
	it("doesn't mark items complete", () => {
		// simulate cookie expiring
		cy.clearCookies();
		cy.get("input[type='checkbox'].item").eq(item).click({ force: true });
		cy.reload();
		login();
		cy.get("a").contains("Homework").click();
		cy.get("input[type='checkbox'].item").eq(item).should("not.be.checked");
	});
	it("doesn't mark extras complete", () => {
		cy.clearCookies();
		cy.get("input[type='checkbox'].item").eq(extra).click({ force: true });
		cy.reload();
		login();
		cy.get("a").contains("Homework").click();
		cy.get("input[type='checkbox'].item").eq(extra).should("not.be.checked");
	});
});
