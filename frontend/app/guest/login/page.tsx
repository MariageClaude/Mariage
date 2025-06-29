"use client";

import type React from "react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Heart, Lock, Eye, EyeOff } from "lucide-react";
import Link from "next/link";
import { PageBackground } from "@/components/page-background";

export default function GuestLogin() {
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const response = await fetch("https://mariageback.onrender.com/api/guests/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, password }),
      });

      if (!response.ok) {
        const { error } = await response.json();
        throw new Error(error || "Échec de la connexion");
      }

      const { message, guest } = await response.json();
      localStorage.setItem("guestName", guest.name);
      localStorage.setItem("guestId", guest._id);

      alert(message);
      router.push("/guest/validation");
    } catch (error) {
      setError(error instanceof Error ? error.message : "Une erreur est survenue.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <PageBackground>
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <Link href="/" className="inline-block">
              <Heart className="h-12 w-12 text-sage-600 mx-auto mb-4" />
            </Link>
            
          </div>

          <Card className="wedding-card shadow-lg">
            <h1 className="text-3xl font-bold text-charcoal-800 mb-2 wedding-title">Bienvenue</h1>
            <CardHeader className="text-center">
              <div className="mx-auto w-12 h-12 bg-cream-100 rounded-full flex items-center justify-center mb-4">
                <Lock className="h-6 w-6 text-sage-600" />
              </div>
              <CardTitle className="text-charcoal-800">Connexion Invité</CardTitle>
              <CardDescription className="text-charcoal-600">
                Entrez votre nom et le mot de passe unique pour accéder à la validation.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleLogin} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-charcoal-700">
                    Nom
                  </Label>
                  <Input
                    id="name"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Entrez votre nom"
                    required
                    className="border-cream-300 focus:border-sage-500"
                  />
                </div>
                <div className="space-y-2 relative">
                  <Label htmlFor="password" className="text-charcoal-700">
                    Mot de Passe
                  </Label>
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Entrez le mot de passe unique"
                    required
                    className="border-cream-300 focus:border-sage-500"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-3 flex items-center text-black bg-transparent focus:outline-none translate-y-1"
                    aria-label={showPassword ? "Masquer le mot de passe" : "Afficher le mot de passe"}
                  >
                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>

                {error && (
                  <Alert className="border-red-200 bg-red-50">
                    <AlertDescription className="text-red-800">{error}</AlertDescription>
                  </Alert>
                )}
                <Button
                  type="submit"
                  className="w-full bg-primary hover:bg-primary/80 text-white"
                  disabled={isLoading}
                >
                  {isLoading ? "Connexion..." : "Se Connecter"}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </PageBackground>
  );
}
