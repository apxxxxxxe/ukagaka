import prisma from "lib/prisma"
import { NextApiRequest, NextApiResponse } from "next"
import { Commit } from "pages/index"

export default async function handler(
	req: NextApiRequest,
	res: NextApiResponse
) {
	const monthAgo = new Date()
	monthAgo.setMonth(monthAgo.getMonth() - 1)
	const start: string = (req.query.start || monthAgo.toISOString()) as string
	const end: string = (req.query.end || new Date().toISOString()) as string

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
	})

	const commits: Commit[] = rawCommits.map((commit) => {
		return new Commit(
			commit.repo_name,
			new Date(commit.date).toISOString(),
			commit.messages
		)
	})

	res.status(200).json(commits)
}
