import { NextPage, InferGetStaticPropsType } from "next";
import { getAllPosts, getPostBySlug } from "utils/api";
import { Layout } from "utils/page";
import markdownToHtml from "utils/markdownToHtml";

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
    <h2>{post.title}</h2>
    <p>{post.date}</p>
    <ul>
      {post.tags?.map((tag) => (
        <li key={tag}>{tag}</li>
      ))}
    </ul>
    <section>
      {/* ここでdangerouslySetInnerHTMLを使ってHTMLタグを出力する */}
      <div dangerouslySetInnerHTML={{ __html: post.content }} />
    </section>
  </Layout>
);

export default Post;
