import { NextPage, InferGetStaticPropsType } from "next"
import { getAllPosts, getPostByTag } from "utils/api"
import Layout from "utils/Layout"
import ArticleComponent from "components/ArticleComponent"

type Props = InferGetStaticPropsType<typeof getStaticProps>

export const getStaticPaths = async () => {
	const posts = getAllPosts(["tags"]).filter(
		(post) => !post.slug.startsWith("noindex-")
	)

	let tags = []
	posts.forEach((post) => {
		tags = [...tags, ...post.tags]
	})
	tags = Array.from(new Set(tags))
	console.log(tags)

	return {
		paths: tags.map((tag) => {
			return {
				params: {
					tag: tag,
				},
			}
		}),
		fallback: false,
	}
}

export const getStaticProps = async ({ params }: any) => {
	const posts = getPostByTag(params.tag, [
		"slug",
		"title",
		"date",
		"tags",
		"summery",
	])
	// ここで変換

	// 変換結果をpropsとして渡す
	return {
		props: { posts, tag: params.tag },
	}
}

const Home: NextPage<Props> = ({ posts, tag }) => (
	<Layout title="Blog">
		<div className="article-container mx-auto">
			<h1 className="article-h1">Blog</h1>
			<p>{`"${tag}"タグの付いた記事`}</p>
			<ul>
				{posts?.map((post) => {
					if (post.tags.includes("noindex")) {
						return null
					}
					return <ArticleComponent post={post} key={post.slug} />
				})}
			</ul>
		</div>
	</Layout>
)

export default Home
