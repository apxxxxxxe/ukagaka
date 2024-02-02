import { NextPage, InferGetStaticPropsType } from "next"
import Link from "next/link"
import { getAllPosts, getPostBySlug } from "utils/api"
import Layout, { formatDate } from "utils/Layout"
import markdownToHtml, { rawHtmlToDom } from "utils/markdownToHtml"
import getOgpData, { getFloatingURLs } from "utils/getOgpData"
import TableOfContent from "utils/toc"
import GoodButton from "utils/goodButton"

type Props = InferGetStaticPropsType<typeof getStaticProps>

export const getStaticPaths = async () => {
	const posts = getAllPosts(["slug"]).filter(
		(post) => !post.slug.startsWith("noindex-")
	)

	return {
		paths: posts.map((post) => {
			return {
				params: {
					slug: post.slug,
				},
			}
		}),
		fallback: false,
	}
}

export const getStaticProps = async ({ params }: any) => {
	const post = getPostBySlug(params.slug, [
		"slug",
		"title",
		"date",
		"tags",
		"content",
	])

	const floatingUrls = getFloatingURLs(post.content)
	const ogpDatas = await getOgpData(floatingUrls)
	const content = await markdownToHtml(post.content)

	// 変換結果をpropsとして渡す
	return {
		props: {
			post: {
				...post,
				content,
			},
			ogpDatas,
		},
	}
}

const Post: NextPage<Props> = ({ post, ogpDatas }) => (
	<Layout title={post.title}>
		<div className="flex flex-col md:flex-row justify-center">
			<div className="article-container">
				<h1 className="font-bold text-2xl">{post.title}</h1>
				<p className="mt-3 text-darkgray text-sm text-right">
					{formatDate(post.date)}
				</p>
				<div className="flex flex-row justify-end">
					{post.tags?.map((tag) => (
						<Link
							key={tag}
							href={`/search/${tag}`}
							className="hover:underline hover:decoration-solid hover:cursor-pointer text-blue mr-1"
						>
							{`#${tag}`}
						</Link>
					))}
				</div>

				<section>
					{rawHtmlToDom(post.content, post.slug, ogpDatas)}
				</section>
			</div>
			<div className="toc-container">
				<h2 className="toc-h2">もくじ</h2>
				<TableOfContent />
			</div>
		</div>
	</Layout>
)

export default Post
