import { NextPage } from "next"
import Link from "next/link"
import Layout from "utils/Layout"
import axios from "axios"

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

export async function getServerSideProps() {
	// Piecesのリポジトリの最終更新日を取得
	const pushedAts: PushedAt[] = await Promise.all(
		pieces.map(async (piece) => {
			const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/${piece.repoName}`);
      if (res.status !== 200) {
        return {
          repoName: piece.repoName,
          pushedAt: "error",
        }
      }

			return {
				repoName: piece.repoName,
				pushedAt: res.data.pushed_at,
			}
		})
	)

	console.log(pushedAts)

	return {
		props: {
			pushedAts: pushedAts,
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
							<h3 className="border-solid border-l-4 border-black pl-2 text-lg font-bold">
								{type}
							</h3>
							{pieces
								.filter((piece) => piece.type === type)
								.map((piece) => {
									let pushedAt = pushedAts.find(
										(p) => p.repoName === piece.repoName
									)
									if (!pushedAt) {
										pushedAt = {
											repoName: piece.repoName,
											pushedAt: "取得失敗",
										}
									}
									return (
										<div
											className="flex flex-col items-center md:flex-row md:items-normal p-4 px-3 my-6 border-solid border border-gray/[0.2] rounded-lg shadow-md"
											key={piece.repoName}
										>
											<img
												className="w-min my-auto"
												src={piece.bannerImg}
											/>
											<div className="w-full ml-5 mt-3 md:mt-0">
												<div className="flex flex-row items-center">
													<Link
														href={`https://github.com/apxxxxxxe/${piece.repoName}#readme`}
													>
														<a className="grow">
															<h4 className="font-bold hover:underline">
																{piece.title}
															</h4>
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
		<div className="container mx-auto flex flex-col bg-white m-5 p-10 rounded-xl shadow-md">
			<h1 className="font-bold text-3xl mb-5">INDEX</h1>
			<h2 className="font-bold text-2xl border-solid border-b border-dashed pb-1 mb-4">
				配布物
			</h2>
			<div className="mt-3">{getPiecesElement(pieces, pushedAts)}</div>
			<h2 className="mt-3 font-bold text-2xl border-solid border-b border-dashed pb-1 mb-4">
				このサイトについて
			</h2>
			<p className="mt-3">
				デスクトップマスコット「伺か」の配布物と開発情報を載せているサイトです。
			</p>
			<p className="my-4">
				サイト名: <strong>おわらない</strong> (https://apxxxxxxe.dev)
				<br />
				管理者: <strong>日野つみ</strong>
			</p>
			<h4 className="font-bold text-lg mb-1">連絡先</h4>
			<ul className="list-disc list-inside">
				<li>
					<a
						className="hover:underline hover:decoration-solid hover:cursor-pointer text-blue"
						href="http://clap.webclap.com/clap.php?id=apxxxxxxe"
					>
						Web拍手
					</a>
				</li>
				<li>
					<a
						className="hover:underline hover:decoration-solid hover:cursor-pointer text-blue"
						href="https://twitter.com/apxxxxxxe"
					>
						Twitter
					</a>
				</li>
				<li>
					<a
						className="hover:underline hover:decoration-solid hover:cursor-pointer text-blue"
						href="https://github.com/apxxxxxxe"
					>
						GitHub
					</a>
				</li>
				<li>
					<a
						className="hover:underline hover:decoration-solid hover:cursor-pointer text-blue"
						rel="me"
						href="https://ukadon.shillest.net/@apxxxxxxe"
					>
						Mastodon
					</a>
				</li>
			</ul>
		</div>
	</Layout>
)

export default Page
