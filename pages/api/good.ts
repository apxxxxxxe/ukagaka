import prisma from "lib/prisma"
import { NextApiRequest, NextApiResponse } from "next"

export enum GoodButtonStatus {
	OK = 200,
	UPTOLIMIT = 429,
}

export type GoodButtonGetResponse = {
	todayCount: number
	cumulativeCount: number
}

export type GoodButtonPostResponse = {
	goodButtonStatus: GoodButtonStatus
	todayCount: number
	cumulativeCount: number
}

export const GoodLimit = 5

export default async function handler(
	req: NextApiRequest,
	res: NextApiResponse
) {
	const ip: string = req.headers["x-forwarded-for"]
		? String(req.headers["x-forwarded-for"]).split(",")[0]
		: ""

	// button id
	const id: string = req.query.id as string
	if (id === undefined) {
		res.status(400).json({ message: "id is required" })
		return
	}

	// set timezone to UTC
	// await sql`SET timezone TO 'UTC'`
	await prisma.$executeRaw`SET timezone TO 'UTC'`

	const now = new Date().toUTCString()
	const nowISO = new Date().toISOString()

	// await sql`SELECT * FROM good_count WHERE ip = ${ip} AND id = ${id}`
	let good = await prisma.good_count.findFirst({
		where: {
			ip: ip,
			button_id: id,
		},
	})

	// if user doesn't exist, create a new user
	if (good === null) {
		good = await prisma.good_count.create({
			data: {
				ip: ip,
				button_id: id,
				last_date: nowISO,
				today_count: 0,
				cumulative_count: 0,
			},
		})
	}

	// if last_date is not today, reset today_count
	const dataA = good.last_date.toUTCString()
	if (dataA.slice(0, 16) !== now.slice(0, 16)) {
	}

	if (req.method === "GET") {
		const response: GoodButtonGetResponse = {
			todayCount: good.today_count,
			cumulativeCount: good.cumulative_count,
		}
		res.status(200).json(response)
	} else if (req.method === "POST") {
		// if today_count is limit, return error
		if (good.today_count >= GoodLimit) {
			const response: GoodButtonPostResponse = {
				goodButtonStatus: GoodButtonStatus.UPTOLIMIT,
				todayCount: good.today_count,
				cumulativeCount: good.cumulative_count,
			}
			res.status(200).json(response)
			return
		}

		good = await prisma.good_count.update({
			where: {
				id: good.id,
			},
			data: {
				last_date: nowISO,
				today_count: { increment: 1 },
				cumulative_count: { increment: 1 },
			},
		})

		const response: GoodButtonPostResponse = {
			goodButtonStatus: GoodButtonStatus.OK,
			todayCount: good.today_count,
			cumulativeCount: good.cumulative_count,
		}
		res.status(200).json(response)
	}
}
