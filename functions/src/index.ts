import { onDocumentUpdated } from "firebase-functions/v2/firestore";
import * as admin from "firebase-admin";

if (admin.apps.length === 0) {
    admin.initializeApp();
}

export const onPlayerUpdated = onDocumentUpdated("players/{playerId}", async (event) => {
    

    if (!event.data) return;

    const before = event.data.before.data();
    const after = event.data.after.data();

    if (before.precio !== after.precio) {

        const namePlayer = `${after.nombre} ${after.apellidos}`; 

        const message = {
            notification: {
                title: "¡Precio actualizado!",
                body: `El precio del jugador ${namePlayer} ha sido subido a ${after.precio.toLocaleString()}.`
            },
            topic: "jugadores"
        };

        try {
            await admin.messaging().send(message);
            console.log("Notificación enviada con éxito al topic: jugadores");
        } catch (error) {
            console.error("Error al enviar la notificación:", error);
        }

    } else {
        console.log("Se modificaron otros datos no relevantes, no se envió notificación.");
    }
});