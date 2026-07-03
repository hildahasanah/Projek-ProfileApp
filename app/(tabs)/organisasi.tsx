import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import { Alert, KeyboardAvoidingView, Modal, Platform, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

interface OrgItem {
  name: string;
  role: string;
  year: string;
  description: string;
}

const DEFAULT_ORGS: OrgItem[] = [
  {
    name: "Himpunan Mahasiswa Ilmu Komputer (HIMAKOM)",
    role: "Anggota Divisi Akademik",
    year: "2024 - Sekarang",
    description: "Anggota Divisi Akademik bertanggung jawab untuk mengelola, menyebarkan informasi publik seputar kegiatan akademik, serta menjembatani komunikasi antar mahasiswa terkait urusan akademik.",
  },
  {
    name: "Pramuka & Saka Bakti Husada (SBH)",
    role: "Anggota",
    year: "2018 - 2021",
    description: "Berpartisipasi aktif dalam kegiatan pramuka, mengikuti berbagai kegiatan,seperti menjaga lingkungan yang sehat dan bersih",
  },
  {
    name: "OSIS Smai Sirojul",
    role: "Sekretaris",
    year: "2020 - 2021",
    description: "Mengelola surat masuk dan keluar, mencatat notulensi rapat bulanan OSIS, serta membantu penyusunan proposal kegiatan kesiswaan.",
  },
];

export default function OrganisasiTabScreen() {
  const router = useRouter();
  const [orgs, setOrgs] = useState<OrgItem[]>(DEFAULT_ORGS);
  const [modalVisible, setModalVisible] = useState(false);
  const [tempOrgs, setTempOrgs] = useState<OrgItem[]>([]);

  useEffect(() => {
    (async () => {
      try {
        const saved = await AsyncStorage.getItem("userOrgs");
        if (saved) {
          setOrgs(JSON.parse(saved));
        }
      } catch (e) {
        console.warn("Failed to load organizations data", e);
      }
    })();
  }, []);

  const handleOpenEdit = () => {
    setTempOrgs(orgs.map(item => ({ ...item })));
    setModalVisible(true);
  };

  const handleSave = async () => {
    try {
      await AsyncStorage.setItem("userOrgs", JSON.stringify(tempOrgs));
      setOrgs(tempOrgs);
      setModalVisible(false);
      Alert.alert("Sukses", "Riwayat organisasi berhasil diperbarui!");
    } catch (e) {
      Alert.alert("Error", "Gagal menyimpan riwayat organisasi.");
    }
  };

  const handleUpdateItem = (index: number, field: keyof OrgItem, value: string) => {
    const updated = [...tempOrgs];
    updated[index] = { ...updated[index], [field]: value };
    setTempOrgs(updated);
  };

  const handleAddEmpty = () => {
    setTempOrgs([
      ...tempOrgs,
      {
        name: "Nama Organisasi Baru",
        role: "Jabatan",
        year: "Tahun keaktifan",
        description: "Deskripsi singkat mengenai tugas/tanggung jawab.",
      }
    ]);
  };

  const handleRemoveItem = (index: number) => {
    Alert.alert(
      "Hapus Organisasi",
      "Apakah Anda yakin ingin menghapus riwayat organisasi ini?",
      [
        { text: "Batal", style: "cancel" },
        {
          text: "Hapus", style: "destructive", onPress: () => {
            setTempOrgs(tempOrgs.filter((_, i) => i !== index));
          }
        }
      ]
    );
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
            <Text style={styles.pageTitle}>Riwayat Organisasi</Text>
            <Text style={styles.pageSubtitle}>Daftar keanggotaan dan pengalaman organisasi.</Text>
          </View>

          <View style={styles.listContainer}>
            {orgs.map((item, index) => (
              <View key={index} style={styles.orgCard}>
                <View style={styles.cardHeader}>
                  <LinearGradient
                    colors={["#f9a8d4", "#93c5fd"]}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={styles.iconContainer}
                  >
                    <Ionicons name="people" size={20} color="#fff" />
                  </LinearGradient>
                  <View style={styles.titleWrapper}>
                    <Text style={styles.orgName}>{item.name}</Text>
                    <Text style={styles.orgRole}>{item.role}</Text>
                    <Text style={styles.orgYear}>{item.year}</Text>
                  </View>
                </View>
                {item.description ? (
                  <View style={styles.descriptionWrapper}>
                    <Text style={styles.orgDescription}>{item.description}</Text>
                  </View>
                ) : null}
              </View>
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
                <Text style={styles.editButtonText}>Edit Riwayat Organisasi</Text>
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
            <Text style={styles.heroTitle}>Organisasi</Text>
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
                <Text style={styles.modalTitle}>Edit Riwayat Organisasi</Text>
                <TouchableOpacity onPress={() => setModalVisible(false)}>
                  <Ionicons name="close" size={24} color="#64748b" />
                </TouchableOpacity>
              </View>

              <ScrollView contentContainerStyle={styles.modalForm} showsVerticalScrollIndicator={false}>
                {tempOrgs.map((item, index) => (
                  <View key={index} style={styles.itemEditorContainer}>
                    <View style={styles.editorItemHeader}>
                      <Text style={styles.itemHeader}>Organisasi ke-{index + 1}</Text>
                      <TouchableOpacity onPress={() => handleRemoveItem(index)} style={styles.deleteBtn}>
                        <Ionicons name="trash-outline" size={18} color="#f43f5e" />
                        <Text style={styles.deleteBtnText}>Hapus</Text>
                      </TouchableOpacity>
                    </View>

                    <View style={styles.inputGroup}>
                      <Text style={styles.inputLabel}>Nama Organisasi</Text>
                      <TextInput
                        style={styles.textInput}
                        value={item.name}
                        onChangeText={(val) => handleUpdateItem(index, "name", val)}
                      />
                    </View>

                    <View style={styles.inputGroup}>
                      <Text style={styles.inputLabel}>Jabatan / Divisi</Text>
                      <TextInput
                        style={styles.textInput}
                        value={item.role}
                        onChangeText={(val) => handleUpdateItem(index, "role", val)}
                      />
                    </View>

                    <View style={styles.inputGroup}>
                      <Text style={styles.inputLabel}>Tahun Pendidikan / Keaktifan</Text>
                      <TextInput
                        style={styles.textInput}
                        value={item.year}
                        placeholder="Contoh: 2023 - Sekarang"
                        onChangeText={(val) => handleUpdateItem(index, "year", val)}
                      />
                    </View>

                    <View style={styles.inputGroup}>
                      <Text style={styles.inputLabel}>Deskripsi Tugas / Kegiatan</Text>
                      <TextInput
                        style={[styles.textInput, styles.textArea]}
                        value={item.description}
                        multiline
                        numberOfLines={3}
                        onChangeText={(val) => handleUpdateItem(index, "description", val)}
                      />
                    </View>
                  </View>
                ))}

                <TouchableOpacity onPress={handleAddEmpty} style={styles.addHobbyBtn}>
                  <Ionicons name="add-circle-outline" size={20} color="#a855f7" />
                  <Text style={styles.addHobbyBtnText}>Tambah Organisasi Baru</Text>
                </TouchableOpacity>
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
    paddingBottom: 95,
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
  listContainer: {
    paddingHorizontal: 16,
    gap: 16,
  },
  orgCard: {
    backgroundColor: "#ffffff",
    borderRadius: 20,
    padding: 16,
    ...Platform.select({
      ios: { shadowColor: "#c084fc", shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.1, shadowRadius: 8 },
      android: { elevation: 3 },
    }),
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
  },
  iconContainer: {
    width: 44,
    height: 44,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
  },
  titleWrapper: {
    marginLeft: 14,
    flex: 1,
  },
  orgName: {
    fontSize: 15,
    fontWeight: "700",
    color: "#1e1b4b",
  },
  orgRole: {
    fontSize: 13,
    color: "#e91e8c",
    fontWeight: "600",
    marginTop: 2,
  },
  orgYear: {
    fontSize: 11,
    color: "#94a3b8",
    fontWeight: "500",
    marginTop: 1,
  },
  descriptionWrapper: {
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: "#f1f5f9",
  },
  orgDescription: {
    fontSize: 13,
    color: "#475569",
    lineHeight: 20,
  },
  buttonContainer: {
    paddingHorizontal: 24,
    marginTop: 24,
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

  // Modal Styles
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
  editorItemHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  itemHeader: { fontSize: 15, fontWeight: "700", color: "#e91e8c" },
  deleteBtn: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff0f2",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
  },
  deleteBtnText: {
    fontSize: 12,
    color: "#f43f5e",
    fontWeight: "600",
    marginLeft: 4,
  },
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
  textArea: {
    height: 80,
    textAlignVertical: "top",
  },
  addHobbyBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 14,
    borderRadius: 14,
    borderWidth: 1.5,
    borderStyle: "dashed",
    borderColor: "#a855f7",
    marginTop: 8,
    marginBottom: 24,
  },
  addHobbyBtnText: { fontSize: 14, fontWeight: "600", color: "#a855f7", marginLeft: 8 },
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
