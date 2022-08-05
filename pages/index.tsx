import { NextPage } from "next";
import Link from "next/link";
import Layout from "utils/Layout";

type Piece = {
  type: string;
  title: string;
  introLink: string;
  bannerImg: string;
  description: JSX.Element;
  downloadButton: JSX.Element;
};

const imageRoot = `/ukagaka/contents/index/`;

const pieces: Piece[] = [
  {
    type: "ゴースト",
    title: "Crave The Grave",
    introLink: "https://github.com/apxxxxxxe/Haine#readme",
    bannerImg: `${imageRoot}banner_haine.png`,
    description: (
      <>
        <p>ソロゴースト/女性/フォークロア/希死念慮</p>
        <p>[制作中]</p>
      </>
    ),
    downloadButton: <></>,
  },
  {
    type: "バルーン",
    title: "霧の郊外にて",
    introLink: "https://github.com/apxxxxxxe/kirinokougai#readme",
    bannerImg: `${imageRoot}banner_kirinokougai.png`,
    description: <p>ゴースト「Crave The Grave」同梱バルーン</p>,
    downloadButton: (
      <Link href="https://github.com/apxxxxxxe/kirinokougai/releases/latest/download/kirinokougai.nar">
        <a>
          <figure>
            <img
              src="https://img.shields.io/github/v/release/apxxxxxxe/kirinokougai?color=%237e7958&label=kirinokougai.nar&logo=github"
              alt="ダウンロード"
            />
          </figure>
        </a>
      </Link>
    ),
  },
  {
    type: "ゴースト",
    title: "思い出の、",
    introLink: "https://github.com/apxxxxxxe/Youto#readme",
    bannerImg: `${imageRoot}banner_youto.png`,
    description: <p>ソロゴースト/男性/ゴーストマスカレード3参加作品</p>,
    downloadButton: (
      <Link href="https://github.com/apxxxxxxe/Youto/releases/latest/download/omoideno.nar">
        <a>
          <figure>
            <img
              src="https://img.shields.io/github/v/release/apxxxxxxe/Youto?color=%23d196bb&label=omoideno.nar&logo=github"
              alt="ダウンロード"
            />
          </figure>
        </a>
      </Link>
    ),
  },
  {
    type: "プラグイン",
    title: "Bouyomi",
    introLink: "https://github.com/apxxxxxxe/Bouyomi#readme",
    bannerImg: `${imageRoot}banner_noimage.png`,
    description: <p>棒読みちゃん連携プラグイン</p>,
    downloadButton: (
      <Link href="https://github.com/apxxxxxxe/Bouyomi/releases/latest/download/Bouyomi.nar">
        <a>
          <figure>
            <img
              src="https://img.shields.io/github/v/release/apxxxxxxe/Bouyomi?color=%2367ab7b&label=Bouyomi.nar&logo=github"
              alt="ダウンロード"
            />
          </figure>
        </a>
      </Link>
    ),
  },
  {
    type: "プラグイン",
    title: "直近のゴースト",
    introLink: "https://github.com/apxxxxxxe/recentghosts#readme",
    bannerImg: `${imageRoot}banner_noimage.png`,
    description: (
      <>
        <p>
          直近に起動したゴーストをリスト表示するプラグイン
          <br />(
          <Link href="/entries/recentghosts-intro">
            <a>紹介記事</a>
          </Link>
          )
        </p>
      </>
    ),
    downloadButton: (
      <Link href="https://github.com/apxxxxxxe/recentghosts/releases/latest/download/recentghosts.nar">
        <a>
          <figure>
            <img
              src="https://img.shields.io/github/v/release/apxxxxxxe/recentghosts?color=%23535178&label=recentghosts.nar&logo=github"
              alt="ダウンロード"
            />
          </figure>
        </a>
      </Link>
    ),
  },
  {
    type: "ツール",
    title: "shioriupdater",
    introLink: "https://github.com/apxxxxxxe/shioriupdater#readme",
    bannerImg: `${imageRoot}banner_noimage.png`,
    description: <p>栞(里々・YAYA)一括更新ツール</p>,
    downloadButton: (
      <Link href="https://github.com/apxxxxxxe/shioriupdater/releases/latest/download/shioriupdater_windows_386.exe">
        <a>
          <figure>
            <img
              src="https://img.shields.io/github/v/release/apxxxxxxe/shioriupdater?color=%2359a6b5&label=shioriupdater_windows_386.exe&logo=github"
              alt="ダウンロード"
            />
          </figure>
        </a>
      </Link>
    ),
  },
  {
    type: "SAORI",
    title: "sunset-sunrise-saori",
    introLink: "https://github.com/apxxxxxxe/sunset-sunrise-saori#readme",
    bannerImg: `${imageRoot}banner_noimage.png`,
    description: <p>日没・日の出の時間を計算する SAORI-basic</p>,
    downloadButton: (
      <Link href="https://github.com/apxxxxxxe/sunset-sunrise-saori/releases/latest/download/sunset.exe">
        <a>
          <figure>
            <img
              src="https://img.shields.io/github/v/release/apxxxxxxe/sunset-sunrise-saori?color=%23e3aa40&label=sunset.exe&logo=github"
              alt="ダウンロード"
            />
          </figure>
        </a>
      </Link>
    ),
  },
];

function getAllPieceTypes(pieceAry) {
  const types = [];
  pieceAry.forEach((piece) => {
    types.push(piece.type);
  });
  return Array.from(new Set(types));
}

function getPiecesElement(pieceAry) {
  const pieceTypes = getAllPieceTypes(pieceAry);
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
                  <>
                    <div className="piece-wrapper">
                      <div className="flex-column flex-column-center piece-box">
                        <Link href={piece.introLink}>
                          <a>
                            <div className="banner-image">
                              <figure>
                                <img src={piece.bannerImg} />
                              </figure>
                            </div>
                          </a>
                        </Link>
                      </div>
                      <div className="piece-box">
                        <Link href={piece.introLink}>
                          <a>
                            <h4>{piece.title}</h4>
                          </a>
                        </Link>
                        <div className="piece-description">
                          {piece.description}
                        </div>
                        {piece.downloadButton}
                      </div>
                    </div>
                  </>
                ))}
            </div>
          </>
        );
      })}
    </>
  );
}

const Page: NextPage = () => (
  <Layout title="INDEX" contentDirection="row">
    <div className="content main-container">
      <h1>INDEX</h1>
      <h2>配布物</h2>
      <div className="body">{getPiecesElement(pieces)}</div>
      <h2>連絡先</h2>
      <ul>
        <li>
          <a href="http://clap.webclap.com/clap.php?id=apxxxxxxe">Web拍手</a>
        </li>
        <li>
          <a href="https://twitter.com/apxxxxxxe">Twitter</a>
        </li>
        <li>
          <a href="https://github.com/apxxxxxxe">GitHub</a>
        </li>
      </ul>
    </div>
  </Layout>
);

export default Page;
