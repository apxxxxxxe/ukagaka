import { NextPage, GetStaticProps } from "next"
import Link from "next/link"
import Layout from "utils/Layout"
import GoodButton from "utils/goodButton"
import { GoodLimit } from "pages/api/good"
import markdownToHtml, {
  makeGitHubReleaseDescription,
} from "utils/markdownToHtml"
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

type Repository = {
  name: string
  pushed_at: string
}

export type CommitGroup = {
  repo: string
  datetime: string
  messages: string[]
}

type CommitsByDate = {
  date: string
  commits: CommitGroup[]
}

export const getStaticProps: GetStaticProps = async () => {
  // Piecesのリポジトリの最終更新日を取得
  const repoDataPath = path.join(process.cwd(), "data", "repositories.json")
  const repoContents = fs.readFileSync(repoDataPath, "utf8")
  const pushedAts: Repository[] = JSON.parse(repoContents)
  console.log(pushedAts)

  // 最近のコミットを取得
  const commitDataPath = path.join(
    process.cwd(),
    "data",
    "commits_by_date.json"
  )
  const commitContents = fs.readFileSync(commitDataPath, "utf8")
  const commits: CommitsByDate[] = JSON.parse(commitContents)
  console.log(commits)

  // 最近のリリースを取得
  const releaseDataPath = path.join(
    process.cwd(),
    "data",
    "releases_by_date.json"
  )
  const releaseContents = fs.readFileSync(releaseDataPath, "utf8")
  const releasesByDate: ReleasesByDate[] = JSON.parse(releaseContents)

  for (let i = 0; i < releasesByDate.length; i++) {
    for (let j = 0; j < releasesByDate[i].releases.length; j++) {
      const body = releasesByDate[i].releases[j].body
      if (body !== "") {
        releasesByDate[i].releases[j].body_html = await markdownToHtml(body)
      } else {
        releasesByDate[i].releases[j].body_html = null
      }
    }
  }

  return {
    props: {
      pushedAts: pushedAts,
      commits: commits,
      releases: releasesByDate,
    },
  }
}

