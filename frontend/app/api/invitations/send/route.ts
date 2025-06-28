import { type NextRequest, NextResponse } from "next/server"
import { getDb } from "@/lib/mongodb"
import { sendEmail, generateInvitationEmail } from "@/lib/email"
import { ObjectId } from "mongodb"

export async function POST(request: NextRequest) {
  try {
    const db = await getDb()
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
        const guest = await db.collection("guests").findOne({ _id: new ObjectId(id) })

        if (!guest) {
          results.push({ guestId: id, success: false, error: "Guest not found" })
          continue
        }

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
          await db.collection("guests").updateOne(
            { _id: guest._id },
            { $set: { invitation_sent: true, invitation_sent_at: new Date() } }
          )

          // Log invitation
          await db.collection("invitations_log").insertOne({
            guest_id: guest._id,
            email_status: "sent",
            sent_at: new Date(),
          })

          results.push({ guestId: id, success: true })
        } else {
          // Log failed invitation
          await db.collection("invitations_log").insertOne({
            guest_id: guest._id,
            email_status: "failed",
            error_message: "Email sending failed",
            sent_at: new Date(),
          })

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
