/// <reference types="cypress" />

import { login, logout } from "./utils.js";

const domain = Cypress.config().baseUrl;

beforeEach(() => {
	cy.visit(`${domain}/hw/all`);
});

describe("login", () => {
	it("logs in correctly", () => {
		login();
		cy.get("h1").should("have.text", "Your Progress");
		cy.get(".lesson-card h3").should("have.text", "Class 1");
	});
	it("logs in correctly if email has uppercase letters", () => {
		login("TEST@TEST.COM");
		cy.get("h1").should("have.text", "Your Progress");
		cy.get(".lesson-card h3").should("have.text", "Class 1");
	});
	it("shows an error if email is incorrect", () => {
		login("nouser@test.com");
		cy.get("h1").should("have.text", "Log In");
		cy.get(".flash").should("contain.text", "Invalid email or password");
	});
	it("shows an error if email is missing", () => {
		login("");
		cy.get("h1").should("have.text", "Log In");
		cy.get(".flash").should(
			"contain.text",
			"Please enter a valid email address"
		);
	});
	it("shows an error if password is incorrect", () => {
		login("test@test.com", "test");
		cy.get("h1").should("have.text", "Log In");
		cy.get(".flash").should("contain.text", "Invalid email or password");
	});
	it("shows an error if password is missing", () => {
		login("test@test.com", "");
		cy.get("h1").should("have.text", "Log In");
		cy.get(".flash").should("contain.text", "Password cannot be blank");
	});
});

describe("github login", () => {
	it("redirects to github login page", () => {});
});

describe("google login", () => {
	it("redirects to github login page", () => {});
});

describe("logout", () => {
	it("logs out correctly", () => {
		login();
		logout();
		cy.get("h1").should("have.text", "Log In");
		cy.get("a").contains("Homework").click();
		cy.get(".flash").should("contain.text", "YOU ARE NOT CURRENTLY LOGGED IN.");
	});
});
