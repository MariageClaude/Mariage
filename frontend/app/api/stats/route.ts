import { NextResponse } from "next/server"
import { getDb } from "../../../lib/mongodb"

export async function GET() {
  try {
    const db = await getDb()

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
      db.collection("guests").countDocuments(),
      db.collection("guests").countDocuments({ invitation_sent: true }),
      db.collection("ceremony_responses").countDocuments({ ceremony_type: "dot", response: "attending" }),
      db.collection("ceremony_responses").countDocuments({ ceremony_type: "civil", response: "attending" }),
      db.collection("ceremony_responses").countDocuments({ ceremony_type: "dot", response: "not-attending" }),
      db.collection("ceremony_responses").countDocuments({ ceremony_type: "civil", response: "not-attending" }),
      db.collection("ceremony_responses").countDocuments({ response: "pending" }),
    ])

    // Get response breakdown by ceremony
    const responseBreakdown = await db.collection("ceremony_responses").aggregate([
      {
        $group: {
          _id: { ceremony_type: "$ceremony_type", response: "$response" },
          count: { $sum: 1 }
        }
      },
      {
        $sort: { "_id.ceremony_type": 1, "_id.response": 1 }
      }
    ]).toArray()

    // Get recent activity
    const recentActivity = await db.collection("ceremony_responses").aggregate([
      { $match: { response: { $ne: "pending" } } },
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
          guest_name: "$guest.name",
          guest_email: "$guest.email",
          ceremony_type: 1,
          response: 1,
          response_date: 1
        }
      },
      { $sort: { response_date: -1 } },
      { $limit: 10 }
    ]).toArray()

    const stats = {
      totalGuests,
      invitationsSent,
      ceremonies: {
        dot: {
          attending: dotAttending,
          notAttending: dotNotAttending,
        },
        civil: {
          attending: civilAttending,
          notAttending: civilNotAttending,
        },
      },
      pendingResponses,
      responseBreakdown,
      recentActivity,
    }

    return NextResponse.json({ stats })
  } catch (error) {
    console.error("Error fetching stats:", error)
    return NextResponse.json({ error: "Failed to fetch statistics" }, { status: 500 })
  }
}
