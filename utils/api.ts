import fs from "fs";
import { join } from "path";
import matter from "gray-matter";

const postsDirectory = join(process.cwd(), "content");

export const getPostSlugs = () => {
  const allDirents = fs.readdirSync(postsDirectory, { withFileTypes: true });
  return allDirents
    .filter((dirent) => dirent.isDirectory())
    .map(({ name }) => name);
};

export const getPostByTag = (tag: string, fields: string[]) => {
  const posts = getAllPosts(fields);
  return posts.filter((post) => post.tags.includes(tag));
};

export const getPostBySlug = (slug: string, fields: string[] = []) => {
  const fullPath = join(postsDirectory, slug, "index.md");
  const fileContents = fs.readFileSync(fullPath, "utf8");
  const { data, content } = matter(fileContents);
  type Item = {
    slug: string;
    content: string;
    title: string;
    date: string;
    tags: string[];
    summery: string;
  };

  const items: Item = {
    slug: "",
    content: "",
    title: "",
    date: "",
    tags: [],
    summery: "",
  };

  fields.forEach((field) => {
    if (field === "slug") {
      items[field] = slug;
    }
    if (field === "content") {
      items[field] = content;
    }

    if (
      field === "title" ||
      field === "date" ||
      field === "tags" ||
      field === "summery"
    ) {
      items[field] = data[field];
    }
  });

  return items;
};

export const getAllPosts = (fields: string[] = []) => {
  const slugs = getPostSlugs();
  const posts = slugs
    .map((slug) => getPostBySlug(slug, fields))
    .sort((a, b) => {
      // 辞書順ソート
      // 日付順
      const slugA = a.date.toString().toLowerCase();
      const slugB = b.date.toString().toLowerCase();

      if (slugA < slugB) {
        return 1;
      } else {
        slugB < slugA;
      }

      return slugA < slugB ? 1 : -1;
    });

  return posts;
};
