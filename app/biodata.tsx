import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import { Alert, Image, KeyboardAvoidingView, Linking, Modal, Platform, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import InfoRow from "../components/biodata/InfoRow";
import SectionCard from "../components/biodata/SectionCard";
import SkillChip from "../components/biodata/SkillChip";

type ModalType = "profile" | "skills" | "hobbies" | null;

const HOBBY_ICONS = [
  "code-slash", "color-palette", "musical-notes", "book", "airplane", "camera",
  "football", "bicycle", "heart", "star", "game-controller", "leaf",
  "film", "brush", "pizza", "flower", "globe", "headset",
];

export default function BiodataScreen() {
  const router = useRouter();

  const [profile, setProfile] = useState({
    name: "Hilda Hasanah",
    nim: "23050026",
    prodi: "Ilmu Komputer",
    fakultas: "Teknologi Dan Bisnis",
    univ: "Universitas Yatsi Madani",
    alamat: "Tangerang, Banten",
    email: "[hildahasanah1501@gmail.com]",
    nohp: "+62 812-9048-4676",
    ttl: "Tangerang, 15 Januari 2004",
    tentang: "Saya adalah mahasiswa aktif di Universitas Yatsi Madani yang antusias terhadap pengembangan teknologi. Saya cukup memiliki minat besar dalam pembuatan aplikasi mobile dan web."
  });

  const [skills, setSkills] = useState<string[]>(["React Native", "HTML", "CSS", "PHP", "Python"]);
  const [hobbies, setHobbies] = useState([
    { name: "Coding", icon: "code-slash" }, { name: "Design", icon: "color-palette" },
    { name: "Music", icon: "musical-notes" }, { name: "Reading", icon: "book" },
    { name: "Traveling", icon: "airplane" }, { name: "Photography", icon: "camera" }
  ]);

  const [activeModal, setActiveModal] = useState<ModalType>(null);
  const [tempProfile, setTempProfile] = useState({ ...profile });
  const [tempSkills, setTempSkills] = useState<string[]>([]);
  const [tempSkillInput, setTempSkillInput] = useState("");
  const [tempHobbies, setTempHobbies] = useState<{ name: string; icon: string }[]>([]);

  const socials = [
    { name: "Instagram", icon: "logo-instagram", color: "#E1306C", url: "https://www.instagram.com/hildashine_?igsh=dmRydWI2cnJpb2oy" },
    { name: "GitHub", icon: "logo-github", color: "#333", url: "https://github.com/hildahasanah" },
    { name: "TikTok", icon: "logo-tiktok", color: "#ff0050", url: "https://www.tiktok.com/@hilda_hsn?_r=1&_t=ZS-97fJ9oFqrUW" }
  ];

  useEffect(() => {
    (async () => {
      try {
        const savedProfile = await AsyncStorage.getItem("userProfile");
        if (savedProfile) setProfile(JSON.parse(savedProfile));
        const savedSkills = await AsyncStorage.getItem("userSkills");
        if (savedSkills) setSkills(JSON.parse(savedSkills));
        const savedHobbies = await AsyncStorage.getItem("userHobbies");
        if (savedHobbies) setHobbies(JSON.parse(savedHobbies));
      } catch (e) { }
    })();
  }, []);

  // ── Profile handlers ──
  const openProfileModal = () => { setTempProfile({ ...profile }); setActiveModal("profile"); };
  const saveProfile = async () => {
    try {
      await AsyncStorage.setItem("userProfile", JSON.stringify(tempProfile));
      setProfile(tempProfile);
      setActiveModal(null);
      Alert.alert("Sukses", "Profil berhasil diperbarui!");
    } catch (e) { Alert.alert("Error", "Gagal menyimpan profil."); }
  };

  // ── Skills handlers ──
  const openSkillsModal = () => { setTempSkills([...skills]); setTempSkillInput(""); setActiveModal("skills"); };
  const addSkill = () => {
    const trimmed = tempSkillInput.trim();
    if (!trimmed) return;
    if (tempSkills.includes(trimmed)) { Alert.alert("Duplikat", "Keahlian sudah ada!"); return; }
    setTempSkills([...tempSkills, trimmed]);
    setTempSkillInput("");
  };
  const removeSkill = (index: number) => setTempSkills(tempSkills.filter((_, i) => i !== index));
  const saveSkills = async () => {
    try {
      await AsyncStorage.setItem("userSkills", JSON.stringify(tempSkills));
      setSkills(tempSkills);
      setActiveModal(null);
      Alert.alert("Sukses", "Keahlian berhasil diperbarui!");
    } catch (e) { Alert.alert("Error", "Gagal menyimpan keahlian."); }
  };

  // ── Hobbies handlers ──
  const openHobbiesModal = () => { setTempHobbies([...hobbies]); setActiveModal("hobbies"); };
  const addHobby = () => setTempHobbies([...tempHobbies, { name: "Hobi Baru", icon: "star" }]);
  const updateHobby = (index: number, field: "name" | "icon", value: string) => {
    const updated = [...tempHobbies];
    updated[index] = { ...updated[index], [field]: value };
    setTempHobbies(updated);
  };
  const removeHobby = (index: number) => setTempHobbies(tempHobbies.filter((_, i) => i !== index));
  const saveHobbies = async () => {
    try {
      await AsyncStorage.setItem("userHobbies", JSON.stringify(tempHobbies));
      setHobbies(tempHobbies);
      setActiveModal(null);
      Alert.alert("Sukses", "Hobi berhasil diperbarui!");
    } catch (e) { Alert.alert("Error", "Gagal menyimpan hobi."); }
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

          {/* Profile Hero */}
          <View style={styles.profileHeroCard}>
            <View style={styles.avatarRing}>
              <Image source={require("../assets/images/profile.jpg")} style={styles.avatarImage} />
            </View>
            <Text style={styles.profileName}>{profile.name}</Text>
            <Text style={styles.profileProdi}>{profile.prodi}</Text>
            <Text style={styles.profileUni}>{profile.univ}</Text>
            <LinearGradient colors={["#f9a8d4", "#a78bfa"]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={styles.badge}>
              <Ionicons name="school" size={12} color="#fff" />
              <Text style={styles.badgeText}>  Mahasiswa Aktif</Text>
            </LinearGradient>
          </View>

          <SectionCard title="Informasi Pribadi" icon="person-circle-outline">
            <InfoRow label="Nama" value={profile.name} />
            <InfoRow label="NIM" value={profile.nim} />
            <InfoRow label="Program Studi" value={profile.prodi} />
            <InfoRow label="Fakultas" value={profile.fakultas} />
            <InfoRow label="Universitas" value={profile.univ} />
            <InfoRow label="Alamat" value={profile.alamat} />
            <InfoRow label="Email" value={profile.email} />
            <InfoRow label="Nomor HP" value={profile.nohp} />
            <InfoRow label="TTL" value={profile.ttl} />
          </SectionCard>

          <SectionCard title="Tentang Saya" icon="information-circle-outline">
            <Text style={styles.aboutText}>{profile.tentang}</Text>
          </SectionCard>

          {/* Keahlian with edit button */}
          <SectionCard title="Keahlian" icon="hammer-outline">
            <View style={styles.chipContainer}>
              {skills.map((skill, index) => <SkillChip key={index} label={skill} />)}
            </View>
            <TouchableOpacity style={styles.sectionEditBtn} onPress={openSkillsModal}>
              <Ionicons name="pencil" size={14} color="#a855f7" />
              <Text style={styles.sectionEditBtnText}>Edit Keahlian</Text>
            </TouchableOpacity>
          </SectionCard>

          {/* Hobi with edit button */}
          <SectionCard title="Hobi" icon="heart-outline">
            <View style={styles.gridContainer}>
              {hobbies.map((hobby, index) => (
                <View key={index} style={styles.hobbyItem}>
                  <LinearGradient colors={["#fce7f3", "#ede9fe"]} style={styles.hobbyIcon}>
                    <Ionicons name={hobby.icon as any} size={22} color="#a855f7" />
                  </LinearGradient>
                  <Text style={styles.hobbyText}>{hobby.name}</Text>
                </View>
              ))}
            </View>
            <TouchableOpacity style={styles.sectionEditBtn} onPress={openHobbiesModal}>
              <Ionicons name="pencil" size={14} color="#a855f7" />
              <Text style={styles.sectionEditBtnText}>Edit Hobi</Text>
            </TouchableOpacity>
          </SectionCard>

          <SectionCard title="Sosial Media" icon="share-social-outline">
            <View style={styles.socialContainer}>
              {socials.map((social, index) => (
                <TouchableOpacity
                  key={index}
                  style={styles.socialBtn}
                  onPress={() => Linking.openURL(social.url).catch(() => Alert.alert("Error", "Gagal membuka link"))}
                >
                  <Ionicons name={social.icon as any} size={24} color={social.color} />
                  <Text style={[styles.socialText, { color: social.color }]}>{social.name}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </SectionCard>

          <View style={styles.buttonContainer}>
            <TouchableOpacity onPress={openProfileModal} activeOpacity={0.85}>
              <LinearGradient
                colors={["#f9a8d4", "#93c5fd"]}
                start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}
                style={styles.editButton}
              >
                <Ionicons name="create-outline" size={20} color="#fff" />
                <Text style={styles.editButtonText}>Edit Profil</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>

        </ScrollView>

        {/* Header */}
        <LinearGradient colors={["#f9a8d4", "#93c5fd"]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={styles.heroBackground}>
          <SafeAreaView edges={["top"]} style={styles.heroNav}>
            <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
              <Ionicons name="arrow-back" size={24} color="#fff" />
            </TouchableOpacity>
            <Text style={styles.heroTitle}>Profil Mahasiswa</Text>
            <View style={{ width: 40 }} />
          </SafeAreaView>
        </LinearGradient>

        {/* ── Edit Profile Modal ── */}
        <Modal visible={activeModal === "profile"} animationType="slide" transparent={true}>
          <View style={styles.modalOverlay}>
            <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={styles.modalContent}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>Edit Profil</Text>
                <TouchableOpacity onPress={() => setActiveModal(null)}>
                  <Ionicons name="close" size={24} color="#64748b" />
                </TouchableOpacity>
              </View>
              <ScrollView contentContainerStyle={styles.modalForm} showsVerticalScrollIndicator={false}>
                {[
                  { label: "Nama Lengkap", key: "name", keyboardType: "default" },
                  { label: "NIM (untuk Login)", key: "nim", keyboardType: "numeric" },
                  { label: "Program Studi", key: "prodi", keyboardType: "default" },
                  { label: "Fakultas", key: "fakultas", keyboardType: "default" },
                  { label: "Universitas", key: "univ", keyboardType: "default" },
                  { label: "Alamat", key: "alamat", keyboardType: "default" },
                  { label: "Email", key: "email", keyboardType: "email-address" },
                  { label: "Nomor HP", key: "nohp", keyboardType: "phone-pad" },
                  { label: "Tempat, Tanggal Lahir", key: "ttl", keyboardType: "default" },
                ].map(({ label, key, keyboardType }) => (
                  <View key={key} style={styles.inputGroup}>
                    <Text style={styles.inputLabel}>{label}</Text>
                    <TextInput
                      style={styles.textInput}
                      value={(tempProfile as any)[key]}
                      onChangeText={(val) => setTempProfile({ ...tempProfile, [key]: val })}
                      keyboardType={keyboardType as any}
                      autoCapitalize={key === "email" ? "none" : "sentences"}
                    />
                  </View>
                ))}
                <View style={styles.inputGroup}>
                  <Text style={styles.inputLabel}>Tentang Saya</Text>
                  <TextInput
                    style={[styles.textInput, styles.textArea]}
                    value={tempProfile.tentang}
                    onChangeText={(val) => setTempProfile({ ...tempProfile, tentang: val })}
                    multiline numberOfLines={4}
                  />
                </View>
              </ScrollView>
              <View style={styles.modalFooter}>
                <TouchableOpacity style={styles.cancelBtn} onPress={() => setActiveModal(null)}>
                  <Text style={styles.cancelBtnText}>Batal</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={saveProfile} style={{ flex: 2 }}>
                  <LinearGradient colors={["#f9a8d4", "#93c5fd"]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={styles.saveBtn}>
                    <Text style={styles.saveBtnText}>Simpan</Text>
                  </LinearGradient>
                </TouchableOpacity>
              </View>
            </KeyboardAvoidingView>
          </View>
        </Modal>

        {/* ── Edit Skills Modal ── */}
        <Modal visible={activeModal === "skills"} animationType="slide" transparent={true}>
          <View style={styles.modalOverlay}>
            <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={styles.modalContent}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>Edit Keahlian</Text>
                <TouchableOpacity onPress={() => setActiveModal(null)}>
                  <Ionicons name="close" size={24} color="#64748b" />
                </TouchableOpacity>
              </View>
              <ScrollView contentContainerStyle={styles.modalForm} showsVerticalScrollIndicator={false}>
                {/* Add input */}
                <View style={styles.inputGroup}>
                  <Text style={styles.inputLabel}>Tambah Keahlian Baru</Text>
                  <View style={styles.addRow}>
                    <TextInput
                      style={[styles.textInput, { flex: 1 }]}
                      value={tempSkillInput}
                      onChangeText={setTempSkillInput}
                      placeholder="Contoh: Figma, MySQL..."
                      placeholderTextColor="#c4b5fd"
                    />
                    <TouchableOpacity onPress={addSkill} style={styles.addBtn}>
                      <LinearGradient colors={["#f9a8d4", "#93c5fd"]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={styles.addBtnGrad}>
                        <Ionicons name="add" size={22} color="#fff" />
                      </LinearGradient>
                    </TouchableOpacity>
                  </View>
                </View>
                {/* Current skills */}
                <Text style={styles.inputLabel}>Keahlian Saat Ini (ketuk untuk hapus)</Text>
                <View style={styles.chipContainer}>
                  {tempSkills.map((skill, index) => (
                    <TouchableOpacity
                      key={index}
                      onPress={() => removeSkill(index)}
                      style={styles.editableChip}
                    >
                      <Text style={styles.editableChipText}>{skill}</Text>
                      <Ionicons name="close-circle" size={16} color="#a855f7" style={{ marginLeft: 4 }} />
                    </TouchableOpacity>
                  ))}
                </View>
              </ScrollView>
              <View style={styles.modalFooter}>
                <TouchableOpacity style={styles.cancelBtn} onPress={() => setActiveModal(null)}>
                  <Text style={styles.cancelBtnText}>Batal</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={saveSkills} style={{ flex: 2 }}>
                  <LinearGradient colors={["#f9a8d4", "#93c5fd"]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={styles.saveBtn}>
                    <Text style={styles.saveBtnText}>Simpan</Text>
                  </LinearGradient>
                </TouchableOpacity>
              </View>
            </KeyboardAvoidingView>
          </View>
        </Modal>

        {/* ── Edit Hobbies Modal ── */}
        <Modal visible={activeModal === "hobbies"} animationType="slide" transparent={true}>
          <View style={styles.modalOverlay}>
            <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={styles.modalContent}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>Edit Hobi</Text>
                <TouchableOpacity onPress={() => setActiveModal(null)}>
                  <Ionicons name="close" size={24} color="#64748b" />
                </TouchableOpacity>
              </View>
              <ScrollView contentContainerStyle={styles.modalForm} showsVerticalScrollIndicator={false}>
                {tempHobbies.map((hobby, index) => (
                  <View key={index} style={styles.hobbyEditRow}>
                    <LinearGradient colors={["#fce7f3", "#ede9fe"]} style={styles.hobbyIconSmall}>
                      <Ionicons name={hobby.icon as any} size={18} color="#a855f7" />
                    </LinearGradient>
                    <View style={{ flex: 1 }}>
                      <TextInput
                        style={[styles.textInput, { marginBottom: 6 }]}
                        value={hobby.name}
                        onChangeText={(val) => updateHobby(index, "name", val)}
                        placeholder="Nama hobi"
                        placeholderTextColor="#c4b5fd"
                      />
                      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.iconPicker}>
                        {HOBBY_ICONS.map((ic) => (
                          <TouchableOpacity
                            key={ic}
                            onPress={() => updateHobby(index, "icon", ic)}
                            style={[styles.iconOption, hobby.icon === ic && styles.iconOptionSelected]}
                          >
                            <Ionicons name={ic as any} size={18} color={hobby.icon === ic ? "#fff" : "#a855f7"} />
                          </TouchableOpacity>
                        ))}
                      </ScrollView>
                    </View>
                    <TouchableOpacity onPress={() => removeHobby(index)} style={styles.deleteHobbyBtn}>
                      <Ionicons name="trash-outline" size={20} color="#f43f5e" />
                    </TouchableOpacity>
                  </View>
                ))}
                <TouchableOpacity onPress={addHobby} style={styles.addHobbyBtn}>
                  <Ionicons name="add-circle-outline" size={20} color="#a855f7" />
                  <Text style={styles.addHobbyBtnText}>Tambah Hobi</Text>
                </TouchableOpacity>
              </ScrollView>
              <View style={styles.modalFooter}>
                <TouchableOpacity style={styles.cancelBtn} onPress={() => setActiveModal(null)}>
                  <Text style={styles.cancelBtnText}>Batal</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={saveHobbies} style={{ flex: 2 }}>
                  <LinearGradient colors={["#f9a8d4", "#93c5fd"]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={styles.saveBtn}>
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
    height: 180, borderBottomLeftRadius: 30, borderBottomRightRadius: 30,
    position: "absolute", top: 0, left: 0, right: 0,
  },
  heroNav: {
    flexDirection: "row", alignItems: "center", justifyContent: "space-between",
    paddingHorizontal: 16, paddingVertical: 12,
  },
  backButton: { padding: 8, backgroundColor: "rgba(255,255,255,0.3)", borderRadius: 20 },
  heroTitle: { fontSize: 18, fontWeight: "700", color: "#fff" },
  scrollContent: { paddingTop: 195, paddingBottom: 40 },
  profileHeroCard: {
    alignItems: "center", marginHorizontal: 16, marginBottom: 20,
    backgroundColor: "#fff", borderRadius: 24, paddingVertical: 24, paddingHorizontal: 16,
    ...Platform.select({
      ios: { shadowColor: "#c084fc", shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.15, shadowRadius: 12 },
      android: { elevation: 5 },
    }),
  },
  avatarRing: {
    width: 100, height: 100, borderRadius: 50,
    borderWidth: 3, borderColor: "#f9a8d4", padding: 3, marginBottom: 12,
  },
  avatarImage: { width: "100%", height: "100%", borderRadius: 50 },
  profileName: { fontSize: 22, fontWeight: "bold", color: "#1e1b4b" },
  profileProdi: { fontSize: 14, color: "#7c3aed", marginTop: 4 },
  profileUni: { fontSize: 13, color: "#94a3b8", marginTop: 2, marginBottom: 12 },
  badge: {
    flexDirection: "row", alignItems: "center",
    paddingHorizontal: 14, paddingVertical: 6, borderRadius: 20,
  },
  badgeText: { fontSize: 12, color: "#fff", fontWeight: "700" },
  aboutText: { fontSize: 14, color: "#475569", lineHeight: 22 },
  chipContainer: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
  gridContainer: { flexDirection: "row", flexWrap: "wrap", justifyContent: "space-between", gap: 12 },
  hobbyItem: { width: "30%", alignItems: "center", paddingVertical: 12 },
  hobbyIcon: {
    width: 44, height: 44, borderRadius: 14, alignItems: "center", justifyContent: "center", marginBottom: 8,
  },
  hobbyText: { fontSize: 12, color: "#374151", fontWeight: "600", textAlign: "center" },
  socialContainer: { gap: 12 },
  socialBtn: {
    flexDirection: "row", alignItems: "center",
    backgroundColor: "#fdf4ff", padding: 14, borderRadius: 14,
    borderWidth: 1, borderColor: "#e9d5ff",
  },
  socialText: { fontSize: 15, fontWeight: "600", marginLeft: 12 },
  sectionEditBtn: {
    flexDirection: "row", alignItems: "center", justifyContent: "center",
    marginTop: 14, paddingVertical: 10, borderRadius: 10,
    backgroundColor: "#fdf4ff", borderWidth: 1.5, borderColor: "#e9d5ff",
  },
  sectionEditBtnText: { fontSize: 13, fontWeight: "600", color: "#a855f7", marginLeft: 6 },
  buttonContainer: { paddingHorizontal: 16, marginTop: 8 },
  editButton: { flexDirection: "row", alignItems: "center", justifyContent: "center", paddingVertical: 16, borderRadius: 16 },
  editButtonText: { color: "#fff", fontSize: 16, fontWeight: "bold", marginLeft: 8 },
  modalOverlay: { flex: 1, backgroundColor: "rgba(0,0,0,0.5)", justifyContent: "flex-end" },
  modalContent: { backgroundColor: "#fff", borderTopLeftRadius: 24, borderTopRightRadius: 24, maxHeight: "85%", paddingBottom: Platform.OS === "ios" ? 40 : 24 },
  modalHeader: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingHorizontal: 24, paddingVertical: 20, borderBottomWidth: 1, borderBottomColor: "#f1f5f9" },
  modalTitle: { fontSize: 18, fontWeight: "bold", color: "#1e293b" },
  modalForm: { padding: 24 },
  inputGroup: { marginBottom: 16 },
  inputLabel: { fontSize: 14, fontWeight: "600", color: "#7c3aed", marginBottom: 8 },
  textInput: { backgroundColor: "#fdf4ff", borderWidth: 1.5, borderColor: "#e9d5ff", borderRadius: 12, paddingHorizontal: 16, paddingVertical: 12, fontSize: 15, color: "#1e293b" },
  textArea: { height: 100, textAlignVertical: "top" },
  modalFooter: { flexDirection: "row", paddingHorizontal: 24, paddingVertical: 16, borderTopWidth: 1, borderTopColor: "#f1f5f9", gap: 12 },
  cancelBtn: { flex: 1, backgroundColor: "#f1f5f9", paddingVertical: 14, borderRadius: 12, alignItems: "center", justifyContent: "center" },
  cancelBtnText: { color: "#475569", fontSize: 15, fontWeight: "600" },
  saveBtn: { paddingVertical: 14, borderRadius: 12, alignItems: "center" },
  saveBtnText: { color: "#fff", fontSize: 15, fontWeight: "600" },
  // Skills
  addRow: { flexDirection: "row", alignItems: "center", gap: 8 },
  addBtn: { width: 52, height: 52, borderRadius: 14, overflow: "hidden" },
  addBtnGrad: { flex: 1, alignItems: "center", justifyContent: "center" },
  editableChip: {
    flexDirection: "row", alignItems: "center",
    backgroundColor: "#f3e8ff", paddingHorizontal: 12, paddingVertical: 8,
    borderRadius: 20, borderWidth: 1, borderColor: "#e9d5ff",
  },
  editableChipText: { fontSize: 13, color: "#7c3aed", fontWeight: "600" },
  // Hobbies edit
  hobbyEditRow: { flexDirection: "row", alignItems: "flex-start", marginBottom: 16, gap: 10 },
  hobbyIconSmall: { width: 36, height: 36, borderRadius: 10, alignItems: "center", justifyContent: "center", marginTop: 12 },
  iconPicker: { marginTop: 4 },
  iconOption: {
    width: 34, height: 34, borderRadius: 10, alignItems: "center", justifyContent: "center",
    backgroundColor: "#fdf4ff", borderWidth: 1, borderColor: "#e9d5ff", marginRight: 6,
  },
  iconOptionSelected: { backgroundColor: "#a855f7", borderColor: "#a855f7" },
  deleteHobbyBtn: { padding: 10, marginTop: 6 },
  addHobbyBtn: {
    flexDirection: "row", alignItems: "center", justifyContent: "center",
    padding: 14, borderRadius: 14, borderWidth: 1.5, borderStyle: "dashed", borderColor: "#a855f7",
    marginTop: 8,
  },
  addHobbyBtnText: { fontSize: 14, fontWeight: "600", color: "#a855f7", marginLeft: 8 },
});
