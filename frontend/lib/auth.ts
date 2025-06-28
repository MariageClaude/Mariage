import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"
import { ObjectId } from "mongodb"
import { getDb } from "./mongodb"

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key"

export interface AuthUser {
  id: string
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
    const db = await getDb()
    const user = await db.collection("admin_users").findOne({ email })

    if (!user) {
      return null
    }

    const isValid = await verifyPassword(password, user.password_hash)
    if (!isValid) {
      return null
    }

    // Update last login
    await db.collection("admin_users").updateOne(
      { _id: user._id },
      { $set: { last_login: new Date() } }
    )

    return {
      id: user._id.toString(),
      email: user.email,
      name: user.name,
      role: user.role,
    }
  } catch (error) {
    console.error("Authentication error:", error)
    return null
  }
}

export async function authenticateGuest(password: string): Promise<{ id: string; name: string; email: string } | null> {
  try {
    const db = await getDb()
    const guest = await db.collection("guests").findOne({ password })

    if (!guest) {
      return null
    }

    return {
      id: guest._id.toString(),
      name: guest.name,
      email: guest.email,
    }
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
