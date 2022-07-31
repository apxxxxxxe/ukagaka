import { NextPage, InferGetStaticPropsType } from "next";
import { getPostBySlug } from "utils/api";
import markdownToHtml, { rawHtmlToDom } from "utils/markdownToHtml";
import Layout from "utils/Layout";
import getOgpData, { getFloatingURLs } from "utils/getOgpData";
import TableOfContent from "utils/toc";

type Props = InferGetStaticPropsType<typeof getStaticProps>;

export const getStaticProps = async () => {
  const post = getPostBySlug("tips", ["content", "slug"]);
  const floatingUrls = getFloatingURLs(post.content);
  const ogpDatas = await getOgpData(floatingUrls);
  const content = await markdownToHtml(post.content);
  const slug = post.slug;
  return { props: { content, slug, ogpDatas } };
};

const Page: NextPage<Props> = ({ content, slug, ogpDatas }) => {
  return (
    <Layout title="TIPS" contentDirection="row">
      <div className="content main-container">
        <h1>TIPS</h1>
        <p>開発中の備忘録をTIPS形式で掲載しています</p>
        <div className="body">{rawHtmlToDom(content, slug, ogpDatas)}</div>
      </div>
      <div className="content toc-content">
        <h2>もくじ</h2>
        <TableOfContent />
      </div>
    </Layout>
  );
};

export default Page;
