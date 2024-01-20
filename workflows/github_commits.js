const utils = require("./utils.js")

async function get_commits() {
	let commits = []
	for (const repo of utils.repos) {
		const response = await utils.github.get(
			`/repos/apxxxxxxe/${repo}/commits`
		)
		const data = response.data
		data.sort((a, b) => {
			return (
				new Date(b.commit.committer.date) -
				new Date(a.commit.committer.date)
			)
		})

		for (let i = 0; i < data.length - 1; i++) {
			let dateA = new Date(data[i].commit.committer.date)
			let dateB = new Date(data[i + 1].commit.committer.date)
			// 日付(時刻は無視)が同じならコミットメッセージを結合する
			if (dateA.toLocaleDateString() === dateB.toLocaleDateString()) {
				data[i + 1].commit.message = data[i].commit.message.concat(
					"\n",
					data[i + 1].commit.message
				)
			} else {
				commits.push({
					repoName: repo,
					date: data[i].commit.committer.date,
					message: data[i].commit.message,
				})
			}
		}
	}

	commits.sort((a, b) => {
		return new Date(b.date) - new Date(a.date)
	})
	console.log(JSON.stringify(commits))
}

get_commits()
