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
  
  civil: "attending" | "not-attending" | ""
}

export default function GuestValidation() {
  const [guestName, setGuestName] = useState("")
  const [responses, setResponses] = useState<CeremonyResponse>({  civil: "" })
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
      setIsSubmitted(false)
    }
  }, [router])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const guestId = localStorage.getItem("guestId");
      if (!guestId) {
        throw new Error("Guest ID not found");
      }

      const response = await fetch(`https://mariageback.onrender.com/api/guests/${guestId}/responses`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          civilResponse: responses.civil,
        }),
      });

      if (!response.ok) {
        const { error } = await response.json();
        throw new Error(error || "Failed to update responses");
      }

      const { message } = await response.json();
      alert(message); // Show success message
      setIsSubmitted(true); // Mark as submitted
    } catch (error) {
      console.error("Error updating responses:", error);
      alert(error instanceof Error ? error.message : "An error occurred.");
    } finally {
      setIsLoading(false);
    }
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
    <div className="background min-h-screen">
      <div className="content">
        <div className="container mx-auto px-4 py-8 md:py-16">
          <div className="max-w-4xl mx-auto">
            {/* Header */}
            <div className="text-center mb-8">
              <Heart className="h-12 w-12 md:h-16 md:w-16 text-sage-600 mx-auto mb-4" />
              <h1
                className="text-2xl sm:text-3xl md:text-4xl font-bold mb-2 wedding-title text-primary"
                style={{ fontStyle: "Bold" }}
              >
                Bienvenue, {guestName} !
              </h1>
              <p
                className="text-lg sm:text-xl md:text-2xl font-bold mb-2 wedding-title text-charcoal-800"
                style={{ fontStyle: "Bold" }}
              >
                Veuillez confirmer votre présence pour notre jour spécial
              </p>
            </div>

            {/* Alert */}
            {isSubmitted && (
              <Alert className="mb-8 border-sage-200 bg-sage-50">
                <CheckCircle className="h-4 w-4 text-sage-600" />
                <AlertDescription className="text-sage-800">
                  Merci ! Vos réponses ont été enregistrées avec succès.
                </AlertDescription>
              </Alert>
            )}

            <form onSubmit={handleSubmit} className="space-y-8">
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
                        <span className="text-charcoal-700">Samedi 26 Juillet 2025</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Clock className="h-4 w-4 text-charcoal-500" />
                        <span className="font-semibold text-charcoal-700">Heure :</span>
                        <span className="text-charcoal-700">09h00</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <MapPin className="h-4 w-4 text-charcoal-500" />
                        <span className="font-semibold text-charcoal-700">Lieu :</span>
                        <span className="text-charcoal-700">Mairie de bandjoun</span>
                      </div>
                    </div>
                    <div className="bg-cream-50 p-4 rounded-lg border border-cream-200">
                      <h4 className="font-semibold text-charcoal-800 mb-2">À quoi s'attendre :</h4>
                      <ul className="text-sm text-charcoal-700 space-y-1">
                        <li>• Cérémonie officielle</li>
                        <li>• Échange des vœux</li>
                        <li>• Séance photo</li>
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
                     // Disable the input if responses are submitted
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
              <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
                {/* Show "Confirmer votre Réponse" button only when not submitted */}
                {!isSubmitted && (
                  <Button
                    type="submit"
                    size="lg"
                    className="w-full sm:w-auto bg-primary hover:bg-primary/80 text-white px-6 py-3 rounded-lg"
                    disabled={!responses.civil || isLoading}
                  >
                    {isLoading ? "Enregistrement..." : "Confirmer votre Réponse"}
                  </Button>
                )}
                {/* Show "Modifier votre Réponse" and "Se Déconnecter" buttons only after submission */}
                {isSubmitted && (
                  <div className="flex flex-col sm:flex-row items-center gap-4">
                    <Button
                      onClick={() => setIsSubmitted(false)} // Reset submission state
                      variant="outline"
                      className="w-full sm:w-auto border-sage-300 text-sage-700 hover:bg-sage-50"
                    >
                      Modifier votre Réponse
                    </Button>
                    
                  </div>
                )}
              </div>

              {/* Responsive Link Button */}
              <div className="text-center mt-8">
                <Link href="/guest/validationdot" className="block">
                  <Button className="w-full sm:w-auto bg-primary hover:bg-primary/80 text-white px-6 py-3 rounded-lg">
                    Aller à la page DOT
                  </Button>
                </Link>
              </div>
            </form>

            {/* Footer */}
            <div className="text-center mt-12 space-y-4">
              <p className="text-base sm:text-lg md:text-xl font-bold text-charcoal-800 mb-2 wedding-title">
                Nous avons hâte de célébrer avec vous ! Si vous avez des questions, n'hésitez pas à nous contacter.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
    </PageBackground>
  )
}
