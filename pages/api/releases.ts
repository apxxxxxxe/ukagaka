import prisma from "lib/prisma"
import { NextApiRequest, NextApiResponse } from "next"
import { Release } from "pages/index"

export default async function handler(
	req: NextApiRequest,
	res: NextApiResponse
) {
	const start: string = (req.query.start ||
		new Date(0).toISOString()) as string
	const end: string = (req.query.end || new Date().toISOString()) as string
	const count: number = parseInt(req.query.count as string)

	const rawReleases = await prisma.releases.findMany({
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

	const releases: Release[] = rawReleases.map((release) => {
		return {
			repoName: release.repo_name,
			date: new Date(release.date).toISOString(),
			tagName: release.tag_name,
			body: release.body,
			bodyHtml: null,
		}
	})

	res.status(200).json(releases)
}
