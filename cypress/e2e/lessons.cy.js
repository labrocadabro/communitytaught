/// <reference types="cypress" />

import { login } from "./utils.js";

const domain = Cypress.config().baseUrl;

beforeEach(() => {
	cy.visit(`${domain}/class/all`);
});

describe("class list page", () => {
	describe("when not logged in", () => {
		it("displays correctly", () => {
			cy.get("h1").should("have.text", "All Classes");
		});
		it("doesn't show checkboxes", () => {
			cy.get("input[type='checkbox']").should("not.exist");
		});
	});

	describe("when logged in", () => {
		beforeEach(() => {
			login();
			cy.get("a").contains("Classes").click();
		});
		const watched = Math.floor(Math.random() * 30);
		const checkedin = Math.floor(Math.random() * 30);

		it("shows checkboxes", () => {
			cy.get("input[type='checkbox']").should("exist");
		});
		it("marks classes watched", () => {
			cy.get("input[type='checkbox'].watched")
				.eq(watched)
				.click({ force: true });
			cy.reload();
			cy.get("input[type='checkbox'].watched").eq(watched).should("be.checked");
		});
		it("marks classes unwatched", () => {
			cy.get("input[type='checkbox'].watched")
				.eq(watched)
				.click({ force: true });
			cy.reload();
			cy.get("input[type='checkbox'].watched")
				.eq(watched)
				.should("not.be.checked");
		});
		it("marks classes checked in", () => {
			cy.get("input[type='checkbox'].checkedin")
				.eq(checkedin)
				.click({ force: true });
			cy.reload();
			cy.get("input[type='checkbox'].checkedin")
				.eq(checkedin)
				.should("be.checked");
		});
		it("marks classes not checked in", () => {
			cy.get("input[type='checkbox'].checkedin")
				.eq(checkedin)
				.click({ force: true });
			cy.reload();
			cy.get("input[type='checkbox'].checkedin")
				.eq(checkedin)
				.should("not.be.checked");
		});
	});

	describe("when logged in then logged out", () => {
		beforeEach(() => {
			login();
			cy.get("a").contains("Classes").click();
		});

		const watched = Math.floor(Math.random() * 30);
		const checkedin = Math.floor(Math.random() * 30);

		it("doesn't mark classes watched", () => {
			// simulate cookie expiring
			cy.clearCookies();
			cy.get("input[type='checkbox'].watched")
				.eq(watched)
				.click({ force: true });
			login();
			cy.get("a").contains("Classes").click();
			cy.get("input[type='checkbox'].watched")
				.eq(watched)
				.should("not.be.checked");
		});
		it("doesn't mark classes checked in", () => {
			cy.clearCookies();
			cy.get("input[type='checkbox'].checkedin")
				.eq(checkedin)
				.click({ force: true });
			login();
			cy.get("a").contains("Classes").click();
			cy.get("input[type='checkbox'].checkedin")
				.eq(checkedin)
				.should("not.be.checked");
		});
	});
});

