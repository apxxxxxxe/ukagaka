import Link from "next/link"
import { ArticleForRender } from "utils/api"
import { formatDate } from "utils/Layout"
import { rawHtmlToDom } from "utils/markdownToHtml"

const ArticleComponent = ({ post }: { post: ArticleForRender }) => {
	let thumbnail = `/contents/${post.slug}/thumbnail.png`
	let elems: JSX.Element
	if (post.html !== "") {
		elems = (
			<>
				<div className="flex flex-row items-center mb-3">
					<p className="grow font-bold text-xl mr-3">{post.title}</p>
					<p className="grow-0 text-right text-sm">
						{formatDate(post.date)}
					</p>
				</div>
				<div className="shadow-inner p-5 border-solid border border-gray/[0.2] rounded-lg">
					{rawHtmlToDom(post.html, post.slug, [])}
				</div>
				<div className="flex flex-row mt-3">
					{post.tags?.map((tag) => (
						<Link
							key={tag}
							href={`/search/${tag}`}
							className="article-a text-sm mr-1"
						>
							<p className="blog-tag flex-compontent">{`#${tag}`}</p>
						</Link>
					))}
				</div>
			</>
		)
	} else {
		elems = (
			<div className="flex flex-row">
				<Link href={"/entries/" + post.slug}>
					<img
						src={post.thumbnail}
						className="rounded-lg size-24 max-w-none mr-6"
					/>
				</Link>
				<div className="grow">
					<div className="flex flex-row items-center border-solid border-b pb-3 mb-3">
						<Link href={"/entries/" + post.slug}>
							<p className="grow font-bold text-xl hover:underline text-blue mr-3">
								{post.title}
							</p>
						</Link>
						<p className="grow-0 text-right text-sm">
							{formatDate(post.date)}
						</p>
					</div>
					<p className="text-darkgray">{post.summery}</p>
					<div className="flex flex-row mt-1">
						{post.tags?.map((tag) => (
							<Link
								key={tag}
								href={`/search/${tag}`}
								className="article-a text-sm mr-1"
							>
								<p className="blog-tag flex-compontent">{`#${tag}`}</p>
							</Link>
						))}
					</div>
				</div>
			</div>
		)
	}
	return (
		<div className="rounded-lg my-5 py-4 px-6 border-solid border border-gray/[0.2] rounded-lg shadow-md">
			{elems}
		</div>
	)
}

export default ArticleComponent
