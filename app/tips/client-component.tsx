"use client"

import { rawHtmlToDom } from "utils/markdownToHtml"
import Layout from "utils/Layout"
import TableOfContent from "utils/toc"

const HomePage = ({ content, slug, ogpDatas }) => {
	return (
		<Layout title="TIPS">
			<div className="article-container">
				<h1 className="article-h1">TIPS</h1>
				<p className="mb-4">開発中の備忘録をTIPS形式で掲載しています</p>
				<div>{rawHtmlToDom(content, slug, ogpDatas)}</div>
			</div>
			<div className="toc-container">
				<h2 className="toc-h2">もくじ</h2>
				<TableOfContent />
			</div>
		</Layout>
	)
}

export default HomePage
