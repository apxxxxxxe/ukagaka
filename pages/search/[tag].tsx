import { NextPage, InferGetStaticPropsType } from "next"
import { getAllPosts, getPostByTag, ArticleForRender, Article } from "utils/api"
import Layout from "utils/Layout"
import ArticleComponent from "components/ArticleComponent"
import markdownToHtml from "utils/markdownToHtml"

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
	const rawPosts: Article[] = getPostByTag(params.tag, [
		"slug",
		"title",
		"date",
		"tags",
		"summery",
		"content",
	])

	const posts: ArticleForRender[] = []
	for (let post of rawPosts) {
		let article: ArticleForRender = {
			title: post.title,
			slug: post.slug,
			date: post.date,
			tags: post.tags,
			summery: post.summery,
			content: post.content,
			html: "",
		}
		if (article.tags.includes("雑記")) {
			article.html = await markdownToHtml(article.content)
		}
		posts.push(article)
	}

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
