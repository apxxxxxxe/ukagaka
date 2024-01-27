import { NextPage, InferGetStaticPropsType } from "next"
import Link from "next/link"
import { getAllPosts } from "utils/api"
import Layout, { formatDate } from "utils/Layout"

type Props = InferGetStaticPropsType<typeof getStaticProps>

export const getStaticProps = async () => {
	const allPosts = getAllPosts(["slug", "title", "date", "tags", "summery"])

	return {
		props: { allPosts },
	}
}

const Home: NextPage<Props> = ({ allPosts }) => (
	<Layout title="Blog" contentDirection="column">
		<div className="article-container mx-auto">
			<h1 className="article-h1">Blog</h1>
			<p>記事一覧（新着順）</p>
			<ul>
				{allPosts?.map((post) => {
					if (
						!post.tags.includes("noindex") &&
						!post.tags.includes("draft") &&
						!post.tags.includes("intro")
					) {
						return (
							<div
								className="rounded-lg my-5 py-5 px-7 border-solid border border-gray/[0.2] rounded-lg shadow-md"
								key={post.slug}
							>
								<div className="flex flex-row items-center border-solid border-b pb-3 mb-3">
									<Link href={"/entries/" + post.slug}>
										<p className="grow font-bold text-xl hover:underline text-blue mr-3">
											{post.title}
										</p>
									</Link>
									<p className="grow-0 text-right text-sm">
										{formatDate(post.date)}
									</p>
								</div>
								<p className="text-darkgray">{post.summery}</p>
								<div className="flex flex-row mt-1">
									{post.tags?.map((tag) => (
										<Link
											key={tag}
											href={`/search/${tag}`}
											className="article-a text-sm mr-1"
										>
											<p className="blog-tag flex-compontent">{`#${tag}`}</p>
										</Link>
									))}
								</div>
							</div>
						)
					}
				})}
			</ul>
		</div>
	</Layout>
)

export default Home
