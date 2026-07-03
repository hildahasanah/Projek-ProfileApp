import React, { useRef, useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Platform,
  Animated,
  Image,
  TouchableOpacity,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import AsyncStorage from "@react-native-async-storage/async-storage";
import AnimatedCard from "../components/AnimatedCard";

const MENU_ITEMS = [
  { id: "biodata", title: "Biodata", icon: "person", route: "/(tabs)/profile", gradient: ["#f9a8d4", "#ec4899"] },
  { id: "education", title: "Riwayat Pendidikan", icon: "school", route: "/(tabs)/pendidikan", gradient: ["#93c5fd", "#3b82f6"] },
  { id: "activity", title: "Aktivitas Harian", icon: "calendar", route: "/(tabs)/aktivitas", gradient: ["#c4b5fd", "#8b5cf6"] },
  { id: "organisasi", title: "Organisasi", icon: "people", route: "/(tabs)/organisasi", gradient: ["#a7f3d0", "#059669"] },
  { id: "recipe", title: "Recipe", icon: "restaurant", route: "/(tabs)/recipe", gradient: ["#fca5a5", "#ef4444"] },
  { id: "logout", title: "Logout", icon: "log-out", route: "/", gradient: ["#cbd5e1", "#94a3b8"] },
];

const DashboardScreen = () => {
  const router = useRouter();
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;
  const [profileName, setProfileName] = useState("Hilda Hasanah");

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 700,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 700,
        useNativeDriver: true,
      }),
    ]).start();

    // Load saved profile name
    (async () => {
      try {
        const saved = await AsyncStorage.getItem("userProfile");
        if (saved) {
          const parsed = JSON.parse(saved);
          if (parsed.name) setProfileName(parsed.name);
        }
      } catch (e) {}
    })();
  }, []);

  const handlePress = (route: string) => {
    if (route === "/") {
      router.replace(route);
    } else {
      router.push(route as any);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Animated.View style={{ flex: 1, opacity: fadeAnim, transform: [{ translateY: slideAnim }] }}>

        {/* Gradient Header */}
        <LinearGradient
          colors={["#fce7f3", "#dbeafe"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.headerGradient}
        >
          <View style={styles.header}>
            <View>
              <Text style={styles.greeting}>Halo, 👋</Text>
              <Text style={styles.name}>{profileName}</Text>
              <Text style={styles.welcomeText}>Selamat Datang di Personal Profile.</Text>
            </View>
            {/* Clickable Profile Avatar */}
            <TouchableOpacity onPress={() => router.push("/(tabs)/profile")} activeOpacity={0.8}>
              <View style={styles.avatarWrapper}>
                <Image
                  source={require("../assets/images/profile.jpg")}
                  style={styles.avatarImage}
                />
                <View style={styles.avatarBadge}>
                  <Ionicons name="checkmark" size={10} color="#fff" />
                </View>
              </View>
            </TouchableOpacity>
          </View>
        </LinearGradient>

        {/* Grid Menu */}
        <ScrollView
          contentContainerStyle={styles.gridContainer}
          showsVerticalScrollIndicator={false}
        >
          {MENU_ITEMS.map((item) => (
            <AnimatedCard
              key={item.id}
              style={styles.card}
              onPress={() => handlePress(item.route)}
            >
              <LinearGradient
                colors={item.gradient as [string, string]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.iconContainer}
              >
                <Ionicons name={item.icon as any} size={28} color="#fff" />
              </LinearGradient>
              <Text style={styles.cardTitle}>{item.title}</Text>
            </AnimatedCard>
          ))}
        </ScrollView>

      </Animated.View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fdf4ff",
  },
  headerGradient: {
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    marginBottom: 8,
    ...Platform.select({
      ios: { shadowColor: "#ec4899", shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.1, shadowRadius: 12 },
      android: { elevation: 4 },
    }),
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 24,
    paddingTop: 20,
    paddingBottom: 24,
  },
  greeting: {
    fontSize: 16,
    color: "#be185d",
    fontWeight: "500",
  },
  name: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#1e1b4b",
    marginTop: 2,
    marginBottom: 4,
  },
  welcomeText: {
    fontSize: 13,
    color: "#6b7280",
  },
  avatarWrapper: {
    position: "relative",
  },
  avatarImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
    borderWidth: 3,
    borderColor: "#fff",
    ...Platform.select({
      ios: { shadowColor: "#ec4899", shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.3, shadowRadius: 6 },
      android: { elevation: 6 },
    }),
  },
  avatarBadge: {
    position: "absolute",
    bottom: 0,
    right: 0,
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: "#10b981",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: "#fff",
  },
  gridContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    paddingHorizontal: 16,
    justifyContent: "space-between",
    paddingBottom: 100,
    paddingTop: 16,
  },
  card: {
    width: "47%",
    backgroundColor: "#ffffff",
    borderRadius: 20,
    padding: 20,
    marginBottom: 16,
    alignItems: "center",
    ...Platform.select({
      ios: { shadowColor: "#c084fc", shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.1, shadowRadius: 10 },
      android: { elevation: 3 },
    }),
  },
  iconContainer: {
    width: 64,
    height: 64,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 12,
  },
  cardTitle: {
    fontSize: 13,
    fontWeight: "700",
    color: "#374151",
    textAlign: "center",
  },
});

export default DashboardScreen;
