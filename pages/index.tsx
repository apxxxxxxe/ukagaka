import { NextPage, InferGetStaticPropsType } from "next";
import { getPostBySlug } from "utils/api";
import Layout from "utils/Layout";
import markdownToHtml, { rawHtmlToDom } from "utils/markdownToHtml";
import getOgpData, { getFloatingURLs } from "utils/getOgpData";

type Props = InferGetStaticPropsType<typeof getStaticProps>;

export const getStaticProps = async () => {
  const post = getPostBySlug("index", ["content"]);
  const floatingUrls = getFloatingURLs(post.content);
  const ogpDatas = await getOgpData(floatingUrls);
  const content = await markdownToHtml(post.content);
  return { props: { content, slug: post.slug, ogpDatas } };
};

const Page: NextPage<Props> = ({ content, slug, ogpDatas }) => (
  <Layout title="INDEX">
    <div className="flex-column flex-column-center">
      <div className="content main-container">
        <div className="body">{rawHtmlToDom(content, slug, ogpDatas)}</div>
      </div>
    </div>
  </Layout>
);

export default Page;
