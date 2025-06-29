import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"
import { sql } from "./database"
import type { AdminUser } from "./database"

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key"

export interface AuthUser {
  id: number
  email: string
  name: string
  role: string
}

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 10)
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash)
}

export async function authenticateAdmin(email: string, password: string): Promise<AuthUser | null> {
  try {
    const users = (await sql`
      SELECT * FROM admin_users 
      WHERE email = ${email}
    `) as AdminUser[]

    if (users.length === 0) {
      return null
    }

    const user = users[0]
    const isValid = await verifyPassword(password, user.password_hash)

    if (!isValid) {
      return null
    }

    // Update last login
    await sql`
      UPDATE admin_users 
      SET last_login = CURRENT_TIMESTAMP 
      WHERE id = ${user.id}
    `

    return {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
    }
  } catch (error) {
    console.error("Authentication error:", error)
    return null
  }
}

export async function authenticateGuest(password: string): Promise<{ id: number; name: string; email: string } | null> {
  try {
    const guests = await sql`
      SELECT id, name, email FROM guests 
      WHERE password = ${password}
    `

    if (guests.length === 0) {
      return null
    }

    return guests[0] as { id: number; name: string; email: string }
  } catch (error) {
    console.error("Guest authentication error:", error)
    return null
  }
}

export function generateToken(user: AuthUser): string {
  return jwt.sign(
    {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
    },
    JWT_SECRET,
    { expiresIn: "24h" },
  )
}

export function verifyToken(token: string): AuthUser | null {
  try {
    return jwt.verify(token, JWT_SECRET) as AuthUser
  } catch (error) {
    return null
  }
}
