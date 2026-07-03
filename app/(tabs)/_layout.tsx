import { Ionicons } from "@expo/vector-icons";
import { Tabs } from "expo-router";
import React from "react";
import { TouchableOpacity, View } from "react-native";

// Warna tema tab
const TAB_INACTIVE = "#90caf9"; // biru pastel (tidak aktif)
const TAB_ACTIVE = "#1565c0";   // biru gelap (aktif / saat dipencet)
const TabLayouts = () => {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: "#e91e8c",
        tabBarInactiveTintColor: "#90caf9",
        tabBarShowLabel: true,
        tabBarLabelStyle: {
          fontSize: 9.5, // Disesuaikan agar 6 tab muat dengan rapi di layar
          fontWeight: "700",
          marginBottom: 4,
        },
        tabBarStyle: {
          backgroundColor: "#fce4ec",
          borderTopWidth: 0,
          elevation: 12,
          shadowColor: "#f9a8d4",
          shadowOpacity: 0.2,
          shadowRadius: 12,
          shadowOffset: { width: 0, height: -4 },
          height: 68, // Ditambah sedikit tinggi untuk kenyamanan
          paddingTop: 6,
          paddingBottom: 8,
        },
        tabBarItemStyle: {
          justifyContent: "center",
          alignItems: "center",
          borderRadius: 12,
        },
        tabBarActiveBackgroundColor: "rgba(249,168,212,0.35)",
        tabBarInactiveBackgroundColor: "transparent",
      }}
    >
      {/* Tab 1: Home */}
      <Tabs.Screen
        name="home"
        options={{
          title: "Home",
          tabBarIcon: ({ color, focused }) => (
            <Ionicons
              name={focused ? "home" : "home-outline"}
              size={22}
              color={color}
            />
          ),
        }}
      />

      {/* Tab 2: Profile */}
      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
          tabBarIcon: ({ color, focused }) => (
            <Ionicons
              name={focused ? "person" : "person-outline"}
              size={22}
              color={color}
            />
          ),
        }}
      />

      {/* Tab 3: Pendidikan */}
      <Tabs.Screen
        name="pendidikan"
        options={{
          title: "Pendidikan",
          tabBarIcon: ({ color, focused }) => (
            <Ionicons
              name={focused ? "school" : "school-outline"}
              size={22}
              color={color}
            />
          ),
        }}
      />

      {/* Tab 4: Aktivitas */}
      <Tabs.Screen
        name="aktivitas"
        options={{
          title: "Aktivitas",
          tabBarIcon: ({ color, focused }) => (
            <Ionicons
              name={focused ? "calendar" : "calendar-outline"}
              size={22}
              color={color}
            />
          ),
        }}
      />

      {/* Tab 5: Organisasi */}
      <Tabs.Screen
        name="organisasi"
        options={{
          title: "Organisasi",
          tabBarIcon: ({ color, focused }) => (
            <Ionicons
              name={focused ? "people" : "people-outline"}
              size={22}
              color={color}
            />
          ),
        }}
      />

      {/* Tab 6: Recipe */}
      <Tabs.Screen
        name="recipe"
        options={{
          title: "Recipe",
          tabBarIcon: ({ color, focused }) => (
            <Ionicons
              name={focused ? "restaurant" : "restaurant-outline"}
              size={22}
              color={color}
            />
          ),
        }}
      />
    </Tabs>
  );
};

export default TabLayouts;