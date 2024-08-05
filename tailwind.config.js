/** @type {import('tailwindcss').Config} */
module.exports = {
	purge: [
		"./pages/**/*.{js,ts,jsx,tsx}",
		"./components/**/*.{js,ts,jsx,tsx}",
		"./utils/**/*.{js,ts,jsx,tsx}",
	],
	darkMode: false, // or 'media' or 'class'
	theme: {
		colors: {
			darkblue: "#1e2130",
			black: "#30383a",
			white: "#f8f8f8",
			lightgray: "#e4e4e8",
			gray: "#b8b8b8",
			darkgray: "#6c6c6f",
			blue: "#4566af",
		},
		listStyleType: {
			none: "none",
			disc: "disc",
			decimal: "decimal",
			square: "square",
			circle: "circle",
			roman: "upper-roman",
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
