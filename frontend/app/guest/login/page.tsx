"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Heart, Lock } from "lucide-react"
import Link from "next/link"
import { PageBackground } from "@/components/page-background"

export default function GuestLogin() {
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  // Mock guest data - in real app, this would come from API
  const mockGuests = [
    { password: "mariage2024", name: "Jean Dupont" },
    { password: "celebration123", name: "Marie Martin" },
  ]

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    // Simulate API call
    setTimeout(() => {
      const guest = mockGuests.find((g) => g.password === password)

      if (guest) {
        // Store guest info in localStorage (in real app, use proper auth)
        localStorage.setItem("guestName", guest.name)
        localStorage.setItem("guestPassword", password)
        router.push("/guest/validation")
      } else {
        setError("Mot de passe invalide. Veuillez vérifier votre email d'invitation pour le mot de passe correct.")
      }
      setIsLoading(false)
    }, 1000)
  }

  return (
    <PageBackground>
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <Link href="/" className="inline-block">
              <Heart className="h-12 w-12 text-sage-600 mx-auto mb-4" />
            </Link>
            <h1 className="text-3xl font-bold text-charcoal-800 mb-2 wedding-title">Bienvenue Invité(e)</h1>
            <p className="text-charcoal-600">Entrez votre mot de passe d'invitation pour continuer</p>
          </div>

          <Card className="wedding-card shadow-lg">
            <CardHeader className="text-center">
              <div className="mx-auto w-12 h-12 bg-cream-100 rounded-full flex items-center justify-center mb-4">
                <Lock className="h-6 w-6 text-sage-600" />
              </div>
              <CardTitle className="text-charcoal-800">Connexion Invité</CardTitle>
              <CardDescription className="text-charcoal-600">
                Utilisez le mot de passe fourni dans votre email d'invitation
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleLogin} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="password" className="text-charcoal-700">
                    Mot de Passe d'Invitation
                  </Label>
                  <Input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Entrez votre mot de passe d'invitation"
                    required
                    className="border-cream-300 focus:border-sage-500"
                  />
                </div>

                {error && (
                  <Alert className="border-red-200 bg-red-50">
                    <AlertDescription className="text-red-800">{error}</AlertDescription>
                  </Alert>
                )}

                <Button type="submit" className="w-full bg-sage-600 hover:bg-sage-700 text-white" disabled={isLoading}>
                  {isLoading ? "Connexion..." : "Se connecter"}
                </Button>
              </form>

              <div className="mt-6 text-center">
                <p className="text-sm text-charcoal-600">
                  Vous n'avez pas de mot de passe d'invitation ?{" "}
                  <span className="text-sage-600">Contactez les organisateurs du mariage</span>
                </p>
              </div>

              <div className="mt-4 p-4 bg-cream-50 rounded-lg border border-cream-200">
                <p className="text-xs text-charcoal-600 mb-2">Mots de passe de démonstration pour les tests :</p>
                <div className="space-y-1">
                  <code className="block text-xs bg-white px-2 py-1 rounded border border-cream-200">mariage2024</code>
                  <code className="block text-xs bg-white px-2 py-1 rounded border border-cream-200">
                    celebration123
                  </code>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="text-center mt-6">
            <Link href="/" className="text-sm text-charcoal-600 hover:text-charcoal-800">
              ← Retour à l'Accueil
            </Link>
          </div>
        </div>
      </div>
    </PageBackground>
  )
}
