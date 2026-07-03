import React from "react";
import { Redirect } from "expo-router";

// Tab "Home" langsung redirect ke halaman Dashboard utama
export default function HomeTab() {
  return <Redirect href="/dashboard" />;
}
