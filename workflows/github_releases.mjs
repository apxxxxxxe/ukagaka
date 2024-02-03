import { github, repos as repo_info } from "./utils.mjs"
import prisma from "../lib/prisma.mts"

async function get_releases() {
  let releases = []
  for (const repo of repo_info) {
    const response = await github.get(
      `/repos/apxxxxxxe/${repo}/releases`
    )
    const data = response.data
    data.sort((a, b) => {
      return new Date(b.published_at) - new Date(a.published_at)
    })

    for (let i = 0; i < data.length - 1; i++) {
      // draftは除外
      if (data[i].draft) {
        continue
      }

      releases.push({
        repoName: repo,
        date: data[i].published_at,
        tagName: data[i].tag_name,
        body: data[i].body || "",
      })
    }
  }

  releases.sort((a, b) => {
    return new Date(b.date) - new Date(a.date)
  })

  let releasesByDate = {}
  for (const release of releases) {
    const date = new Date(release.date).toLocaleDateString();
    if (!releasesByDate[date]) {
      releasesByDate[date] = [];
    }
    releasesByDate[date].push(release);
  }

  await prisma.$executeRaw`SET timezone TO 'UTC'`

  await prisma.releases.deleteMany()
  await prisma.releases_by_date.deleteMany()

  let promises = []
  for (const date of Object.keys(releasesByDate)) {
    let queries = []
    for (const release of releasesByDate[date]) {
      queries.push(
        {
          repo_name: release.repoName,
          date: new Date(release.date).toISOString(),
          tag_name: release.tagName,
          body: release.body,
        }
      )
    }
    promises.push(prisma.releases_by_date.create({
      data: {
        date: date,
        releases: {
          create: queries
        }
      },
    }))
  }

  const result = await Promise.all(promises)
  console.log("releases: ", result)
}

get_releases()
