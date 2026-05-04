# Producto 4 — Integrante 1 (Pol)

**Alcance asignado**: configuración completa del ecosistema Android (React Native): permisos, integración de Firebase Cloud Messaging, registro del token del dispositivo en Firestore y manejo de notificaciones en primer y segundo plano.

> Este documento cubre únicamente la parte del Integrante 1. El resto de partes (web Angular, Cloud Functions `onWrite` y `onUpdate`) las documentan los demás miembros del equipo.

---

## 1. Creación de la app Android en Firebase

1. En la consola de Firebase, dentro del proyecto compartido del Producto 2, se añade una nueva app de tipo **Android**.
2. Como `applicationId` se utiliza el ya configurado en `android/app/build.gradle`: `com.producto3`.
3. Firebase genera el archivo `google-services.json`, que se descarga y se coloca en `app-react-native/android/app/google-services.json`.

> El archivo `google-services.json` no se sube al repositorio porque cada miembro debe descargarlo desde la consola de Firebase con su propia configuración local. Dentro del repo ya está aplicado el plugin `com.google.gms.google-services` en `android/app/build.gradle` y la dependencia `classpath("com.google.gms:google-services:4.4.1")` en `android/build.gradle`, por lo que basta con añadir el archivo descargado para que la app se enlace correctamente.

## 2. Instalación de la librería de mensajería

Se añade el paquete `@react-native-firebase/messaging` (misma versión que el resto de paquetes de `@react-native-firebase`):

```bash
npm install @react-native-firebase/messaging@^24.0.0
```

Queda reflejado en [`app-react-native/package.json`](../app-react-native/package.json):

```json
"@react-native-firebase/messaging": "^24.0.0"
```

## 3. Permisos en `AndroidManifest.xml`

Para que Android 13+ (API 33) permita mostrar notificaciones, hay que declarar el permiso `POST_NOTIFICATIONS`. Además, registramos un canal de notificaciones por defecto para que FCM no rechace los mensajes en Android 8+:

```xml
<uses-permission android:name="android.permission.INTERNET" />
<uses-permission android:name="android.permission.POST_NOTIFICATIONS" />

<!-- ... -->

<meta-data
  android:name="com.google.firebase.messaging.default_notification_channel_id"
  android:value="default_channel" />
```

Archivo: [`android/app/src/main/AndroidManifest.xml`](../app-react-native/android/app/src/main/AndroidManifest.xml).

## 4. Servicio de notificaciones

Toda la lógica relacionada con FCM se ha encapsulado en [`src/services/NotificationService.ts`](../app-react-native/src/services/NotificationService.ts):

- `pedirPermisoNotificaciones()`: usa `PermissionsAndroid` en Android 13+ y `messaging().requestPermission()` en versiones anteriores / iOS.
- `inicializarNotificaciones()`:
  1. solicita el permiso al usuario;
  2. obtiene el token FCM con `messaging().getToken()`;
  3. lo guarda en Firestore en la colección `device_tokens`;
  4. se suscribe a `onTokenRefresh` para volver a guardarlo si el dispositivo lo rota.
- `escucharMensajesEnPrimerPlano(callback)`: con `messaging().onMessage(...)` recibe las notificaciones cuando la app está abierta y dispara un `Alert.alert` con el título y el cuerpo (Android no las muestra automáticamente en este caso).

El token se guarda en Firestore usando el propio token como id de documento, lo que evita duplicados:

```ts
await setDoc(doc(db, 'device_tokens', token), {
  token,
  plataforma: Platform.OS,
  actualizado: serverTimestamp(),
}, { merge: true });
```

Esta colección `device_tokens` es la que leerán las Cloud Functions de los Integrantes 3 y 4 para enviar las notificaciones.

## 5. Handler de segundo plano (`index.js`)

`@react-native-firebase/messaging` exige que el handler de mensajes en segundo plano se registre antes de que arranque la app de React. Por eso se añade en [`index.js`](../app-react-native/index.js):

```js
messaging().setBackgroundMessageHandler(async (mensajeRemoto) => {
  console.log('[FCM][background] Mensaje recibido:', JSON.stringify(mensajeRemoto));
});
```

Cuando la app está cerrada o en segundo plano, Android muestra automáticamente la notificación si trae el campo `notification`. Este handler simplemente registra el mensaje recibido para tareas adicionales (analytics, sincronización, etc.).

## 6. Integración en `App.tsx`

Dentro del componente raíz se inicializa el servicio en un `useEffect`:

```tsx
useEffect(() => {
  let cancelarRefresh: (() => void) | undefined;
  const cancelarPrimerPlano = escucharMensajesEnPrimerPlano(({ titulo, cuerpo }) => {
    Alert.alert(titulo ?? 'Notificación', cuerpo ?? '');
  });

  inicializarNotificaciones().then((unsubscribe) => {
    cancelarRefresh = unsubscribe;
  });

  return () => {
    cancelarPrimerPlano();
    cancelarRefresh?.();
  };
}, []);
```

Al desmontarse el componente se cancelan las suscripciones a `onMessage` y `onTokenRefresh`.

## 7. Cómo probar

1. Ejecutar la app en un dispositivo Android real (los emuladores sin Google Play no reciben FCM):
   ```bash
   cd app-react-native
   npm install
   npm run android
   ```
2. Aceptar el pop-up de notificaciones cuando aparezca.
3. En los logs (`adb logcat *:S ReactNative:V ReactNativeJS:V` o la ventana del Metro) aparece:
   ```
   [NotificationService] Token FCM: <token>
   [NotificationService] Token guardado en Firestore
   ```
4. Verificar en la consola de Firebase → Firestore → colección `device_tokens` que el documento se ha creado.
5. Desde Firebase → **Messaging** → "Crear primera campaña" → **Notificación de Firebase** → en "Probar en dispositivo" pegar el token y enviar.
6. Comprobar que la notificación llega:
   - En primer plano → se muestra como `Alert.alert` (lo gestiona `escucharMensajesEnPrimerPlano`).
   - En segundo plano / app cerrada → aparece en la barra de notificaciones del sistema.

## 8. Bibliografía

- React Native Firebase — Messaging: https://rnfirebase.io/messaging/usage
- Permisos en Android 13+: https://developer.android.com/develop/ui/views/notifications/notification-permission
- FCM — Configurar app cliente Android: https://firebase.google.com/docs/cloud-messaging/android/client
