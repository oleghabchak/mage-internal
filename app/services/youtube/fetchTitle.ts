import Config from "app/config"

export async function fetchVideoTitle(videoId: string) {
  try {
    const response = await fetch(
      `https://www.googleapis.com/youtube/v3/videos?id=${videoId}&key=${Config.GOOGLE_API_KEY}&part=snippet`,
    )
    const data = await response.json()
    if (data.items.length > 0) {
      return data.items[0].snippet.title
    } else {
      return "Video not found"
    }
  } catch (error) {
    console.error("Error fetching video title:", error)
    return "Error fetching video title"
  }
}
