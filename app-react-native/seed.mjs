import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs, deleteDoc, doc, addDoc } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyBGNW2mjZuBuoA2lmoiVPXBKwWK6ln7eAw",
  authDomain: "equipobasket-database.firebaseapp.com",
  projectId: "equipobasket-database",
  storageBucket: "equipobasket-database.firebasestorage.app",
  messagingSenderId: "213459839335",
  appId: "1:213459839335:web:224a20c11e8315908167c2"
};

const app = initializeApp(firebaseConfig);
const firestore = getFirestore(app);

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
    fotoUrl: 'https://www.dropbox.com/scl/fi/rk5bg6mn88iorqzztg4t5/curry.png?rlkey=eosy0yfvsnfvm3z5tr1ou35de&st=y7j6ejcq&raw=1',
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
    fotoUrl: 'https://www.dropbox.com/scl/fi/u4a5cclln5t3tzydlwym7/lebron.png?rlkey=81upx4sub3sh352q1esj1holj&st=pxfi0vuh&raw=1',
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
    fotoUrl: 'https://www.dropbox.com/scl/fi/zlojzpca5wtlfnatq5p3p/giannis.png?rlkey=tbsg90w9gfia5anq4yfzrx8i9&st=bkohvknd&raw=1',
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
    fotoUrl: 'https://www.dropbox.com/scl/fi/xx5ypow2e32liiw7kshqy/luka.png?rlkey=1466on1yxi9jx9m589k99s7gd&st=03c7q0j5&raw=1',
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
    fotoUrl: 'https://www.dropbox.com/scl/fi/ambukv7u1e66faceopu4p/jokic.png?rlkey=oyla7ne8729lmvj8exldmo363&st=6f75nskl&raw=1',
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
    fotoUrl: 'https://www.dropbox.com/scl/fi/57ewk7tjgi92l4bo1qx8f/embiid.png?rlkey=8p7ytu3l8f9gljm0ej89yewoi&st=mc3e0dky&raw=1',
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
    fotoUrl: 'https://www.dropbox.com/scl/fi/oqnz1yiav49mkkxgwr6kr/jayson.png?rlkey=ek3k8drruc0uk184604ezbzdt&st=3sfs0lsl&raw=1',
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
    fotoUrl: 'https://www.dropbox.com/scl/fi/yfeqbofp22qsluxwab5l6/booker.png?rlkey=ikkbudws5e1swdfuf9qp0p8xy&st=uml9ak71&raw=1',
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
    fotoUrl: 'https://www.dropbox.com/scl/fi/x8plibw0vry621xq4isri/morant.png?rlkey=3pgu4yis92qmileyrw43erzt3&st=waw2onth&raw=1',
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
    fotoUrl: 'https://www.dropbox.com/scl/fi/ndp03gxl3b62hz1l5lvfz/edwards.png?rlkey=2gv8rr5hkhfuk6qyia9ra0v6q&st=96k7tb52&raw=1',
    videoUrl: 'https://www.dropbox.com/scl/fi/j6qp5s8ecb6vd5dzf7i7q/videoplayback.mp4?rlkey=lzob1a960o2wond0qwxlw27ju&st=ap51g74m&dl=1',
    posterUrl: 'assets/videos/poster/edwards.webp',
    descripcion: 'Joven estrella con gran capacidad atlética y anotadora.'
  }
];

async function seedDatabase() {
  console.log('Limpiando la base de datos...');
  const playersRef = collection(firestore, 'players');
  const snapshot = await getDocs(playersRef);

  const deletePromises = snapshot.docs.map(docSnap =>
    deleteDoc(doc(firestore, `players/${docSnap.id}`))
  );
  await Promise.all(deletePromises);

  console.log('Base de datos vacía. Metiendo los jugadores originales...');

  for (const player of playersData) {
    await addDoc(playersRef, player);
  }

  console.log('✅ ¡Limpieza y carga terminada! Solo hay los jugadores originales ahora.');
  process.exit(0);
}

seedDatabase().catch(error => {
  console.error(error);
  process.exit(1);
});
