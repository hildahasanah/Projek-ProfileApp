import { COLOR } from '@/app/constans/color';
import { useRouter } from 'expo-router';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { FC } from 'react';

interface Props {
  btnBack?: boolean;
}

const Header: FC<Props> = ({ btnBack = false }) => {
  const router = useRouter();

  return (
    <View style={styles.header}>
      {btnBack && (
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" color={COLOR.Active} size={20} />
        </TouchableOpacity>
      )}

      <Text style={styles.title}>Recipe-App</Text>
    </View>
  );
};

export default Header;

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    padding: 16,
  },

  title: {
    fontSize: 20,
    fontWeight: '800',
    color: COLOR.primary,
    letterSpacing: 2,
  },
});