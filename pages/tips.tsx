import { NextPage, InferGetStaticPropsType } from "next";
import { getPostBySlug } from "utils/api";
import Layout from "utils/Layout";
import markdownToHtml from "utils/markdownToHtml";
import { useEffect } from "react";
import tocbot from "tocbot";
import parse from "html-react-parser";

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

  const changeImageURL = (node) => {
    const imageRoot = "/ukagaka/contents";
    if (node.name === "img") {
      node.attribs.src = `${imageRoot}/${slug}/${node.attribs.src}`;
    }
    return node;
  };

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
      <div className="body">{parse(content, { replace: changeImageURL })}</div>
    </Layout>
  );
};

export default Page;
