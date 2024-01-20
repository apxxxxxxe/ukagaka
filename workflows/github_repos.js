const utils = require("./utils.js")

async function get_repos() {
	const response = await utils.github.get(`/users/apxxxxxxe/repos`)
	const data = response.data.filter((item) => {
		return utils.repos.includes(item.name)
	})

	let repos = []
	for (item of data) {
		repos.push({
			repoName: item.name,
			pushedAt: item.pushed_at,
		})
	}

	console.log(JSON.stringify(repos))
}

get_repos()
