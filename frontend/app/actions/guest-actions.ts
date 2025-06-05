"use server"

import { sql } from "@/lib/database"
import { sendEmail, generateInvitationEmail } from "@/lib/email"
import { revalidatePath } from "next/cache"

export async function createGuest(formData: FormData) {
  try {
    const name = formData.get("name") as string
    const email = formData.get("email") as string
    const phone = formData.get("phone") as string
    const address = formData.get("address") as string
    const city = formData.get("city") as string
    const country = formData.get("country") as string
    const guestType = formData.get("guestType") as string
    const partnerName = formData.get("partnerName") as string
    const numberOfGuests = Number.parseInt(formData.get("numberOfGuests") as string) || 1
    const dietaryRestrictions = formData.get("dietaryRestrictions") as string
    const specialRequests = formData.get("specialRequests") as string
    const password = formData.get("password") as string
    const sendInvitation = formData.get("sendInvitation") === "true"

    // Validate required fields
    if (!name || !email || !password) {
      return { success: false, error: "Name, email, and password are required" }
    }

    // Check if email already exists
    const existingGuest = await sql`
      SELECT id FROM guests WHERE email = ${email}
    `

    if (existingGuest.length > 0) {
      return { success: false, error: "A guest with this email already exists" }
    }

    // Insert new guest
    const newGuest = await sql`
      INSERT INTO guests (
        name, email, phone, address, city, country, guest_type,
        partner_name, number_of_guests, dietary_restrictions,
        special_requests, password
      ) VALUES (
        ${name}, ${email}, ${phone}, ${address}, ${city}, ${country},
        ${guestType}, ${partnerName}, ${numberOfGuests},
        ${dietaryRestrictions}, ${specialRequests}, ${password}
      )
      RETURNING *
    `

    const guest = newGuest[0]

    // Initialize ceremony responses as pending
    await sql`
      INSERT INTO ceremony_responses (guest_id, ceremony_type, response)
      VALUES 
        (${guest.id}, 'dot', 'pending'),
        (${guest.id}, 'civil', 'pending')
    `

    // Send invitation if requested
    if (sendInvitation) {
      const loginUrl = `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/guest/login`
      const emailTemplate = generateInvitationEmail({
        guestName: guest.name,
        guestEmail: guest.email,
        password: guest.password,
        loginUrl,
      })

      const emailSent = await sendEmail(emailTemplate)

      if (emailSent) {
        await sql`
          UPDATE guests 
          SET invitation_sent = true, invitation_sent_at = CURRENT_TIMESTAMP
          WHERE id = ${guest.id}
        `

        await sql`
          INSERT INTO invitations_log (guest_id, email_status)
          VALUES (${guest.id}, 'sent')
        `
      }
    }

    revalidatePath("/admin")
    return { success: true, guest }
  } catch (error) {
    console.error("Error creating guest:", error)
    return { success: false, error: "Failed to create guest" }
  }
}

export async function updateGuestResponses(guestId: number, responses: Record<string, string>) {
  try {
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

    revalidatePath("/admin")
    return { success: true, responses: updatedResponses }
  } catch (error) {
    console.error("Error updating responses:", error)
    return { success: false, error: "Failed to update responses" }
  }
}

export async function sendInvitation(guestId: number) {
  try {
    // Get guest details
    const guests = await sql`
      SELECT * FROM guests WHERE id = ${guestId}
    `

    if (guests.length === 0) {
      return { success: false, error: "Guest not found" }
    }

    const guest = guests[0]

    // Generate and send invitation email
    const loginUrl = `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/guest/login`
    const emailTemplate = generateInvitationEmail({
      guestName: guest.name,
      guestEmail: guest.email,
      password: guest.password,
      loginUrl,
    })

    const emailSent = await sendEmail(emailTemplate)

    if (emailSent) {
      // Update guest invitation status
      await sql`
        UPDATE guests 
        SET invitation_sent = true, invitation_sent_at = CURRENT_TIMESTAMP
        WHERE id = ${guestId}
      `

      // Log invitation
      await sql`
        INSERT INTO invitations_log (guest_id, email_status)
        VALUES (${guestId}, 'sent')
      `

      revalidatePath("/admin")
      return { success: true }
    } else {
      // Log failed invitation
      await sql`
        INSERT INTO invitations_log (guest_id, email_status, error_message)
        VALUES (${guestId}, 'failed', 'Email sending failed')
      `

      return { success: false, error: "Email sending failed" }
    }
  } catch (error) {
    console.error("Error sending invitation:", error)
    return { success: false, error: "Failed to send invitation" }
  }
}
