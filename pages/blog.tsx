import { NextPage, InferGetStaticPropsType } from "next";
import Link from "next/link";
import { getAllPosts } from "utils/api";
import { Layout } from "utils/page";

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
  <Layout>
    <h1>Blog</h1>
    <p>記事一覧</p>
    <ul>
      {allPosts?.map((post) => {
        if (!post.tags.includes("noindex")) {
          return (
            <div className="list-article">
              <Link href={"/entries/" + post.slug}>
                <a>
                  <h2>{post.title}</h2>
                </a>
              </Link>
              <p>{post.date}</p>
              <ul>
                {post.tags?.map((tag) => (
                  <li key={tag}>{tag}</li>
                ))}
              </ul>
            </div>
          );
        }
      })}
    </ul>
  </Layout>
);

export default Home;
