"use client";
import { deleteGuestAction } from "@/app/actions/deleteGuestAction";
import { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Plus, Mail, Users, Calendar, Trash2, Edit } from "lucide-react";
import { PageBackground } from "@/components/page-background";

interface Guest {
  id: string;
  name: string;
  email: string;
  phone?: string;
  address?: string;
  plainPassword: string; 
  password: string;
  invitationSent: boolean;
  dotResponse: "pending" | "attending" | "not-attending";
  civilResponse: "pending" | "attending" | "not-attending";
  NightResponse: "pending" | "attending" | "not-attending";
  createdAt: string;
}

export default function AdminDashboard() {
  const [guests, setGuests] = useState<Guest[]>([]);

  useEffect(() => {
    const fetchGuests = async () => {
      try {
        const response = await fetch("https://mariageclaude-lqdj.onrender.com", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("adminToken")}`,
          },
        });

        if (!response.ok) {
          throw new Error("Erreur lors de la récupération des invités");
        }

        const data = await response.json();
        console.log("Invités récupérés :", data);

        // Mappez les données pour inclure un champ `id` basé sur `_id`
        const mappedGuests = data.map((guest: any) => ({
          ...guest,
          id: guest._id, // Transforme `_id` en `id`
        }));

        setGuests(mappedGuests);
      } catch (error) {
        console.error("Erreur :", error);
      }
    };

    fetchGuests();
  }, []);

  const addGuestToList = (newGuest: Guest) => {
    setGuests((prevGuests) => {
      const updatedGuests = [...prevGuests, newGuest];
      console.log("Liste des invités mise à jour :", updatedGuests);
      return updatedGuests;
    });
  };

  const getResponseBadge = (response: string) => {
    switch (response) {
      case "attending":
        return <Badge className="bg-primary/10 text-primary">Présent</Badge>;
      case "not-attending":
        return <Badge className="bg-red-100 text-red-600">Absent</Badge>;
      default:
        return <Badge variant="outline" className="border-primary text-primary">En attente</Badge>;
    }
  };

  const stats = {
    totalGuests: guests.length,
    invitationsSent: guests.filter((g) => g.invitationSent).length,
    dotAttending: guests.filter((g) => g.dotResponse === "attending").length,
    civilAttending: guests.filter((g) => g.civilResponse === "attending").length,
    NightAttending: guests.filter((g) => g.NightResponse === "attending").length,
  };

  const handleSendInvitation = async (guestId: string) => {
    try {
      const response = await fetch(`https://mariageback.onrender.com/api/guests/${guestId}/send-invitation`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("adminToken")}`,
        },
      });

      if (!response.ok) {
        throw new Error("Erreur lors de l'envoi de l'invitation");
      }

      const updatedGuest = await response.json();
      setGuests((prevGuests) =>
        prevGuests.map((guest) => (guest.id === guestId ? updatedGuest : guest))
      );
    } catch (error) {
      console.error("Erreur :", error);
      alert("Une erreur est survenue lors de l'envoi de l'invitation.");
    }
  };

  const handleDeleteGuest = async (guestId: string) => {
    try {
      console.log("ID de l'invité à supprimer :", guestId);

      const response = await fetch(`https://mariageback.onrender.com/api/guests/${guestId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("adminToken")}`,
        },
      });

      if (!response.ok) {
        const errorMessage = await response.text();
        throw new Error(`Erreur lors de la suppression de l'invité : ${errorMessage}`);
      }

      const result = await response.json();
      console.log("Réponse du backend :", result);

      // Mettre à jour la liste locale des invités
      setGuests((prevGuests) => prevGuests.filter((guest) => guest.id !== guestId));
    } catch (error) {
      console.error("Erreur :", error);
      alert("Une erreur est survenue lors de la suppression de l'invité.");
    }
  };

  return (
    <PageBackground>
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-primary wedding-title">Tableau de Bord Admin</h1>
            <p className="text-primary/80">Gérez vos invitations de mariage</p>
          </div>
          <Link href="/">
            <Button variant="outline" className="border-primary text-primary hover:bg-primary/10">
              Retour à l'Accueil
            </Button>
          </Link>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="wedding-card">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-primary">Total Invités</CardTitle>
              <Users className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-primary">{stats.totalGuests}</div>
            </CardContent>
          </Card>
          <Card className="wedding-card">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-primary">Cérémonie DOTE</CardTitle>
              <Calendar className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-primary">{stats.dotAttending}</div>
              <p className="text-xs text-primary/70">présents</p>
            </CardContent>
          </Card>
          <Card className="wedding-card">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-primary">Cérémonie Civile</CardTitle>
              <Calendar className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-primary">{stats.civilAttending}</div>
              <p className="text-xs text-primary/70">présents</p>
            </CardContent>
          </Card>
          <Card className="wedding-card">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-primary">Cérémonie nuxiale</CardTitle>
              <Calendar className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-primary">{stats.NightAttending}</div>
              <p className="text-xs text-primary/70">présents</p>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="guests" className="space-y-6">
          <TabsList className="bg-primary/10">
            <TabsTrigger value="guests" className="data-[state=active]:bg-white data-[state=active]:text-primary">
              Gestion des Invités
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="guests" className="space-y-6">
            <Card className="wedding-card">
              <CardHeader>
              <div className="flex justify-between items-center">
                  <div>
                    <CardTitle className="text-primary">Liste des Invités</CardTitle>
                    <CardDescription className="text-primary/80">Gérez vos invités de mariage</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="text-primary">Nom</TableHead>
                        <TableHead className="text-primary">Réponse DOT</TableHead>
                        <TableHead className="text-primary">Réponse Civile</TableHead>
                        <TableHead className="text-primary">Réponse Céremonie de nuit</TableHead>
                        <TableHead className="text-primary">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {guests.map((guest) => (
                        <TableRow key={guest.id}>
                          <TableCell className="font-medium text-primary">{guest.name}</TableCell>
                          <TableCell>{getResponseBadge(guest.dotResponse)}</TableCell>
                          <TableCell>{getResponseBadge(guest.civilResponse)}</TableCell>
                          <TableCell>{getResponseBadge(guest.NightResponse)}</TableCell>
                          <TableCell>
                            <div className="flex space-x-2">
                              <Button
                                size="sm"
                                variant="outline"
                                className="border-primary text-primary hover:bg-primary/10"
                                title="Supprimer"
                                onClick={() => {
                                  if (confirm("Êtes-vous sûr de vouloir supprimer cet invité ?")) {
                                    console.log("ID invité :", guest.id); // Vérifiez que `guest.id` est défini
                                    handleDeleteGuest(guest.id);
                                  }
                                }}
                              >
                                <Trash2 className="h-4 w-4 text-red-600" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="invitations" className="space-y-6">
            <Card className="wedding-card">
              <CardHeader>
                <CardTitle className="text-primary">Aperçu de l'Invitation</CardTitle>
                <CardDescription className="text-primary/80">
                  Aperçu de l'email d'invitation envoyé aux invités
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="border border-primary/20 rounded-lg p-6 bg-white">
                  <div className="text-center mb-6">
                    <h2 className="text-2xl font-bold text-primary mb-2 wedding-title">Vous êtes invité(e) !</h2>
                    <p className="text-primary/80">Rejoignez-nous pour notre jour spécial</p>
                  </div>
                  <div className="space-y-4">
                    <p className="text-primary">Cher(e) invité(e),</p>
                    <p className="text-primary">
                      Nous sommes ravis de vous inviter à célébrer notre mariage ! Veuillez utiliser les identifiants
                      suivants pour accéder à votre invitation et confirmer votre présence.
                    </p>
                    <div className="bg-primary/5 p-4 rounded-lg border border-primary/20">
                      <p className="font-semibold text-primary">Détails de connexion :</p>
                      <p className="text-primary">
                        Site web : <span className="text-primary">votremariage.com/guest/login</span>
                      </p>
                      <p className="text-primary">
                        Mot de passe :{" "}
                        <code className="bg-primary/10 px-2 py-1 rounded text-primary">votre-mot-de-passe</code>
                      </p>
                    </div>
                    <p className="text-primary">Veuillez confirmer votre présence pour les deux cérémonies :</p>
                    <ul className="list-disc list-inside text-primary ml-4">
                      <li>Cérémonie traditionnelle (DOT)</li>
                      <li>Cérémonie civile</li>
                    </ul>
                    <p className="text-primary">Nous avons hâte de célébrer avec vous !</p>
                    <p className="text-primary">
                      Avec amour,
                      <br />
                      Cedric & Claude
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </PageBackground>
  );
}
