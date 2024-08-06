import { NextPage, InferGetStaticPropsType } from "next"
import { getAllPosts } from "utils/api"
import Layout from "utils/Layout"
import ArticleComponent from "components/ArticleComponent"

type Props = InferGetStaticPropsType<typeof getStaticProps>

export const getStaticProps = async () => {
	const allPosts = getAllPosts(["slug", "title", "date", "tags", "summery"])

	return {
		props: { allPosts },
	}
}

const Home: NextPage<Props> = ({ allPosts }) => (
	<Layout title="Blog" contentDirection="col">
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
						return <ArticleComponent post={post} key={post.slug} />
					}
				})}
			</ul>
		</div>
	</Layout>
)

export default Home
