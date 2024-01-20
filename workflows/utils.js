const axios = require("axios")

module.exports = {
	github: axios.create({
		baseURL: "https://api.github.com",
	}),
	repos: [
		"Haine",
		"Youto",
		"thumbelina-shell",
		"kirinokougai",
		"GhostSpeaker",
		"Ukaing",
		"GhostWardrobe",
		"Bouyomi",
		"recentghosts",
		"shioriupdater",
	],
}
