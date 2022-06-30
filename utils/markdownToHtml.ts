import { remark } from "remark";
import remarkGfm from "remark-gfm";
import html from "remark-html";
import { rehype } from "rehype";
import rehypeSlug from "rehype-slug";
import parse from "html-react-parser";

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

export const rawHtmlToDom = (content: string, slug: string) => {
  const rep = (node) => {
    const imageRoot = "/ukagaka/contents";
    if (node.name === "img") {
      node.attribs.src = `${imageRoot}/${slug}/${node.attribs.src}`;
    }
    return node;
  };
  return parse(content, { replace: rep });
};

export default markdownToHtml;
