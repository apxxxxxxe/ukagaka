import { getAllPosts, ArticleForRender } from "utils/api"
import markdownToHtml from "utils/markdownToHtml"
import HomePage from "app/blog/client-component"
import { join } from "path"
import fs from "fs"

const getProps = async () => {
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
		const assetsDirectory = join(process.cwd(), "public")
		let thumbnail = `/contents/${article.slug}/thumbnail.png`
		if (!fs.existsSync(`${assetsDirectory}${thumbnail}`)) {
			thumbnail = `/contents/common/thumbnail.png`
		}
		article.thumbnail = thumbnail
		posts.push(article)
	}

	return {
		posts,
	}
}

export default async function Page() {
	const props = await getProps()
	return <HomePage {...props} />
}
