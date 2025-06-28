"use server";

export async function deleteGuestAction(guestId: string, token: string) {
  try {
    const response = await fetch(`http://localhost:5000/api/guests/${guestId}`, { // Supprime `/id/` pour correspondre à l'API
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const errorMessage = await response.text();
      throw new Error(`Erreur lors de la suppression de l'invité : ${errorMessage}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Erreur dans deleteGuestAction :", error);
    throw error;
  }
}