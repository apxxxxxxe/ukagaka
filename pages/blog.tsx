import { NextPage, InferGetStaticPropsType } from "next"
import { getAllPosts, ArticleForRender } from "utils/api"
import Layout from "utils/Layout"
import ArticleComponent from "components/ArticleComponent"
import markdownToHtml from "utils/markdownToHtml"

type Props = InferGetStaticPropsType<typeof getStaticProps>

export const getStaticProps = async () => {
	const rawPosts = getAllPosts([
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
			content: post.content,
			summery: post.summery,
			html: "",
		}
		if (article.tags.includes("雑記")) {
			article.html = await markdownToHtml(article.content)
		}
		posts.push(article)
	}

	return {
		props: {
			posts,
		},
	}
}

const Home: NextPage<Props> = ({ posts }) => (
	<Layout title="Blog" contentDirection="col">
		<div className="article-container mx-auto">
			<h1 className="article-h1">Blog</h1>
			<p>記事一覧（新着順）</p>
			<ul>
				{posts?.map((post) => {
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
