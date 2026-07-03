import { COLOR } from "@/app/constans/color";
import React, { FC } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

interface Props {
  name: string;
  handleChangRecipe: (name: string) => void;
  selectedName: string;
}

const TagItem: FC<Props> = ({ name, handleChangRecipe, selectedName }) => {
  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={() => handleChangRecipe(name)}>
        <View style={[selectedName === name ? styles.badgeActive : styles.badgeActive]}>
          <Text style={styles.badgeText}>{name}</Text>
        </View>
      </TouchableOpacity>
    </View>
  );
};

export default TagItem;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  badgeActive: {
    backgroundColor: COLOR.Active,
    borderRadius: 25,
    padding: 15,
    elevation: 5,
  },
  badgeDeactive: {
    backgroundColor: COLOR.Inactive,
    borderRadius: 25,
    padding: 15,
    elevation: 5,
  },
  badgeText: {
    color: "black",
  },
});
