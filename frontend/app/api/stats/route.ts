import { NextResponse } from "next/server"
import { sql } from "@/lib/database"

export async function GET() {
  try {
    // Get basic stats
    const [
      totalGuests,
      invitationsSent,
      dotAttending,
      civilAttending,
      dotNotAttending,
      civilNotAttending,
      pendingResponses,
    ] = await Promise.all([
      sql`SELECT COUNT(*) as count FROM guests`,
      sql`SELECT COUNT(*) as count FROM guests WHERE invitation_sent = true`,
      sql`SELECT COUNT(*) as count FROM ceremony_responses WHERE ceremony_type = 'dot' AND response = 'attending'`,
      sql`SELECT COUNT(*) as count FROM ceremony_responses WHERE ceremony_type = 'civil' AND response = 'attending'`,
      sql`SELECT COUNT(*) as count FROM ceremony_responses WHERE ceremony_type = 'dot' AND response = 'not-attending'`,
      sql`SELECT COUNT(*) as count FROM ceremony_responses WHERE ceremony_type = 'civil' AND response = 'not-attending'`,
      sql`SELECT COUNT(*) as count FROM ceremony_responses WHERE response = 'pending'`,
    ])

    // Get response breakdown by ceremony
    const responseBreakdown = await sql`
      SELECT 
        ceremony_type,
        response,
        COUNT(*) as count
      FROM ceremony_responses
      GROUP BY ceremony_type, response
      ORDER BY ceremony_type, response
    `

    // Get recent activity
    const recentActivity = await sql`
      SELECT 
        g.name,
        cr.ceremony_type,
        cr.response,
        cr.response_date
      FROM ceremony_responses cr
      JOIN guests g ON cr.guest_id = g.id
      WHERE cr.response != 'pending'
      ORDER BY cr.response_date DESC
      LIMIT 10
    `

    const stats = {
      totalGuests: Number.parseInt(totalGuests[0].count),
      invitationsSent: Number.parseInt(invitationsSent[0].count),
      ceremonies: {
        dot: {
          attending: Number.parseInt(dotAttending[0].count),
          notAttending: Number.parseInt(dotNotAttending[0].count),
        },
        civil: {
          attending: Number.parseInt(civilAttending[0].count),
          notAttending: Number.parseInt(civilNotAttending[0].count),
        },
      },
      pendingResponses: Number.parseInt(pendingResponses[0].count),
      responseBreakdown,
      recentActivity,
    }

    return NextResponse.json({ stats })
  } catch (error) {
    console.error("Error fetching stats:", error)
    return NextResponse.json({ error: "Failed to fetch statistics" }, { status: 500 })
  }
}
