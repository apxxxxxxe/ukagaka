import axios from "axios"

export const github = axios.create({
  baseURL: "https://api.github.com",
})

export const repos = [
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
]
