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
			<TableOfContent html={content} />
		</Layout>
	)
}

export default HomePage
