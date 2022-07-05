import { NextPage, InferGetStaticPropsType } from "next";
import { getPostBySlug } from "utils/api";
import Layout from "utils/Layout";
import markdownToHtml from "utils/markdownToHtml";

type Props = InferGetStaticPropsType<typeof getStaticProps>;

export const getStaticProps = async () => {
  const post = getPostBySlug("index", ["content"]);
  const content = await markdownToHtml(post.content);
  return { props: { content } };
};

const Page: NextPage<Props> = ({ content }) => (
  <Layout title="INDEX">
    <div dangerouslySetInnerHTML={{ __html: content }} />
  </Layout>
);

export default Page;
