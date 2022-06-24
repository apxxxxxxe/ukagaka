import Link from "next/link";

export function Layout({ children }) {
  return (
    <div id="wrapper">
      <div id="header">
        <div className="inner">
          <h1>おわらない.lzh</h1>
          <p>伺か関連の配布物をおいています</p>
        </div>
      </div>
      <div id="menu">
        <p>
          <Link href="/ukagaka/">
            <a>index</a>
          </Link>
        </p>
        <p>
          <Link href="/ukagaka/tips/">
            <a>tips</a>
          </Link>
        </p>
        <p>
          <Link href="/ukagaka/blog/">
            <a>blog</a>
          </Link>
        </p>
      </div>
      <div id="container" className="inner">
        {children}
      </div>
      <div id="footer"></div>
    </div>
  );
}
