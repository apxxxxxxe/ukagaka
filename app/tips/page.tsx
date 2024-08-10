import { getPostBySlug } from "utils/api"
import getOgpData, { getFloatingURLs } from "utils/getOgpData"
import markdownToHtml from "utils/markdownToHtml"
import HomePage from "app/tips/client-component"

const getProps = async () => {
	const post = getPostBySlug("tips", ["content", "slug"])
	const floatingUrls = getFloatingURLs(post.content)
	const ogpDatas = await getOgpData(floatingUrls)
	const content = await markdownToHtml(post.content)
	const slug = post.slug
	return { content, slug, ogpDatas }
}

export default async function Page() {
	const props = await getProps()
	return <HomePage {...props} />
}
