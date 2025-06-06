"use server";

interface GuestFormData {
  name: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  country: string;
  guestType: string;
  partnerName: string;
  numberOfGuests: number;
  password: string;
  sendInvitation: boolean;
}

export async function addGuestToListAction(guestData: GuestFormData, token: string) {
  const response = await fetch("http://localhost:5000/api/guests", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`, // Utilisation du token passé depuis le client
    },
    body: JSON.stringify(guestData),
  });

  if (!response.ok) {
    const errorMessage = await response.text();
    throw new Error(`Erreur lors de l'ajout de l'invité : ${errorMessage}`);
  }

  return await response.json();
}