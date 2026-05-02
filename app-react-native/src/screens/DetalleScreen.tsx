/**
 * DetalleScreen - Pantalla de detalle de un jugador
 * TODO (Thabata): Implementar vista detalle con imagen zoomeable y datos de Firebase
 *
 * Recibe route.params.player con el objeto Player seleccionado del listado.
 */

import React, { useState } from 'react'; // useState sirve para manejar "estados" (ej. el modal abierto/cerrado)
import { View, Text, StyleSheet, Image, TouchableOpacity, Modal, ScrollView } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../../App';

type Props = NativeStackScreenProps<RootStackParamList, 'Detalle'>;
 
const DetalleScreen: React.FC<Props> = ({ route, navigation }) => {
  const { player } = route.params;
  const [verZoom, setVerZoom] = useState(false);

  return (
    <>
      <ScrollView style={styles.mainContainer}>

        {/* IMAGEN CLICKEABLE */}
        <View style={styles.contenedorAvatar}>
        <TouchableOpacity onPress={() => setVerZoom(true)} activeOpacity={0.8}>
          <Image 
            source={{ uri: player.fotoUrl }} 
            style={styles.imagenRedonda} 
          />
        </TouchableOpacity>
        <Text style={styles.textoAyuda}>Toca para ampliar</Text>
      </View>

        <View style={styles.infoBox}>
            <Text style={styles.title}>{player.nombre} {player.apellidos}
          </Text>

          <Text style={styles.filaTexto}>
            <Text style={styles.etiqueta}>Posición: </Text>
            <Text style={styles.subtitle}>{player.posicion}</Text>
          </Text>

          <Text style={styles.filaTexto}>
            <Text style={styles.etiqueta}>Edad: </Text>
            <Text style={styles.subtitle}>{player.edad}</Text>
          </Text>

          <Text style={styles.filaTexto}>
            <Text style={styles.etiqueta}>Altura: </Text>
            <Text style={styles.subtitle}>{player.altura}</Text>
          </Text>

          <Text style={styles.filaTexto}>
            <Text style={styles.etiqueta}>Peso: </Text>
            <Text style={styles.subtitle}>{player.peso}</Text>
          </Text> 

          <Text style={styles.filaTexto}>
            <Text style={styles.etiqueta}>Experiencia: </Text>
            <Text style={styles.subtitle}>{player.experiencia}</Text>
          </Text>

          <Text style={styles.filaTexto}>
            <Text style={styles.etiqueta}>Precio: </Text>
            <Text style={styles.subtitle}>{player.precio} €</Text>
          </Text>
  
          <View style={styles.contenedorDescripcion}>
            <Text style={styles.etiqueta}>Descripción</Text>
            <View style={styles.lineaDecorativa} />
            <Text style={styles.textoDescripcion}>{player.descripcion}</Text>
          </View>
       
        </View>
          {/* BOTÓN SIMPLIFICADO: Quitamos el View innecesario */}
          <TouchableOpacity 
            style={styles.botonMultimedia} 
            onPress={() => navigation.navigate('Multimedia', { player })}>
            <Text style={styles.textoBoton}>Ver Mejores Jugadas</Text>
          </TouchableOpacity>

      </ScrollView>

      {/* MODAL PARA IMAGEN ZOOM */}
      <Modal visible={verZoom} transparent={false}>
        <View style={styles.modelFull}>
          <TouchableOpacity style={styles.botonCerrar} onPress={() => setVerZoom(false)}>
            <Text style={styles.textoBoton}>Cerrar</Text>
          </TouchableOpacity>
          <Image
          source={{uri: player.fotoUrl}}
          style={styles.imagenZoom}
          resizeMode="contain"
          />
        </View>
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  // Contenedor centrado para la foto de perfil
  contenedorAvatar: {
    alignItems: 'center',
    marginTop: 20,
  },
  imagenRedonda: {
    width: 250,
    height: 250,
    borderRadius: 125, // Mitad exacta de 250
    borderWidth: 4,
    borderColor: '#1A237E',
    backgroundColor: '#EEE',
  },
  textoAyuda: {
    textAlign: 'center',
    color: '#999',
    fontSize: 12,
    marginVertical: 10,
    fontStyle: 'italic',
  },
  infoBox: {
    padding: 20,
  },
  title: {
    fontSize: 25,
    color: '#1A237E',
    textAlign: 'center',
    textTransform: 'uppercase',
    fontWeight: 'bold',
    paddingBottom: 15,
  },
  filaTexto: {
    flexDirection: 'row',
    marginBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
    paddingBottom: 8,
  },
  etiqueta: {
    fontSize: 14,
    color: '#444',
    textTransform: 'uppercase',
    flex: 1,
  },
  subtitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000000',
    width: 120,
  },
  // Bloque de descripción mejorado
  contenedorDescripcion: {
    marginTop: 20,
    padding: 15,
    backgroundColor: '#F8F9FA',
    borderRadius: 12,
  },
  lineaDecorativa: {
    height: 1,
    backgroundColor: '#DEE2E6',
    marginBottom: 10,
    width: '30%',
  },
  textoDescripcion: {
    fontSize: 16,
    lineHeight: 24,
    color: '#000000',
    marginTop: 5,
    textAlign: 'justify',
  },
  // Botones y Modales
  botonMultimedia: {
    backgroundColor: '#1A237E',
    padding: 15,
    borderRadius: 10,
    marginVertical: 15,
    marginHorizontal: 20, // Añadido para que no toque los bordes
    alignItems: 'center',
    elevation: 3,
  },
  modelFull: {
    flex: 1,
    backgroundColor: 'black',
    justifyContent: 'center',
    alignItems: 'center',
  },
  imagenZoom: {
    width: '100%',
    height: '90%',
  },
  botonCerrar: {
    position: 'absolute',
    top: 50,
    right: 25,
    zIndex: 10,
    backgroundColor: 'rgba(255,255,255,0.2)',
    padding: 10,
    borderRadius: 20,
  },
  textoBoton: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
    textAlign: 'center',
  },
});

export default DetalleScreen;
