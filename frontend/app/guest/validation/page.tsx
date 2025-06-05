"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Heart, Calendar, MapPin, Clock, CheckCircle } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { PageBackground } from "@/components/page-background"

interface CeremonyResponse {
  dot: "attending" | "not-attending" | ""
  civil: "attending" | "not-attending" | ""
}

export default function GuestValidation() {
  const [guestName, setGuestName] = useState("")
  const [responses, setResponses] = useState<CeremonyResponse>({ dot: "", civil: "" })
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  useEffect(() => {
    // Check if user is logged in
    const name = localStorage.getItem("guestName")
    if (!name) {
      router.push("/guest/login")
      return
    }
    setGuestName(name)

    // Load existing responses if any
    const savedResponses = localStorage.getItem("guestResponses")
    if (savedResponses) {
      setResponses(JSON.parse(savedResponses))
      setIsSubmitted(true)
    }
  }, [router])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    // Simulate API call
    setTimeout(() => {
      localStorage.setItem("guestResponses", JSON.stringify(responses))
      setIsSubmitted(true)
      setIsLoading(false)
    }, 1000)
  }

  const handleLogout = () => {
    localStorage.removeItem("guestName")
    localStorage.removeItem("guestPassword")
    localStorage.removeItem("guestResponses")
    router.push("/guest/login")
  }

  if (!guestName) {
    return <div>Chargement...</div>
  }

  return (
    <PageBackground>
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <Heart className="h-16 w-16 text-sage-600 mx-auto mb-4" />
            <h1 className="text-4xl font-bold text-charcoal-800 mb-2 wedding-title">Bienvenue, {guestName} !</h1>
            <p className="text-xl text-charcoal-600">Veuillez confirmer votre présence pour notre jour spécial</p>
          </div>

          {isSubmitted && (
            <Alert className="mb-8 border-sage-200 bg-sage-50">
              <CheckCircle className="h-4 w-4 text-sage-600" />
              <AlertDescription className="text-sage-800">
                Merci ! Vos réponses ont été enregistrées avec succès.
              </AlertDescription>
            </Alert>
          )}

          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Traditional Ceremony (DOT) */}
            <Card className="wedding-card shadow-lg">
              <CardHeader>
                <div className="flex items-center space-x-3">
                  <Calendar className="h-6 w-6 text-sage-600" />
                  <div>
                    <CardTitle className="text-2xl text-charcoal-800">Cérémonie Traditionnelle (DOT)</CardTitle>
                    <CardDescription className="text-charcoal-600">
                      Rejoignez-nous pour notre cérémonie de mariage traditionnelle
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <div className="flex items-center space-x-2">
                      <Calendar className="h-4 w-4 text-charcoal-500" />
                      <span className="font-semibold text-charcoal-700">Date :</span>
                      <span className="text-charcoal-700">Samedi 15 juin 2024</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Clock className="h-4 w-4 text-charcoal-500" />
                      <span className="font-semibold text-charcoal-700">Heure :</span>
                      <span className="text-charcoal-700">14h00 - 17h00</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <MapPin className="h-4 w-4 text-charcoal-500" />
                      <span className="font-semibold text-charcoal-700">Lieu :</span>
                      <span className="text-charcoal-700">Salle Traditionnelle, Centre-ville</span>
                    </div>
                  </div>
                  <div className="bg-cream-50 p-4 rounded-lg border border-cream-200">
                    <h4 className="font-semibold text-charcoal-800 mb-2">À quoi s'attendre :</h4>
                    <ul className="text-sm text-charcoal-700 space-y-1">
                      <li>• Rituels de mariage traditionnels</li>
                      <li>• Spectacles culturels</li>
                      <li>• Tenue traditionnelle recommandée</li>
                      <li>• Rafraîchissements servis</li>
                    </ul>
                  </div>
                </div>

                <div className="space-y-3">
                  <Label className="text-base font-semibold text-charcoal-700">
                    Assisterez-vous à la Cérémonie Traditionnelle ?
                  </Label>
                  <RadioGroup
                    value={responses.dot}
                    onValueChange={(value) =>
                      setResponses({ ...responses, dot: value as "attending" | "not-attending" })
                    }
                    disabled={isSubmitted}
                    className="space-y-3"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="attending" id="dot-yes" className="text-sage-600" />
                      <Label htmlFor="dot-yes" className="cursor-pointer text-charcoal-700">
                        Oui, je serai présent(e)
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="not-attending" id="dot-no" className="text-sage-600" />
                      <Label htmlFor="dot-no" className="cursor-pointer text-charcoal-700">
                        Désolé(e), je ne peux pas assister
                      </Label>
                    </div>
                  </RadioGroup>
                  {responses.dot && (
                    <Badge
                      className={
                        responses.dot === "attending" ? "bg-sage-100 text-sage-800" : "bg-cream-100 text-charcoal-800"
                      }
                    >
                      {responses.dot === "attending" ? "Présent" : "Absent"}
                    </Badge>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Civil Wedding Ceremony */}
            <Card className="wedding-card shadow-lg">
              <CardHeader>
                <div className="flex items-center space-x-3">
                  <Heart className="h-6 w-6 text-sage-600" />
                  <div>
                    <CardTitle className="text-2xl text-charcoal-800">Cérémonie Civile</CardTitle>
                    <CardDescription className="text-charcoal-600">
                      Rejoignez-nous pour notre cérémonie de mariage civile
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <div className="flex items-center space-x-2">
                      <Calendar className="h-4 w-4 text-charcoal-500" />
                      <span className="font-semibold text-charcoal-700">Date :</span>
                      <span className="text-charcoal-700">Dimanche 16 juin 2024</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Clock className="h-4 w-4 text-charcoal-500" />
                      <span className="font-semibold text-charcoal-700">Heure :</span>
                      <span className="text-charcoal-700">11h00 - 15h00</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <MapPin className="h-4 w-4 text-charcoal-500" />
                      <span className="font-semibold text-charcoal-700">Lieu :</span>
                      <span className="text-charcoal-700">Mairie, Rue Principale</span>
                    </div>
                  </div>
                  <div className="bg-cream-50 p-4 rounded-lg border border-cream-200">
                    <h4 className="font-semibold text-charcoal-800 mb-2">À quoi s'attendre :</h4>
                    <ul className="text-sm text-charcoal-700 space-y-1">
                      <li>• Cérémonie officielle</li>
                      <li>• Échange des vœux</li>
                      <li>• Séance photo</li>
                      <li>• Réception déjeuner</li>
                    </ul>
                  </div>
                </div>

                <div className="space-y-3">
                  <Label className="text-base font-semibold text-charcoal-700">
                    Assisterez-vous à la Cérémonie Civile ?
                  </Label>
                  <RadioGroup
                    value={responses.civil}
                    onValueChange={(value) =>
                      setResponses({ ...responses, civil: value as "attending" | "not-attending" })
                    }
                    disabled={isSubmitted}
                    className="space-y-3"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="attending" id="civil-yes" className="text-sage-600" />
                      <Label htmlFor="civil-yes" className="cursor-pointer text-charcoal-700">
                        Oui, je serai présent(e)
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="not-attending" id="civil-no" className="text-sage-600" />
                      <Label htmlFor="civil-no" className="cursor-pointer text-charcoal-700">
                        Désolé(e), je ne peux pas assister
                      </Label>
                    </div>
                  </RadioGroup>
                  {responses.civil && (
                    <Badge
                      className={
                        responses.civil === "attending" ? "bg-sage-100 text-sage-800" : "bg-cream-100 text-charcoal-800"
                      }
                    >
                      {responses.civil === "attending" ? "Présent" : "Absent"}
                    </Badge>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Submit Button */}
            <div className="flex justify-center space-x-4">
              {!isSubmitted ? (
                <Button
                  type="submit"
                  size="lg"
                  className="bg-sage-600 hover:bg-sage-700 text-white px-8"
                  disabled={!responses.dot || !responses.civil || isLoading}
                >
                  {isLoading ? "Enregistrement..." : "Confirmer la Présence"}
                </Button>
              ) : (
                <div className="text-center space-y-4">
                  <p className="text-sage-600 font-semibold">Vos réponses ont été enregistrées !</p>
                  <div className="space-x-4">
                    <Button
                      onClick={() => setIsSubmitted(false)}
                      variant="outline"
                      className="border-sage-300 text-sage-700 hover:bg-sage-50"
                    >
                      Modifier les Réponses
                    </Button>
                    <Button
                      onClick={handleLogout}
                      variant="outline"
                      className="border-cream-300 text-charcoal-700 hover:bg-cream-50"
                    >
                      Se Déconnecter
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </form>

          {/* Footer */}
          <div className="text-center mt-12 space-y-4">
            <p className="text-charcoal-600">
              Nous avons hâte de célébrer avec vous ! Si vous avez des questions, n'hésitez pas à nous contacter.
            </p>
            <div className="flex justify-center space-x-4">
              <Link href="/" className="text-sm text-charcoal-600 hover:text-charcoal-800">
                ← Retour à l'Accueil
              </Link>
            </div>
          </div>
        </div>
      </div>
    </PageBackground>
  )
}
