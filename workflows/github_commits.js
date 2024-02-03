import { github, repos as repo_info } from "./utils.js"
import prisma from "../lib/prisma.ts"

async function get_commits() {
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

    let tmpMessages = []
    for (let i = 0; i < data.length - 1; i++) {
      // 特定のコミットメッセージは無視する
      if (
        data[i].commit.message.includes("md5") ||
        data[i].commit.message.includes("CI") ||
        data[i].commit.message.includes("Merge branch")
      ) {
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

  let promises = []
  for (const date of Object.keys(commitsByDate)) {
    let queries = []
    for (const commit of commitsByDate[date]) {
      queries.push({
        repo_name: commit.repoName,
        date: new Date(commit.date).toISOString(),
        messages: commit.messages,
      })
    }
    promises.push(
      prisma.commits_by_date.create({
        data: {
          date: date,
          commits: {
            create: queries,
          }
        }
      })
    )
  }

  const result = await Promise.all(promises)
  console.log("result: ", result)
}

get_commits()
