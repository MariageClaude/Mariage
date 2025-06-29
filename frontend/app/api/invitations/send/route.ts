import { type NextRequest, NextResponse } from "next/server"
import { sql } from "@/lib/database"
import { sendEmail, generateInvitationEmail } from "@/lib/email"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { guestId, guestIds } = body

    // Handle single guest or multiple guests
    const targetGuestIds = guestId ? [guestId] : guestIds

    if (!targetGuestIds || targetGuestIds.length === 0) {
      return NextResponse.json({ error: "Guest ID(s) required" }, { status: 400 })
    }

    const results = []

    for (const id of targetGuestIds) {
      try {
        // Get guest details
        const guests = await sql`
          SELECT * FROM guests WHERE id = ${id}
        `

        if (guests.length === 0) {
          results.push({ guestId: id, success: false, error: "Guest not found" })
          continue
        }

        const guest = guests[0]

        // Generate invitation email
        const loginUrl = `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/guest/login`
        const emailTemplate = generateInvitationEmail({
          guestName: guest.name,
          guestEmail: guest.email,
          password: guest.password,
          loginUrl,
        })

        // Send email
        const emailSent = await sendEmail(emailTemplate)

        if (emailSent) {
          // Update guest invitation status
          await sql`
            UPDATE guests 
            SET invitation_sent = true, invitation_sent_at = CURRENT_TIMESTAMP
            WHERE id = ${id}
          `

          // Log invitation
          await sql`
            INSERT INTO invitations_log (guest_id, email_status)
            VALUES (${id}, 'sent')
          `

          results.push({ guestId: id, success: true })
        } else {
          // Log failed invitation
          await sql`
            INSERT INTO invitations_log (guest_id, email_status, error_message)
            VALUES (${id}, 'failed', 'Email sending failed')
          `

          results.push({ guestId: id, success: false, error: "Email sending failed" })
        }
      } catch (error) {
        console.error(`Error sending invitation to guest ${id}:`, error)
        results.push({ guestId: id, success: false, error: "Internal error" })
      }
    }

    const successCount = results.filter((r) => r.success).length
    const failureCount = results.length - successCount

    return NextResponse.json({
      message: `Invitations processed: ${successCount} sent, ${failureCount} failed`,
      results,
    })
  } catch (error) {
    console.error("Error processing invitations:", error)
    return NextResponse.json({ error: "Failed to process invitations" }, { status: 500 })
  }
}
