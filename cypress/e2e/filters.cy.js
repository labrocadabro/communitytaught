/// <reference types="cypress" />

import { login } from "./utils.js";

const domain = Cypress.config().baseUrl;

beforeEach(() => {
  cy.visit(domain);
  // wait for the page to load including js
});

describe("All class page", () => {
  describe("when clicking on a tag", () => {
    beforeEach(() => {
      cy.visit(`${domain}/class/all`);
      cy.get(".tag-link").first().as("firstTag");
      cy.get("@firstTag").invoke("data", "id").as("dataId");
      cy.get("@firstTag").click({ force: true });
    });
    it("it redirects to the filter page", () => {
      cy.url().should("include", "/class/filter");
      cy.get("h1").should("have.text", "Filter Results");
    });
    it("it adds the tag to the url", () => {
      cy.get("@dataId").then((dataId) => {
        cy.url().should("include", `tags=${encodeURIComponent(dataId)}`);
      });
    });
  });
});

describe("Individual class page", () => {
  beforeEach(() => {
    cy.visit(`${domain}/class/1`);
    cy.get(".tag-link").first().as("firstTag");
    cy.get("@firstTag").invoke("data", "id").as("dataId");
    cy.get("@firstTag").click({ force: true });
  });
  describe("when clicking on a tag", () => {
    it("it redirects to the filter page", () => {
      cy.url().should("include", "/class/filter");
      cy.get("h1").should("have.text", "Filter Results");
    });
    it("it adds the tag to the url", () => {
      cy.get("@dataId").then((dataId) => {
        cy.url().should("include", `tags=${encodeURIComponent(dataId)}`);
      });
    });
  });
});

describe("filter page", () => {
  describe("when not logged in", () => {
    it("displays correctly", () => {
      cy.visit(`${domain}/class/filter`);
      cy.get("h1").should("have.text", "Filter Results");
    });

    it("should load filterTags.js file", () => {
      cy.visit(`${domain}/class/filter`);
      cy.get("script[src='/js/filterTags.js']").should("exist");
    });
  });

  describe("when logged in", () => {
    beforeEach(() => {
      login();
      cy.visit(`${domain}/class/filter`);
    });
    it("displays correctly", () => {
      cy.get("h1").should("have.text", "Filter Results");
    });

    it("should load filterTags.js file", () => {
      cy.get("script[src='/js/filterTags.js']").should("exist");
    });
  });

  describe("when clicking on a filter", () => {
    beforeEach(() => {
      cy.visit(`${domain}/class/filter`);
      cy.get(".filter-tag").first().as("firstFilter");
      cy.get("@firstFilter").invoke("data", "id").as("dataId");
      cy.get("@firstFilter")
        .click({ force: true }, { log: true, timeout: 10000 })
        .then(() => cy.log("clicked"));
    });

    it("it adds the filter to the url", { scrollBehavior: false }, () => {
      cy.get("@dataId").then((dataId) => {
        cy.url()
          .should("include", `tags=${encodeURIComponent(dataId)}`, {
            log: true,
            timeout: 10000,
          })
          .then(() => cy.log("url"));
      });
    });

    describe("when clicking on a second filter", () => {
      beforeEach(() => {
        cy.get(".filter-tag").eq(1).as("secondFilter");
        cy.get("@secondFilter").invoke("data", "id").as("dataId");
        cy.get("@secondFilter").click({ force: true });
      });
      it("it should add to the url as a query param of tags", () => {
        cy.get("@dataId").then((dataId) => {
          console.log(dataId);
          cy.url().should("include", `${encodeURIComponent(dataId)}`);
        });
      });

      it("it should have both filters in the url", () => {
        cy.get("@dataId").then((dataId) => {
          cy.url().should("include", `${encodeURIComponent(dataId)}`);
        });
        cy.get("@firstFilter").invoke("data", "id").as("dataId");
        cy.get("@dataId").then((dataId) => {
          cy.url().should("include", `${encodeURIComponent(dataId)}`);
        });
      });
    });

    describe("when clicking on a selected filter", () => {
      beforeEach(() => {
        cy.get("@firstFilter").click({ force: true });
      });
      it("it should remove the filter from the url", () => {
        cy.get("@dataId").then((dataId) => {
          cy.url().should("not.include", `${encodeURIComponent(dataId)}`);
        });
      });

      it("it should have the other filter in the url", () => {
        cy.get(".filter-tag").eq(1).as("secondFilter");
        cy.get("@secondFilter").invoke("data", "id").as("dataId");
        cy.get("@secondFilter").click({ force: true });

        cy.get("@dataId").then((dataId) => {
          cy.url().should("include", `${encodeURIComponent(dataId)}`);
        });
      });
    });

    describe("when clicking on the clear button", () => {
      beforeEach(() => {
        cy.get("#filter-tag-clear").as("clearBtn");
        cy.get("@clearBtn").click({ force: true });
      });
      it("it should clear the url", () => {
        cy.url().should("not.include", "tags=");
      });
    });
  });
});
