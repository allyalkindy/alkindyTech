import { NextResponse } from "next/server"

export async function POST(req: Request) {
  try {
    const { url } = await req.json()

    if (!url) {
      return NextResponse.json({ error: "No URL provided" }, { status: 400 })
    }

    const api = `https://www.tikwm.com/api/?url=${encodeURIComponent(url)}`

    const response = await fetch(api)
    const data = await response.json()

    if (!data?.data) {
      return NextResponse.json({ error: "Failed to fetch video" }, { status: 400 })
    }

    return NextResponse.json({
      title: data.data.title,
      thumbnail: data.data.cover,
      video: data.data.play,
      videoNoWM: data.data.play,
      audio: data.data.music
    })

  } catch (error) {
    return NextResponse.json({ error: "Server error" }, { status: 500 })
  }
}