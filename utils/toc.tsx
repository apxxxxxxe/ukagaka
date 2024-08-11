import Link from "next/link"
import { JSDOM } from "jsdom"

type TableOfContent = {
	level: string
	title: string
	href: string
}

function TableOfContent({
	html,
	title = "もくじ",
}: {
	html: string
	title?: string
}) {
	const dom = new JSDOM(html).window.document
	const elements = dom.querySelectorAll<HTMLElement>("h2, h3")
	const headers: TableOfContent[] = []
	elements.forEach((element) => {
		const level = element.tagName
		const title = element.textContent || "error"
		const href = "#" + element.id
		const record = { level: level, title: title, href: href }
		headers.push(record)
	})
	if (headers.length === 0) {
		return <></>
	}
	return (
		<div className="toc-container">
			<h2 className="toc-h2">{title}</h2>
			<ol className="toc-ol">
				{headers.map((header) => {
					if (header.level === "H2") {
						return (
							<li
								key={header.title}
								className={`hover:underline font-bold toc-li toc-item-H2`}
							>
								<Link href={header.href} as={header.href}>
									{header.title}
								</Link>
							</li>
						)
					} else {
						return (
							<li
								key={header.title}
								className={`hover:underline toc-li toc-item-H3`}
							>
								<Link href={header.href} as={header.href}>
									{header.title}
								</Link>
							</li>
						)
					}
				})}
			</ol>
		</div>
	)
}

export default TableOfContent
