import type { Metadata } from "next"
import "styles/tailwind.css"

const siteTitle = "おわらない"

export const metadata: Metadata = {
	title: siteTitle,
}

export default function RootLayout({
	// Layouts must accept a children prop.
	// This will be populated with nested layouts or pages
	children,
}: {
	children: React.ReactNode
}) {
	return (
		<html lang="ja">
			<body>{children}</body>
		</html>
	)
}
