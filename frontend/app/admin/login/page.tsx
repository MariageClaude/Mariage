"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Heart } from "lucide-react"
import { PageBackground } from "@/components/page-background"

export default function AdminLoginPage() {
  const router = useRouter()
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setIsSubmitting(true)

    try {
      const response = await fetch("https://mariageback.onrender.com", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      })

      if (!response.ok) {
        throw new Error("Nom d'utilisateur ou mot de passe incorrect")
      }

      const data = await response.json()
      console.log("Token reçu :", data.token) // Vérifiez que le token est bien reçu
      localStorage.setItem("adminToken", data.token) // Stocker le token JWT
      console.log("Token stocké dans localStorage :", localStorage.getItem("adminToken")) // Vérifiez le stockage
      alert("Connexion réussie !")
      router.push("/admin") // Rediriger vers le tableau de bord
    } catch (error) {
      console.error("Erreur de connexion :", error)
      setError("Nom d'utilisateur ou mot de passe incorrect")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <PageBackground>
      <div className="min-h-screen flex items-center justify-center p-4">
        <Card className="wedding-card max-w-md w-full shadow-xl">
          <CardHeader className="text-center">
            <Heart className="h-10 w-10 text-primary mx-auto mb-2" />
            <CardTitle className="text-2xl text-charcoal-800">Connexion Admin</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="username" className="text-charcoal-700">
                  Nom d'utilisateur
                </Label>
                <Input
                  id="username"
                  type="text"
                  autoComplete="username"
                  value={username}
                  onChange={e => setUsername(e.target.value)}
                  placeholder="admin"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password" className="text-charcoal-700">
                  Mot de passe
                </Label>
                <Input
                  id="password"
                  type="password"
                  autoComplete="current-password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="Mot de passe"
                  required
                />
              </div>
              {error && <p className="text-red-600 text-sm">{error}</p>}
              <Button
                type="submit"
                className="w-full bg-primary hover:bg-primary/80 text-primary-foreground"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Connexion..." : "Se connecter"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </PageBackground>
  )
}