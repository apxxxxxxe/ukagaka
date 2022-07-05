import { NextPage, InferGetStaticPropsType } from "next";
import Link from "next/link";
import { getAllPosts, getPostByTag } from "utils/api";
import Layout, { formatDate } from "utils/Layout";

type Props = InferGetStaticPropsType<typeof getStaticProps>;

export const getStaticPaths = async () => {
  const posts = getAllPosts(["tags"]).filter(
    (post) => !post.slug.startsWith("noindex-")
  );

  let tags = [];
  posts.forEach((post) => {
    tags = [...tags, ...post.tags];
  });
  tags = Array.from(new Set(tags));
  console.log(tags);

  return {
    paths: tags.map((tag) => {
      return {
        params: {
          tag: tag,
        },
      };
    }),
    fallback: false,
  };
};

export const getStaticProps = async ({ params }: any) => {
  const posts = getPostByTag(params.tag, [
    "slug",
    "title",
    "date",
    "tags",
    "content",
  ]);
  // ここで変換

  // 変換結果をpropsとして渡す
  return {
    props: { posts, tag: params.tag },
  };
};

const Home: NextPage<Props> = ({ posts, tag }) => (
  <Layout title="Blog">
    <h1>Blog</h1>
    <p>{`"${tag}"タグの付いた記事`}</p>
    <ul>
      {posts?.map((post) => {
        if (!post.tags.includes("noindex")) {
          return (
            <div className="list-article">
              <Link href={"/entries/" + post.slug}>
                <div className="flex-end flex-margin blogpost-title">
                  <a className="flex-leftchild flex-compontent">
                    <h2 className="flex-compontent">{post.title}</h2>
                  </a>
                  <p className="flex-compontent flex-column-center">
                    {formatDate(post.date)}
                  </p>
                </div>
              </Link>
              <div className="flex-row">
                {post.tags?.map((tag) => (
                  <Link href="">
                    <a className="blog-tag flex-compontent">
                      <p className="blog-tag flex-compontent">{`#${tag}`}</p>
                    </a>
                  </Link>
                ))}
              </div>
            </div>
          );
        }
      })}
    </ul>
  </Layout>
);

export default Home;
