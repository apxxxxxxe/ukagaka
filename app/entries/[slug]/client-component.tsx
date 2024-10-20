import Link from "next/link"
import { Article } from "utils/api"
import Layout, { formatDate } from "utils/Layout"
import { rawHtmlToDom } from "utils/markdownToHtml"
import { OgpData } from "utils/getOgpData"
import TableOfContent from "utils/toc"

const HomePage = ({
	post,
	ogpDatas,
}: {
	post: Article
	ogpDatas: OgpData[]
}) => (
	<Layout title={post.title}>
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

			<section>{rawHtmlToDom(post.content, post.slug, ogpDatas)}</section>
		</div>
		<TableOfContent html={post.content} />
	</Layout>
)

export default HomePage
