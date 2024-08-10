"use client"

import { ArticleForRender } from "utils/api"
import Layout from "utils/Layout"
import ArticleComponent from "components/ArticleComponent"

const HomePage = ({
	posts,
	tag,
}: {
	posts: ArticleForRender[]
	tag: string
}) => (
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

export default HomePage
