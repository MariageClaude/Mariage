import { MongoClient, Db } from "mongodb"

const uri = process.env.DATABASE_URL as string
const dbName = "tonNomDeDB" // Remplace par le nom de ta base

let client: MongoClient | null = null

export async function getDb(): Promise<Db> {
  if (!client) {
    client = new MongoClient(uri)
    await client.connect()
  }
  return client.db(dbName)
}