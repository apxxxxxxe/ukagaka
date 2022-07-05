import Link from "next/link";
import Head from "next/head";

export function formatDate(date: string) {
  const year = date.substring(0, 4);
  const month = date.substring(4, 6);
  const day = date.substring(6, 8);
  return `${year}/${month}/${day}`;
}

export default function Layout({ children, title = "" }): JSX.Element {
  const siteTitle = "おわらない.lzh";

  let pageTitle: string;
  if (title !== "") {
    pageTitle = `${title} | ${siteTitle}`;
  } else {
    pageTitle = siteTitle;
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
      <div id="wrapper">
        <div id="header">
          <div className="inner">
            <h1>おわらない.lzh</h1>
            <p>伺か関連の配布物をおいています</p>
          </div>
        </div>
        <div id="menu">
          <p>
            <Link href="/">
              <a>index</a>
            </Link>
          </p>
          <p>
            <Link href="/tips/">
              <a>tips</a>
            </Link>
          </p>
        </div>
        <div id="container" className="inner">
          {children}
        </div>
        <div id="footer"></div>
      </div>
    </>
  );
}
