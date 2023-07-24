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
			const imageRoot = `contents`
			if (node.name === "h1") {
				node.attribs.class = "font-bold text-3xl mb-5"
			}
			if (node.name === "h2") {
				node.attribs.class =
					"font-bold text-2xl border-solid border-b border-dashed pb-1 mb-4"
			}
			if (node.name === "h3") {
				node.attribs.class =
					"border-solid border-l-4 border-black pl-2 text-lg font-bold mb-4"
			}
			if (node.name === "h4") {
				node.attribs.class = "font-bold text-lg mb-4"
			}
			if (node.name === "h5") {
				node.attribs.class = "font-bold mb-4"
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
					node.attribs.class = "mb-4"
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

				if (node.attribs.alt.startsWith("center:")) {
					node.attribs.alt = node.attribs.alt.replace("center:", "")
					imgdivClass += " justify-center items-center"
				}

				const caption = reactStringReplace(
					node.attribs.alt,
					"crlf",
					() => <br />
				)

				return (
					<div className={imgdivClass}>
						<img {...node.attribs} />
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
							<a>
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
							</a>
						</Link>
					)
				}
			} else if (node.name === "pre" && node.children.length > 0) {
				const child = node.children.find((child) => {
					if (hasProperty(child, "name")) {
						return child.name === "code"
					}
					return false
				})
				let code = ""
				if (hasProperty(child, "children")) {
					code = child.children[0].data
				}
				return (
					<div className="mb-4 mx-4 border-solid border border-gray/[0.6] shadow">
						<SyntaxHighlighter
							style={arduinoLight}
							showLineNumbers={false}
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

export default markdownToHtml
