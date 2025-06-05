import { type NextRequest, NextResponse } from "next/server"
import { sql } from "@/lib/database"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { guestId, responses } = body

    // Validate input
    if (!guestId || !responses) {
      return NextResponse.json({ error: "Guest ID and responses are required" }, { status: 400 })
    }

    // Verify guest exists
    const guests = await sql`
      SELECT id FROM guests WHERE id = ${guestId}
    `

    if (guests.length === 0) {
      return NextResponse.json({ error: "Guest not found" }, { status: 404 })
    }

    // Update or insert ceremony responses
    const updatedResponses = []

    for (const [ceremonyType, response] of Object.entries(responses)) {
      if (ceremonyType === "dot" || ceremonyType === "civil") {
        const result = await sql`
          INSERT INTO ceremony_responses (guest_id, ceremony_type, response)
          VALUES (${guestId}, ${ceremonyType}, ${response})
          ON CONFLICT (guest_id, ceremony_type)
          DO UPDATE SET 
            response = ${response},
            response_date = CURRENT_TIMESTAMP
          RETURNING *
        `
        updatedResponses.push(result[0])
      }
    }

    return NextResponse.json({
      message: "Responses updated successfully",
      responses: updatedResponses,
    })
  } catch (error) {
    console.error("Error updating responses:", error)
    return NextResponse.json({ error: "Failed to update responses" }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const guestId = searchParams.get("guestId")

    let query
    if (guestId) {
      query = sql`
        SELECT cr.*, g.name as guest_name, g.email as guest_email
        FROM ceremony_responses cr
        JOIN guests g ON cr.guest_id = g.id
        WHERE cr.guest_id = ${guestId}
        ORDER BY cr.ceremony_type
      `
    } else {
      query = sql`
        SELECT cr.*, g.name as guest_name, g.email as guest_email
        FROM ceremony_responses cr
        JOIN guests g ON cr.guest_id = g.id
        ORDER BY g.name, cr.ceremony_type
      `
    }

    const responses = await query

    return NextResponse.json({ responses })
  } catch (error) {
    console.error("Error fetching responses:", error)
    return NextResponse.json({ error: "Failed to fetch responses" }, { status: 500 })
  }
}
