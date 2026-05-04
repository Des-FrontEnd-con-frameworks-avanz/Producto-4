/**
 * @format
 */

import { AppRegistry } from 'react-native';
import messaging from '@react-native-firebase/messaging';
import App from './App';
import { name as appName } from './app.json';

// Handler de mensajes recibidos cuando la app está en segundo plano o cerrada.
// Debe registrarse fuera del ciclo de vida de React, lo más arriba posible
// (requisito de @react-native-firebase/messaging).
messaging().setBackgroundMessageHandler(async (mensajeRemoto) => {
  console.log(
    '[FCM][background] Mensaje recibido:',
    JSON.stringify(mensajeRemoto),
  );
});

AppRegistry.registerComponent(appName, () => App);
