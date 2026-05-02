import { Injectable, inject } from '@angular/core';
import { Firestore, doc, setDoc } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  private firestore = inject(Firestore);

  constructor() {}

  async saveToken(token: string): Promise<void> {
    try {
      const tokenDocRef = doc(this.firestore, `fcmTokens/${token}`);
      
      await setDoc(tokenDocRef, {
        token: token,
        createdAt: new Date().toISOString(),
        plataforma: 'web' 
      });
      
      console.log('✅ Token guardado en Firestore con éxito en la colección fcmTokens');
    } catch (error) {
      console.error('❌ Error al guardar el token en Firestore:', error);
    }
  }
}