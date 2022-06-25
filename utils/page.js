import Link from "next/link";
import Head from "next/head";

export function Layout({ children }) {
  return (
    <>
      <Head>
        <title>おわらない.lzh</title>
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
          <p>
            <Link href="/blog/">
              <a>blog</a>
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
