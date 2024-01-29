import { sql } from "@vercel/postgres"
import { NextApiRequest, NextApiResponse } from "next"

export enum GoodButtonStatus {
	OK = 200,
	UPTOLIMIT = 429,
}

export type GoodButtonGetResponse = {
	todayCount: number
	cumlitiveCount: number
}

export type GoodButtonPostResponse = {
	goodButtonStatus: GoodButtonStatus
	todayCount: number
	cumlitiveCount: number
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
	await sql`SET timezone TO 'UTC'`

	const now = new Date().toUTCString()

	let { rows } =
		await sql`SELECT * FROM good_count WHERE ip = ${ip} AND id = ${id}`

	// if user doesn't exist, create a new user
	if (rows.length === 0) {
		await sql`INSERT INTO
      good_count (ip, id, last_date, today_count, cumlitive_count)
      VALUES (${ip}, ${id}, ${now}, 0, 0)`
		let q =
			await sql`SELECT * FROM good_count WHERE ip = ${ip} AND id = ${id}`
		rows = q.rows
	}

	// if last_date is not today, reset today_count
	const dataA = rows[0].last_date.toUTCString()
	if (dataA.slice(0, 16) !== now.slice(0, 16)) {
		await sql`UPDATE good_count SET
    last_date = ${now},
    today_count = 0
    WHERE ip = ${ip} AND id = ${id}`
		let q =
			await sql`SELECT * FROM good_count WHERE ip = ${ip} AND id = ${id}`
		rows = q.rows
	}

	if (req.method === "GET") {
		const response: GoodButtonGetResponse = {
			todayCount: rows[0].today_count,
			cumlitiveCount: rows[0].cumlitive_count,
		}
		res.status(200).json(response)
	} else if (req.method === "POST") {
		// if today_count is limit, return error
		if (rows[0].today_count >= GoodLimit) {
			const response: GoodButtonPostResponse = {
				goodButtonStatus: GoodButtonStatus.UPTOLIMIT,
				todayCount: rows[0].today_count,
				cumlitiveCount: rows[0].cumlitive_count,
			}
			res.status(200).json(response)
			return
		}

		// count up
		await sql`UPDATE good_count SET
      last_date = ${now},
      today_count = today_count + 1,
      cumlitive_count = cumlitive_count + 1
      WHERE ip = ${ip} AND id = ${id}`

		let q =
			await sql`SELECT * FROM good_count WHERE ip = ${ip} AND id = ${id}`
		rows = q.rows

		const response: GoodButtonPostResponse = {
			goodButtonStatus: GoodButtonStatus.OK,
			todayCount: rows[0].today_count,
			cumlitiveCount: rows[0].cumlitive_count,
		}
		res.status(200).json(response)
	}
}
