import { NextResponse } from "next/server"
import { MongoClient } from "mongodb"

const uri = process.env.DATABASE_URL as string
const dbName = "tonNomDeDB" // Remplace par le nom de ta base

let client: MongoClient | null = null
async function getClient() {
  if (!client) {
    client = new MongoClient(uri)
    await client.connect()
  }
  return client
}

export async function GET(request: Request) {
  try {
    const client = await getClient()
    const db = client.db(dbName)
    const guests = await db.collection("guests").aggregate([
      {
        $lookup: {
          from: "ceremony_responses",
          localField: "_id",
          foreignField: "guest_id",
          as: "responses"
        }
      },
      { $sort: { created_at: -1 } }
    ]).toArray()

    return NextResponse.json({ guests })
  } catch (error) {
    console.error("Error fetching guests:", error)
    return NextResponse.json({ error: "Failed to fetch guests" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const client = await getClient()
    const db = client.db(dbName)
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

    if (!name || !email || !password) {
      return NextResponse.json({ error: "Name, email, and password are required" }, { status: 400 })
    }

    // Vérifier si l'email existe déjà
    const existingGuest = await db.collection("guests").findOne({ email })
    if (existingGuest) {
      return NextResponse.json({ error: "A guest with this email already exists" }, { status: 409 })
    }

    // Insérer le nouvel invité
    const guestResult = await db.collection("guests").insertOne({
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
      created_at: new Date(),
    })

    // Initialiser les réponses aux cérémonies
    await db.collection("ceremony_responses").insertMany([
      { guest_id: guestResult.insertedId, ceremony_type: "dot", response: "pending" },
      { guest_id: guestResult.insertedId, ceremony_type: "civil", response: "pending" },
    ])

    return NextResponse.json(
      {
        message: "Guest created successfully",
        guest: { _id: guestResult.insertedId, name, email },
      },
      { status: 201 },
    )
  } catch (error) {
    console.error("Error creating guest:", error)
    return NextResponse.json({ error: "Failed to create guest" }, { status: 500 })
  }
}
