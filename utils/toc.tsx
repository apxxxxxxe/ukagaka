import React, { useEffect, useState, useRef, ReactElement } from "react"

type HeadingType = { id: string; text: string; level: number }
function useHeadings() {
	const [headings, setHeadings] = useState<HeadingType[]>([])
	useEffect(() => {
		const elements = Array.from(document.querySelectorAll("h2,h3"))
			.filter((element) => element.id)
			.map((element) => ({
				id: element.id,
				text: element.textContent ?? "",
				level: Number(element.tagName.substring(1)),
			}))
		setHeadings(elements)
	}, [])
	return headings
}

function getId(children: string) {
	return children
		.split(" ")
		.map((word) => word.toLowerCase())
		.join("-")
}

type HeadingProps = {
	children: string
	as: "h1" | "h2" | "h3" | "h4" | "h5" | "h6"
	id?: string
}

function Heading({ children, id, as: Element, ...props }: HeadingProps) {
	const theId = id ?? getId(children)
	return (
		<Element id={theId} {...props}>
			{children}
		</Element>
	)
}

function useScrollSpy(ids: string[], options: IntersectionObserverInit) {
	const [activeId, setActiveId] = useState<string>()
	const observer = useRef<IntersectionObserver>()
	useEffect(() => {
		const elements = ids.map((id) => document.getElementById(id))
		observer.current?.disconnect()
		observer.current = new IntersectionObserver((entries) => {
			entries.forEach((entry) => {
				if (entry?.isIntersecting) {
					setActiveId(entry.target.id)
				}
			})
		}, options)
		elements.forEach((el) => {
			if (el) {
				observer.current?.observe(el)
			}
		})
		return () => observer.current?.disconnect()
	}, [ids, options])
	return activeId
}

function makeHeading(headings: HeadingType[], activeId: string) {
	let lastLevel = 0
	let result = <></>
	let tmp = new Array<ReactElement>(6).fill(null)
	const ulClass = "pl-5 text-sm"

	const wrapUl = (ary: ReactElement[], i: number) => {
		if (i === ary.length - 1 && ary[i] === null) {
			return <></>
		} else if (i === ary.length - 1) {
			return <ul className={ulClass}>{ary[i]}</ul>
		} else if (ary[i] === null) {
			return <>{wrapUl(ary, i + 1)}</>
		}
		return (
			<ul className={ulClass}>
				{ary[i]}
				{wrapUl(ary, i + 1)}
			</ul>
		)
	}

	let i = 0
	while (i < headings.length) {
		const heading = headings[i]
		if (heading.level >= lastLevel) {
			const level = heading.level - 1
			let c = "list-disc"
			switch (level) {
				case 2:
					c = "list-circle"
					break
			}
			tmp[level] = (
				<>
					{tmp[level]}
					<li key={heading.id} className={c}>
						<a
							className={
								activeId === heading.id ? "font-bold" : ""
							}
							href={`#${heading.id}`}
						>
							{heading.text}
						</a>
					</li>
				</>
			)
			lastLevel = heading.level
			i++
		} else {
			result = (
				<>
					{result}
					{wrapUl(tmp, 0)}
				</>
			)
			tmp = new Array<ReactElement>(6).fill(null)
			lastLevel = 0
		}
	}
	return (
		<>
			{result}
			{wrapUl(tmp, 0)}
		</>
	)
}

function TableOfContent() {
	const headings = useHeadings()
	const activeId = useScrollSpy(
		headings.map(({ id }) => id),
		{ rootMargin: "0% 0% -90% 0%" }
	)
	const result = makeHeading(headings, activeId)

	return <nav className="toc">{result}</nav>
}

export default TableOfContent
