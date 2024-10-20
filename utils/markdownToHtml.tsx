import { remark } from "remark"
import remarkGfm from "remark-gfm"
import html from "remark-html"
import { rehype } from "rehype"
import { Element } from "domhandler/lib/node"
import rehypeSlug from "rehype-slug"
import parse, { domToReact } from "html-react-parser"
import { OgpData } from "utils/getOgpData"
import Link from "next/link"
import SyntaxHighlighter from "react-syntax-highlighter"
import { arduinoLight } from "react-syntax-highlighter/dist/cjs/styles/hljs"
import reactStringReplace from "react-string-replace"

function hasProperty<K extends string>(
	x: unknown,
	name: K
): x is { [M in K]: unknown } {
	return x instanceof Object && name in x
}

/**
 * remarkによるmarkdownの構文変換を行う
 * @param markdown markdown記法で書かれたプレーンテキスト
 * @returns 変換結果をString化したもの
 */
const markdownToHtml = async (markdown: string) => {
	const rawHTML = await remark()
		.use(html)
		.use(remarkGfm)
		.use(rehypeSlug)
		.process(markdown)

	const result = await rehype()
		.data("settings", { fragment: true })
		.use(rehypeSlug)
		.process(rawHTML)

	return result.toString()
}

export const rawHtmlToDom = (
	content: string,
	slug: string,
	ogpDatas: OgpData[]
): ReturnType<typeof parse> => {
	const options = {
		replace: (node: Element) => {
			const imageRoot = `/contents`
			if (node.name === "h1") {
				node.attribs.class = "article-h1"
			}
			if (node.name === "h2") {
				node.attribs.class = "article-h2"
			}
			if (node.name === "h3") {
				node.attribs.class = "article-h3"
			}
			if (node.name === "h4") {
				node.attribs.class = "article-h4"
			}
			if (node.name === "h5") {
				node.attribs.class = "article-h5"
			}
			if (node.name === "p" && node.children.length > 0) {
				let includeImg = false
				node.children.forEach((c) => {
					if (hasProperty(c, "name")) {
						if (c.name === "img") {
							includeImg = true
						}
					}
				})
				if (includeImg) {
					node.name = "div"
				} else {
					node.attribs.class = "article-p"
				}
			}
			if (node.name === "img") {
				if (!node.attribs.src.startsWith("http")) {
					if (slug === "") {
						slug = "index"
					}
					node.attribs.src = `${imageRoot}/${slug}/${node.attribs.src}`
				}

				let imgdivClass = "my-5 flex flex-col"

				if (node.attribs.alt.includes("center:")) {
					node.attribs.alt = node.attribs.alt.replace("center:", "")
					imgdivClass += " justify-center items-center"
				}

				let imgClass = ""
				if (node.attribs.alt.includes("size-limit:")) {
					node.attribs.alt = node.attribs.alt.replace(
						"size-limit:",
						""
					)
					imgClass += ` !max-w-lg !max-h-lg`
				}

				const caption = reactStringReplace(
					node.attribs.alt,
					"crlf",
					() => <br />
				)

				return (
					<div className={imgdivClass}>
						<Link href={node.attribs.src}>
							<img {...node.attribs} className={imgClass} />
						</Link>
						<p>{caption}</p>
					</div>
				)
			} else if (node.name === "a") {
				if (!node.attribs.href.startsWith("http")) {
					node.attribs.href = `${node.attribs.href}`
				}

				const ogpData = ogpDatas.find((data) =>
					node.attribs.href.includes(data.ogUrl)
				)
				if (ogpData !== undefined) {
					const ogTitle = ogpData.ogTitle
					const ogDescription = ogpData.ogDescription
					return (
						<Link href={node.attribs.href}>
							<div className="flex flex-row m-5 p-3 border-solid border border-gray/[0.6] rounded-lg shadow-md">
								<img
									className="w-1/4 mr-3 pr-3 border-solid border-r border-black"
									src={ogpData.ogImage.url}
								/>
								<div className="flex flex-col justify-center">
									<h1 className="font-bold">{ogTitle}</h1>
									<p className="text-darkgray">
										{ogDescription}
									</p>
								</div>
							</div>
						</Link>
					)
				}
				return (
					<Link href={node.attribs.href} className="article-a">
						{domToReact(node.children, options)}
					</Link>
				)
			} else if (node.name === "pre" && node.children.length > 0) {
				const child = node.children.find((child) => {
					if (hasProperty(child, "name")) {
						return child.name === "code"
					}
					return false
				})
				let code = ""
				if (hasProperty(child, "children")) {
					code = child.children![0].data
				}
				return (
					<div className="mb-4 mx-4 border-solid border border-gray/[0.6] shadow">
						<SyntaxHighlighter
							style={arduinoLight}
							showLineNumbers={false}
							codeTagProps={{
								className: "font-sans text-sm",
							}}
						>
							{code}
						</SyntaxHighlighter>
					</div>
				)
			} else if (node.name === "table") {
				return (
					<div className="table-box">
						<div className="table-wrapper">
							<table {...node.attribs}>
								{domToReact(node.children, options)}
							</table>
						</div>
					</div>
				)
			}
			return node
		},
	}
	return parse(content, options)
}

export const makeGitHubReleaseDescription = (
	html: string
): ReturnType<typeof parse> => {
	const options = {
		replace: (node: Element) => {
			if (node.name === "h2") {
				node.attribs.class = "text-lg font-bold"
			}
			if (node.name === "h3") {
				node.attribs.class = "font-bold"
			}
			if (node.name === "ul") {
				node.attribs.class = "list-disc ml-7 mb-3"
			}
			if (node.name === "p" && node.children.length > 0) {
				let includeImg = false
				node.children.forEach((c) => {
					if (hasProperty(c, "name")) {
						if (c.name === "img") {
							includeImg = true
						}
					}
				})
				if (includeImg) {
					node.name = "div"
				}
			}
			if (node.name === "img") {
				return (
					<div className="my-5 flex flex-col">
						<img {...node.attribs} />
					</div>
				)
			} else if (node.name === "a") {
				return (
					<Link href={node.attribs.href} className="article-a">
						{domToReact(node.children, options)}
					</Link>
				)
			} else if (node.name === "table") {
				return (
					<div className="table-box">
						<div className="table-wrapper">
							<table {...node.attribs}>
								{domToReact(node.children, options)}
							</table>
						</div>
					</div>
				)
			}
			return node
		},
	}
	return parse(html, options)
}

export default markdownToHtml
