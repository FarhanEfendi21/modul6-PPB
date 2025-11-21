import { useEffect, useState } from "react";
import { View, ActivityIndicator, StyleSheet } from "react-native";
import { NavigationContainer, DefaultTheme } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Ionicons from "@expo/vector-icons/Ionicons";
import { enableScreens } from "react-native-screens";
import { SafeAreaProvider } from "react-native-safe-area-context";
import * as SplashScreenLib from 'expo-splash-screen';

// --- Screens ---
import { MonitoringScreen } from "./src/screens/MonitoringScreen.js";
import { ControlScreen } from "./src/screens/ControlScreen.js";
import { LoginScreen } from "./src/screens/LoginScreen.js";
import { SplashScreen as CustomSplashScreen } from "./src/screens/SplashScreen.js";

// --- Services & Context ---
import { assertConfig } from "./src/services/config.js";
import { AuthProvider, useAuth } from "./src/context/AuthContext.js";

const Tab = createBottomTabNavigator();
enableScreens(true);

// 1. Tahan splash screen bawaan (Layar Putih) agar tidak hilang otomatis
//    Kita akan menghilangkannya secara manual nanti.
SplashScreenLib.preventAutoHideAsync().catch(() => {});

const MainNavigator = () => {
  const { user, isGuest, loading } = useAuth();

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#2563eb" />
      </View>
    );
  }

  if (!user && !isGuest) {
    return <LoginScreen />;
  }

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: true,
        headerTitle: "IOTWatch",
        headerTitleAlign: "center",
        headerTintColor: "#1f2937",
        headerStyle: { backgroundColor: "#f8f9fb" },
        headerTitleStyle: { fontWeight: "600", fontSize: 18 },
        tabBarActiveTintColor: "#2563eb",
        tabBarInactiveTintColor: "#94a3b8",
        tabBarIcon: ({ color, size }) => {
          const iconName = route.name === "Monitoring" ? "analytics" : "options";
          return <Ionicons name={iconName} size={size} color={color} />;
        },
      })}
    >
      <Tab.Screen name="Monitoring" component={MonitoringScreen} />
      <Tab.Screen name="Control" component={ControlScreen} />
    </Tab.Navigator>
  );
};

export default function App() {
  // State untuk mengatur kapan Custom Splash Screen (Layar Biru) selesai
  const [isShowSplash, setIsShowSplash] = useState(true);

  useEffect(() => {
    async function prepare() {
      try {
        // Inisialisasi config
        assertConfig();

        // --- LOGIKA PENTING AGAR TIDAK STUCK ---
        
        // 1. Sembunyikan Layar Putih (Native) SEGERA.
        //    Ini akan mengungkap Layar Biru (CustomSplashScreen) di bawahnya.
        await SplashScreenLib.hideAsync(); 

        // 2. Biarkan Layar Biru tampil selama 3 detik untuk animasi.
        await new Promise(resolve => setTimeout(resolve, 3000));

      } catch (e) {
        console.warn(e);
      } finally {
        // 3. Selesai. Matikan Layar Biru, masuk ke Aplikasi utama.
        setIsShowSplash(false);
      }
    }

    prepare();
  }, []);

  // Selama isShowSplash = true, tampilkan Animasi Kelompok 43
  if (isShowSplash) {
    return <CustomSplashScreen />;
  }

  const theme = {
    ...DefaultTheme,
    colors: {
      ...DefaultTheme.colors,
      background: "#f8f9fb",
    },
  };

  return (
    <AuthProvider>
      <SafeAreaProvider>
        <NavigationContainer theme={theme}>
          <MainNavigator />
        </NavigationContainer>
      </SafeAreaProvider>
    </AuthProvider>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8f9fb',
  }
});