describe.only("individual class pages", () => {
	describe("when not logged in", () => {
		it("displays correctly", () => {
			cy.get("a")
				.contains("Easily Add Authentication To Your Node Apps!")
				.click({ force: true });
			cy.get("h1").should(
				"contain.text",
				"Classes 50 - 52: Easily Add Authentication To Your Node Apps!"
			);
		});
		it("doesn't show checkboxes", () => {
			cy.get("a")
				.contains("Easily Add Authentication To Your Node Apps!")
				.click({ force: true });
			cy.get("input[type='checkbox']").should("not.exist");
		});
	});

	describe("when logged in", () => {
		beforeEach(() => {
			login();
			cy.get("a").contains("Classes").click();
			cy.get("a")
				.contains("Easily Add Authentication To Your Node Apps!")
				.click({ force: true });
		});

		it("shows checkboxes", () => {
			cy.get("input[type='checkbox']").should("exist");
		});
		it("marks classes watched", () => {
			cy.get("input[type='checkbox'].watched").click({ force: true });
			cy.reload();
			cy.get("input[type='checkbox'].watched").should("be.checked");
		});
		it("marks classes unwatched", () => {
			cy.get("input[type='checkbox'].watched").click({ force: true });
			cy.reload();
			cy.get("input[type='checkbox'].watched").should("not.be.checked");
		});
		it("marks classes checked in", () => {
			cy.get("input[type='checkbox'].checkedin").click({ force: true });
			cy.reload();
			cy.get("input[type='checkbox'].checkedin").should("be.checked");
		});
		it("marks classes not checked in", () => {
			cy.get("input[type='checkbox'].checkedin").click({ force: true });
			cy.reload();
			cy.get("input[type='checkbox'].checkedin").should("not.be.checked");
		});
		it("marks items complete", () => {
			cy.get("input[type='checkbox'].item").eq(0).click({ force: true });
			cy.reload();
			cy.get("input[type='checkbox'].item").eq(0).should("be.checked");
		});
		it("marks items incomplete", () => {
			cy.get("input[type='checkbox'].item").eq(0).click({ force: true });
			cy.reload();
			cy.get("input[type='checkbox'].item").eq(0).should("not.be.checked");
		});
		it("marks extras complete", () => {
			cy.get("input[type='checkbox'].extra").eq(0).click({ force: true });
			cy.reload();
			cy.get("input[type='checkbox'].extra").eq(0).should("be.checked");
		});
		it("marks extras incomplete", () => {
			cy.get("input[type='checkbox'].extra").eq(0).click({ force: true });
			cy.reload();
			cy.get("input[type='checkbox'].extra").eq(0).should("not.be.checked");
		});
		it("marks submitted complete", () => {
			cy.get("input[type='checkbox'].submitted").eq(0).click({ force: true });
			cy.reload();
			cy.get("input[type='checkbox'].submitted").eq(0).should("be.checked");
		});
		it("marks submitted incomplete", () => {
			cy.get("input[type='checkbox'].submitted").eq(0).click({ force: true });
			cy.reload();
			cy.get("input[type='checkbox'].submitted").eq(0).should("not.be.checked");
		});
	});

	describe("when logged in then logged out", () => {
		beforeEach(() => {
			login();
			cy.get("a").contains("Classes").click();
			cy.get("a")
				.contains("Easily Add Authentication To Your Node Apps!")
				.click({ force: true });
		});

		it("doesn't mark classes watched", () => {
			// simulate cookie expiring
			cy.clearCookies();
			cy.get("input[type='checkbox'].watched").click({ force: true });
			login();
			cy.get("a").contains("Classes").click();
			cy.get("a")
				.contains("Easily Add Authentication To Your Node Apps!")
				.click({ force: true });
			cy.get("input[type='checkbox'].watched").should("not.be.checked");
		});
		it("doesn't mark classes checked in", () => {
			cy.clearCookies();
			cy.get("input[type='checkbox'].checkedin").click({ force: true });
			login();
			cy.get("a").contains("Classes").click();
			cy.get("a")
				.contains("Easily Add Authentication To Your Node Apps!")
				.click({ force: true });
			cy.get("input[type='checkbox'].checkedin").should("not.be.checked");
		});
		it("doesn't mark items complete", () => {
			// simulate cookie expiring
			cy.clearCookies();
			cy.get("input[type='checkbox'].item").eq(0).click({ force: true });
			login();
			cy.get("a").contains("Classes").click();
			cy.get("a")
				.contains("Easily Add Authentication To Your Node Apps!")
				.click({ force: true });
			cy.get("input[type='checkbox'].item").eq(0).should("not.be.checked");
		});
		it("doesn't mark extras complete", () => {
			cy.clearCookies();
			cy.get("input[type='checkbox'].item").eq(0).click({ force: true });
			login();
			cy.get("a").contains("Classes").click();
			cy.get("a")
				.contains("Easily Add Authentication To Your Node Apps!")
				.click({ force: true });
			cy.get("input[type='checkbox'].item").eq(0).should("not.be.checked");
		});
		it("doesn't mark submitted complete", () => {
			cy.clearCookies();
			cy.get("input[type='checkbox'].submitted").eq(0).click({ force: true });
			login();
			cy.get("a").contains("Classes").click();
			cy.get("a")
				.contains("Easily Add Authentication To Your Node Apps!")
				.click({ force: true });
			cy.get("input[type='checkbox'].submitted").eq(0).should("not.be.checked");
		});
	});
});
