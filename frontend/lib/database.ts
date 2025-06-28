// types.ts (ou ce que tu veux comme nom)

export interface Guest {
  id: number
  name: string
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
