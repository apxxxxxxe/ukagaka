import { NextPage } from "next"
import Link from "next/link"
import Image from "next/image"
import Layout from "utils/Layout"
import GoodButton from "utils/goodButton"
import { GoodLimit } from "pages/api/good"
import { useCallback, useState, useRef, useEffect } from "react"
import { Checkbox } from "@mui/material"
import markdownToHtml, {
	makeGitHubReleaseDescription,
} from "utils/markdownToHtml"
import prisma from "lib/prisma"

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

type CommitsByDate = {
	date: string
	commits: Commit[]
}

type Commit = {
	repoName: string
	date: string
	message: string[]
}

const isCommitsByDate = (item: any): item is CommitsByDate => {
	return item.commits !== undefined
}

type ReleaseByDate = {
	date: string
	releases: Release[]
}

type Release = {
	repoName: string
	date: string
	tagName: string
	body: string
	bodyHtml: string | null
}

const isReleaseByDate = (item: any): item is ReleaseByDate => {
	return item.releases !== undefined
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
				<Link
					className="article-a"
					href="https://nanachi.sakura.ne.jp/narnaloader/ghost.php?ghost=DSLGS"
				>
					DSLGS
				</Link>
				」用追加シェル
			</p>
		),
	},
	{
		type: "バルーン",
		title: "霧の郊外にて",
		repoName: "kirinokougai",
		color: "7e7958",
		fileName: "kirinokougai.nar",
		bannerImg: `${imageRoot}banner_kirinokougai.png`,
		description: <p>ゴースト「Crave The Grave」同梱バルーン</p>,
	},
	{
		type: "プラグイン",
		title: "GhostSpeaker",
		repoName: "GhostSpeaker",
		color: "8a4e4e",
		fileName: "GhostSpeaker.nar",
		bannerImg: `${imageRoot}banner_noimage.png`,
		description: (
			<p>
				棒読みちゃん・VOICEVOX・COEIROINK等でゴーストのトークを読み上げられるようになるプラグイン
			</p>
		),
	},
	{
		type: "プラグイン",
		title: "Ukaing",
		repoName: "Ukaing",
		color: "5865f2",
		fileName: "Ukaing.nar",
		bannerImg: `${imageRoot}banner_noimage.png`,
		description: <p>Discord上に起動中ゴーストの情報を表示するプラグイン</p>,
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
				<Link href="/entries/recentghosts-intro" className="article-a">
					プラグインを作った
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

const pieceNameByRepoName = (repoName: string): string => {
	const piece = pieces.find((piece) => piece.repoName === repoName)
	if (piece) {
		return piece.title
	} else {
		return repoName
	}
}

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
	const rawPushedAts = await prisma.repos.findMany({
		select: {
			repo_name: true,
			pushed_at: true,
		},
	})

	const pushedAts: PushedAt[] = rawPushedAts.map((raw) => ({
		repoName: raw.repo_name,
		pushedAt: raw.pushed_at.toISOString(),
	}))

	// 最近のコミットを取得
	const rawCommits = await prisma.commits.findMany({
		select: {
			date: true,
			repo_name: true,
			messages: true,
		},
	})

	const commitsMap: any = {}
	for (let i = 0; i < rawCommits.length; i++) {
		const commit = rawCommits[i]
		const d = new Date(commit.date).toLocaleDateString()
		if (commitsMap[d] === undefined) {
			const commitsByDate = rawCommits.filter(
				(c) => d === new Date(c.date).toLocaleDateString()
			)
			commitsMap[d] = {
				date: d,
				commits: commitsByDate.map((c) => ({
					repoName: c.repo_name,
					date: c.date.toISOString(),
					message: c.messages,
				})),
			}
		}
	}

	const commits: CommitsByDate[] = []
	for (const key in commitsMap) {
		commits.push(commitsMap[key])
	}

	// 最近のリリースを取得
	const rawReleases: Release[] = await prisma.releases
		.findMany({
			select: {
				date: true,
				repo_name: true,
				tag_name: true,
				body: true,
			},
		})
		.then((rawReleases) => {
			return rawReleases.map((raw) => {
				return {
					date: raw.date.toISOString(),
					repoName: raw.repo_name,
					tagName: raw.tag_name,
					body: raw.body,
					bodyHtml: null,
				}
			})
		})

	const releasesMap: any = {}
	for (let i = 0; i < rawReleases.length; i++) {
		const release = rawReleases[i]
		const d = new Date(release.date).toLocaleDateString()
		if (releasesMap[d] === undefined) {
			const releasesByDate = rawReleases.filter(
				(r) => d === new Date(r.date).toLocaleDateString()
			)
			releasesMap[d] = {
				date: d,
				releases: releasesByDate,
			}
		}
	}

	const releases: ReleaseByDate[] = []
	for (const key in releasesMap) {
		releases.push(releasesMap[key])
	}

	// body(markdown)を変換したものをbodyHtmlに書き込む
	for (let i = 0; i < releases.length; i++) {
		for (let j = 0; j < releases[i].releases.length; j++) {
			const release = releases[i].releases[j]
			if (release.body !== "") {
				releases[i].releases[j].bodyHtml = await markdownToHtml(
					release.body
				)
			} else {
				releases[i].releases[j].bodyHtml = null
			}
		}
	}

	let updates: (CommitsByDate | ReleaseByDate)[] = [...commits, ...releases]

	// sort by date
	// 両方dateを持つので区別の必要はない
	updates = updates.sort((a, b) => {
		return new Date(b.date).getTime() - new Date(a.date).getTime()
	})

	return {
		props: {
			pushedAts: pushedAts,
			updates: updates,
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
											id={piece.repoName}
											className="flex flex-col items-center md:flex-row md:items-normal p-4 px-3 mb-8 border-solid border border-gray/[0.2] rounded-lg shadow-md"
											key={`piece-${piece.repoName}`}
										>
											<Image
												className="w-min my-auto"
												width={234}
												height={60}
												src={piece.bannerImg}
												alt={`${piece.title}のバナー`}
											/>
											<div className="w-full mx-5 mt-3 md:mt-0">
												<div className="flex flex-row items-center">
													<Link
														href={`https://github.com/apxxxxxxe/${piece.repoName}#readme`}
														className="grow font-bold hover:underline"
													>
														{piece.title}
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
																<figure>
																	<img
																		className="rounded-md h-6"
																		src={`https://img.shields.io/github/v/release/apxxxxxxe/${piece.repoName}?color=%23${piece.color}&label=${piece.fileName}&logo=github&style=flat-square`}
																		alt="ダウンロード"
																	/>
																</figure>
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

const renderCommitsByDate = (commitByDate: CommitsByDate) => (
	<div
		className="p-5 mb-5 mx-5 border-solid border border-gray/[0.6] rounded-lg shadow-md md:w-3/4 mx-auto"
		key={`commitByDate-${commitByDate.date}`}
	>
		<h2 className="text-xl font-bold mb-3">
			{formatDate(commitByDate.date)}
		</h2>
		{commitByDate.commits.map((commit: Commit) => (
			<div className="ml-5" key={`${commit.date}-${commit.repoName}}`}>
				<h3 className="font-bold mb-1">
					<span
						className="mr-1"
						style={{
							color: `#${
								pieces.find(
									(piece) =>
										piece.repoName === commit.repoName
								)?.color
							}`,
						}}
					>
						●
					</span>
					<Link
						href={`#${commit.repoName}`}
						className="grow font-bold hover:underline"
					>
						{pieceNameByRepoName(commit.repoName)}
					</Link>
				</h3>
				<ol className="list-disc ml-11 mb-3">
					{commit.message.map((mes) => (
						<li key={`${commit.date}-${mes}`}>
							{mes.split("\n").map((line, idx) => {
								if (line === "") {
									return ""
								}
								return (
									<>
										{line}
										{idx < mes.split("\n").length - 1 ? (
											<br />
										) : (
											""
										)}
									</>
								)
							})}
						</li>
					))}
				</ol>
			</div>
		))}
		<GoodButton id={`commitByDate-${commitByDate.date}`} align="end" />
	</div>
)

const renderReleasesByDate = (releasesByDate: ReleaseByDate) => {
	return (
		<div
			className="p-5 mb-5 mx-5 border-solid border border-gray/[0.6] rounded-lg shadow-md md:w-3/4 mx-auto"
			key={`releaseByDate-${releasesByDate.date}`}
		>
			<h2 className="text-xl font-bold mb-3">
				{formatDate(releasesByDate.date)}
			</h2>
			{releasesByDate.releases.map((release: Release) => (
				<div
					className="ml-5"
					key={`${release.date}-${release.tagName}`}
				>
					<h2 className="text-xl font-bold mb-1">
						<span
							className="mr-1"
							style={{
								color: `#${
									pieces.find(
										(piece) =>
											piece.repoName === release.repoName
									)?.color
								}`,
							}}
						>
							●
						</span>
						<Link
							href={`https://github.com/apxxxxxxe/${release.repoName}/releases/tag/${release.tagName}`}
							className="grow font-bold hover:underline"
						>
							{`${pieceNameByRepoName(
								release.repoName
							)} Release ${release.tagName}`}
						</Link>
					</h2>
					<p className="ml-3 my-3">
						{release.bodyHtml !== null
							? makeGitHubReleaseDescription(release.bodyHtml)
							: release.body}
					</p>
				</div>
			))}
			<GoodButton
				id={`commitByDate-${releasesByDate.date}`}
				align="end"
			/>
		</div>
	)
}

const Page: NextPage = ({
	pushedAts,
	updates,
}: {
	pushedAts: PushedAt[]
	updates: (CommitsByDate | ReleaseByDate)[]
}) => {
	const [showCommits, setShowCommits] = useState(true)
	const [showReleases, setShowReleases] = useState(true)
	const [updateDoms, setUpdateDoms] = useState<JSX.Element[]>([])
	const numPerUpdate = 10
	const [page, setPage] = useState(1)
	const [showMore, setShowMore] = useState(true)
	const updateObserverRef = useRef<HTMLDivElement>(null)

	const scrollObserver = useCallback(
		(node: HTMLDivElement) => {
			new IntersectionObserver((entries) => {
				if (entries[0].isIntersecting) {
					setPage((p) => p + 1)
				}
			}).observe(node)
		},
		[showMore]
	)

	useEffect(() => {
		if (updateObserverRef.current) {
			scrollObserver(updateObserverRef.current)
		}
	}, [updateObserverRef, scrollObserver])

	useEffect(() => {
		const fetchMoreUpdates = async () => {
			const doms: JSX.Element[] = []
			for (let i = updateDoms.length; i < page * numPerUpdate; i++) {
				if (i >= updates.length) {
					setShowMore(false)
					break
				}
				const update = updates[i]
				if (isCommitsByDate(update) && showCommits) {
					doms.push(renderCommitsByDate(update as CommitsByDate))
				} else if (isReleaseByDate(update) && showReleases) {
					doms.push(renderReleasesByDate(update as ReleaseByDate))
				} else {
					continue
				}
			}
			setUpdateDoms([...updateDoms, ...doms])
			setShowMore(updates.length > page * numPerUpdate)
		}
		fetchMoreUpdates()
	}, [page])

	useEffect(() => {
		setUpdateDoms([])
		setShowMore(updates.length > page * numPerUpdate)
		setPage(1)
	}, [showCommits, showReleases])

	return (
		<Layout title="INDEX" contentDirection="row">
			<div className="article-container mx-auto">
				<h1 className="article-h1">INDEX</h1>
				<h2 className="article-h2">最近の更新</h2>
				<div className="flex flex-row items-center justify-center mb-3">
					<Checkbox
						checked={showCommits}
						onChange={() => setShowCommits(!showCommits)}
					/>{" "}
					ネットワーク更新情報
					<Checkbox
						checked={showReleases}
						onChange={() => setShowReleases(!showReleases)}
					/>{" "}
					アーカイブ更新情報
				</div>
				<div className="overflow-y-auto h-96 mb-5">
					{updateDoms}
					<div ref={updateObserverRef}>
						{showMore && (
							<div className="loader-wrapper">
								<div className="loader"></div>
							</div>
						)}
					</div>
				</div>
				<h2 className="article-h2">配布物</h2>
				<div className="mt-3">
					{getPiecesElement(pieces, pushedAts)}
				</div>
				<h2 className="article-h2">このサイトについて</h2>
				<p className="mt-3">
					デスクトップマスコット「伺か」の配布物と開発情報を載せているサイトです。
				</p>
				<p className="my-4">
					サイト名: <strong>おわらない</strong>{" "}
					(https://apxxxxxxe.dev)
					<br />
					管理者: <strong>日野つみ</strong>
				</p>
				<h4 className="article-h4">連絡先</h4>
				<ul className="list-disc list-inside">
					<li>
						<Link
							className="article-a"
							href="https://github.com/apxxxxxxe"
						>
							GitHub
						</Link>
					</li>
					<li>
						<Link
							className="article-a"
							rel="me"
							href="https://ukadon.shillest.net/@apxxxxxxe"
						>
							Mastodon
						</Link>
					</li>
					<li>
						<Link
							className="article-a"
							href="http://clap.webclap.com/clap.php?id=apxxxxxxe"
						>
							Web拍手
						</Link>
					</li>
				</ul>
				<div className="mt-20 flex flex-col items-center">
					<GoodButton id="index" align="center" />
					<div className="mt-2 text-sm text-darkgray">
						<p>
							いいねボタンはそれぞれ1日{GoodLimit}回まで押せます。
							<br />
							押しても何も起きませんが、作者の励みになります。
						</p>
					</div>
				</div>
			</div>
		</Layout>
	)
}

export default Page
