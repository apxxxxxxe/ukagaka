import markdownToHtml from "utils/markdownToHtml"
import fs from "fs"
import path from "path"

import HomePage, {
	Repository,
	CommitsByDate,
	ReleasesByDate,
} from "app/client-component"

const getProps = async () => {
	// Piecesのリポジトリの最終更新日を取得
	const repoDataPath = path.join(process.cwd(), "data", "repositories.json")
	const repoContents = fs.readFileSync(repoDataPath, "utf8")
	const pushedAts: Repository[] = JSON.parse(repoContents)
	console.log(pushedAts)

	// 最近のコミットを取得
	const commitDataPath = path.join(
		process.cwd(),
		"data",
		"commits_by_date.json"
	)
	const commitContents = fs.readFileSync(commitDataPath, "utf8")
	const commits: CommitsByDate[] = JSON.parse(commitContents)
	console.log(commits)

	// 最近のリリースを取得
	const releaseDataPath = path.join(
		process.cwd(),
		"data",
		"releases_by_date.json"
	)
	const releaseContents = fs.readFileSync(releaseDataPath, "utf8")
	const releasesByDate: ReleasesByDate[] = JSON.parse(releaseContents)

	for (let i = 0; i < releasesByDate.length; i++) {
		for (let j = 0; j < releasesByDate[i].releases.length; j++) {
			const body = releasesByDate[i].releases[j].body
			if (body !== "") {
				releasesByDate[i].releases[j].body_html = await markdownToHtml(
					body
				)
			} else {
				releasesByDate[i].releases[j].body_html = null
			}
		}
	}

	return {
		pushedAts: pushedAts,
		commits: commits,
		releases: releasesByDate,
	}
}

export default async function Page() {
	const props = await getProps()
	return <HomePage {...props} />
}
