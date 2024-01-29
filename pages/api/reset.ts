import { sql } from "@vercel/postgres"
import { NextApiRequest, NextApiResponse } from "next"

export default async function handler(
	_req: NextApiRequest,
	res: NextApiResponse
) {
	// when not develop mode, return 403
	if (process.env.NODE_ENV !== "development") {
		res.status(403).json({ message: "access denied" })
		return
	}

	// check user exists
	const isTableExists =
		(
			await sql`SELECT * FROM information_schema.tables WHERE table_name = 'good_count'`
		).rows.length !== 0
	if (!isTableExists) {
		res.status(200).json({ message: "please init table" })
	}

	// drop rows where ip === ::1/24
	await sql`DELETE FROM good_count WHERE ip = '::1/128'::cidr`

	res.status(200).json({ message: "ok" })
}
