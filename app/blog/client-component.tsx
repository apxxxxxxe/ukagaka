import Layout from "utils/Layout"
import Link from "next/link"
import ArticleComponent from "components/ArticleComponent"
import { ArticleForRender } from "utils/api"

const Home = ({ posts }: { posts: ArticleForRender[] }) => (
	<Layout title="Blog">
		<div className="article-container mx-auto">
			<h1 className="article-h1">Blog</h1>
			<div className="article-h2 flex flex-row items-center">
				<h2>記事一覧（新着順）</h2>
				<Link
					href="/rss/blog_rss.xml"
					className="article-a flex flex-row items-center ml-2"
				>
					<img className="h-5" src="/rss-icon.svg" alt="RSS" />
				</Link>
			</div>
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
