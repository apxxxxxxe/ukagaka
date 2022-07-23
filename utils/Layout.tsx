import Link from "next/link";
import Head from "next/head";
import { useRouter } from "next/router";

export function formatDate(date: string) {
  const year = date.substring(0, 4);
  const month = date.substring(4, 6);
  const day = date.substring(6, 8);
  return `${year}/${month}/${day}`;
}

const menuItem = (name: string, currentSlug: string): JSX.Element => {
  const slug = name === "index" ? "" : `${name}`;
  const c = currentSlug === slug ? "menuitem-active" : "";

  return (
    <p>
      <Link href={`/${slug}`} as={`/${slug}`}>
        <a className={c}>{name}</a>
      </Link>
    </p>
  );
};

export default function Layout({ children, title = "" }): JSX.Element {
  const router = useRouter();
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
          <div className="center">
            <h1>おわらない.lzh</h1>
            <p>伺か関連の配布物をおいています</p>
          </div>
        </div>
        <div id="menu">
          {menuItem("index", router.pathname)}
          {menuItem("tips", router.pathname)}
          {menuItem("blog", router.pathname)}
        </div>
        <div id="container">{children}</div>
        <div id="footer"></div>
      </div>
    </>
  );
}
