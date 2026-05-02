/**
 * Configuración de Firebase - Realtime Database
 *
 * @react-native-firebase/app se inicializa automáticamente leyendo el archivo
 * google-services.json (Android) o GoogleService-Info.plist (iOS).
 * No es necesario llamar a Firebase.initializeApp() manualmente en las versiones
 * modernas de la librería (v6+). Ver: https://rnfirebase.io/
 */

import database from '@react-native-firebase/database';

export { database };

/**
 * Ejemplo de uso con .once() — equivalente al componentDidMount del profesor:
 *
 *   database()
 *     .ref('/retos')
 *     .once('value')
 *     .then((snapshot: FirebaseDatabaseTypes.DataSnapshot) => {
 *       const retos = snapshot.val(); // Array de retos desde Firebase
 *       console.log('Retos cargados:', retos);
 *     });
 */