const renderCommit = (commit: CommitGroup) => {
  return (
    <div className="ml-5" key={`commit-${commit.datetime}-${commit.repo}}`}>
      <h3 className="font-bold mb-1">
        <span
          className="mr-1"
          style={{
            color: `#${pieces.find(
              (piece) => piece.repoName === commit.repo
            )?.color
              }`,
          }}
        >
          ●
        </span>
        <Link
          href={`#${commit.repo}`}
          className="grow font-bold hover:underline"
        >
          {pieceNameByRepoName(commit.repo)}
        </Link>
      </h3>
      <ol className="list-disc ml-11 mb-3">
        {commit.messages.map((mes) => (
          <li key={`${commit.datetime}-${mes}`}>
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
  )
}

export type Release = {
  repo: string
  datetime: string
  tag_name: string
  body: string
  body_html: string | null
}

type ReleasesByDate = {
  date: string
  releases: Release[]
}

const renderRelease = (release: Release) => {
  return (
    <div
      className="ml-5"
      key={`release-${release.datetime}-${release.tag_name}`}
    >
      <h2 className="text-xl font-bold mb-1">
        <span
          className="mr-1"
          style={{
            color: `#${pieces.find(
              (piece) => piece.repoName === release.repo
            )?.color
              }`,
          }}
        >
          ●
        </span>
        <Link
          href={`https://github.com/apxxxxxxe/${release.repo}/releases/tag/${release.tag_name}`}
          className="grow font-bold hover:underline"
        >
          {`${pieceNameByRepoName(release.repo)} Release ${release.tag_name
            }`}
        </Link>
      </h2>
      <div className="ml-3 my-3">
        {release.body_html !== null
          ? makeGitHubReleaseDescription(release.body_html)
          : release.body}
      </div>
    </div>
  )
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

function getAllPieceTypes(pieceAry: Piece[]): string[] {
  const types = []
  pieceAry.forEach((piece: Piece) => {
    types.push(piece.type)
  })
  return Array.from(new Set(types))
}

function getPiecesElement(pieceAry: Piece[], pushedAts: Repository[]) {
  const pieceTypes = getAllPieceTypes(pieceAry)
  return (
    <>
      {pieceTypes.map((type) => (
        <div key={`piece-${type}`} className="flex flex-col">
          <h3 className="article-h3">{type}</h3>
          {pieces
            .filter((piece) => piece.type === type)
            .map((piece) => {
              let pushedAt = pushedAts.find(
                (p) => p.name === piece.repoName
              )
              if (pushedAt) {
                pushedAt.pushed_at = formatDate(
                  pushedAt.pushed_at
                )
              } else {
                pushedAt = {
                  name: piece.repoName,
                  pushed_at: "取得失敗",
                }
              }
              return (
                <div
                  id={piece.repoName}
                  className="flex flex-col items-center md:flex-row md:items-normal p-4 px-3 mb-8 border-solid border border-gray/[0.2] rounded-lg shadow-md"
                  key={`piece-${piece.repoName}`}
                >
                  <img
                    className="w-min my-auto"
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
                        最終更新: {pushedAt.pushed_at}
                      </p>
                    </div>
                    <div>
                      <div className="my-3 text-sm">
                        {piece.description}
                      </div>
                      <div className="flex flex-row items-center justify-end">
                        {piece.fileName === "" ? (
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
      ))}
    </>
  )
}

type UpdatesByDate = {
  date: string
  updates: (CommitGroup | Release)[]
}

const makeUpdatesByDate = (updates: (CommitsByDate | ReleasesByDate)[]) => {
  let dateMap: any = {}

  for (let i = 0; i < updates.length; i++) {
    let updateGroup: CommitsByDate | ReleasesByDate = updates[i]
    let beans: CommitGroup[] | Release[];
    if ("commits" in updateGroup) {
      beans = (updateGroup as CommitsByDate).commits
    } else {
      beans = (updateGroup as ReleasesByDate).releases
    }
    let d = updateGroup.date
    if (d in dateMap) {
      let ary = dateMap[d].updates.concat(beans)
      ary.sort((a: CommitGroup | Release, b: CommitGroup | Release) => {
        if ("tag_name" in a && !("tag_name" in b)) {
          return -1
        }
        if (a.datetime < b.datetime) {
          return 1
        } else {
          return -1
        }
      })
      dateMap[d].updates = ary
    } else {
      dateMap[d] = {
        date: d,
        updates: beans,
      }
    }
  }

  const updatesByDates: UpdatesByDate[] = []
  for (const key in dateMap) {
    updatesByDates.push(dateMap[key])
  }

  return updatesByDates
}

const renderUpdates = (updatesByDate: UpdatesByDate) => {
  const updateDoms: JSX.Element[] = []
  for (const update of updatesByDate.updates) {
    if ("messages" in update) {
      updateDoms.push(renderCommit(update))
    } else {
      updateDoms.push(renderRelease(update))
    }
  }

  return (
    <div
      className="p-5 mb-5 mx-5 border-solid border border-gray/[0.6] rounded-lg shadow-md md:w-3/4 mx-auto"
      key={`updatesByDate-${updatesByDate.date}`}
    >
      <h2 className="text-xl font-bold mb-3">
        {formatDate(updatesByDate.date)}
      </h2>
      {updateDoms.map((updateDom) => updateDom)}
    </div>
  )
}

type Props = {
  pushedAts: Repository[]
  commits: CommitsByDate[]
  releases: ReleasesByDate[]
}

const Page: NextPage = ({ pushedAts, commits, releases }: Props) => {
  let uds: (CommitsByDate | ReleasesByDate)[] = []
  uds.push(...commits)
  uds.push(...releases)
  let updateDoms = makeUpdatesByDate(uds).map(renderUpdates)

  return (
    <Layout title="INDEX" contentDirection="row">
      <div className="article-container mx-auto">
        <h1 className="article-h1">INDEX</h1>
        <div className="article-h2 flex flex-row items-center">
          <h2>最近の更新</h2>
          <Link
            href="/rss/feed.xml"
            className="article-a flex flex-row items-center ml-2"
          >
            <img
              className="h-5"
              src="rss-icon.svg"
              alt="RSS"
            />
          </Link>
        </div>
        <div className="overflow-y-auto h-96 mb-5">{updateDoms}</div>
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
