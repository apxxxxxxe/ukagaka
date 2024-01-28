import { sql, QueryResultRow } from "@vercel/postgres"
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
			await sql`SELECT * FROM good_count`
		).rows.map((row: QueryResultRow) => row.ip)

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
			const results: QueryResultRow[] = (
				await sql`
      SELECT id, today_count, cumlitive_count
      FROM good_count
      WHERE ip = ${ip} AND cumlitive_count > 0
    `
			).rows

			let goodCounts: GoodCount[] = []
			for (const result of results) {
				goodCounts.push({
					id: result.id,
					todayCount: result.today_count,
					cumlitiveCount: result.cumlitive_count,
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
