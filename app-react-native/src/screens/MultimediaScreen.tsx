/**
 * MultimediaScreen - Pantalla de reproductor multimedia
 * Migrado a react-native-video v7 (useVideoPlayer + VideoView).
 * surfaceType="texture" arregla el bug de pantalla negra en Android con Fabric.
 */

import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../../App';
import { useVideoPlayer, VideoView } from 'react-native-video';

type Props = NativeStackScreenProps<RootStackParamList, 'Multimedia'>;

const MultimediaScreen: React.FC<Props> = ({ route }) => {
  const { player } = route.params;

  const videoPlayer = useVideoPlayer(
    { uri: player.videoUrl ?? '' },
    (p) => {
      p.play();
    },
  );

  const [paused, setPaused] = useState(false);
  const [muted, setMuted] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  useEffect(() => {
    const subProgress = videoPlayer.addEventListener('onProgress', (data) => {
      setCurrentTime(data.currentTime);
    });
    const subLoad = videoPlayer.addEventListener('onLoad', (data) => {
      setDuration(data.duration);
    });
    const subEnd = videoPlayer.addEventListener('onEnd', () => {
      setPaused(true);
    });
    return () => {
      subProgress.remove();
      subLoad.remove();
      subEnd.remove();
    };
  }, [videoPlayer]);

  const togglePlayPause = () => {
    if (paused) {
      videoPlayer.play();
    } else {
      videoPlayer.pause();
    }
    setPaused(!paused);
  };

  const toggleMute = () => {
    const next = !muted;
    videoPlayer.muted = next;
    setMuted(next);
  };

  const reiniciarVideo = () => {
    videoPlayer.seekTo(0);
  };

  const adelantar10Segundos = () => {
    videoPlayer.seekBy(10);
  };

  const retroceder10Segundos = () => {
    videoPlayer.seekBy(-10);
  };

  const progress = duration > 0 ? currentTime / duration : 0;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Mejores Jugadas</Text>
      {player.videoUrl ? (
        <VideoView
          player={videoPlayer}
          style={styles.videoPlayer}
          resizeMode="contain"
          surfaceType="texture"
        />
      ) : (
        <Text style={{ color: 'white' }}>No hay vídeo disponible</Text>
      )}

      {/* PROGRESO */}
      <View style={styles.barraWrapper}>
        <View style={styles.barraContainer}>
          <View style={[styles.barraProgreso, { width: `${progress * 100}%` }]} />
        </View>
        <Text style={styles.tiempo}>
          {Math.floor(currentTime)}s / {Math.floor(duration)}s
        </Text>
      </View>

      {/* CONTROLES */}
      <View style={styles.controlesContainer}>
        <TouchableOpacity style={styles.boton} onPress={reiniciarVideo}>
          <Text style={styles.textoBoton}>⏮️</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.boton} onPress={retroceder10Segundos}>
          <Text style={styles.textoBoton}>⏪</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.boton, styles.botonPrincipal]}
          onPress={togglePlayPause}
        >
          <Text style={styles.textoBotonGrande}>{paused ? '▶️' : '⏸️'}</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.boton} onPress={adelantar10Segundos}>
          <Text style={styles.textoBoton}>⏩</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.boton} onPress={toggleMute}>
          <Text style={styles.textoBoton}>{muted ? '🔇' : '🔊'}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0F172A',
    paddingTop: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 10,
  },
  videoPlayer: {
    width: '100%',
    aspectRatio: 16 / 9,
    backgroundColor: '#000',
  },

  barraWrapper: {
    paddingHorizontal: 15,
    marginTop: 10,
  },
  barraContainer: {
    width: '100%',
    height: 6,
    backgroundColor: '#334155',
    borderRadius: 5,
    overflow: 'hidden',
  },
  barraProgreso: {
    height: '100%',
    backgroundColor: '#3B82F6',
  },
  tiempo: {
    color: '#CBD5F5',
    fontSize: 12,
    marginTop: 5,
    textAlign: 'right',
  },

  controlesContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    marginTop: 20,
    paddingHorizontal: 10,
  },
  boton: {
    backgroundColor: '#1E293B',
    padding: 12,
    borderRadius: 50,
    elevation: 3,
  },
  botonPrincipal: {
    backgroundColor: '#3B82F6',
    padding: 16,
  },
  textoBoton: {
    color: '#FFFFFF',
    fontSize: 16,
  },
  textoBotonGrande: {
    color: '#FFFFFF',
    fontSize: 20,
  },
});

export default MultimediaScreen;
