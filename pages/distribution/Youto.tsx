import { NextPage, InferGetStaticPropsType } from "next"
import { getPostBySlug } from "utils/api"
import markdownToHtml, { rawHtmlToDom } from "utils/markdownToHtml"
import Layout from "utils/Layout"
import getOgpData, { getFloatingURLs } from "utils/getOgpData"
import TableOfContent from "utils/toc"

type Props = InferGetStaticPropsType<typeof getStaticProps>

export const getStaticProps = async () => {
	const post = getPostBySlug("tips", ["content", "slug"])
	const floatingUrls = getFloatingURLs(post.content)
	const ogpDatas = await getOgpData(floatingUrls)
	const content = await markdownToHtml(post.content)
	const slug = post.slug
	return { props: { content, slug, ogpDatas } }
}

const Page: NextPage<Props> = ({ content, slug, ogpDatas }) => {
	return (
		<Layout title="TIPS">
			<div className="flex-row flex-row-center">
				<div className="content main-container">
					<h1>思い出の、</h1>
					<p>vimvimvim</p>
				</div>
			</div>
		</Layout>
	)
}

export default Page
