import { type NextRequest, NextResponse } from "next/server"
import { sql } from "@/lib/database"

export async function GET(request: NextRequest) {
  try {
    const guests = await sql`
      SELECT 
        g.*,
        COALESCE(
          json_agg(
            json_build_object(
              'ceremony_type', cr.ceremony_type,
              'response', cr.response,
              'response_date', cr.response_date
            )
          ) FILTER (WHERE cr.id IS NOT NULL), 
          '[]'
        ) as responses
      FROM guests g
      LEFT JOIN ceremony_responses cr ON g.id = cr.guest_id
      GROUP BY g.id
      ORDER BY g.created_at DESC
    `

    return NextResponse.json({ guests })
  } catch (error) {
    console.error("Error fetching guests:", error)
    return NextResponse.json({ error: "Failed to fetch guests" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const {
      name,
      email,
      phone,
      address,
      city,
      country,
      guest_type,
      partner_name,
      number_of_guests,
      dietary_restrictions,
      special_requests,
      password,
    } = body

    // Validate required fields
    if (!name || !email || !password) {
      return NextResponse.json({ error: "Name, email, and password are required" }, { status: 400 })
    }

    // Check if email already exists
    const existingGuest = await sql`
      SELECT id FROM guests WHERE email = ${email}
    `

    if (existingGuest.length > 0) {
      return NextResponse.json({ error: "A guest with this email already exists" }, { status: 409 })
    }

    // Insert new guest
    const newGuest = await sql`
      INSERT INTO guests (
        name, email, phone, address, city, country, guest_type,
        partner_name, number_of_guests, dietary_restrictions,
        special_requests, password
      ) VALUES (
        ${name}, ${email}, ${phone}, ${address}, ${city}, ${country},
        ${guest_type}, ${partner_name}, ${number_of_guests},
        ${dietary_restrictions}, ${special_requests}, ${password}
      )
      RETURNING *
    `

    // Initialize ceremony responses as pending
    await sql`
      INSERT INTO ceremony_responses (guest_id, ceremony_type, response)
      VALUES 
        (${newGuest[0].id}, 'dot', 'pending'),
        (${newGuest[0].id}, 'civil', 'pending')
    `

    return NextResponse.json(
      {
        message: "Guest created successfully",
        guest: newGuest[0],
      },
      { status: 201 },
    )
  } catch (error) {
    console.error("Error creating guest:", error)
    return NextResponse.json({ error: "Failed to create guest" }, { status: 500 })
  }
}
