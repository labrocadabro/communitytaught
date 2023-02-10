/// <reference types="cypress" />

import { login, logout } from "./utils.js";

const domain = Cypress.config().baseUrl;

beforeEach(() => {
	cy.visit(domain);
});

describe("login", () => {
	it("works correctly", () => {
		login();
		cy.get("h1").should("have.text", "Your Progress");
		cy.get(".lesson-card h3").should("have.text", "Class 1");
	});
	it("works correctly if email has uppercase letters", () => {
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
	it("redirects to github login page", () => {
		cy.get("a").contains("Log in").click();
		cy.get("a").contains("Log In with Github").click();
		cy.origin("github.com", () => {
			cy.url().should("include", "github.com/login");
		});
	});
});

describe("google login", () => {
	it("redirects to google login page", () => {
		cy.get("a").contains("Log in").click();
		cy.get("a").contains("Log In with Google").click();
		cy.origin("accounts.google.com", () => {
			cy.url().should("include", "google.com/o/oauth2/v2/auth/");
		});
	});
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
