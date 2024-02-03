import prisma from "lib/prisma"
import { NextApiRequest, NextApiResponse } from "next"
import { Commit } from "pages/index"

export default async function handler(
	req: NextApiRequest,
	res: NextApiResponse
) {
	const start: string = (req.query.start ||
		new Date(0).toISOString()) as string
	const end: string = (req.query.end || new Date().toISOString()) as string
	const count: number = parseInt(req.query.count as string)

	const rawCommits = await prisma.commits.findMany({
		where: {
			date: {
				gt: new Date(start as string),
				lt: new Date(end as string),
			},
		},
		orderBy: {
			date: "desc",
		},
		take: count,
	})

	const commits: Commit[] = rawCommits.map((commit) => {
		return {
			repoName: commit.repo_name,
			date: new Date(commit.date).toISOString(),
			messages: commit.messages,
		}
	})

	res.status(200).json(commits)
}
