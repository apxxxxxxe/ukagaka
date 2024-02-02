import prisma from "lib/prisma"
import { NextApiRequest, NextApiResponse } from "next"

export type GoodUser = {
	ipAddress: string
	goodCount: GoodCount[]
}

export type GoodCount = {
	id: string
	todayCount: number
	cumlitiveCount: number
}

export default async function (req: NextApiRequest, res: NextApiResponse) {
	// GET method

	if (req.method === "GET") {
		const rawIpAddresses: string[] = (
			await prisma.good_count.findMany({
				select: {
					ip: true,
				},
			})
		).map((row) => row.ip)

		let ipAddresses: string[] = []
		let ipMap: Map<string, boolean> = new Map()
		for (const rawIpAddress of rawIpAddresses) {
			if (!ipMap.has(rawIpAddress)) {
				ipMap.set(rawIpAddress, true)
				ipAddresses.push(rawIpAddress)
			}
		}

		let goodUsers: GoodUser[] = []
		for (const ip of ipAddresses) {
			const results = await prisma.good_count.findMany({
				where: {
					ip: ip,
					cumulative_count: {
						gt: 0,
					},
				},
				select: {
					button_id: true,
					today_count: true,
					cumulative_count: true,
				},
			})

			let goodCounts: GoodCount[] = []
			for (const result of results) {
				goodCounts.push({
					id: result.button_id,
					todayCount: result.today_count,
					cumlitiveCount: result.cumulative_count,
				})
			}

			goodUsers.push({
				ipAddress: ip,
				goodCount: goodCounts,
			})
		}

		res.status(200).json(goodUsers)
		return
	}

	res.status(404).end()
}
