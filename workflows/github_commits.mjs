import { github, repos as repo_info } from "./utils.mjs"
import prisma from "../lib/prisma.mts"
import { Feed } from 'feed';
import fs from 'fs';

function is_ignored_commit(message) {
  message.includes("md5") ||
    message.includes("CI") ||
    message.includes("Merge branch") ||
    message.includes("Merge pull request")
}

async function get_commits() {
  let commitsForRss = []
  let commits = []
  for (const repo of repo_info) {
    const response = await github.get(
      `/repos/apxxxxxxe/${repo}/commits`
    )
    const data = response.data
    data.sort((a, b) => {
      return (
        new Date(b.commit.committer.date) -
        new Date(a.commit.committer.date)
      )
    })
    console.log("data: ", data.length)

    for (const commit of data) {
      if (is_ignored_commit(commit.commit.message)) {
        continue
      }
      commitsForRss.push({
        repo: repo,
        commit: commit,
      })
    }

    let tmpMessages = []
    for (let i = 0; i < data.length - 1; i++) {
      // 特定のコミットメッセージは無視する
      if (is_ignored_commit(data[i].commit.message)) {
        continue
      }

      tmpMessages.push(data[i].commit.message)

      let dateA = new Date(data[i].commit.committer.date)
      let dateB = new Date(data[i + 1].commit.committer.date)
      if (dateA.toLocaleDateString() !== dateB.toLocaleDateString()) {
        commits.push({
          repoName: repo,
          date: data[i].commit.committer.date,
          messages: tmpMessages,
        })
        tmpMessages = []
      }
    }
  }
  console.log("commits: ", commits.length)

  let commitsByDate = {}
  for (const commit of commits) {
    const date = new Date(commit.date).toLocaleDateString();
    if (!commitsByDate[date]) {
      commitsByDate[date] = [];
    }
    commitsByDate[date].push(commit);
  }
  console.log("commitsByDate: ", commitsByDate)

  // set timezone to UTC
  await prisma.$executeRaw`SET timezone TO 'UTC'`
  await prisma.commits.deleteMany()
  await prisma.commits_by_date.deleteMany()

  const promiseNum = 10
  const promises = []
  for (const date of Object.keys(commitsByDate)) {
    let queries = []
    for (const commit of commitsByDate[date]) {
      queries.push({
        repo_name: commit.repoName,
        date: new Date(commit.date).toISOString(),
        messages: commit.messages,
      })
    }

    promises.push(prisma.commits_by_date.create({
      data: {
        date: date,
        commits: {
          create: queries,
        }
      }
    }))

    // timeoutを避けるためにpromiseNum件ずつ処理する
    if (promises.length >= promiseNum) {
      const result = await Promise.all(promises)
      console.log("result: ", result)
      promises = []
    }
  }
  if (promises.length > 0) {
    const result = await Promise.all(promises)
    console.log("result: ", result)
  }

  commitsForRss = commitsForRss.flat()
  commitsForRss.sort((a, b) => {
    return (
      new Date(b.commit.committer.date) -
      new Date(a.commit.committer.date)
    )
  })
  return commitsForRss
}

function generatedRssFeed(posts) {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || '';
  const date = new Date();
  // author の情報を書き換える
  const author = {
    name: 'sample',
    email: 'sample@sample.com',
    link: 'https://...com',
  };

  // デフォルトになる feed の情報
  const feed = new Feed({
    title: 'おわらない | 更新履歴',
    description: process.env.NEXT_PUBLIC_BASE_DISC,
    id: baseUrl,
    link: baseUrl,
    language: 'ja',
    image: `${baseUrl}/favicon.png`,  // image には OGP 画像でなくファビコンを指定
    copyright: `All rights reserved ${date.getFullYear()}, ${author.name}`,
    updated: date,
    feedLinks: {
      rss2: `${baseUrl}/rss/feed.xml`,
    },
    author: author,
  });

  // feed で定義した情報から各記事での変更点を宣言
  posts.forEach((post) => {
    // post のプロパティ情報は使用しているオブジェクトの形式に合わせる
    const url = post.url;
    feed.addItem({
      title: `${post.repo} | ${post.commit.commit.message}`,
      description: post.commit.commit.message,
      id: url,
      link: url,
      content: post.commit.commit.message,
      date: new Date(post.commit.commit.committer.date),
    });
  });

  // フィード情報を public/rss 配下にディレクトリを作って保存
  fs.mkdirSync('./public/rss', { recursive: true });
  fs.writeFileSync('./public/rss/feed.xml', feed.rss2());
}

async function main() {
  const commits = await get_commits()
  generatedRssFeed(commits)
}

main()
