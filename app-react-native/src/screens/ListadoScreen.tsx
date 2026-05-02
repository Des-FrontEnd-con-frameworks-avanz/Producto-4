import React, { Component } from 'react';
import { View, Text, FlatList, StyleSheet, ActivityIndicator, TouchableOpacity, Image } from 'react-native';
import { getFirestore, collection, getDocs } from '@react-native-firebase/firestore';
import { Player } from '../types/Player';

interface State {
  jugadores: Player[];     
  cargando: boolean; 
}

interface Props {
  navigation: any; 
}

export default class ListadoScreen extends Component<Props, State> {
  
  constructor(props: Props) {
    super(props);
    this.state = {
      jugadores: [],        
      cargando: true,   
    };
  }

  async componentDidMount() {
    try {
      console.log('[ListadoScreen] Cargando jugadores desde Firestore...');
      const db = getFirestore();
      const snapshot = await getDocs(collection(db, 'players'));
      console.log(`[ListadoScreen] Recibidos ${snapshot.size} jugadores`);

      const arrayJugadores: Player[] = snapshot.docs.map((documento) => {
        const datos = documento.data();
        return {
          id: documento.id,
          nombre: datos.nombre,
          apellidos: datos.apellidos,
          posicion: datos.posicion,
          edad: datos.edad,
          altura: datos.altura,
          peso: datos.peso,
          experiencia: datos.experiencia,
          precio: datos.precio,
          fotoUrl: datos.fotoUrl,
          videoUrl: datos.videoUrl,
          posterUrl: datos.posterUrl,
          descripcion: datos.descripcion,
        };
      });

      this.setState({ jugadores: arrayJugadores, cargando: false });
    } catch (error) {
      console.error('[ListadoScreen] Error cargando jugadores:', error);
      this.setState({ cargando: false });
    }
  }

  renderTarjeta = ({ item }: { item: Player }) => {
    return (
      <TouchableOpacity 
        style={styles.tarjeta}
        onPress={() => this.props.navigation.navigate('Detalle', { player: item })}
      >
        <Image source={{ uri: item.fotoUrl }} style={styles.foto} />
        <View style={styles.infoContainer}>
          <Text style={styles.nombre}>{item.nombre} {item.apellidos}</Text>
          <Text style={styles.posicion}>{item.posicion}</Text>
          <Text style={styles.precio}>${item.precio.toLocaleString()}</Text>
        </View>
      </TouchableOpacity>
    );
  };

  render() {
    if (this.state.cargando) {
      return (
        <View style={styles.centro}>
          <ActivityIndicator size="large" color="#1A237E" />
        </View>
      );
    }

    return (
      <View style={styles.contenedor}>
        <Text style={styles.cabecera}>Jugadores</Text>
        
        <FlatList
          data={this.state.jugadores}
          renderItem={this.renderTarjeta}
          keyExtractor={(item) => item.id as string}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  contenedor: { flex: 1, backgroundColor: '#F0F2F5', padding: 12 },
  centro: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  cabecera: { fontSize: 22, fontWeight: '800', marginBottom: 20, textAlign: 'center', color: '#1A237E', letterSpacing: 2, textTransform: 'uppercase' },
  tarjeta: { backgroundColor: '#ffffff', padding: 12, borderRadius: 15, marginBottom: 14, flexDirection: 'row', alignItems: 'center', elevation: 4, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4 },
  foto: { width: 75, height: 75, borderRadius: 37.5, marginRight: 15, borderWidth: 3, borderColor: '#1A237E', backgroundColor: '#f0f0f0' },
  infoContainer: { flex: 1, justifyContent: 'center' },
  nombre: { fontSize: 18, fontWeight: 'bold', color: '#1A237E' },
  posicion: { fontSize: 14, color: '#757575', marginTop: 2, fontWeight: '500' },
  precio: { fontSize: 17, fontWeight: '800', color: '#2E7D32', marginTop: 6 },
});