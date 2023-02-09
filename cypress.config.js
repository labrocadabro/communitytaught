import { defineConfig } from "cypress";

export default defineConfig({
	e2e: {
		baseUrl: "http://0.0.0.0:3000",
		video: false,
		setupNodeEvents(on, config) {
			// implement node event listeners here
		},
	},
});
