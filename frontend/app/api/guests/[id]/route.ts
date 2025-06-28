import { NextResponse } from "next/server"
import { ObjectId } from "mongodb"
import { getDb } from "@/lib/mongodb"

// GET un invité avec ses réponses
export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const db = await getDb()
    const guest = await db.collection("guests").aggregate([
      { $match: { _id: new ObjectId(params.id) } },
      {
        $lookup: {
          from: "ceremony_responses",
          localField: "_id",
          foreignField: "guest_id",
          as: "responses"
        }
      }
    ]).next()

    if (!guest) {
      return NextResponse.json({ error: "Guest not found" }, { status: 404 })
    }

    return NextResponse.json({ guest })
  } catch (error) {
    console.error("Error fetching guest:", error)
    return NextResponse.json({ error: "Failed to fetch guest" }, { status: 500 })
  }
}

// PUT pour mettre à jour un invité
export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
    const db = await getDb()
    const body = await request.json()
    const updateFields = { ...body }
    delete updateFields._id

    const result = await db.collection("guests").findOneAndUpdate(
      { _id: new ObjectId(params.id) },
      { $set: updateFields },
      { returnDocument: "after" }
    )

    if (!result || !result.value) {
      return NextResponse.json({ error: "Guest not found" }, { status: 404 })
    }

    return NextResponse.json({ message: "Guest updated successfully", guest: result.value })
  } catch (error) {
    console.error("Error updating guest:", error)
    return NextResponse.json({ error: "Failed to update guest" }, { status: 500 })
  }
}

// DELETE un invité
export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    const db = await getDb()
    const result = await db.collection("guests").findOneAndDelete({ _id: new ObjectId(params.id) })

    if (!result || !result.value) {
      return NextResponse.json({ error: "Guest not found" }, { status: 404 })
    }

    return NextResponse.json({ message: "Guest deleted successfully", deletedGuest: result.value })
  } catch (error) {
    console.error("Error deleting guest:", error)
    return NextResponse.json({ error: "Failed to delete guest" }, { status: 500 })
  }
}

// POST pour créer un invité (optionnel ici, car déjà dans /guests/route.ts)
export async function POST(request: Request) {
  try {
    const db = await getDb()
    const body = await request.json()
    const { name, email, guestType, numberOfGuests, password } = body

    if (!name || !email || !guestType || !numberOfGuests || !password) {
      return NextResponse.json({ error: "Tous les champs requis doivent être remplis." }, { status: 400 })
    }

    const existingGuest = await db.collection("guests").findOne({ email })
    if (existingGuest) {
      return NextResponse.json({ error: "A guest with this email already exists" }, { status: 409 })
    }

    const result = await db.collection("guests").insertOne({
      name,
      email,
      guest_type: guestType,
      number_of_guests: numberOfGuests,
      password,
      created_at: new Date(),
    })

    return NextResponse.json({ _id: result.insertedId, name, email, guestType, numberOfGuests }, { status: 201 })
  } catch (error) {
    console.error("Erreur lors de l'ajout de l'invité :", error)
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 })
  }
}
