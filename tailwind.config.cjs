/** @type {import('tailwindcss').Config} */
module.exports = {
	content: ["./src/views/**/*.pug", "./src/assets/js/*.js"],
	theme: {
		screens: {
			xs: "640px",
			sm: "780px",
			md: "926px",
			lg: "1024px",
			xl: "1280px",
			"2xl": "1536px",
		},
		extend: {
			fontFamily: {
				logo: ["Orienta", "serif"],
				main: ["Poppins", "sans-serif"],
				awesome: ['"Font Awesome 6 Free"'],
			},
			colors: {
				twilight: {
					50: "#f1f8fa",
					100: "#E8F3F7",
					200: "#bfe0ee",
					300: "#9ed0e5",
					400: "#7ec0dd",
					500: "#5eb1d4",
					600: "#3ea1cc",
					700: "#2e86ab",
					800: "#226581",
					900: "#153f51",
				},
			},
			textUnderlineOffset: {
				6: "6px",
			},
			textDecorationThickness: {
				3: "3px",
			},
			maxWidth: {
				"1/3": "33%",
				80: "20rem",
			},
		},
	},
	plugins: [require("@tailwindcss/forms")],
	safelist: ["flash-success", "flash-error", "flash-info"],
};
