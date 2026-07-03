import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Modal, TextInput, KeyboardAvoidingView, Platform, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import AsyncStorage from "@react-native-async-storage/async-storage";
import TimelineItem from "../../components/education/TimelineItem";

interface EducationItem {
  title: string;
  year: string;
  major: string;
  icon: string;
}

const DEFAULT_EDUCATION: EducationItem[] = [
  {
    title: "Sekolah Dasar",
    year: "2010 - 2016",
    major: "Pendidikan Umum",
    icon: "school-outline",
  },
  {
    title: "Sekolah Menengah Pertama",
    year: "2016 - 2019",
    major: "Pendidikan Umum",
    icon: "library-outline",
  },
  {
    title: "Sekolah Menengah Kejuruan",
    year: "2019 - 2022",
    major: "Rekayasa Perangkat Lunak",
    icon: "laptop-outline",
  },
  {
    title: "Universitas Yatsi Madani",
    year: "2023 - Sekarang",
    major: "Ilmu Komputer",
    icon: "business-outline",
  },
];

export default function EducationTabScreen() {
  const router = useRouter();
  const [history, setHistory] = useState<EducationItem[]>(DEFAULT_EDUCATION);
  const [modalVisible, setModalVisible] = useState(false);
  const [tempHistory, setTempHistory] = useState<EducationItem[]>([]);

  useEffect(() => {
    (async () => {
      try {
        const saved = await AsyncStorage.getItem("userEducation");
        if (saved) {
          setHistory(JSON.parse(saved));
        }
      } catch (e) {
        console.warn("Failed to load education data", e);
      }
    })();
  }, []);

  const handleOpenEdit = () => {
    setTempHistory(history.map(item => ({ ...item })));
    setModalVisible(true);
  };

  const handleSave = async () => {
    try {
      await AsyncStorage.setItem("userEducation", JSON.stringify(tempHistory));
      setHistory(tempHistory);
      setModalVisible(false);
      Alert.alert("Sukses", "Riwayat pendidikan berhasil diperbarui!");
    } catch (e) {
      Alert.alert("Error", "Gagal menyimpan riwayat pendidikan.");
    }
  };

  const handleUpdateItem = (index: number, field: keyof EducationItem, value: string) => {
    const updated = [...tempHistory];
    updated[index] = { ...updated[index], [field]: value };
    setTempHistory(updated);
  };

  return (
    <LinearGradient
      colors={["#fce4ec", "#e3f2fd"]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={{ flex: 1 }}
    >
      <SafeAreaView style={styles.container} edges={["bottom"]}>
        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          <View style={styles.pageTitleContainer}>
            <Text style={styles.pageTitle}>Perjalanan Edukasi</Text>
            <Text style={styles.pageSubtitle}>Riwayat pendidikan formal dari dasar hingga perguruan tinggi.</Text>
          </View>

          <View style={styles.timelineContainer}>
            {history.map((item, index) => (
              <TimelineItem
                key={index}
                index={index}
                title={item.title}
                year={item.year}
                major={item.major}
                icon={item.icon as any}
                isLast={index === history.length - 1}
              />
            ))}
          </View>

          {/* Edit Button */}
          <View style={styles.buttonContainer}>
            <TouchableOpacity onPress={handleOpenEdit} activeOpacity={0.85}>
              <LinearGradient
                colors={["#f9a8d4", "#93c5fd"]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.editButton}
              >
                <Ionicons name="create-outline" size={20} color="#fff" />
                <Text style={styles.editButtonText}>Edit Riwayat Pendidikan</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </ScrollView>

        {/* Header overlay rendered after ScrollView to remain clickable */}
        <LinearGradient colors={["#f9a8d4", "#93c5fd"]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={styles.heroBackground}>
          <SafeAreaView edges={["top"]} style={styles.heroNav}>
            <TouchableOpacity onPress={() => router.replace("/dashboard")} style={styles.backButton}>
              <Ionicons name="arrow-back" size={24} color="#fff" />
            </TouchableOpacity>
            <Text style={styles.heroTitle}>Riwayat Pendidikan</Text>
            <View style={{ width: 40 }} />
          </SafeAreaView>
        </LinearGradient>

        {/* Edit Modal */}
        <Modal visible={modalVisible} animationType="slide" transparent={true}>
          <View style={styles.modalOverlay}>
            <KeyboardAvoidingView
              behavior={Platform.OS === "ios" ? "padding" : "height"}
              style={styles.modalContent}
            >
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>Edit Riwayat Pendidikan</Text>
                <TouchableOpacity onPress={() => setModalVisible(false)}>
                  <Ionicons name="close" size={24} color="#64748b" />
                </TouchableOpacity>
              </View>

              <ScrollView contentContainerStyle={styles.modalForm} showsVerticalScrollIndicator={false}>
                {tempHistory.map((item, index) => (
                  <View key={index} style={styles.itemEditorContainer}>
                    <Text style={styles.itemHeader}>Jenjang {index + 1}: {item.title}</Text>
                    
                    <View style={styles.inputGroup}>
                      <Text style={styles.inputLabel}>Nama Sekolah / Kampus</Text>
                      <TextInput
                        style={styles.textInput}
                        value={item.title}
                        onChangeText={(val) => handleUpdateItem(index, "title", val)}
                      />
                    </View>

                    <View style={styles.inputGroup}>
                      <Text style={styles.inputLabel}>Tahun Pendidikan</Text>
                      <TextInput
                        style={styles.textInput}
                        value={item.year}
                        placeholder="Contoh: 2010 - 2016"
                        onChangeText={(val) => handleUpdateItem(index, "year", val)}
                      />
                    </View>

                    <View style={styles.inputGroup}>
                      <Text style={styles.inputLabel}>Jurusan / Program Studi</Text>
                      <TextInput
                        style={styles.textInput}
                        value={item.major}
                        onChangeText={(val) => handleUpdateItem(index, "major", val)}
                      />
                    </View>
                  </View>
                ))}
              </ScrollView>

              <View style={styles.modalFooter}>
                <TouchableOpacity style={styles.cancelBtn} onPress={() => setModalVisible(false)}>
                  <Text style={styles.cancelBtnText}>Batal</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={handleSave} style={{ flex: 2 }}>
                  <LinearGradient
                    colors={["#f9a8d4", "#93c5fd"]}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                    style={styles.saveBtn}
                  >
                    <Text style={styles.saveBtnText}>Simpan</Text>
                  </LinearGradient>
                </TouchableOpacity>
              </View>
            </KeyboardAvoidingView>
          </View>
        </Modal>
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
  scrollContent: {
    paddingTop: 140,
    paddingBottom: 85, // Tambah padding bawah agar tidak tertutup tab bar
  },
  pageTitleContainer: {
    paddingHorizontal: 24,
    marginBottom: 24,
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
  timelineContainer: {
    paddingVertical: 10,
  },
  buttonContainer: {
    paddingHorizontal: 24,
    marginTop: 20,
    marginBottom: 20,
  },
  editButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 16,
    borderRadius: 16,
  },
  editButtonText: { color: "#fff", fontSize: 16, fontWeight: "bold", marginLeft: 8 },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "flex-end",
  },
  modalContent: {
    backgroundColor: "#fff",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: "85%",
    paddingBottom: Platform.OS === "ios" ? 40 : 24,
  },
  modalHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 24,
    paddingVertical: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#f1f5f9",
  },
  modalTitle: { fontSize: 18, fontWeight: "bold", color: "#1e293b" },
  modalForm: { padding: 24 },
  itemEditorContainer: {
    marginBottom: 24,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#f1f5f9",
  },
  itemHeader: { fontSize: 15, fontWeight: "700", color: "#a855f7", marginBottom: 16 },
  inputGroup: { marginBottom: 12 },
  inputLabel: { fontSize: 13, fontWeight: "600", color: "#7c3aed", marginBottom: 6 },
  textInput: {
    backgroundColor: "#fdf4ff",
    borderWidth: 1.5,
    borderColor: "#e9d5ff",
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 15,
    color: "#1e293b",
  },
  modalFooter: {
    flexDirection: "row",
    paddingHorizontal: 24,
    paddingVertical: 16,
    borderTopWidth: 1,
    borderTopColor: "#f1f5f9",
    gap: 12,
  },
  cancelBtn: {
    flex: 1,
    backgroundColor: "#f1f5f9",
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  cancelBtnText: { color: "#475569", fontSize: 15, fontWeight: "600" },
  saveBtn: {
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  saveBtnText: { color: "#fff", fontSize: 15, fontWeight: "600" },
});
