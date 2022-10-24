import Link from "next/link"
import Head from "next/head"
import { useRouter } from "next/router"

export function formatDate(date: string) {
	const year = date.substring(0, 4)
	const month = date.substring(4, 6)
	const day = date.substring(6, 8)
	return `${year}/${month}/${day}`
}

const menuItem = (name: string, currentSlug: string): JSX.Element => {
	const slug = name === "index" ? "" : `${name}`
	const c = currentSlug === slug ? "menuitem-active" : ""

	return (
		<p>
			<Link href={`/${slug}`} as={`/${slug}`}>
				<a className={c}>{name}</a>
			</Link>
		</p>
	)
}

export default function Layout({
	children,
	title = "",
	contentDirection = "row",
}): JSX.Element {
	const router = useRouter()
	const siteTitle = "おわらない"

	let pageTitle: string
	if (title !== "") {
		pageTitle = `${title} | ${siteTitle}`
	} else {
		pageTitle = siteTitle
	}

	let contentClass = "flex-row flex-row-center"
	if (contentDirection !== "row") {
		contentClass = "flex-column flex-column-center"
	}

	return (
		<>
			<Head>
				<title>{pageTitle}</title>
				<link
					rel="shortcut icon"
					href="favicon.ico"
					type="image/vnd.microsoft.icon"
				/>
			</Head>
			<div id="wrapper">
				<div id="header">
					<div className="blog-title">
						<h1>おわらない</h1>
						<p>伺か関連の配布物を置くところ</p>
					</div>
				</div>
				<div id="menu">
					{menuItem("index", router.pathname)}
					{menuItem("tips", router.pathname)}
					{menuItem("blog", router.pathname)}
				</div>
				<div id="container" className={contentClass}>
					{children}
				</div>
				<div id="footer"></div>
			</div>
		</>
	)
}
