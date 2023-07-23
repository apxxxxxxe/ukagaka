import { NextPage } from "next"
import Link from "next/link"
import Layout from "utils/Layout"

type Piece = {
	type: string
	title: string
	repoName: string
	color: string
	fileName: string
	bannerImg: string
	description: JSX.Element
}

const imageRoot = `/contents/index/`

const pieces: Piece[] = [
	{
		type: "ゴースト",
		title: "Crave The Grave",
		repoName: "Haine",
		color: "ab1609",
		fileName: "",
		bannerImg: `${imageRoot}banner_haine.png`,
		description: <p>ソロゴースト/女性/フォークロア</p>,
	},
	{
		type: "ゴースト",
		title: "思い出の、",
		repoName: "Youto",
		color: "d196bb",
		fileName: "omoideno.nar",
		bannerImg: `${imageRoot}banner_youto.png`,
		description: <p>ソロゴースト/男性/ゴーストマスカレード3参加作品</p>,
	},
	{
		type: "追加シェル",
		title: "thumbelina",
		repoName: "thumbelina-shell",
		color: "6E2393",
		fileName: "thumbelina.nar",
		bannerImg: `${imageRoot}banner_thumbelina.png`,
		description: (
			<p>
				ゴースト「
				<a href="https://nanachi.sakura.ne.jp/narnaloader/ghost.php?ghost=DSLGS">
					DSLGS
				</a>
				」用追加シェル
			</p>
		),
	},
	{
		type: "バルーン",
		title: "霧の郊外にて",
		repoName: "kirinokougai",
		color: "7e7958&",
		fileName: "kirinokougai.nar",
		bannerImg: `${imageRoot}banner_kirinokougai.png`,
		description: <p>ゴースト「Crave The Grave」同梱バルーン</p>,
	},
	{
		type: "プラグイン",
		title: "GhostWardrobe",
		repoName: "GhostWardrobe",
		color: "9cb08b",
		fileName: "GhostWardrobe.nar",
		bannerImg: `${imageRoot}banner_noimage.png`,
		description: <p>シェルの着せ替え保存&読込プラグイン</p>,
	},
	{
		type: "プラグイン",
		title: "Bouyomi",
		repoName: "Bouyomi",
		color: "67ab7b",
		fileName: "Bouyomi.nar",
		bannerImg: `${imageRoot}banner_noimage.png`,
		description: <p>棒読みちゃん連携プラグイン</p>,
	},
	{
		type: "プラグイン",
		title: "直近のゴースト",
		repoName: "recentghosts",
		color: "535178",
		fileName: "recentghosts.nar",
		bannerImg: `${imageRoot}banner_noimage.png`,
		description: (
			<p>
				直近に起動したゴーストをリスト表示するプラグイン
				<br />
				(紹介記事:
				<Link href="/entries/recentghosts-intro">
					<a>プラグインを作った</a>
				</Link>
				)
			</p>
		),
	},
	{
		type: "ツール",
		title: "shioriupdater",
		repoName: "shioriupdater",
		color: "59a6b5",
		fileName: "shioriupdater_windows_386.exe",
		bannerImg: `${imageRoot}banner_noimage.png`,
		description: <p>栞(里々・YAYA)一括更新ツール</p>,
	},
	{
		type: "SAORI",
		title: "sunset-sunrise-saori",
		repoName: "sunset-sunrise-saori",
		color: "e3aa40",
		fileName: "sunset.exe",
		bannerImg: `${imageRoot}banner_noimage.png`,
		description: <p>日没・日の出の時間を計算する SAORI-basic</p>,
	},
]

function getAllPieceTypes(pieceAry: Piece[]): string[] {
	const types = []
	pieceAry.forEach((piece: Piece) => {
		types.push(piece.type)
	})
	return Array.from(new Set(types))
}

function getPiecesElement(pieceAry: Piece[]) {
	const pieceTypes = getAllPieceTypes(pieceAry)
	return (
		<>
			{pieceTypes.map((type) => {
				return (
					<>
						<div className="piece-type">
							<h3>{type}</h3>
							{pieces
								.filter((piece) => piece.type === type)
								.map((piece) => (
									<div
										className="piece-wrapper"
										key={piece.repoName}
									>
										<div className="banner-image flex-column flex-column-center">
											<figure className="shadow-figure">
												<img src={piece.bannerImg} />
											</figure>
										</div>
										<div className="piece-box">
											<div className="piece-title">
												<Link
													href={`https://github.com/apxxxxxxe/${piece.repoName}#readme`}
												>
													<a>
														<h4>{piece.title}</h4>
													</a>
												</Link>
												<figure>
													<img
														className="rounded5"
														src={`https://img.shields.io/badge/dynamic/json?query=pushed_at&url=https%3A%2F%2Fapxxxxxxe.dev%2Fapi%2F${piece.repoName}&color=%23${piece.color}&label=最終更新&style=flat-square`}
														alt="最終更新"
													/>
												</figure>
											</div>
											<div className="piece-description">
												{piece.description}
												<div className="piece-download-button">
													<p>Download:</p>
													{piece.fileName === "" ? (
														<p>[制作中]</p>
													) : (
														<Link
															href={`https://github.com/apxxxxxxe/${piece.repoName}/releases/latest/download/${piece.fileName}`}
														>
															<a>
																<figure>
																	<img
																		className="rounded5"
																		src={`https://img.shields.io/github/v/release/apxxxxxxe/${piece.repoName}?color=%23${piece.color}&label=${piece.fileName}&logo=github&style=flat-square`}
																		alt="ダウンロード"
																	/>
																</figure>
															</a>
														</Link>
													)}
												</div>
											</div>
										</div>
									</div>
								))}
						</div>
					</>
				)
			})}
		</>
	)
}

const Page: NextPage = () => (
	<Layout title="INDEX" contentDirection="row">
		<div className="content main-container">
			<h1>INDEX</h1>
			<h2>配布物</h2>
			<div className="body">{getPiecesElement(pieces)}</div>
			<h2>このサイトについて</h2>
			<p>
				デスクトップマスコット「伺か」の配布物と開発情報を載せているサイトです。
				<br />
				<br />
				サイト名: <strong>おわらない</strong>
			</p>
			<p>
				管理者: <strong>日野つみ</strong>
			</p>
			<h4>連絡先</h4>
			<ul>
				<li>
					<a href="http://clap.webclap.com/clap.php?id=apxxxxxxe">
						Web拍手
					</a>
				</li>
				<li>
					<a href="https://twitter.com/apxxxxxxe">Twitter</a>
				</li>
				<li>
					<a href="https://github.com/apxxxxxxe">GitHub</a>
				</li>
				<li>
					<a rel="me" href="https://ukadon.shillest.net/@apxxxxxxe">
						Mastodon
					</a>
				</li>
			</ul>
		</div>
	</Layout>
)

export default Page
