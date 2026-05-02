import { Component, OnInit, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';

import { Messaging, getToken, onMessage, isSupported } from '@angular/fire/messaging';
import { environment } from '../environments/environment';
import { NotificationService } from './services/notification.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, CommonModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit {
  title = 'equipo-basket';

  private messaging = inject(Messaging);
  private notificationService = inject(NotificationService);

  ngOnInit(): void {
    this.requestNotificationPermission();
  }

  public async requestNotificationPermission(): Promise<void> {
    try {
      const messagingSupported = await isSupported();
      
      if (!messagingSupported) {
        console.warn('❌ Este navegador no soporta notificaciones Push.');
        return;
      }

      console.log('Solicitando permiso de notificaciones...');
      const permission = await Notification.requestPermission();
      
      if (permission === 'granted') {
        console.log('✅ Permiso concedido.');

        getToken(this.messaging, { vapidKey: environment.firebase.vapidKey })
          .then((currentToken) => {
            if (currentToken) {
              console.log('✅ ¡Este es tu Device Token!: ', currentToken);
              this.notificationService.saveToken(currentToken);

            } else {
              console.log('❌ No se pudo obtener el token.');
            }
          })
          .catch((err) => console.error('❌ Error al obtener el token', err));

      } else {
        console.warn('❌ Permiso denegado.');
      }

      onMessage(this.messaging, (payload) => {
        console.log('Mensaje en primer plano: ', payload);
        alert(`🏀 Nueva Notificación: ${payload.notification?.title}\n${payload.notification?.body}`);
      });

    } catch (error) {
      console.error('Error configurando Firebase Messaging:', error);
    }
  }
}