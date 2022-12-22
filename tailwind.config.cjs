/** @type {import('tailwindcss').Config} */
module.exports = {
	content: ["./src/views/**/*.pug", "./src/assets/js/*.js"],
	theme: {
		screens: {
			xs: "640px",
			sm: "768px",
			md: "896px",
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
				// 'corn': {
				// 	100: '#fffceb',
				// 	200: '#fff6c2',
				// 	300: '#fff099',
				// 	400: '#ffea70',
				// 	500: '#ffe75c',
				// 	600: '#ffe033',
				// 	700: '#ffda0a',
				// 	800: '#e0bf00',
				// 	900: '#b89c00',
				// },
				vermillion: {
					100: "#",
					200: "#",
					300: "#",
					400: "#",
					500: "#",
					600: "#c92918",
					700: "#",
					800: "#",
					900: "#",
				},
			},
			textUnderlineOffset: {
				6: "6px",
			},
			textDecorationThickness: {
				3: "3px",
			},
		},
	},
	plugins: [require("@tailwindcss/forms")],
	safelist: ["flash-success", "flash-error", "flash-info"],
};
