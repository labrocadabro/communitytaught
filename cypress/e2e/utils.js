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
