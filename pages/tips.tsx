import { NextPage, InferGetStaticPropsType } from "next";
import { getPostBySlug } from "utils/api";
import { Layout } from "utils/page";
import markdownToHtml from "utils/markdownToHtml";
import { useEffect } from "react";
import tocbot from "tocbot";

type Props = InferGetStaticPropsType<typeof getStaticProps>;

export const getStaticProps = async () => {
  const post = getPostBySlug("noindex-tips", ["content"]);
  const content = await markdownToHtml(post.content);
  return { props: { content } };
};

const Page: NextPage<Props> = ({ content }) => {
  useEffect(() => {
    tocbot.init({
      tocSelector: ".toc",
      contentSelector: ".body",
      headingSelector: "h2",
    });

    return () => tocbot.destroy();
  }, []);

  return (
    <Layout>
      <h1>TIPS</h1>
      <p>
        制作中に気づいたことなどをかいています
        <br />
        YAYA関係が多め
      </p>
      <h2>もくじ</h2>
      <nav className="toc" />
      <div className="body" dangerouslySetInnerHTML={{ __html: content }} />
    </Layout>
  );
};

export default Page;
