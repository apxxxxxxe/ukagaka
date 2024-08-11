use crate::blog_rss::load_all_front_matter;
use crate::commit::{generate_commits_by_date, parse_commit, sort_by_date};
use crate::release::RawRelease;
use crate::repository::Repository;
use crate::rss::RssGenerator;

mod blog_rss;
mod commit;
mod release;
mod repository;
mod rss;

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
pub const UPDATES_RSS_TITLE: &str = "おわらない | 更新履歴";
pub const BLOG_RSS_TITLE: &str = "おわらない | ブログ記事";
const UPDATES_RSS_FILE: &str = "../public/rss/updates_rss.xml";
const BLOG_RSS_FILE: &str = "../public/rss/blog_rss.xml";
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
    let blog_data = load_all_front_matter()?;
    let blog_rss_channel = blog_data.generate_rss();
    std::fs::write(BLOG_RSS_FILE, blog_rss_channel.to_string())?;

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
    std::fs::write(UPDATES_RSS_FILE, rss.to_string())?;

    let commits_by_date = generate_commits_by_date(&all_commits);
    std::fs::write(
        COMMIT_BY_DATE_FILE,
        serde_json::to_string_pretty(&commits_by_date)?,
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
    std::fs::write(REPOSITORIES_FILE, serde_json::to_string_pretty(&all_repos)?)?;

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
        serde_json::to_string_pretty(&releases_by_date)?,
    )?;

    Ok(())
}
