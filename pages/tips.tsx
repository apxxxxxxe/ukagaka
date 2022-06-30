import { NextPage, InferGetStaticPropsType } from "next";
import { useEffect } from "react";
import tocbot from "tocbot";
import { getPostBySlug } from "utils/api";
import markdownToHtml, { rawHtmlToDom } from "utils/markdownToHtml";
import Layout from "utils/Layout";

type Props = InferGetStaticPropsType<typeof getStaticProps>;

export const getStaticProps = async () => {
  const post = getPostBySlug("tips", ["content", "slug"]);
  const content = await markdownToHtml(post.content);
  const slug = post.slug;
  return { props: { content, slug } };
};

const Page: NextPage<Props> = ({ content, slug }) => {
  useEffect(() => {
    tocbot.init({
      tocSelector: ".toc",
      contentSelector: ".body",
      headingSelector: "h2",
    });
    return () => tocbot.destroy();
  }, []);

  return (
    <Layout title="TIPS">
      <h1>TIPS</h1>
      <p>
        制作中に気づいたことなどをかいています
        <br />
        YAYA関係が多め
      </p>
      <h2>もくじ</h2>
      <nav className="toc" />
      <div className="body">{rawHtmlToDom(content, slug)}</div>
    </Layout>
  );
};

export default Page;
