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
					50: "#FBF9F1",
					100: "#E5E1DA",
					200: "#AAD7D9",
					300: "#92C7CF",
					400: "#92C7CF",
					500: "#92C7CF",
					600: "#92C7CF",
					700: "#92C7CF",
					800: "#508da1",
					900: "#3e778a",
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
