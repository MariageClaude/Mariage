import { type NextRequest, NextResponse } from "next/server";
import { sql } from "@/lib/database";

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const guestId = Number.parseInt(params.id)

    const guest = await sql`
      SELECT 
        g.*,
        COALESCE(
          json_agg(
            json_build_object(
              'ceremony_type', cr.ceremony_type,
              'response', cr.response,
              'response_date', cr.response_date,
              'notes', cr.notes
            )
          ) FILTER (WHERE cr.id IS NOT NULL), 
          '[]    http://localhost:3000'
        ) as responses
      FROM guests g
      LEFT JOIN ceremony_responses cr ON g.id = cr.guest_id
      WHERE g.id = ${guestId}
      GROUP BY g.id
    `

    if (guest.length === 0) {
      return NextResponse.json({ error: "Guest not found" }, { status: 404 })
    }

    return NextResponse.json({ guest: guest[0] })
  } catch (error) {
    console.error("Error fetching guest:", error)
    return NextResponse.json({ error: "Failed to fetch guest" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const guestId = Number.parseInt(params.id)
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
    } = body

    const updatedGuest = await sql`
      UPDATE guests SET
        name = ${name},
        email = ${email},
        phone = ${phone},
        address = ${address},
        city = ${city},
        country = ${country},
        guest_type = ${guest_type},
        partner_name = ${partner_name},
        number_of_guests = ${number_of_guests},
        dietary_restrictions = ${dietary_restrictions},
        special_requests = ${special_requests}
      WHERE id = ${guestId}
      RETURNING *
    `

    if (updatedGuest.length === 0) {
      return NextResponse.json({ error: "Guest not found" }, { status: 404 })
    }

    return NextResponse.json({
      message: "Guest updated successfully",
      guest: updatedGuest[0],
    })
  } catch (error) {
    console.error("Error updating guest:", error)
    return NextResponse.json({ error: "Failed to update guest" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const guestId = Number.parseInt(params.id);

    if (isNaN(guestId)) {
      return NextResponse.json({ error: "Invalid guest ID" }, { status: 400 });
    }

    const deletedGuest = await sql`
      DELETE FROM guests 
      WHERE id = ${guestId}
      RETURNING *
    `;

    if (deletedGuest.length === 0) {
      return NextResponse.json({ error: "Guest not found" }, { status: 404 });
    }

    return NextResponse.json({
      message: "Guest deleted successfully",
      deletedGuest: deletedGuest[0],
    });
  } catch (error) {
    console.error("Error deleting guest with ID:", params.id, error);
    return NextResponse.json({ error: "Failed to delete guest" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, guestType, numberOfGuests, password } = body;

    // Validation des champs requis
    if (!name || !email || !guestType || !numberOfGuests || !password) {
      return NextResponse.json({ error: "Tous les champs requis doivent être remplis." }, { status: 400 });
    }

    const newGuest = await sql`
      INSERT INTO guests (name, email, guest_type, number_of_guests, password)
      VALUES (${name}, ${email}, ${guestType}, ${numberOfGuests}, ${password})
      RETURNING *
    `;

    return NextResponse.json(newGuest[0], { status: 201 });
  } catch (error) {
    console.error("Erreur lors de l'ajout de l'invité :", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
