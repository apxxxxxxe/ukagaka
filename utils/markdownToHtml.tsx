import { remark } from "remark";
import remarkGfm from "remark-gfm";
import html from "remark-html";
import { rehype } from "rehype";
import { Element } from "domhandler/lib/node";
import rehypeSlug from "rehype-slug";
import parse from "html-react-parser";
import { OgpData } from "utils/getOgpData";
import Link from "next/link";
import SyntaxHighlighter from "react-syntax-highlighter";
import { defaultStyle } from "react-syntax-highlighter/dist/cjs/styles/hljs";

function hasProperty<K extends string>(
  x: unknown,
  name: K
): x is { [M in K]: unknown } {
  return x instanceof Object && name in x;
}

/**
 * remarkによるmarkdownの構文変換を行う
 * @param markdown markdown記法で書かれたプレーンテキスト
 * @returns 変換結果をString化したもの
 */
const markdownToHtml = async (markdown: string) => {
  const rawHTML = await remark()
    .use(html)
    .use(remarkGfm)
    .use(rehypeSlug)
    .process(markdown);

  const result = await rehype()
    .data("settings", { fragment: true })
    .use(rehypeSlug)
    .process(rawHTML);

  return result.toString();
};

export const rawHtmlToDom = (
  content: string,
  slug: string,
  ogpDatas: OgpData[]
) => {
  const rep = (node: Element) => {
    const imageRoot = `/ukagaka/contents`;
    if (node.name === "p") {
      node.name = "section";
    } else if (node.name === "img") {
      if (!node.attribs.src.startsWith("http")) {
        node.attribs.src = `${imageRoot}/${slug}/${node.attribs.src}`;
      }
      if (node.attribs.alt.startsWith("center:")) {
        node.attribs.alt = node.attribs.alt.replace("center:", "");
        return (
          <figure className="image-center">
            <img {...node.attribs} />
          </figure>
        );
      }
      return (
        <figure>
          <img {...node.attribs} />
        </figure>
      );
    } else if (node.name === "a") {
      const ogpData = ogpDatas.find((data) =>
        node.attribs.href.includes(data.ogUrl)
      );
      if (ogpData !== undefined) {
        const ogTitle = ogpData.ogTitle;
        const ogDescription = ogpData.ogDescription;
        return (
          <Link href={node.attribs.href}>
            <a className="ogp-link">
              <div className="ogp-box">
                <img src={ogpData.ogImage.url} />
                <div className="ogp-caption">
                  <h1>{ogTitle}</h1>
                  <p>{ogDescription}</p>
                </div>
              </div>
            </a>
          </Link>
        );
      }
    } else if (node.name === "pre" && node.children.length > 0) {
      const child = node.children.find((child) => {
        if (hasProperty(child, "name")) {
          return child.name === "code";
        }
        return false;
      });
      let code = "";
      if (hasProperty(child, "children")) {
        code = child.children[0].data;
      }
      return <SyntaxHighlighter style={defaultStyle}>{code}</SyntaxHighlighter>;
    }
    return node;
  };
  return parse(content, { replace: rep });
};

export default markdownToHtml;
