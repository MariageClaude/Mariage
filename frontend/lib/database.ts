import { neon } from "@neondatabase/serverless"

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL environment variable is required")
}

export const sql = neon(process.env.DATABASE_URL)

// Database types
export interface Guest {
  id: number
  name: string
  email: string
  phone?: string
  address?: string
  city?: string
  country?: string
  guest_type: "individual" | "couple" | "family"
  partner_name?: string
  number_of_guests: number
  dietary_restrictions?: string
  special_requests?: string
  password: string
  invitation_sent: boolean
  invitation_sent_at?: Date
  created_at: Date
  updated_at: Date
}

export interface CeremonyResponse {
  id: number
  guest_id: number
  ceremony_type: "dot" | "civil"
  response: "attending" | "not-attending" | "pending"
  response_date: Date
  notes?: string
}

export interface InvitationLog {
  id: number
  guest_id: number
  sent_at: Date
  email_status: "sent" | "delivered" | "failed" | "bounced"
  email_provider_id?: string
  error_message?: string
}

export interface AdminUser {
  id: number
  email: string
  password_hash: string
  name: string
  role: "admin" | "super_admin"
  created_at: Date
  last_login?: Date
}

// Database helper functions
export async function testConnection() {
  try {
    const result = await sql`SELECT 1 as test`
    return result.length > 0
  } catch (error) {
    console.error("Database connection failed:", error)
    return false
  }
}
