import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';

import { provideFirebaseApp, initializeApp } from '@angular/fire/app'; // importacion de Firebase para usar los servicios de Firebase en la aplicación
import { provideFirestore, getFirestore } from '@angular/fire/firestore';// importacion de Firestore para usar la base de datos en la aplicación
import { environment } from '../environments/environment'; //ruta con las credenciales de Firebase

import { provideStorage, getStorage} from '@angular/fire/storage'; // importar Storage para gestión de archivos

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),

    // Configuración de Firebase
    provideFirebaseApp(() => initializeApp(environment.firebase)),
    provideFirestore(() => getFirestore()),
    provideStorage(() => getStorage())
  ]
};
