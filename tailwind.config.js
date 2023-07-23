/** @type {import('tailwindcss').Config} */
module.exports = {
	purge: [
		"./pages/**/*.{js,ts,jsx,tsx}",
		"./components/**/*.{js,ts,jsx,tsx}",
		"./utils/**/*.{js,ts,jsx,tsx}",
	],
	darkMode: false, // or 'media' or 'class'
	theme: {
		fontFamily: {
			sans: ["Open Sans", "sans-serif"],
			tegaki: ["klee", "sans-serif"],
			tegakibold: ["klee-semibold", "sans-serif"],
		},
		colors: {
			darkblue: "#1e2130",
			black: "#30383a",
			white: "#f8f8f8",
			gray: "#b8b8b8",
			lightgray: "#e4e4e8",
			blue: "#4566af",
		},
		extend: {
			backgroundImage: {
				dot: "url('/bg.png')",
				rain: "url('/rain.gif')",
				fog: "url('/fog.jpg')",
			},
			blur: {
				xs: "1.5px",
			},
		},
		container: {
			center: true,
			padding: "1rem",
			screens: {
				sm: "100%",
				md: "100%",
				lg: "800px",
				xl: "800px",
				"2xl": "800px",
			},
		},
	},
	variants: {
		extend: {},
	},
	plugins: [],
}
