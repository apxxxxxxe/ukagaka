import { NextPage } from "next"
import Layout from "utils/Layout"
import axios from "axios"
import { GoodUser } from "pages/api/good_statistics"
import { useEffect, useState } from "react"
import md5 from "crypto-js/md5"

const Page: NextPage = () => {
	const [goodUsers, setGoodUsers] = useState<GoodUser[]>([])

	useEffect(() => {
		const fetch = async () => {
			await axios
				.get("/api/good_statistics")
				.then((res) => {
					console.log(res.data)
					setGoodUsers(res.data)
				})
				.catch((err) => {
					console.log(err)
					return []
				})
		}
		fetch()
	}, [])

	return (
		<Layout title="INDEX" contentDirection="row">
			<div className="article-container mx-auto">
				<h1 className="article-h1">Good Statistics</h1>
				{goodUsers.map((goodUser) => {
					const ipHash = md5(goodUser.ipAddress).toString()
					return (
						<div key={ipHash}>
							<h2 className="article-h2">{ipHash}</h2>
							<table className="mx-auto border">
								<tr className="bg-black text-white">
									<th className="px-4 py-2">id</th>
									<th className="px-4 py-2">todayCount</th>
									<th className="px-4 py-2">
										cumlitiveCount
									</th>
								</tr>
								{goodUser.goodCount.map((goodCount) => (
									<tr key={goodCount.id}>
										<td className="border px-4 py-2">
											{goodCount.id}
										</td>
										<td className="border px-4 py-2">
											{goodCount.todayCount}
										</td>
										<td className="border px-4 py-2">
											{goodCount.cumlitiveCount}
										</td>
									</tr>
								))}
							</table>
						</div>
					)
				})}
			</div>
		</Layout>
	)
}

export default Page
