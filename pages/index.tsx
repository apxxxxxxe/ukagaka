import { NextPage, InferGetStaticPropsType } from "next";
import { getPostBySlug } from "utils/api";
import { Layout } from "utils/page";
import markdownToHtml from "./api/markdownToHtml";

type Props = InferGetStaticPropsType<typeof getStaticProps>;

export const getStaticProps = async () => {
  const post = getPostBySlug("noindex-index", ["content"]);
  const content = await markdownToHtml(post.content);
  return { props: { content } };
};

const Page: NextPage<Props> = ({ content }) => (
  <Layout>
    <div dangerouslySetInnerHTML={{ __html: content }} />
  </Layout>
);

export default Page;
