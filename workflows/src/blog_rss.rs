use crate::rss::RssGenerator;
use crate::BASE_URL;
use crate::BLOG_RSS_TITLE;
use fronma::parser::parse;
use rss::ChannelBuilder;
use serde::Deserialize;
use std::collections::HashMap;
use std::fs;

#[derive(Deserialize)]
struct RawHeaders {
    title: String,
    summary: Option<String>,
    date: String,
}

pub struct Headers {
    title: String,
    summary: Option<String>,
    date: String,
    content: String,
}

#[derive(Debug)]
pub enum Error {
    Io(std::io::Error),
    FronmaError(fronma::error::Error),
}

impl std::fmt::Display for Error {
    fn fmt(&self, f: &mut std::fmt::Formatter) -> std::fmt::Result {
        match self {
            Error::Io(e) => write!(f, "{}", e),
            Error::FronmaError(e) => write!(f, "{:?}", e),
        }
    }
}

impl std::error::Error for Error {}

fn load_front_matter(file: &str) -> Result<Headers, Error> {
    let text = fs::read_to_string(file).map_err(Error::Io)?;
    let data = parse::<RawHeaders>(&text).map_err(Error::FronmaError)?;
    Ok(Headers {
        title: data.headers.title,
        summary: data.headers.summary,
        date: data.headers.date,
        content: data.body.to_string(),
    })
}

pub fn load_all_front_matter() -> Result<HashMap<String, Headers>, Error> {
    let mut result = HashMap::new();
    for entry in fs::read_dir("../content").map_err(Error::Io)? {
        let entry = entry.map_err(Error::Io)?;
        let path = entry.path();
        if path.is_dir() {
            let slug = path.file_name().unwrap().to_str().unwrap();
            let file = format!("../content/{}/index.md", slug);
            let headers = load_front_matter(&file)?;
            result.insert(slug.to_string(), headers);
        }
    }
    Ok(result)
}

impl RssGenerator for HashMap<String, Headers> {
    fn generate_rss(&self) -> rss::Channel {
        let mut channel = ChannelBuilder::default()
            .title(BLOG_RSS_TITLE)
            .link(BASE_URL)
            .build();

        let items = self
            .iter()
            .map(|(slug, headers)| {
                let title = headers.title.clone();
                let link = format!("{}/entries/{}", BASE_URL, slug);
                let description = headers.summary.clone();
                let date = chrono::NaiveDate::parse_from_str(&headers.date, "%Y%m%d").unwrap();
                let item = rss::ItemBuilder::default()
                    .title(title)
                    .link(link)
                    .description(description)
                    .pub_date(date.format("%Y-%m-%dT00:00:00Z").to_string())
                    .content(Some(format!("<p>{}</p>", headers.content)))
                    .build();
                item
            })
            .collect::<Vec<_>>();

        channel.set_items(items);
        channel
    }
}
