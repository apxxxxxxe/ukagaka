import { sql } from "@vercel/postgres"

export default async function handler(req, res) {
	// when not develop mode, return 404
	if (process.env.NODE_ENV !== "development") {
		res.status(404)
		return
	}

	// check user exists
	const isTableExists =
		await sql`SELECT * FROM information_schema.tables WHERE table_name = 'good_count'`
	if (isTableExists.rows.length !== 0) {
		// delete table
		await sql`DROP TABLE good_count`
	}
	// create a new Data
	await sql`CREATE TABLE good_count (ip cidr, id TEXT, last_date timestamptz, today_count INT, cumlitive_count INT)`

	res.status(200).json({ message: "ok" })
}
