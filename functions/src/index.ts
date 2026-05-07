import { onDocumentWritten, onDocumentUpdated } from "firebase-functions/v2/firestore";
import * as admin from "firebase-admin";

if (admin.apps.length === 0) {
    admin.initializeApp();
}

export const onPlayerCreated = onDocumentWritten("players/{playerId}", async (event) => {
    
    if (!event.data) return;

    if (!event.data.before.exists && event.data.after.exists) {
        
        const nuevoJugador = event.data.after.data();
        const nombreCompleto = `${nuevoJugador?.nombre || "Nuevo"} ${nuevoJugador?.apellidos || "Jugador"}`;

        try {
            const tokensSnapshot = await admin.firestore().collection("fcmTokens").get();
            const tokens: string[] = [];

            tokensSnapshot.forEach((doc) => {
                const data = doc.data();
                if (data.token) {
                    tokens.push(data.token);
                }
            });

            if (tokens.length === 0) {
                console.log("No hay tokens registrados. No se envía notificación.");
                return;
            }

            const newMessage = {
                notification: {
                    title: "🏀 ¡Nuevo Fichaje Confirmado!",
                    body: `Se ha unido a la plantilla: ${nombreCompleto}.`
                },
                tokens: tokens
            };

            const response = await admin.messaging().sendEachForMulticast(newMessage);
            console.log(`¡Éxito! Notificación enviada a ${response.successCount} dispositivos.`);

        } catch (error) {
            console.error("Error enviando la notificación:", error);
        }
    } else {
        console.log("Evento detectado, pero no es una creación.");
    }
});

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
