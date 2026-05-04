/**
 * NotificationService
 *
 * Encargado de la integración de Firebase Cloud Messaging (FCM) en la app
 * Android:
 *   1. Solicita el permiso al usuario (Android 13+ requiere POST_NOTIFICATIONS).
 *   2. Obtiene el token FCM del dispositivo.
 *   3. Guarda el token en la colección `device_tokens` de Firestore para que
 *      Cloud Functions pueda recuperarlo y enviar la notificación.
 *   4. Escucha refrescos de token (onTokenRefresh) y los persiste también.
 *
 * Autor: Pol — Producto 4 (FP067), parte del Integrante 1.
 *
 * Documentación oficial: https://rnfirebase.io/messaging/usage
 */

import { Platform, PermissionsAndroid } from 'react-native';
import messaging from '@react-native-firebase/messaging';
import {
  getFirestore,
  doc,
  setDoc,
  serverTimestamp,
} from '@react-native-firebase/firestore';

const COLECCION_TOKENS = 'device_tokens';

/**
 * Pide permiso al usuario para recibir notificaciones.
 *
 * En Android 13+ (API 33) hay que pedir explícitamente el permiso
 * POST_NOTIFICATIONS mediante PermissionsAndroid. En versiones anteriores
 * basta con `messaging().requestPermission()`.
 */
export async function pedirPermisoNotificaciones(): Promise<boolean> {
  if (Platform.OS === 'android' && Platform.Version >= 33) {
    const resultado = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS,
    );
    return resultado === PermissionsAndroid.RESULTS.GRANTED;
  }

  const authStatus = await messaging().requestPermission();
  return (
    authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
    authStatus === messaging.AuthorizationStatus.PROVISIONAL
  );
}

/**
 * Guarda el token FCM en Firestore. Usamos el propio token como id del
 * documento — así evitamos duplicados si el usuario reinstala la app y
 * Cloud Functions puede leerlos todos con un `getDocs(collection(...))`.
 */
async function guardarTokenEnFirestore(token: string): Promise<void> {
  const db = getFirestore();
  const referencia = doc(db, COLECCION_TOKENS, token);
  await setDoc(
    referencia,
    {
      token,
      plataforma: Platform.OS,
      actualizado: serverTimestamp(),
    },
    { merge: true },
  );
  console.log('[NotificationService] Token guardado en Firestore');
}

/**
 * Inicializa toda la lógica de notificaciones:
 *  - pide permiso
 *  - obtiene el token y lo guarda
 *  - se suscribe a refrescos de token
 *
 * Devuelve una función `unsubscribe` para cancelar el listener si la app
 * se desmonta.
 */
export async function inicializarNotificaciones(): Promise<() => void> {
  const concedido = await pedirPermisoNotificaciones();
  if (!concedido) {
    console.warn('[NotificationService] Permiso de notificaciones denegado');
    return () => {};
  }

  const token = await messaging().getToken();
  console.log('[NotificationService] Token FCM:', token);
  await guardarTokenEnFirestore(token);

  // Si Firebase rota el token (limpieza de datos, reinstalación, etc.)
  // lo volvemos a persistir para que las Cloud Functions sigan teniendo
  // un destinatario válido.
  const unsubscribe = messaging().onTokenRefresh(async (nuevoToken) => {
    console.log('[NotificationService] Token refrescado:', nuevoToken);
    await guardarTokenEnFirestore(nuevoToken);
  });

  return unsubscribe;
}

/**
 * Listener de mensajes recibidos en primer plano. En Android, cuando la
 * app está abierta, el sistema NO muestra la notificación automáticamente,
 * por lo que se delega aquí su tratamiento (logging, alert, etc.).
 *
 * Devuelve la función para cancelar la suscripción.
 */
export function escucharMensajesEnPrimerPlano(
  callback?: (mensaje: { titulo?: string; cuerpo?: string }) => void,
): () => void {
  return messaging().onMessage(async (mensajeRemoto) => {
    console.log(
      '[NotificationService] Notificación en primer plano:',
      JSON.stringify(mensajeRemoto),
    );
    if (callback) {
      callback({
        titulo: mensajeRemoto.notification?.title,
        cuerpo: mensajeRemoto.notification?.body,
      });
    }
  });
}
