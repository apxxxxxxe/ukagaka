import { NextPage, InferGetStaticPropsType } from "next";
import Link from "next/link";
import { getAllPosts } from "utils/api";
import Layout, { formatDate } from "utils/Layout";

type Props = InferGetStaticPropsType<typeof getStaticProps>;

export const getStaticProps = async () => {
  const allPosts = getAllPosts(["slug", "title", "date", "tags"]).filter(
    (post) => !post.slug.startsWith("noindex-")
  );

  return {
    props: { allPosts },
  };
};

const Home: NextPage<Props> = ({ allPosts }) => (
  <Layout title="Blog">
    <h1>Blog</h1>
    <p>記事一覧（新着順）</p>
    <ul>
      {allPosts?.map((post) => {
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
                  <Link href={`/search/${tag}`}>
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
