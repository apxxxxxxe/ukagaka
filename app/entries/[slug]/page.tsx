import { getAllPosts, getPostBySlug } from "utils/api"
import markdownToHtml from "utils/markdownToHtml"
import getOgpData, { getFloatingURLs } from "utils/getOgpData"
import HomePage from "app/entries/[slug]/client-component"

export const generateStaticParams = async () => {
	const posts = getAllPosts(["slug"]).filter(
		(post) => !post.slug.startsWith("noindex-")
	)

	return posts.map((post) => ({ slug: post.slug }))
}

const getProps = async ({ slug }: any) => {
	const post = getPostBySlug(slug, [
		"slug",
		"title",
		"date",
		"tags",
		"content",
	])

	const floatingUrls = getFloatingURLs(post.content)
	const ogpDatas = await getOgpData(floatingUrls)
	const content = await markdownToHtml(post.content)

	return {
		post: {
			...post,
			content,
		},
		ogpDatas,
	}
}

export default async function Page({
	params: slug,
}: {
	params: { slug: string }
}) {
	const props = await getProps(slug)
	return <HomePage {...props} />
}
