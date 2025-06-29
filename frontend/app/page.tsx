import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Heart, Users, Calendar, Mail, Play } from "lucide-react"
import { PageBackground } from "@/components/page-background"

export default function HomePage() {
  return (
    <PageBackground overlayOpacity={0.3}>
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <div className="flex justify-center mb-6">
            <div className="relative">
              <Heart className="h-16 w-16 text-primary animate-pulse" />
              <div className="absolute inset-0 h-16 w-16 text-primary/40 animate-ping">
                <Heart className="h-16 w-16" />
              </div>
            </div>
          </div>
          <h1 className="text-5xl md:text-7xl font-bold text-primary mb-4 wedding-title drop-shadow-lg">
            Réservez la Date
          </h1>
          <div className="text-3xl md:text-4xl font-light text-primary/80 mb-6 wedding-title">Cedric & Claude</div>
          <p className="text-xl text-primary/70 max-w-2xl mx-auto drop-shadow-sm">
            Nous vous invitons à célébrer notre jour spécial avec nous
          </p>
          <div className="mt-6 text-lg text-primary/80 font-medium">Juillet 2025</div>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          <Card className="wedding-card shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105">
            <CardHeader className="text-center">
              <Users className="h-12 w-12 text-primary mx-auto mb-4" />
              <CardTitle className="text-2xl text-primary">Portail Administrateur</CardTitle>
              <CardDescription className="text-primary/70">
                Gérez les invités, envoyez les invitations et suivez les réponses
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <ul className="space-y-2 text-primary/80">
                <li className="flex items-center">
                  <Users className="h-4 w-4 mr-2 text-primary" />
                  Gérer la liste des invités
                </li>
                <li className="flex items-center">
                  <Calendar className="h-4 w-4 mr-2 text-primary" />
                  Suivre les réponses aux cérémonies
                </li>
              </ul>
              <Link href="/admin/login" className="block">
                <Button className="w-full bg-primary hover:bg-primary/80 text-primary-foreground shadow-lg hover:shadow-xl transition-all duration-300">
                  Accéder au Portail Admin
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card className="wedding-card shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105">
            <CardHeader className="text-center">
              <Heart className="h-12 w-12 text-primary mx-auto mb-4" />
              <CardTitle className="text-2xl text-primary">Connexion Invité</CardTitle>
              <CardDescription className="text-primary/70">
                Confirmez votre présence aux cérémonies de mariage
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <ul className="space-y-2 text-primary/80">
                <li className="flex items-center">
                  <Calendar className="h-4 w-4 mr-2 text-primary" />
                 Cérémonie civile
                </li>
                 <li className="flex items-center">
                  <Calendar className="h-4 w-4 mr-2 text-primary" />
                 Benediction nuptiale
                </li>
                <li className="flex items-center">
                  <Calendar className="h-4 w-4 mr-2 text-primary" />
                   Cérémonie traditionnelle (DOT)
                </li>
                <li className="flex items-center">
                  <Heart className="h-4 w-4 mr-2 text-primary" />
                  Confirmer votre présence
                </li>
              </ul>
              <Link href="/guest/login" className="block">
                <Button className="w-full bg-primary hover:bg-primary/80 text-primary-foreground shadow-lg hover:shadow-xl transition-all duration-300">
                  Connexion Invité
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>

        <div className="text-center mt-16">
          <div className="bg-white/80 backdrop-blur-sm rounded-lg p-6 max-w-md mx-auto shadow-lg">
            <p className="text-primary italic text-lg mb-2">
              "Deux âmes avec une seule pensée, deux cœurs qui battent à l'unisson."
            </p>
            <p className="text-primary/80 font-medium">Rejoignez-nous pour notre célébration d'amour</p>
          </div>
        </div>

       
      </div>
    </PageBackground>
  )
}
