use crate::BASE_URL;
use crate::OWNER;
use crate::RSS_TITLE;
use rss::ChannelBuilder;
use serde::{Deserialize, Serialize};
use std::collections::HashMap;

#[derive(Deserialize, Clone)]
struct RawCommit {
    // url: String,
    // sha: String,
    // html_url: String,
    // comments_url: String,
    commit: CommitDetail,
    // author: Author,
    // committer: Committer,
    // parents: Vec<Parent>,
}

#[derive(Deserialize, Clone)]
struct CommitDetail {
    // url: String,
    author: CommitAuthor,
    // committer: Committer,
    message: String,
    // tree: Tree,
    // comment_count: u32,
    // verification: Verification,
}

#[derive(Deserialize, Clone)]
struct CommitAuthor {
    // name: String,
    // email: String,
    date: String,
}

#[derive(Clone)]
pub(super) struct Commit {
    repo: String,
    message: String,
    datetime: String,
}

pub fn parse_commit(repo: &str, response_text: String) -> Result<Vec<Commit>, serde_json::Error> {
    let raw_commits: Vec<RawCommit> = serde_json::from_str(&response_text)?;

    let result = raw_commits
        .iter()
        .filter(|c| !is_ignored_commit(&c.commit.message))
        .map(|c| Commit {
            repo: repo.to_string(),
            message: c.commit.message.clone(),
            datetime: c.commit.author.date.clone(),
        })
        .collect::<Vec<Commit>>();
    Ok(result)
}

// 新しい順にソート
pub fn sort_by_date(commits: &mut [Commit]) {
    commits.sort_by(|a, b| {
        let a = chrono::NaiveDateTime::parse_from_str(&a.datetime, "%Y-%m-%dT%H:%M:%SZ").unwrap();
        let b = chrono::NaiveDateTime::parse_from_str(&b.datetime, "%Y-%m-%dT%H:%M:%SZ").unwrap();
        b.cmp(&a)
    });
}

impl RssGenerator for Vec<Commit> {
    fn generate_rss(&self) -> rss::Channel {
        let mut channel = ChannelBuilder::default()
            .title(RSS_TITLE)
            .link(BASE_URL)
            .build();
        let mut items = Vec::new();
        for commit in self.iter() {
            let url = format!("https://github.com/{}/{}", OWNER, commit.repo);
            let item = rss::ItemBuilder::default()
                .title(format!("{} | {}", commit.repo, commit.message))
                .description(commit.message.clone())
                .link(url)
                .content(Some(format!("<p>{}</p>", commit.message)))
                .pub_date(commit.datetime.clone())
                .build();
            items.push(item);
        }
        channel.set_items(items);
        channel
    }
}

#[derive(Serialize)]
pub(super) struct CommitsByDate {
    date: String,
    commits: Vec<CommitsGroup>,
}

#[derive(Clone, Serialize)]
struct CommitsGroup {
    repo: String,
    datetime: String,
    messages: Vec<String>,
}

pub fn generate_commits_by_date(commits: &[Commit]) -> Vec<CommitsByDate> {
    let mut result_map: HashMap<String, HashMap<String, CommitsGroup>> = HashMap::new();
    let mut commits = commits.to_vec();
    sort_by_date(&mut commits); // 新しい順にソート
    for commit in commits.iter() {
        let date = commit.datetime.split('T').next().unwrap();
        let commits_by_date = result_map.entry(date.to_string()).or_default();
        let commits_by_repo = commits_by_date
            .entry(commit.repo.clone())
            .or_insert(CommitsGroup {
                repo: commit.repo.clone(),
                datetime: commit.datetime.clone(),
                messages: Vec::new(),
            });
        commits_by_repo.messages.push(commit.message.clone());
    }
    let mut result = Vec::new();
    for (date, commits_by_date) in result_map.iter() {
        let mut commits = commits_by_date
            .iter()
            .map(|(_, group)| group.clone())
            .collect::<Vec<CommitsGroup>>();
        commits.sort_by(|a, b| a.repo.cmp(&b.repo)); // リポジトリ名の昇順にソート
        result.push(CommitsByDate {
            date: date.clone(),
            commits,
        });
    }
    result.sort_by(|a, b| b.date.cmp(&a.date)); // 新しい順にソート
    result
}

fn is_ignored_commit(message: &str) -> bool {
    let words = [
        "md5",
        "CI",
        "Merge branch",
        "Merge pull request",
        "Merge remote-tracking branch",
        "build(deps)",
    ];
    words.iter().any(|w| message.contains(w))
}

pub(super) trait RssGenerator {
    fn generate_rss(&self) -> rss::Channel;
}
