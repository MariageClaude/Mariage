import { type NextRequest, NextResponse } from "next/server"
import { authenticateGuest } from "@/lib/auth"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { password } = body

    if (!password) {
      return NextResponse.json({ error: "Password is required" }, { status: 400 })
    }

    const guest = await authenticateGuest(password)

    if (!guest) {
      return NextResponse.json({ error: "Invalid password" }, { status: 401 })
    }

    return NextResponse.json({
      message: "Authentication successful",
      guest: {
        id: guest.id,
        name: guest.name,
        email: guest.email,
      },
    })
  } catch (error) {
    console.error("Guest authentication error:", error)
    return NextResponse.json({ error: "Authentication failed" }, { status: 500 })
  }
}
