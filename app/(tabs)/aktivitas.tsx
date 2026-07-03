import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Modal, TextInput, KeyboardAvoidingView, Platform, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import AsyncStorage from "@react-native-async-storage/async-storage";
import ActivityItem from "../../components/activity/ActivityItem";

interface ActivityItemType {
  time: string;
  title: string;
  icon: string;
}

const DEFAULT_ACTIVITIES: ActivityItemType[] = [
  { time: "06.00", title: "Bangun", icon: "sunny-outline" },
  { time: "07.00", title: "Sarapan", icon: "fast-food-outline" },
  { time: "08.00", title: "Berangkat Kuliah", icon: "bus-outline" },
  { time: "09.00", title: "Perkuliahan", icon: "library-outline" },
  { time: "12.00", title: "Istirahat", icon: "cafe-outline" },
  { time: "13.00", title: "Praktikum", icon: "laptop-outline" },
  { time: "16.00", title: "Pulang", icon: "home-outline" },
  { time: "19.00", title: "Belajar", icon: "book-outline" },
  { time: "21.00", title: "Mengerjakan Tugas", icon: "document-text-outline" },
  { time: "22.30", title: "Tidur", icon: "moon-outline" },
];

export default function ActivityTabScreen() {
  const router = useRouter();
  const [activities, setActivities] = useState<ActivityItemType[]>(DEFAULT_ACTIVITIES);
  const [modalVisible, setModalVisible] = useState(false);
  const [tempActivities, setTempActivities] = useState<ActivityItemType[]>([]);

  useEffect(() => {
    (async () => {
      try {
        const saved = await AsyncStorage.getItem("userActivities");
        if (saved) {
          setActivities(JSON.parse(saved));
        }
      } catch (e) {
        console.warn("Failed to load activities data", e);
      }
    })();
  }, []);

  const handleOpenEdit = () => {
    setTempActivities(activities.map(item => ({ ...item })));
    setModalVisible(true);
  };

  const handleSave = async () => {
    try {
      await AsyncStorage.setItem("userActivities", JSON.stringify(tempActivities));
      setActivities(tempActivities);
      setModalVisible(false);
      Alert.alert("Sukses", "Aktivitas harian berhasil diperbarui!");
    } catch (e) {
      Alert.alert("Error", "Gagal menyimpan aktivitas harian.");
    }
  };

  const handleUpdateItem = (index: number, field: keyof ActivityItemType, value: string) => {
    const updated = [...tempActivities];
    updated[index] = { ...updated[index], [field]: value };
    setTempActivities(updated);
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
            <Text style={styles.pageTitle}>Jadwal Rutin</Text>
            <Text style={styles.pageSubtitle}>Aktivitas harian dari pagi hingga malam.</Text>
          </View>

          <View style={styles.timelineContainer}>
            {activities.map((item, index) => (
              <ActivityItem
                key={index}
                index={index}
                time={item.time}
                title={item.title}
                icon={item.icon as any}
                isLast={index === activities.length - 1}
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
                <Text style={styles.editButtonText}>Edit Aktivitas Harian</Text>
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
            <Text style={styles.heroTitle}>Aktivitas Harian</Text>
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
                <Text style={styles.modalTitle}>Edit Aktivitas Harian</Text>
                <TouchableOpacity onPress={() => setModalVisible(false)}>
                  <Ionicons name="close" size={24} color="#64748b" />
                </TouchableOpacity>
              </View>

              <ScrollView contentContainerStyle={styles.modalForm} showsVerticalScrollIndicator={false}>
                {tempActivities.map((item, index) => (
                  <View key={index} style={styles.itemEditorContainer}>
                    <Text style={styles.itemHeader}>Aktivitas ke-{index + 1}</Text>
                    
                    <View style={styles.inputGroup}>
                      <Text style={styles.inputLabel}>Jam Kegiatan</Text>
                      <TextInput
                        style={styles.textInput}
                        value={item.time}
                        placeholder="Contoh: 06.00"
                        onChangeText={(val) => handleUpdateItem(index, "time", val)}
                      />
                    </View>

                    <View style={styles.inputGroup}>
                      <Text style={styles.inputLabel}>Nama Aktivitas</Text>
                      <TextInput
                        style={styles.textInput}
                        value={item.title}
                        onChangeText={(val) => handleUpdateItem(index, "title", val)}
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
