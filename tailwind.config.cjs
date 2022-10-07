/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/views/**/*.pug", "./src/assets/js/*.js"],
  theme: {
    extend: {},
  },
  plugins: [require('@tailwindcss/forms'),],
	safelist: ['flash-success', 'flash-error', 'flash-info']
}
