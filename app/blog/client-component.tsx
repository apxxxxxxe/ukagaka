import Layout from "utils/Layout"
import ArticleComponent from "components/ArticleComponent"
import { ArticleForRender } from "utils/api"

const Home = ({ posts }: { posts: ArticleForRender[] }) => (
	<Layout title="Blog">
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
