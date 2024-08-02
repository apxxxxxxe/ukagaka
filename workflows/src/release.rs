use serde::{Deserialize, Deserializer, Serialize};
use std::collections::HashMap;

fn deserialize_string_or_empty<'de, D>(deserializer: D) -> Result<String, D::Error>
where
    D: Deserializer<'de>,
{
    match Option::<String>::deserialize(deserializer)? {
        Some(s) => Ok(s),
        None => Ok(String::new()),
    }
}

#[derive(Deserialize)]
pub(crate) struct RawRelease {
    published_at: String,
    tag_name: String,
    #[serde(deserialize_with = "deserialize_string_or_empty")]
    body: String,
}

#[derive(Serialize, Clone)]
pub(crate) struct Release {
    pub(crate) repo: String,
    pub(crate) datetime: String,
    pub(crate) tag_name: String,
    pub(crate) body: String,
}

impl Release {
    pub(crate) fn new(repo: &str, raw: RawRelease) -> Self {
        Self {
            repo: repo.to_string(),
            datetime: raw.published_at,
            tag_name: raw.tag_name,
            body: raw.body,
        }
    }
}

#[derive(Serialize)]
pub(crate) struct ReleasesByDate {
    pub(crate) date: String,
    pub(crate) releases: Vec<Release>,
}

pub(crate) fn generate_releases_by_date(releases: &[Release]) -> Vec<ReleasesByDate> {
    let mut releases_map: HashMap<String, Vec<Release>> = HashMap::new();
    let releases = releases.to_vec();
    for r in releases {
        let date = r.datetime.split('T').next().unwrap();
        let releases_group = releases_map.entry(date.to_string()).or_default();
        releases_group.push(r);
    }

    let mut releases_vec = releases_map
        .into_iter()
        .collect::<Vec<(String, Vec<Release>)>>();
    releases_vec.sort_by(|a, b| b.0.cmp(&a.0));
    releases_vec
        .into_iter()
        .map(|(date, releases)| ReleasesByDate { date, releases })
        .collect()
}
