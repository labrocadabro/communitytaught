const domain = Cypress.config().baseUrl;

beforeEach(() => {
  cy.visit(domain);
});
describe("filers page", () => {
  describe("when not logged in", () => {
    it("displays correctly", () => {
      cy.visit(`${domain}/class/filter`);
      cy.get("h1").should("have.text", "Filters");
    });
  });
});
