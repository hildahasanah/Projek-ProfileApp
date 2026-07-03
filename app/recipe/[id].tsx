import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, Image, ScrollView, TouchableOpacity, Platform, ActivityIndicator } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import axios from "axios";

// Import local JSON data
import recipesData from "../../data/recipes.json";

export default function DetailRecipeScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();

  const [recipe, setRecipe] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRecipe = async () => {
      setLoading(true);
      const targetId = Array.isArray(id) ? id[0] : id;

      // 1. Cari di resep lokal terlebih dahulu
      const localRecipe = recipesData.find((r) => String(r.id) === String(targetId));
      
      if (localRecipe) {
        setRecipe(localRecipe);
        setLoading(false);
      } else {
        // 2. Jika tidak ada di lokal, ambil dari API online
        try {
          const res = await axios.get(`https://dummyjson.com/recipes/${targetId}`);
          const apiData = res.data;
          
          // Sesuaikan format data API agar sama dengan format lokal
          const formattedRecipe = {
            id: String(apiData.id),
            name: apiData.name,
            category: apiData.mealType ? apiData.mealType[0] : "Rekomendasi",
            image: apiData.image,
            cookTime: `${apiData.cookTimeMinutes} Menit`,
            rating: apiData.rating,
            ingredients: apiData.ingredients || [],
            instructions: apiData.instructions || [],
          };
          setRecipe(formattedRecipe);
        } catch (error) {
          console.warn("Gagal mengambil detail resep dari API", error);
        } finally {
          setLoading(false);
        }
      }
    };

    if (id) {
      fetchRecipe();
    }
  }, [id]);

  if (loading) {
    return (
      <LinearGradient colors={["#fce4ec", "#e3f2fd"]} style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#e91e8c" />
        <Text style={styles.loadingText}>Memuat resep...</Text>
      </LinearGradient>
    );
  }

  if (!recipe) {
    return (
      <SafeAreaView style={styles.errorContainer}>
        <Text style={styles.errorText}>Resep tidak ditemukan.</Text>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Text style={styles.backButtonText}>Kembali</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  return (
    <LinearGradient
      colors={["#fce4ec", "#e3f2fd"]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={{ flex: 1 }}
    >
      <View style={styles.container}>
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 40 }}>
          {/* Large Image Header */}
          <View style={styles.imageContainer}>
            <Image source={{ uri: recipe.image }} style={styles.mainImage} />
            {/* Back Button Overlay */}
            <SafeAreaView style={styles.backButtonOverlay} edges={["top"]}>
              <TouchableOpacity onPress={() => router.back()} style={styles.navBackButton}>
                <Ionicons name="arrow-back" size={24} color="#fff" />
              </TouchableOpacity>
            </SafeAreaView>
          </View>

          {/* Recipe Content */}
          <View style={styles.contentContainer}>
            <View style={styles.headerInfo}>
              <Text style={styles.recipeName}>{recipe.name}</Text>
              <View style={styles.categoryBadge}>
                <Text style={styles.categoryText}>{recipe.category}</Text>
              </View>
            </View>

            <View style={styles.statsRow}>
              <View style={styles.statItem}>
                <Ionicons name="time-outline" size={20} color="#e91e8c" />
                <Text style={styles.statText}>{recipe.cookTime}</Text>
              </View>
              <View style={styles.statItem}>
                <Ionicons name="star" size={20} color="#f59e0b" />
                <Text style={styles.statText}>{recipe.rating} Rating</Text>
              </View>
            </View>

            {/* Ingredients */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Bahan-bahan</Text>
              <View style={styles.card}>
                {recipe.ingredients.map((item: string, index: number) => (
                  <View key={index} style={styles.listItem}>
                    <View style={styles.bullet} />
                    <Text style={styles.listText}>{item}</Text>
                  </View>
                ))}
              </View>
            </View>

            {/* Instructions */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Langkah Memasak</Text>
              <View style={styles.card}>
                {recipe.instructions.map((step: string, index: number) => (
                  <View key={index} style={styles.stepItem}>
                    <View style={styles.stepNumberContainer}>
                      <Text style={styles.stepNumber}>{index + 1}</Text>
                    </View>
                    <Text style={styles.stepText}>{step}</Text>
                  </View>
                ))}
              </View>
            </View>
          </View>
        </ScrollView>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "transparent" },
  loadingContainer: { flex: 1, justifyContent: "center", alignItems: "center" },
  loadingText: { marginTop: 12, color: "#e91e8c", fontWeight: "600" },
  errorContainer: { flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#fce4ec" },
  errorText: { fontSize: 16, color: "#64748b", marginBottom: 16 },
  backButton: { backgroundColor: "#e91e8c", paddingHorizontal: 20, paddingVertical: 10, borderRadius: 8 },
  backButtonText: { color: "#fff", fontWeight: "bold" },
  
  imageContainer: {
    width: "100%",
    height: 300,
    position: "relative",
  },
  mainImage: {
    width: "100%",
    height: "100%",
  },
  backButtonOverlay: {
    position: "absolute",
    top: 0,
    left: 16,
    zIndex: 10,
  },
  navBackButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(0,0,0,0.4)",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 8,
  },
  contentContainer: {
    flex: 1,
    backgroundColor: "rgba(255,255,255,0.85)",
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    marginTop: -30,
    paddingHorizontal: 24,
    paddingTop: 30,
  },
  headerInfo: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 20,
  },
  recipeName: {
    flex: 1,
    fontSize: 24,
    fontWeight: "bold",
    color: "#1e293b",
    marginRight: 16,
  },
  categoryBadge: {
    backgroundColor: "#fce4ec",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#f9a8d4",
  },
  categoryText: {
    fontSize: 12,
    color: "#e91e8c",
    fontWeight: "600",
  },
  statsRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 30,
    backgroundColor: "#ffffff",
    paddingVertical: 16,
    borderRadius: 16,
    ...Platform.select({
      ios: { shadowColor: "#000", shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 8 },
      android: { elevation: 2 },
    }),
  },
  statItem: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    borderRightWidth: 1,
    borderRightColor: "#f1f5f9",
  },
  statText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#475569",
    marginLeft: 8,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#1e293b",
    marginBottom: 16,
  },
  card: {
    backgroundColor: "#ffffff",
    borderRadius: 16,
    padding: 20,
    ...Platform.select({
      ios: { shadowColor: "#000", shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 8 },
      android: { elevation: 2 },
    }),
  },
  listItem: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 12,
  },
  bullet: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: "#f9a8d4",
    marginTop: 8,
    marginRight: 12,
  },
  listText: {
    flex: 1,
    fontSize: 15,
    color: "#475569",
    lineHeight: 22,
  },
  stepItem: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 16,
  },
  stepNumberContainer: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: "#fce4ec",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
    marginTop: 2,
  },
  stepNumber: {
    fontSize: 12,
    fontWeight: "bold",
    color: "#e91e8c",
  },
  stepText: {
    flex: 1,
    fontSize: 15,
    color: "#475569",
    lineHeight: 24,
  },
});