// app/src/screens/SplashScreen.js
import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated, Easing, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Ionicons from "@expo/vector-icons/Ionicons";
import { LinearGradient } from 'expo-linear-gradient'; // Opsional: Jika ingin background gradien

const { width } = Dimensions.get('window');

export function SplashScreen() {
  // Kita buat 3 nilai animasi terpisah untuk 3 grup elemen
  const animIcon = useRef(new Animated.Value(0)).current;
  const animTitle = useRef(new Animated.Value(0)).current;
  const animGroup = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Fungsi helper untuk membuat animasi slide-up + fade-in
    const createSlideUpAnim = (animValue, delay) => {
      return Animated.timing(animValue, {
        toValue: 1, // Target akhir (opacity 1, posisi 0)
        duration: 800, // Durasi animasi 0.8 detik
        delay: delay, // Waktu tunggu sebelum mulai
        useNativeDriver: true,
        // Easing 'back' memberikan efek sedikit memantul saat sampai di tujuan
        easing: Easing.out(Easing.back(1.7)), 
      });
    };

    // Jalankan animasi secara paralel tapi dengan delay yang berbeda (staggered)
    Animated.parallel([
      createSlideUpAnim(animIcon, 100),   // Ikon mulai setelah 100ms
      createSlideUpAnim(animTitle, 400),  // Judul mulai setelah 400ms
      createSlideUpAnim(animGroup, 700),  // Kelompok mulai setelah 700ms
    ]).start();
  }, []);

  // Fungsi helper untuk mengubah nilai 0-1 menjadi gerakan vertikal
  const getTransformStyle = (animValue) => {
    const translateY = animValue.interpolate({
      inputRange: [0, 1],
      outputRange: [100, 0], // Mulai dari 100 piksel di bawah, berakhir di posisi 0
    });
    return {
      opacity: animValue, // Opasitas dari 0 ke 1
      transform: [{ translateY }], // Gerakan vertikal
    };
  };

  return (
    // Menggunakan warna background solid yang modern (Slate Blue gelap)
    <SafeAreaView style={styles.container}>
      <View style={styles.contentContainer}>
        
        {/* --- BAGIAN 1: IKON --- */}
        <Animated.View style={[styles.iconWrapper, getTransformStyle(animIcon)]}>
          <View style={styles.iconCircle}>
             <Ionicons name="wifi" size={70} color="#fff" style={styles.iconShadow} />
          </View>
        </Animated.View>
        
        {/* --- BAGIAN 2: JUDUL APLIKASI --- */}
        <Animated.View style={[styles.textWrapper, getTransformStyle(animTitle)]}>
          <Text style={styles.title}>IOTWatch</Text>
          <Text style={styles.subtitle}>Smart Sensor Monitor</Text>
          {/* Garis pemisah dekoratif */}
          <View style={styles.dividerContainer}>
              <View style={styles.dividerLine} />
              <View style={styles.dividerDot} />
              <View style={styles.dividerLine} />
          </View>
        </Animated.View>

        {/* --- BAGIAN 3: NAMA KELOMPOK --- */}
        <Animated.View style={[styles.groupWrapper, getTransformStyle(animGroup)]}>
          <Text style={styles.groupLabel}>Presented by</Text>
          <View style={styles.groupNameContainer}>
            <Text style={styles.groupName}>KELOMPOK 43</Text>
          </View>
        </Animated.View>

      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // Warna latar belakang biru tua modern (mirip Github dark mode / Vercel)
    backgroundColor: '#0f172a', 
  },
  contentContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 30,
  },
  // --- Styles Ikon ---
  iconWrapper: {
    marginBottom: 40,
  },
  iconCircle: {
    width: 120,
    height: 120,
    backgroundColor: '#3b82f6', // Biru terang (Royal Blue)
    borderRadius: 60,
    justifyContent: 'center',
    alignItems: 'center',
    // Efek Glow/Bayangan Biru
    shadowColor: "#3b82f6",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.5,
    shadowRadius: 20,
    elevation: 15,
    borderWidth: 4,
    borderColor: '#60a5fa', // Border biru lebih terang
  },
  // --- Styles Teks Judul ---
  textWrapper: {
    alignItems: 'center',
    marginBottom: 50,
  },
  title: {
    fontSize: 42,
    fontWeight: '900', // Sangat tebal
    color: '#f8fafc', // Putih hampir murni
    letterSpacing: 2,
    marginBottom: 5,
    textShadowColor: 'rgba(59, 130, 246, 0.5)', // Bayangan teks biru halus
    textShadowOffset: {width: 0, height: 2},
    textShadowRadius: 10,
  },
  subtitle: {
    fontSize: 18,
    color: '#94a3b8', // Abu-abu kebiruan
    fontWeight: '500',
    letterSpacing: 1,
  },
  // Divider Dekoratif
  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 25,
    opacity: 0.7,
  },
  dividerLine: {
    height: 2,
    width: 40,
    backgroundColor: '#3b82f6',
    borderRadius: 2,
  },
  dividerDot: {
    width: 8,
    height: 8,
    backgroundColor: '#60a5fa',
    borderRadius: 4,
    marginHorizontal: 10,
  },
  // --- Styles Kelompok ---
  groupWrapper: {
    alignItems: 'center',
    position: 'absolute', // Posisikan di bagian bawah layar
    bottom: 80,
  },
  groupLabel: {
    fontSize: 14,
    color: '#64748b', // Abu-abu lebih gelap
    marginBottom: 8,
    textTransform: 'uppercase',
    letterSpacing: 2,
    fontWeight: '600',
  },
  groupNameContainer: {
    backgroundColor: 'rgba(30, 41, 59, 0.8)', // Latar belakang semi-transparan
    paddingVertical: 10,
    paddingHorizontal: 25,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(59, 130, 246, 0.3)', // Border biru tipis
  },
  groupName: {
    fontSize: 20,
    fontWeight: '800',
    color: '#3b82f6', // Warna teks biru terang
    letterSpacing: 1.5,
  },
});