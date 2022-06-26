import { remark } from "remark";
import remarkGfm from "remark-gfm";
import html from "remark-html";
import { rehype } from "rehype";
import rehypeSlug from "rehype-slug";

/**
 * remarkによるmarkdownの構文変換を行う
 * @param markdown markdown記法で書かれたプレーンテキスト
 * @returns 変換結果をString化したもの
 */
const markdownToHtml = async (markdown) => {
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

export default markdownToHtml;
