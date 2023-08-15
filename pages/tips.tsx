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
		<Layout title="TIPS" contentDirection="row">
			<div className="flex flex-col md:flex-row justify-center">
				<div className="article-container">
					<h1 className="article-h1">TIPS</h1>
					<p className="mb-4">
						開発中の備忘録をTIPS形式で掲載しています
					</p>
					<div>{rawHtmlToDom(content, slug, ogpDatas)}</div>
				</div>
				<div className="toc-container">
					<h2 className="toc-h2">もくじ</h2>
					<TableOfContent />
				</div>
			</div>
		</Layout>
	)
}

export default Page
