import { remark } from "remark";
import remarkGfm from "remark-gfm";
import html from "remark-html";
import { rehype } from "rehype";
import { Element } from "domhandler/lib/node";
import rehypeSlug from "rehype-slug";
import parse from "html-react-parser";
import { OgpData } from "utils/getOgpData";
import Link from "next/link";

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
    } else if (node.name === "img" && !node.attribs.src.startsWith("http")) {
      node.attribs.src = `${imageRoot}/${slug}/${node.attribs.src}`;
    } else if (node.name === "a") {
      const ogpData = ogpDatas.find((data) =>
        node.attribs.href.includes(data.ogUrl)
      );
      if (ogpData !== undefined) {
        return (
          <Link href={node.attribs.href}>
            <div className="ogp-data">
              <img src={ogpData.ogImage.url} />
              <h1>{ogpData.ogTitle}</h1>
              <p>{ogpData.ogDescription}</p>
            </div>
          </Link>
        );
      }
    }
    return node;
  };
  return parse(content, { replace: rep });
};

export default markdownToHtml;
