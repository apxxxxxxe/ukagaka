import { NextPage, InferGetStaticPropsType } from "next"
import React from "react"
import Link from "next/link"
import fetch from "node-fetch"
import Layout from "utils/Layout"
import { join } from "path"

type Props = {
	repos: Repo[]
}

type Repo = {
	name: string
	lastUpdated: string
}

type RepoData = {
	name: string
	pushed_at: string
}

function formatDate(date: string) {
	const d = new Date(date)
	return d.toLocaleDateString()
}

export async function getStaticProps() {
	const res = await fetch(
		"https://api.github.com/users/apxxxxxxe/repos?per_page=100&page=1"
	)
	const json = (await res.json()) as RepoData[]
	const result = new Array<Repo>()

	json.forEach((repo) => {
		result.push({
			name: repo.name,
			lastUpdated: repo.pushed_at,
		})
	})

	result.sort((a, b) => {
		return (
			new Date(b.lastUpdated).getTime() -
			new Date(a.lastUpdated).getTime()
		)
	})

	return {
		props: {
			repos: result,
		},
	}
}

const Page: NextPage<Props> = ({ repos }) => {
	console.log(repos)
	return (
		<Layout title="TIPS" contentDirection="row">
			<div className="content main-container">
				<h1>LIST</h1>
				<section>apxxxxxxeのGitHubリポジトリの最終push順リスト</section>
				<div className="table-box">
					<div className="table-wrapper">
						<table>
							<thead>
								<tr>
									<th>Name</th>
									<th>Last Updated</th>
								</tr>
							</thead>
							<tbody>
								{repos.map((repo) => (
									<tr key={repo.name}>
										<td>
											<Link href={`/repo/${repo.name}`}>
												{repo.name}
											</Link>
										</td>
										<td>{formatDate(repo.lastUpdated)}</td>
									</tr>
								))}
							</tbody>
						</table>
					</div>
				</div>
			</div>
		</Layout>
	)
}

export default Page
