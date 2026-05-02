import { Injectable, inject } from '@angular/core';
import { 
  Firestore, 
  collection, 
  onSnapshot,
  doc, 
  addDoc, 
  updateDoc, 
  deleteDoc,
  getDocs
} from '@angular/fire/firestore';
import { Storage, ref, uploadBytes, getDownloadURL } from '@angular/fire/storage';
import { Observable } from 'rxjs';
import { Player } from '../shared/models/player.model';

@Injectable({
  providedIn: 'root'
})
export class PlayerService {
  private firestore = inject(Firestore);
  private storage = inject(Storage);

  constructor() {}

  /**
   * Obtiene los jugadores en TIEMPO REAL usando la API nativa de Firebase.
   */
  getPlayers(): Observable<Player[]> {
    return new Observable<Player[]>((observer) => {
      const playersRef = collection(this.firestore, 'players');
      
      const unsubscribe = onSnapshot(playersRef, 
        (snapshot) => {
          const players: Player[] = [];
          snapshot.forEach((docSnapshot) => {
            players.push({ id: docSnapshot.id, ...docSnapshot.data() } as Player);
          });
          observer.next(players); 
        }, 
        (error) => {
          observer.error(error); 
        }
      );

      return () => unsubscribe();
    });
  }

  async updatePlayer(id: string, data: Partial<Player>) {
    const playerDoc = doc(this.firestore, `players/${id}`);
    await updateDoc(playerDoc, data);
  }

  /*async uploadFile(file: File, path: string): Promise<string> {
    const referencia = ref(this.storage, path + file.name);
    await uploadBytes(referencia, file);
    return await getDownloadURL(referencia);
  }*/

  async uploadFileString(file: File, path: string): Promise <string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (error) => reject(error);
    })
  }

  async deletePlayer(id: string) {
    const playerDoc = doc(this.firestore, `players/${id}`);
    await deleteDoc(playerDoc);
  }

  async addPlayer(player: Player) {

    const playersRef = collection(this.firestore, 'players');
    await addDoc(playersRef, player);
  }

