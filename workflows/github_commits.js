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

		let tmpMessages = []
		for (let i = 0; i < data.length - 1; i++) {
			// 特定のコミットメッセージは無視する
			if (
				data[i].commit.message.includes("md5") ||
				data[i].commit.message.includes("CI") ||
				data[i].commit.message.includes("Merge branch")
			) {
				continue
			}
			
			tmpMessages.push(data[i].commit.message)

			let dateA = new Date(data[i].commit.committer.date)
			let dateB = new Date(data[i + 1].commit.committer.date)
			if (dateA.toLocaleDateString() !== dateB.toLocaleDateString()) {
				tmpMessages.push(data[i].commit.message)
				commits.push({
					repoName: repo,
					date: data[i].commit.committer.date,
					message: tmpMessages,
				})
				tmpMessages = []
			}
		}
	}

	commits.sort((a, b) => {
		return new Date(b.date) - new Date(a.date)
	})

	let commitsByDate = new Map()
	for (const commit of commits) {
		const date = new Date(commit.date).toLocaleDateString()
		if (commitsByDate.has(date)) {
			const ary = commitsByDate.get(date)
			ary.push(commit)
			commitsByDate.set(date, ary)
		} else {
			commitsByDate.set(date, [commit])
		}
	}

	let obj = []
	for (const [key, value] of commitsByDate) {
		obj.push({
			date: key,
			commits: value,
		})
	}

	console.log(JSON.stringify(obj))
}

get_commits()
