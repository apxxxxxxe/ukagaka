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
			<div className="flex flex-row justify-center">
				<div className="container flex flex-col bg-white m-5 p-10 rounded-xl shadow-md">
					<h1 className="font-bold text-3xl mb-5">TIPS</h1>
					<p className="mb-4">
						開発中の備忘録をTIPS形式で掲載しています
					</p>
					<div className="body">
						{rawHtmlToDom(content, slug, ogpDatas)}
					</div>
				</div>
				<div className="sticky top-5 h-fit w-1/6 flex flex-col bg-white mt-5 p-6 rounded-xl shadow-md">
					<h2 className="font-bold text-xl border-solid border-b border-dashed pb-1 mb-4">
						もくじ
					</h2>
					<TableOfContent />
				</div>
			</div>
		</Layout>
	)
}

export default Page
