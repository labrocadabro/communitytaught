const domain = Cypress.config().baseUrl;

export function logout() {
	cy.get("#account-menu").click();
	cy.get("a").contains("Log out").click();
}

export function login(email = "test@test.com", password = "testtest") {
	cy.get("a").contains("Log in").click();
	if (email.length) cy.get("#email").type(email);
	if (password.length) cy.get("#pwd").type(password);
	cy.get("button[type='submit']").click();
}

export function signup(
	email = "test1@test.com",
	password = "testtest",
	conf = password
) {
	cy.get("a").contains("Sign up").click();
	if (email.length) cy.get("#email").type(email);
	if (password.length) cy.get("#pwd").type(password);
	if (conf.length) cy.get("#conf").type(conf);
	cy.get("button[type='submit']").click();
}

export function deleteAccount(email = "test1@test.com") {
	cy.get("#account-menu").click();
	cy.get("a").contains("Account").click();
	cy.get("#delete-account button#first").click();
	cy.get("#delete_confirm").type(email);
	cy.get("#delete-account button#second").click();
}
