import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  TouchableOpacity,
  Platform,
  ScrollView,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import AnimatedCard from "../../components/AnimatedCard";

// Import local JSON data
import recipesData from "../../data/recipes.json";

// Daftar kategori filter lokal
const CATEGORIES = ["Semua", "Utama", "Lauk Pauk", "Berkuah", "Salad", "Camilan"];

export default function RecipeScreen() {
  const router = useRouter();
  
  // State sub-tab di atas halaman Recipe ("lokal" = resep lokal, "rekomendasi" = resep rekomendasi/home)
  const [subTab, setSubTab] = useState<"lokal" | "rekomendasi">("rekomendasi");

  // --- State untuk Tampilan Home (Resep Acak Lokal) ---
  const [randomBanner, setRandomBanner] = useState<any>(null);
  const [randomList, setRandomList] = useState<any[]>([]);

  // Mengacak resep lokal untuk banner dan daftar resep acak
  const setupIndoRecipes = () => {
    if (recipesData.length > 0) {
      // Ambil 1 resep acak untuk banner
      const bannerIndex = Math.floor(Math.random() * recipesData.length);
      setRandomBanner(recipesData[bannerIndex]);

      // Ambil list resep acak lainnya
      const shuffled = [...recipesData].sort(() => 0.5 - Math.random());
      setRandomList(shuffled.slice(0, 6)); // ambil 6 resep acak
    }
  };

  useEffect(() => {
    setupIndoRecipes();
  }, []);

  // --- Logic Filter Resep Lokal ---
  const [selectedCategory, setSelectedCategory] = useState("Semua");
  const filteredRecipes =
    selectedCategory === "Semua"
      ? recipesData
      : recipesData.filter((item) => item.category === selectedCategory);

  // Card image dengan fallback gradient
  const RecipeImage = ({ uri, name }: { uri: string; name: string }) => {
    const [hasError, setHasError] = useState(false);
    if (hasError) {
      return (
        <LinearGradient
          colors={["#fce7f3", "#ede9fe", "#dbeafe"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.cardImagePlaceholder}
        >
          <Ionicons name="restaurant" size={36} color="#a855f7" />
        </LinearGradient>
      );
    }
    return (
      <Image
        source={{ uri }}
        style={styles.cardImage}
        onError={() => setHasError(true)}
      />
    );
  };

  const renderRecipeItem = ({ item }: { item: any }) => (
    <AnimatedCard
      style={styles.card}
      onPress={() => router.push(`/recipe/${item.id}`)}
    >
      <View style={styles.cardImageWrapper}>
        <RecipeImage uri={item.image} name={item.name} />
        <LinearGradient
          colors={["transparent", "rgba(0,0,0,0.65)"]}
          style={styles.cardOverlay}
        >
          <Text style={styles.cardTitleOverlay} numberOfLines={2}>
            {item.name}
          </Text>
          <Text style={styles.cardTimeOverlay}>{item.cookTime}</Text>
        </LinearGradient>
      </View>
    </AnimatedCard>
  );

  return (
    <LinearGradient
      colors={["#fce4ec", "#e3f2fd"]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={{ flex: 1 }}
    >
      <SafeAreaView style={styles.container} edges={["bottom"]}>
        
        {/* Sub-Tab Selector */}
        <View style={styles.subTabContainer}>
          <TouchableOpacity
            style={[styles.subTabButton, subTab === "rekomendasi" && styles.subTabActive]}
            onPress={() => setSubTab("rekomendasi")}
          >
            <Text style={[styles.subTabText, subTab === "rekomendasi" && styles.subTabTextActive]}>
              Home
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.subTabButton, subTab === "lokal" && styles.subTabActive]}
            onPress={() => setSubTab("lokal")}
          >
            <Text style={[styles.subTabText, subTab === "lokal" && styles.subTabTextActive]}>
              Resep Lokal
            </Text>
          </TouchableOpacity>
        </View>

        {subTab === "lokal" ? (
          // === TAMPILAN 1: GRID RESEP LOKAL ===
          <View style={styles.listContainer}>
            <FlatList
              data={filteredRecipes}
              keyExtractor={(item) => item.id}
              renderItem={renderRecipeItem}
              numColumns={2}
              contentContainerStyle={styles.flatListContent}
              columnWrapperStyle={styles.rowWrapper}
              showsVerticalScrollIndicator={false}
              ListHeaderComponent={
                <View>
                  <View style={styles.pageTitleContainer}>
                    <Text style={styles.pageTitle}>Menu Favorit</Text>
                    <Text style={styles.pageSubtitle}>
                      Temukan resep masakan lokal terbaik.
                    </Text>
                  </View>

                  <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    style={styles.categoryScroll}
                    contentContainerStyle={styles.categoryScrollContent}
                  >
                    {CATEGORIES.map((cat) => {
                      const isActive = selectedCategory === cat;
                      return (
                        <TouchableOpacity
                          key={cat}
                          style={[
                            styles.categoryChip,
                            isActive && styles.categoryChipActive,
                          ]}
                          onPress={() => setSelectedCategory(cat)}
                          activeOpacity={0.75}
                        >
                          {isActive ? (
                            <LinearGradient
                              colors={["#f9a8d4", "#93c5fd"]}
                              start={{ x: 0, y: 0 }}
                              end={{ x: 1, y: 0 }}
                              style={styles.categoryChipGradient}
                            >
                              <Text style={styles.categoryChipTextActive}>{cat}</Text>
                            </LinearGradient>
                          ) : (
                            <Text style={styles.categoryChipText}>{cat}</Text>
                          )}
                        </TouchableOpacity>
                      );
                    })}
                  </ScrollView>
                </View>
              }
            />
          </View>
        ) : (
          // === TAMPILAN 2: HOME (BAHASA INDONESIA SEPENUHNYA) ===
          <ScrollView 
            contentContainerStyle={styles.scrollContentRekomendasi} 
            showsVerticalScrollIndicator={false}
          >
            <View style={styles.apiViewContainer}>
              <View style={styles.pageTitleContainer}>
                <Text style={styles.pageTitle}>Recipe-App</Text>
              </View>

              {/* Banner Resep Utama */}
              {randomBanner && (
                <TouchableOpacity
                  activeOpacity={0.9}
                  onPress={() => router.push(`/recipe/${randomBanner.id}`)}
                >
                  <View style={styles.bannerCard}>
                    <Image source={{ uri: randomBanner.image }} style={styles.bannerImage} />
                    <LinearGradient
                      colors={["transparent", "rgba(0,0,0,0.7)"]}
                      style={styles.bannerOverlay}
                    >
                      <Text style={styles.bannerTitle}>{randomBanner.name}</Text>
                      <Text style={styles.bannerSubtitle}>{randomBanner.cookTime}</Text>
                    </LinearGradient>
                  </View>
                </TouchableOpacity>
              )}

              {/* Student Info Card */}
              <View style={styles.studentCard}>
                <Text style={styles.studentName}>Hilda Hasanah</Text>
                <Text style={styles.studentNim}>23050026</Text>
              </View>

              {/* Resep Acak */}
              <Text style={styles.sectionHeader}>Resep Acak</Text>
              <ScrollView 
                horizontal 
                showsHorizontalScrollIndicator={false} 
                contentContainerStyle={styles.horizontalScrollContent}
              >
                {randomList.map((item) => (
                  <TouchableOpacity
                    key={item.id}
                    activeOpacity={0.85}
                    onPress={() => router.push(`/recipe/${item.id}`)}
                  >
                    <View style={styles.horizontalCard}>
                      <Image source={{ uri: item.image }} style={styles.horizontalImage} />
                      <View style={styles.horizontalCardBody}>
                        <Text style={styles.horizontalCardTitle} numberOfLines={1}>
                          {item.name}
                        </Text>
                        <Text style={styles.horizontalCardSubtitle}>
                          {item.cookTime}
                        </Text>
                      </View>
                    </View>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>
          </ScrollView>
        )}

        {/* Header Overlay */}
        <LinearGradient
          colors={["#f9a8d4", "#93c5fd"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={styles.heroBackground}
        >
          <SafeAreaView edges={["top"]} style={styles.heroNav}>
            <TouchableOpacity
              onPress={() => router.replace("/dashboard")}
              style={styles.backButton}
            >
              <Ionicons name="arrow-back" size={24} color="#fff" />
            </TouchableOpacity>
            <Text style={styles.heroTitle}>Koleksi Resep</Text>
            <View style={{ width: 40 }} />
          </SafeAreaView>
        </LinearGradient>
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "transparent" },
  heroBackground: {
    height: 120,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    zIndex: 10,
  },
  heroNav: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  backButton: {
    padding: 8,
    backgroundColor: "rgba(255,255,255,0.3)",
    borderRadius: 20,
  },
  heroTitle: { fontSize: 18, fontWeight: "700", color: "#fff" },
  
  // Sub-Tab Selector
  subTabContainer: {
    flexDirection: "row",
    marginTop: 130,
    marginHorizontal: 16,
    backgroundColor: "rgba(255,255,255,0.5)",
    borderRadius: 25,
    padding: 4,
    borderWidth: 1.5,
    borderColor: "#f9a8d4",
  },
  subTabButton: {
    flex: 1,
    paddingVertical: 10,
    alignItems: "center",
    borderRadius: 20,
  },
  subTabActive: {
    backgroundColor: "#e91e8c",
  },
  subTabText: {
    fontSize: 13,
    fontWeight: "700",
    color: "#e91e8c",
  },
  subTabTextActive: {
    color: "#fff",
  },

  // Grid Tampilan Lokal
  listContainer: {
    flex: 1,
  },
  flatListContent: {
    paddingHorizontal: 16,
    paddingBottom: 95,
    paddingTop: 15,
  },
  rowWrapper: {
    justifyContent: "space-between",
    marginBottom: 16,
  },
  pageTitleContainer: {
    marginBottom: 16,
    marginTop: 10,
  },
  pageTitle: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#1e1b4b",
    marginBottom: 4,
  },
  pageSubtitle: {
    fontSize: 14,
    color: "#6b7280",
  },

  // Category Filter Chips
  categoryScroll: {
    marginBottom: 20,
  },
  categoryScrollContent: {
    paddingVertical: 4,
    paddingRight: 8,
  },
  categoryChip: {
    paddingHorizontal: 18,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: "#fff",
    marginRight: 10,
    borderWidth: 1.5,
    borderColor: "#f9a8d4",
    overflow: "hidden",
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.08,
        shadowRadius: 4,
      },
      android: { elevation: 2 },
    }),
  },
  categoryChipActive: {
    borderColor: "transparent",
    backgroundColor: "transparent",
    padding: 0,
  },
  categoryChipGradient: {
    paddingHorizontal: 18,
    paddingVertical: 8,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  categoryChipText: {
    fontSize: 13,
    fontWeight: "600",
    color: "#f472b6",
  },
  categoryChipTextActive: {
    fontSize: 13,
    fontWeight: "700",
    color: "#fff",
  },

  // Card Layout
  card: {
    width: "47%",
    borderRadius: 16,
    overflow: "hidden",
    backgroundColor: "#000",
    ...Platform.select({
      ios: {
        shadowColor: "#c084fc",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.15,
        shadowRadius: 8,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  cardImageWrapper: {
    width: "100%",
    height: 160,
  },
  cardImage: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  cardImagePlaceholder: {
    width: "100%",
    height: "100%",
    alignItems: "center",
    justifyContent: "center",
  },
  cardOverlay: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 10,
    paddingTop: 30,
    paddingBottom: 10,
    justifyContent: "flex-end",
  },
  cardTitleOverlay: {
    fontSize: 14,
    fontWeight: "700",
    color: "#fff",
    marginBottom: 2,
  },
  cardTimeOverlay: {
    fontSize: 12,
    color: "rgba(255,255,255,0.85)",
  },

  // --- Style Tampilan Home ---
  scrollContentRekomendasi: {
    paddingHorizontal: 16,
    paddingBottom: 100,
    paddingTop: 15,
  },
  apiViewContainer: {
    flex: 1,
  },
  bannerCard: {
    position: "relative",
    borderRadius: 24,
    overflow: "hidden",
    height: 250,
    marginBottom: 16,
    ...Platform.select({
      ios: { shadowColor: "#000", shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.15, shadowRadius: 10 },
      android: { elevation: 5 },
    }),
  },
  bannerImage: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  bannerOverlay: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    padding: 16,
    paddingTop: 50,
  },
  bannerTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#fff",
    textShadowColor: "rgba(0,0,0,0.5)",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
  },
  bannerSubtitle: {
    fontSize: 14,
    color: "rgba(255,255,255,0.9)",
    marginTop: 4,
  },
  studentCard: {
    backgroundColor: "rgba(233, 30, 140, 0.15)",
    padding: 16,
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: "#f9a8d4",
    marginBottom: 20,
  },
  studentName: {
    fontSize: 16,
    fontWeight: "700",
    color: "#e91e8c",
  },
  studentNim: {
    fontSize: 13,
    color: "#475569",
    marginTop: 2,
    fontWeight: "600",
  },
  sectionHeader: {
    fontSize: 18,
    fontWeight: "700",
    color: "#1e1b4b",
    marginBottom: 12,
  },
  horizontalScrollContent: {
    gap: 14,
    paddingBottom: 10,
  },
  horizontalCard: {
    width: 160,
    backgroundColor: "#fff",
    borderRadius: 16,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "#e3f2fd",
    ...Platform.select({
      ios: { shadowColor: "#000", shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.08, shadowRadius: 6 },
      android: { elevation: 3 },
    }),
  },
  horizontalImage: {
    width: "100%",
    height: 110,
    resizeMode: "cover",
  },
  horizontalCardBody: {
    padding: 10,
  },
  horizontalCardTitle: {
    fontSize: 13,
    fontWeight: "700",
    color: "#1e1b4b",
  },
  horizontalCardSubtitle: {
    fontSize: 11,
    color: "#94a3b8",
    marginTop: 2,
  },
});
