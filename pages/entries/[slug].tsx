import { NextPage, InferGetStaticPropsType } from "next";
import Link from "next/link";
import { getAllPosts, getPostBySlug } from "utils/api";
import Layout, { formatDate } from "utils/Layout";
import markdownToHtml, { rawHtmlToDom } from "utils/markdownToHtml";

type Props = InferGetStaticPropsType<typeof getStaticProps>;

export const getStaticPaths = async () => {
  const posts = getAllPosts(["slug"]).filter(
    (post) => !post.slug.startsWith("noindex-")
  );

  return {
    paths: posts.map((post) => {
      return {
        params: {
          slug: post.slug,
        },
      };
    }),
    fallback: false,
  };
};

export const getStaticProps = async ({ params }: any) => {
  const post = getPostBySlug(params.slug, [
    "slug",
    "title",
    "date",
    "tags",
    "content",
  ]);
  // ここで変換
  const content = await markdownToHtml(post.content);

  // 変換結果をpropsとして渡す
  return {
    props: {
      post: {
        ...post,
        content,
      },
    },
  };
};

const Post: NextPage<Props> = ({ post }) => (
  <Layout>
    <p>{formatDate(post.date)}</p>
    <h1>{post.title}</h1>
    <div className="flex-end">
      <div className="flex-row">
        {post.tags?.map((tag) => (
          <Link href={`/search/${tag}`}>
            <p className="article-tag flex-compontent">
              <a>{`#${tag}`}</a>
            </p>
          </Link>
        ))}
      </div>
    </div>
    <section>{rawHtmlToDom(post.content, post.slug)}</section>
  </Layout>
);

export default Post;
