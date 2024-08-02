use serde::{Deserialize, Serialize};

#[derive(Deserialize, Serialize)]
pub(crate) struct Repository {
    pub name: String,
    pub pushed_at: String,
}

