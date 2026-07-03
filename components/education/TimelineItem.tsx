import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface TimelineItemProps {
  title: string;
  year: string;
  major: string;
  icon: keyof typeof Ionicons.glyphMap;
  index: number;
  isLast: boolean;
}

export default function TimelineItem({ title, year, major, icon, index, isLast }: TimelineItemProps) {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 500,
        delay: index * 200,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 500,
        delay: index * 200,
        useNativeDriver: true,
      }),
    ]).start();
  }, [index, fadeAnim, slideAnim]);

  return (
    <View style={styles.container}>
      {/* Timeline left side */}
      <View style={styles.timelineColumn}>
        <View style={styles.dotContainer}>
          <Ionicons name={icon} size={16} color="#fff" />
        </View>
        {!isLast && <View style={styles.line} />}
      </View>

      {/* Card right side */}
      <Animated.View style={[styles.cardWrapper, { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}>
        <View style={styles.card}>
          <Text style={styles.title}>{title}</Text>
          <View style={styles.row}>
            <Ionicons name="calendar-outline" size={14} color="#64748b" style={styles.iconMargin} />
            <Text style={styles.year}>{year}</Text>
          </View>
          <View style={styles.row}>
            <Ionicons name="book-outline" size={14} color="#64748b" style={styles.iconMargin} />
            <Text style={styles.major}>{major}</Text>
          </View>
        </View>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    marginBottom: 20,
    paddingHorizontal: 16,
  },
  timelineColumn: {
    alignItems: 'center',
    width: 40,
    marginRight: 12,
  },
  dotContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#a855f7',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 2,
    borderWidth: 3,
    borderColor: '#fce7f3',
  },
  line: {
    width: 2,
    flex: 1,
    backgroundColor: '#f3e8ff',
    marginTop: -4,
    marginBottom: -24, // overlap with the next item
    zIndex: 1,
  },
  cardWrapper: {
    flex: 1,
    paddingBottom: 8,
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 16,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
      },
      android: {
        elevation: 3,
      },
    }),
  },
  title: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1e293b',
    marginBottom: 8,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  iconMargin: {
    marginRight: 6,
  },
  year: {
    fontSize: 14,
    color: '#475569',
  },
  major: {
    fontSize: 14,
    color: '#64748b',
  },
});
