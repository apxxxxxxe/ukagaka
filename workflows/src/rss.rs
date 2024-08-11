pub trait RssGenerator {
    fn generate_rss(&self) -> rss::Channel;
}
