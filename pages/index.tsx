import { NextPage } from "next"
import Link from "next/link"
import Layout from "utils/Layout"
import WebClapBox from "utils/webclap"

import fs from "fs"
import path from "path"

type Piece = {
	type: string
	title: string
	repoName: string
	color: string
	fileName: string
	bannerImg: string
	pushedAt?: string
	description: JSX.Element
}

type PushedAt = {
	repoName: string
	pushedAt: string
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
				<a
					className="article-a"
					href="https://nanachi.sakura.ne.jp/narnaloader/ghost.php?ghost=DSLGS"
				>
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
					<a className="article-a">プラグインを作った</a>
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

const formatDate = (dateString: string): string => {
	const date = new Date(dateString)
	return (
		date.getFullYear() +
		"/" +
		("0" + (date.getMonth() + 1)).slice(-2) +
		"/" +
		("0" + date.getDate()).slice(-2)
	)
}

export async function getServerSideProps() {
	// Piecesのリポジトリの最終更新日を取得
	const filePath = path.join(process.cwd(), "data", "repos.json")
	const fileContents = fs.readFileSync(filePath, "utf8")

	const data = JSON.parse(fileContents) as PushedAt[]

	console.log(data)

	return {
		props: {
			pushedAts: data as PushedAt[],
		},
	}
}

function getAllPieceTypes(pieceAry: Piece[]): string[] {
	const types = []
	pieceAry.forEach((piece: Piece) => {
		types.push(piece.type)
	})
	return Array.from(new Set(types))
}

function getPiecesElement(pieceAry: Piece[], pushedAts: PushedAt[]) {
	const pieceTypes = getAllPieceTypes(pieceAry)
	return (
		<>
			{pieceTypes.map((type) => {
				return (
					<>
						<div className="flex flex-col">
							<h3 className="article-h3">{type}</h3>
							{pieces
								.filter((piece) => piece.type === type)
								.map((piece) => {
									let pushedAt = pushedAts.find(
										(p) => p.repoName === piece.repoName
									)
									if (pushedAt) {
										pushedAt.pushedAt = formatDate(
											pushedAt.pushedAt
										)
									} else {
										pushedAt = {
											repoName: piece.repoName,
											pushedAt: "取得失敗",
										}
									}
									return (
										<div
											className="flex flex-col items-center md:flex-row md:items-normal p-4 px-3 mb-8 border-solid border border-gray/[0.2] rounded-lg shadow-md"
											key={piece.repoName}
										>
											<img
												className="w-min my-auto"
												src={piece.bannerImg}
											/>
											<div className="w-full mx-5 mt-3 md:mt-0">
												<div className="flex flex-row items-center">
													<Link
														href={`https://github.com/apxxxxxxe/${piece.repoName}#readme`}
													>
														<a className="grow font-bold hover:underline">
															{piece.title}
														</a>
													</Link>
													<p className="ml-2 grow-0 text-sm text-darkgray">
														最終更新:{" "}
														{pushedAt.pushedAt}
													</p>
												</div>
												<div>
													<div className="my-3 text-sm">
														{piece.description}
													</div>
													<div className="flex flex-row items-center justify-end">
														{piece.fileName ===
														"" ? (
															<p>[制作中]</p>
														) : (
															<Link
																href={`https://github.com/apxxxxxxe/${piece.repoName}/releases/latest/download/${piece.fileName}`}
															>
																<a>
																	<figure>
																		<img
																			className="rounded-md h-6"
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
									)
								})}
						</div>
					</>
				)
			})}
		</>
	)
}

const Page: NextPage = ({ pushedAts }: { pushedAts: PushedAt[] }) => (
	<Layout title="INDEX" contentDirection="row">
		<div className="article-container mx-auto">
			<h1 className="article-h1">INDEX</h1>
			<h2 className="article-h2">配布物</h2>
			<div className="mt-3">{getPiecesElement(pieces, pushedAts)}</div>
			<h2 className="article-h2">このサイトについて</h2>
			<p className="mt-3">
				デスクトップマスコット「伺か」の配布物と開発情報を載せているサイトです。
			</p>
			<p className="my-4">
				サイト名: <strong>おわらない</strong> (https://apxxxxxxe.dev)
				<br />
				管理者: <strong>日野つみ</strong>
			</p>
			<h4 className="article-h4 mb-1">連絡先</h4>
			<ul className="list-disc list-inside">
				<li>
					<a
						className="article-a"
						rel="me"
						href="https://ukadon.shillest.net/@apxxxxxxe"
					>
						Mastodon
					</a>
				</li>
				<li>
					<a
						className="article-a"
						href="https://github.com/apxxxxxxe"
					>
						GitHub
					</a>
				</li>
			</ul>
			<WebClapBox />
		</div>
	</Layout>
)

export default Page
