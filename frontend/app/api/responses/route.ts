import { NextResponse } from "next/server"
import { ObjectId } from "mongodb"
import { getDb } from "@/lib/mongodb"

// POST: Met à jour les réponses d'un invité
export async function POST(request: Request) {
  try {
    const db = await getDb()
    const { guestId, responses } = await request.json()

    if (!guestId || !responses) {
      return NextResponse.json({ error: "Guest ID and responses are required" }, { status: 400 })
    }

    // Vérifie que le guest existe
    const guest = await db.collection("guests").findOne({ _id: new ObjectId(guestId) })
    if (!guest) {
      return NextResponse.json({ error: "Guest not found" }, { status: 404 })
    }

    const updatedResponses = []
    for (const [ceremony_type, response] of Object.entries(responses)) {
      if (ceremony_type === "dot" || ceremony_type === "civil") {
        // Upsert la réponse pour chaque cérémonie
        const result = await db.collection("ceremony_responses").findOneAndUpdate(
          { guest_id: guest._id, ceremony_type },
          {
            $set: {
              response,
              response_date: new Date(),
            },
          },
          { upsert: true, returnDocument: "after" }
        )
        if (result && result.value) {
          updatedResponses.push(result.value)
        }
      }
    }

    return NextResponse.json({ message: "Responses updated successfully", responses: updatedResponses })
  } catch (error) {
    console.error("Error updating responses:", error)
    return NextResponse.json({ error: "Failed to update responses" }, { status: 500 })
  }
}

// GET: Récupère les réponses (pour un invité ou tous)
export async function GET(request: Request) {
  try {
    const db = await getDb()
    const { searchParams } = new URL(request.url)
    const guestId = searchParams.get("guestId")

    let responses
    if (guestId) {
      // Réponses pour un invité donné
      responses = await db.collection("ceremony_responses").aggregate([
        { $match: { guest_id: new ObjectId(guestId) } },
        {
          $lookup: {
            from: "guests",
            localField: "guest_id",
            foreignField: "_id",
            as: "guest"
          }
        },
        { $unwind: "$guest" },
        {
          $project: {
            ceremony_type: 1,
            response: 1,
            response_date: 1,
            guest_name: "$guest.name",
            guest_email: "$guest.email"
          }
        },
        { $sort: { ceremony_type: 1 } }
      ]).toArray()
    } else {
      // Toutes les réponses
      responses = await db.collection("ceremony_responses").aggregate([
        {
          $lookup: {
            from: "guests",
            localField: "guest_id",
            foreignField: "_id",
            as: "guest"
          }
        },
        { $unwind: "$guest" },
        {
          $project: {
            ceremony_type: 1,
            response: 1,
            response_date: 1,
            guest_name: "$guest.name",
            guest_email: "$guest.email"
          }
        },
        { $sort: { guest_name: 1, ceremony_type: 1 } }
      ]).toArray()
    }

    return NextResponse.json({ responses })
  } catch (error) {
    console.error("Error fetching responses:", error)
    return NextResponse.json({ error: "Failed to fetch responses" }, { status: 500 })
  }
}
