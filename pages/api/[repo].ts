import type { NextApiRequest, NextApiResponse } from "next"
import axios from "axios"

type Data = {
	pushed_at: string
}

const formatDate = (dateString: string): string => {
	const date = new Date(dateString)
	return (
		date.getFullYear() +
		"/" +
		("0" + (date.getMonth() + 1)).slice(-2) +
		"/" +
		("0" + date.getDate()).slice(-2)
	)
}

export default async function handler(
	req: NextApiRequest,
	res: NextApiResponse<Data>
) {
	const { repo } = req.query
	const endPoint = `https://api.github.com/repos/apxxxxxxe/${repo}`

	axios
		.get(endPoint)
		.then((response) =>
			res
				.status(response.status)
				.json({ pushed_at: formatDate(response.data.pushed_at) })
		)
		.catch((err) => err)
}
