import Link from "next/link"
import { Article } from "utils/api"
import { formatDate } from "utils/Layout"

const ArticleComponent = ({ post }: { post: Article }) => (
  <div
    className="rounded-lg my-5 py-5 px-7 border-solid border border-gray/[0.2] rounded-lg shadow-md"
    key={post.slug}
  >
    <div className="flex flex-row items-center border-solid border-b pb-3 mb-3">
      <Link href={"/entries/" + post.slug}>
        <p className="grow font-bold text-xl hover:underline text-blue mr-3">
          {post.title}
        </p>
      </Link>
      <p className="grow-0 text-right text-sm">
        {formatDate(post.date)}
      </p>
    </div>
    <p className="text-darkgray">{post.summery}</p>
    <div className="flex flex-row mt-1">
      {post.tags?.map((tag) => (
        <Link
          key={tag}
          href={`/search/${tag}`}
          className="article-a text-sm mr-1"
        >
          <p className="blog-tag flex-compontent">{`#${tag}`}</p>
        </Link>
      ))}
    </div>
  </div>
)

export default ArticleComponent
