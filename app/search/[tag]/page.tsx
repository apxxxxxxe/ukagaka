import { getAllPosts, getPostByTag, ArticleForRender, Article } from "utils/api"
import markdownToHtml from "utils/markdownToHtml"
import HomePage from "app/search/[tag]/client-component"
import { join } from "path"
import fs from "fs"

export const generateStaticParams = async () => {
	const posts = getAllPosts(["tags"]).filter(
		(post) => !post.slug.startsWith("noindex-")
	)

	let tags: string[] = []
	posts.forEach((post) => {
		tags = [...tags, ...post.tags]
	})
	tags = Array.from(new Set(tags))
	console.log(tags)

	// url encode
	return tags.map((tag) => ({ tag: tag }))
}

const getProps = async ({ tag }: { tag: string }) => {
	const decodedTag = decodeURIComponent(tag)

	const rawPosts: Article[] = getPostByTag(decodedTag, [
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
		const assetsDirectory = join(process.cwd(), "public")
		let thumbnail = `/contents/${article.slug}/thumbnail.png`
		if (!fs.existsSync(`${assetsDirectory}${thumbnail}`)) {
			thumbnail = `/contents/common/thumbnail.png`
		}
		article.thumbnail = thumbnail
		posts.push(article)
	}

	return { posts, tag: decodedTag }
}

export default async function Page({
	params: tag,
}: {
	params: { tag: string }
}) {
	const props = await getProps(tag)
	return <HomePage {...props} />
}
