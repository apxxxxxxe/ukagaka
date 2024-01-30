const utils = require("./utils.js")

async function get_releases() {
	let releases = []
	for (const repo of utils.repos) {
		const response = await utils.github.get(
			`/repos/apxxxxxxe/${repo}/releases`
		)
		const data = response.data
		data.sort((a, b) => {
			return new Date(b.published_at) - new Date(a.published_at)
		})

		for (let i = 0; i < data.length - 1; i++) {
			// draftは除外
			if (data[i].draft) {
				continue
			}

			releases.push({
				repoName: repo,
				date: data[i].published_at,
				tagName: data[i].tag_name,
				body: data[i].body || "",
				bodyHtml: null,
			})
		}
	}

	releases.sort((a, b) => {
		return new Date(b.date) - new Date(a.date)
	})

	let releasesByDate = new Map()
	for (const release of releases) {
		const date = new Date(release.date).toLocaleDateString()
		if (releasesByDate.has(date)) {
			const ary = releasesByDate.get(date)
			ary.push(release)
			releasesByDate.set(date, ary)
		} else {
			releasesByDate.set(date, [release])
		}
	}

	let obj = []
	for (const [key, value] of releasesByDate) {
		obj.push({
			date: key,
			releases: value,
		})
	}

	console.log(JSON.stringify(obj))
}

get_releases()
