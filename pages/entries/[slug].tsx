import { NextPage, InferGetStaticPropsType } from "next"
import Link from "next/link"
import { getAllPosts, getPostBySlug } from "utils/api"
import Layout, { formatDate } from "utils/Layout"
import markdownToHtml, { rawHtmlToDom } from "utils/markdownToHtml"
import getOgpData, { getFloatingURLs } from "utils/getOgpData"
import TableOfContent from "utils/toc"
import WebClapBox from "utils/webclap"

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
	<Layout title={post.title} contentDirection="row">
		<div className="content main-container">
			<p>{formatDate(post.date)}</p>
			<h1>{post.title}</h1>
			<div className="flex-end">
				<div className="flex-row">
					{post.tags?.map((tag) => (
						<Link key={tag} href={`/search/${tag}`}>
							<p className="article-tag flex-compontent">
								<a>{`#${tag}`}</a>
							</p>
						</Link>
					))}
				</div>
			</div>
			<section>{rawHtmlToDom(post.content, post.slug, ogpDatas)}</section>
			<WebClapBox />
		</div>
		<div className="content toc-content">
			<h2>もくじ</h2>
			<TableOfContent />
		</div>
	</Layout>
)

export default Post
