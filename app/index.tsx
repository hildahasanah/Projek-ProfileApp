import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
  Animated,
  Platform,
  Image,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import AsyncStorage from "@react-native-async-storage/async-storage";

const LoginScreen = () => {
  const router = useRouter();
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.95)).current;
  const logoAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Tampilkan animasi login screen langsung
    Animated.sequence([
      Animated.timing(logoAnim, { toValue: 1, duration: 500, useNativeDriver: true }),
      Animated.parallel([
        Animated.timing(fadeAnim, { toValue: 1, duration: 600, useNativeDriver: true }),
        Animated.spring(scaleAnim, { toValue: 1, friction: 8, tension: 40, useNativeDriver: true }),
      ]),
    ]).start();
  }, []);

  const [storedUser, setStoredUser] = useState<{ name: string; nim: string } | null>(null);
  useEffect(() => {
    (async () => {
      try {
        const data = await AsyncStorage.getItem("userProfile");
        if (data) {
          const parsed = JSON.parse(data);
          setStoredUser(parsed);
        }
      } catch (e) {
        console.warn("Failed to load stored user data", e);
      }
    })();
  }, []);

  const handleLogin = () => {
    const expectedName = storedUser?.name ?? "Hilda Hasanah";
    const expectedPass = storedUser?.nim ?? "23050026";
    if (name.trim() === expectedName.trim() && password.trim() === expectedPass.trim()) {
      setIsLoading(true);
      setTimeout(() => {
        setIsLoading(false);
        Alert.alert("Login Berhasil", "", [
          { text: "OK", onPress: () => router.push("/dashboard") },
        ]);
      }, 1000);
    } else {
      Alert.alert("Nama atau Password salah.");
    }
  };

  return (
    <LinearGradient
      colors={["#fce7f3", "#ede9fe", "#dbeafe"]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.gradientBg}
    >
      <SafeAreaView style={styles.container}>
        {/* Logo / Profile Photo */}
        <Animated.View style={[styles.logoArea, { opacity: logoAnim }]}>
          <View style={styles.logoRing}>
            <Image
              source={require("../assets/images/profile.jpg")}
              style={styles.profileImage}
            />
          </View>
          <Text style={styles.appName}>Personal Profile</Text>
          <Text style={styles.appSubtitle}>Silakan login untuk masuk ke aplikasi.</Text>
        </Animated.View>

        <Animated.View style={[styles.card, { opacity: fadeAnim, transform: [{ scale: scaleAnim }] }]}>
          {/* Name Input */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Nama Lengkap</Text>
            <View style={styles.inputWrapper}>
              <Ionicons name="person-outline" size={20} color="#c084fc" style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Masukkan Nama Lengkap"
                placeholderTextColor="#c4b5fd"
                value={name}
                onChangeText={setName}
              />
            </View>
          </View>

          {/* Password Input */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Password (NIM)</Text>
            <View style={styles.inputWrapper}>
              <Ionicons name="lock-closed-outline" size={20} color="#c084fc" style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Masukkan NIM"
                placeholderTextColor="#c4b5fd"
                secureTextEntry={!showPassword}
                value={password}
                onChangeText={setPassword}
              />
              <TouchableOpacity onPress={() => setShowPassword(!showPassword)} style={styles.eyeIcon}>
                <Ionicons name={showPassword ? "eye-outline" : "eye-off-outline"} size={20} color="#c084fc" />
              </TouchableOpacity>
            </View>
          </View>

          {/* Options Row */}
          <View style={styles.optionsRow}>
            <TouchableOpacity
              style={styles.checkboxContainer}
              onPress={() => setRememberMe(!rememberMe)}
              activeOpacity={0.7}
            >
              <View style={[styles.checkbox, rememberMe && styles.checkboxActive]}>
                {rememberMe && <Ionicons name="checkmark" size={14} color="#fff" />}
              </View>
              <Text style={styles.rememberText}>Ingat Saya</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => Alert.alert("Fitur belum tersedia.")}>
              <Text style={styles.forgotText}>Lupa Password?</Text>
            </TouchableOpacity>
          </View>

          {/* Login Button */}
          <TouchableOpacity onPress={handleLogin} disabled={isLoading} activeOpacity={0.85}>
            <LinearGradient
              colors={["#f472b6", "#a855f7", "#3b82f6"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.loginButton}
            >
              {isLoading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.loginButtonText}>Masuk</Text>
              )}
            </LinearGradient>
          </TouchableOpacity>
        </Animated.View>
      </SafeAreaView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  gradientBg: { flex: 1 },
  container: {
    flex: 1,
    justifyContent: "center",
    paddingHorizontal: 24,
  },
  logoArea: {
    alignItems: "center",
    marginBottom: 32,
  },
  logoRing: {
    width: 110,
    height: 110,
    borderRadius: 55,
    borderWidth: 4,
    borderColor: "#f9a8d4",
    padding: 3,
    marginBottom: 16,
    ...Platform.select({
      ios: { shadowColor: "#ec4899", shadowOffset: { width: 0, height: 6 }, shadowOpacity: 0.3, shadowRadius: 10 },
      android: { elevation: 8 },
    }),
  },
  profileImage: {
    width: "100%",
    height: "100%",
    borderRadius: 50,
  },
  appName: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#1e1b4b",
    marginBottom: 6,
  },
  appSubtitle: {
    fontSize: 14,
    color: "#7c3aed",
    textAlign: "center",
  },
  card: {
    backgroundColor: "rgba(255,255,255,0.92)",
    borderRadius: 24,
    padding: 24,
    ...Platform.select({
      ios: { shadowColor: "#c084fc", shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.15, shadowRadius: 16 },
      android: { elevation: 8 },
    }),
  },
  inputGroup: { marginBottom: 20 },
  label: {
    fontSize: 14,
    fontWeight: "600",
    color: "#7c3aed",
    marginBottom: 8,
  },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fdf4ff",
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: "#e9d5ff",
  },
  inputIcon: { paddingLeft: 14 },
  input: {
    flex: 1,
    paddingVertical: 14,
    paddingHorizontal: 12,
    fontSize: 15,
    color: "#1e1b4b",
  },
  eyeIcon: { padding: 14 },
  optionsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 28,
  },
  checkboxContainer: { flexDirection: "row", alignItems: "center" },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: "#d8b4fe",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 8,
  },
  checkboxActive: {
    backgroundColor: "#a855f7",
    borderColor: "#a855f7",
  },
  rememberText: { fontSize: 14, color: "#6b7280", fontWeight: "500" },
  forgotText: { fontSize: 14, color: "#ec4899", fontWeight: "600" },
  loginButton: {
    borderRadius: 14,
    paddingVertical: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  loginButtonText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#ffffff",
    letterSpacing: 0.5,
  },
});


export default LoginScreen;
