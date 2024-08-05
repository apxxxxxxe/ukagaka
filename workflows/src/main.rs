use crate::commit::{generate_commits_by_date, parse_commit, sort_by_date, RssGenerator};
use crate::release::RawRelease;
use crate::repository::Repository;

mod commit;
mod release;
mod repository;

const REPOS: [&str; 11] = [
    "Haine",
    "Youto",
    "thumbelina-shell",
    "kirinokougai",
    "GhostSpeaker",
    "Ukaing",
    "GhostWardrobe",
    "Bouyomi",
    "recentghosts",
    "shioriupdater",
    "sunset-sunrise-saori",
];

pub const OWNER: &str = "apxxxxxxe";
pub const BASE_URL: &str = "https://apxxxxxxe.dev/";
pub const RSS_TITLE: &str = "おわらない | 更新履歴";
const RSS_FILE: &str = "../public/rss/feed.xml";
const COMMIT_BY_DATE_FILE: &str = "../data/commits_by_date.json";
const REPOSITORIES_FILE: &str = "../data/repositories.json";
const RELEASES_BY_DATE_FILE: &str = "../data/releases_by_date.json";

// the date format is "2021-08-01T00:00:00Z"

#[tokio::main]
async fn main() {
    if let Err(e) = run().await {
        eprintln!("{}", e);
        std::process::exit(1);
    }
}

async fn run() -> Result<(), Box<dyn std::error::Error>> {
    let client = reqwest::Client::new();

    let mut all_commits = Vec::new();
    for repo in REPOS.iter() {
        let response = {
            let url = format!("https://api.github.com/repos/{}/{}/commits", OWNER, repo);
            let response = client
                .get(&url)
                .header("User-Agent", "reqwest")
                .send()
                .await?;
            response.text().await?
        };
        let commits = parse_commit(repo, response)?;
        all_commits.extend(commits);
    }

    sort_by_date(&mut all_commits);
    let rss = all_commits.generate_rss();
    std::fs::write(RSS_FILE, rss.to_string())?;

    let commits_by_date = generate_commits_by_date(&all_commits);
    std::fs::write(
        COMMIT_BY_DATE_FILE,
        serde_json::to_string(&commits_by_date)?,
    )?;

    let mut all_repos = Vec::new();
    for repo in REPOS.iter() {
        let response = {
            let url = format!("https://api.github.com/repos/{}/{}", OWNER, repo);
            let response = client
                .get(&url)
                .header("User-Agent", "reqwest")
                .send()
                .await?;
            response.text().await?
        };
        all_repos.push(serde_json::from_str::<Repository>(&response)?);
    }
    std::fs::write(REPOSITORIES_FILE, serde_json::to_string(&all_repos)?)?;

    let mut all_releases = Vec::new();
    for repo in REPOS.iter() {
        let response = {
            let url = format!("https://api.github.com/repos/{}/{}/releases", OWNER, repo);
            let response = client
                .get(&url)
                .header("User-Agent", "reqwest")
                .send()
                .await?;
            response.text().await?
        };
        let raw_releases: Vec<RawRelease> = serde_json::from_str(&response)?;
        all_releases.extend(
            raw_releases
                .into_iter()
                .map(|r| release::Release::new(repo, r)),
        );
    }
    let releases_by_date = release::generate_releases_by_date(&all_releases);
    std::fs::write(
        RELEASES_BY_DATE_FILE,
        serde_json::to_string(&releases_by_date)?,
    )?;

    Ok(())
}
