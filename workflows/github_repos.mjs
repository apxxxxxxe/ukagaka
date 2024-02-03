import { github, repos as repo_info } from "./utils.mjs"
import prisma from "../lib/prisma.mts"

async function get_repos() {
  const response = await github.get(`/users/apxxxxxxe/repos`)
  const data = response.data.filter((item) => {
    return repo_info.includes(item.name)
  })

  let repos = []
  for (const item of data) {
    repos.push({
      repoName: item.name,
      pushedAt: item.pushed_at,
    })
  }

  // set timezone to UTC
  prisma.$executeRaw`SET timezone TO 'UTC'`

  // delete all records from repos table
  await prisma.repos.deleteMany()

  let queries = []
  for (let i = 0; i < repos.length; i++) {
    queries.push({
      repo_name: repos[i].repoName,
      pushed_at: repos[i].pushedAt
    })
  }

  await prisma.repos.createMany({
    data: queries
  })
}

get_repos()