// funcion de reseteo de base de datos
  async resetDatabase() {
    console.log('Limpiando la base de datos...');
    const playersRef = collection(this.firestore, 'players');
    
    const snapshot = await getDocs(playersRef);
    
    const deletePromises = snapshot.docs.map(docSnap => 
      deleteDoc(doc(this.firestore, `players/${docSnap.id}`))
    );
    await Promise.all(deletePromises);
    
    console.log('Base de datos vacía. Metiendo los 10 originales...');
    
    await this.seedDatabase();
    console.log('✅ ¡Limpieza terminada! Solo hay 10 jugadores ahora.');
  }


  async seedDatabase() {
    const playersRef = collection(this.firestore, 'players');
    const playersData = [
      {
        nombre: 'Stephen',
        apellidos: 'Curry',
        posicion: 'Base',
        edad: 37,
        altura: '1.88m',
        peso: '83 kg',
        experiencia: '16° Temporadas',
        precio: 59606817,
        fotoUrl: 'images/curry.png',
        videoUrl: 'https://www.dropbox.com/scl/fi/uk6gwr6bygz6kt34i2a4e/curry-highlights.mp4?rlkey=d9epg2qf3c9gtj1r1lodg621m&st=zx42srud&raw=1',
        posterUrl: 'assets/videos/poster/curry.webp',
        descripcion: 'Considerado el mejor tirador de la historia. Líder de los Warriors.'
      },
      {
        nombre: 'Lebron',
        apellidos: 'James',
        posicion: 'Alero',
        edad: 41,
        altura: '2.06m',
        peso: '113 kg',
        experiencia: '22° Temporadas',
        precio: 52627153,
        fotoUrl: 'images/lebron.png',
        videoUrl: 'https://www.dropbox.com/scl/fi/axsd4ea7sw1u0x9202ifp/lebron-highlights.mp4?rlkey=1zb3ynz0l94jpw7twxxqhzgo1&st=cgmf8e1i&raw=1',
        posterUrl: 'assets/videos/poster/lebron.webp',
        descripcion: 'Máximo anotador histórico de la NBA y 4 veces campeón.'
      },
      {
        nombre: 'Giannis',
        apellidos: 'Antetokounmpo',
        posicion: 'Ala-Pívot',
        edad: 29,
        altura: '2.11m',
        peso: '110 kg',
        experiencia: '12° Temporadas',
        precio: 54126450,
        fotoUrl: 'images/giannis.png',
        videoUrl: 'https://www.dropbox.com/scl/fi/jd30akpdwvz2rluqyh9t5/antetokounmpo-highlights.mp4?rlkey=g4cwf1kw2x14jk81kfd1o30po&st=vzz5v2d4&raw=1',
        posterUrl: 'assets/videos/poster/giannis.webp',
        descripcion: 'Dominio físico total y MVP de las finales de 2021.'
      },
      {
        nombre: 'Luka',
        apellidos: 'Dončić',
        posicion: 'Base',
        edad: 24,
        altura: '2.01m',
        peso: '104 kg',
        experiencia: '7° Temporadas',
        precio: 54123450,
        fotoUrl: 'images/luka.png',
        videoUrl: 'https://www.dropbox.com/scl/fi/lo3epwq8rx6ndun8ohbcn/doncic-highlights.mp4?rlkey=bkukl66ztwg3o7xc1l838bpxf&st=k3s7zawv&raw=1',
        posterUrl: 'assets/videos/poster/luka.webp',
        descripcion: 'Genio esloveno con una visión de juego inigualable.'
      },
      {
        nombre: 'Nikola',
        apellidos: 'Jokić',
        posicion: 'Pívot',
        edad: 28,
        altura: '2.11m',
        peso: '128 kg',
        experiencia: '10° Temporadas',
        precio: 55224526,
        fotoUrl: 'images/jokic.png',
        videoUrl: 'https://www.dropbox.com/scl/fi/b6zzuynxn8gj4dn2f5rw4/jokic-highlights.mp4?rlkey=0j441o5l65mc1uqxebo32mh4f&st=iggytn64&raw=1',
        posterUrl: 'assets/videos/poster/jokic.webp',
        descripcion: 'El "Joker". Un pívot con alma de base y doble MVP.'
      },
      {
        nombre: 'Joel',
        apellidos: 'Embiid',
        posicion: 'Pívot',
        edad: 32,
        altura: '2.13 m',
        peso: '127 kg',
        experiencia: '10° Temporadas',
        precio: 51000000,
        fotoUrl: 'images/embiid.png',
        videoUrl: 'https://www.dropbox.com/scl/fi/hjbzqw7m8k5xht0bffw7b/Joel-Embiid-s-Top-10-Defensive-Plays-of-the-2017-2018-NBA-Regular-Season.mp4?rlkey=nbwb7j2uwd26uucl7lax4aja4&st=1jo0urfl&dl=1',
        posterUrl: 'assets/videos/poster/embiid.webp',
        descripcion: 'Pívot dominante con habilidades ofensivas y defensivas élite.'
      },
      {
        nombre: 'Jayson',
        apellidos: 'Tatum',
        posicion: 'Alero',
        edad: 27,
        altura: '2.03 m',
        peso: '95 kg',
        experiencia: '9° Temporadas',
        precio: 52000000,
        fotoUrl: 'images/jayson.png',
        videoUrl: 'https://www.dropbox.com/scl/fi/g7cm33m351o5d9fuggrii/Jayson-Tatum-s-DOMINANT-TRIPLE-DOUBLE-Performance-in-the-CHI-_-December-21-2024.mp4?rlkey=zhvghwmwqusd4a5m3xd49qu3b&st=az8nahfq&dl=1',
        posterUrl: 'assets/videos/poster/tatum.webp',
        descripcion: 'Alero estrella con gran capacidad anotadora y liderazgo.'
      },
      {
        nombre: 'Devin',
        apellidos: 'Booker',
        posicion: 'Escolta',
        edad: 26,
        altura: '1.96 m',
        peso: '93 kg',
        experiencia: '8° Temporadas',
        precio: 43000000,
        fotoUrl: 'images/booker.png',
        videoUrl: 'https://www.dropbox.com/scl/fi/qp7vzp02d1o43v2n7lym0/Devin-Booker-Had-A-Historic-Rookie-Season-_-Top-10-Rookie-Plays.mp4?rlkey=gqc21buotqdkcecbe19ianjcw&st=pgm9prdp&dl=1',
        posterUrl: 'assets/videos/poster/booker.webp',
        descripcion: 'Escolta letal con capacidad anotadora y gran tiro exterior.'
      },
      {
        nombre: 'Ja',
        apellidos: 'Morant',
        posicion: 'Base',
        edad: 24,
        altura: '1.91 m',
        peso: '79 kg',
        experiencia: '5° Temporadas',
        precio: 38000000,
        fotoUrl: 'images/morant.png',
        videoUrl: 'https://www.dropbox.com/scl/fi/ma2tdoa2rt41bwyy3lmxp/MUST-SEE_-Ja-Morant-POSTER.mp4?rlkey=lgatgeh4111b2f6ph5t4w61mk&st=av7l82cj&dl=1',
        posterUrl: 'assets/videos/poster/morant.webp',
        descripcion: 'Base explosivo y creativo, capaz de dominar cualquier partido.'
      },
      {
        nombre: 'Anthony',
        apellidos: 'Edwards',
        posicion: 'Escolta',
        edad: 22,
        altura: '1.96 m',
        peso: '100 kg',
        experiencia: '3° Temporadas',
        precio: 28000000,
        fotoUrl: 'images/edwards.png',
        videoUrl: 'https://www.dropbox.com/scl/fi/j6qp5s8ecb6vd5dzf7i7q/videoplayback.mp4?rlkey=lzob1a960o2wond0qwxlw27ju&st=ap51g74m&dl=1',
        posterUrl: 'assets/videos/poster/edwards.webp',
        descripcion: 'Joven estrella con gran capacidad atlética y anotadora.'
      }
    ];

    try {
      for (const player of playersData) {
        await addDoc(playersRef, player);
      }
      console.log('✅ Datos de jugadores añadidos a Firestore');
    } catch (error) {
      console.error('❌ Error al añadir jugadores a Firestore:', error);
    }
  }
}