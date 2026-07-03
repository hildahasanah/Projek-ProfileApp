import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface ActivityItemProps {
  time: string;
  title: string;
  icon: keyof typeof Ionicons.glyphMap;
  index: number;
  isLast: boolean;
}

export default function ActivityItem({ time, title, icon, index, isLast }: ActivityItemProps) {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 400,
        delay: index * 150, // slightly faster stagger
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 400,
        delay: index * 150,
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
          <View style={styles.timeContainer}>
            <Ionicons name="time-outline" size={16} color="#ec4899" />
            <Text style={styles.timeText}>{time}</Text>
          </View>
          <Text style={styles.title}>{title}</Text>
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
    width: 36,
    height: 36,
    borderRadius: 18,
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
    justifyContent: 'center',
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
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
  timeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fce7f3',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 12,
    marginRight: 12,
  },
  timeText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#be185d',
    marginLeft: 6,
  },
  title: {
    flex: 1,
    fontSize: 16,
    fontWeight: '600',
    color: '#1e293b',
  },
});
