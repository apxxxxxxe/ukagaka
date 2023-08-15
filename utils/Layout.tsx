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
		<p className="text-center text-white text-md font px-5 my-2 py-0.5">
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
			<div className="bg-dot bg-lightgray font-sans">
				<div className="bg-fog">
					<div className="bg-rain">
						<div className="backdrop-blur-xs h-40 flex flex-row items-center bg-darkblue/[0.6]">
							<div className="text-white mx-auto md:ml-40 md:mr-0">
								<h1 className="text-5xl font-tegakibold">
									おわらない
								</h1>
								<p className="text-sm ml-2 mt-1.5 font-sans">
									伺か関連の配布物を置くところ
								</p>
							</div>
						</div>
					</div>
				</div>
				<div className="flex flex-row justify-center divide-x divide-darkgray bg-black">
					{menuItem("index", router.pathname)}
					{menuItem("tips", router.pathname)}
					{menuItem("blog", router.pathname)}
				</div>
				{children}
				<div className="bg-black h-32"></div>
			</div>
		</>
	)
}
