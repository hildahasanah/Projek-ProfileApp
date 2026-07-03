export interface recipeData {
  id: number | string;
  name: string;
  cookTimeMinutes: number;
  image: string;
}
import { COLOR } from '@/app/constans/color';
import { useRouter } from 'expo-router';
import { FC } from 'react';
import { View, Text, TouchableOpacity, Dimensions, Image, StyleSheet} from 'react-native';


const RecipeItem: FC<recipeData> = ({id, name, cookTimeMinutes, image}) => {
    const router = useRouter();
  return (
    <TouchableOpacity style={styles.container} onPress={()=> router.push(`/recipe/${id}`)}>
        <View style={styles.imageContainer}>
            <Image source={{uri: image}} style={styles.image}/>
        </View>
        <View style={styles.content}>
            <Text style={styles.name}>{name}</Text>
            <Text style={styles.time}>{cookTimeMinutes} Minutes</Text>
        </View>
    </TouchableOpacity>
  )
}

export default RecipeItem

const {width}= Dimensions.get('window');
const cardWidth = (width - 48)/ 2;


const styles = StyleSheet.create({
    image: {
        width: "100%",
        height: "100%",
    },
    imageContainer: {
          height: 120,
    },
    container: {
        width: cardWidth,
        height: 220, 
        backgroundColor: COLOR.Active,
        borderRadius: 16,
        marginBottom: 16,
        elevation: 4,
        overflow: 'hidden',
    },
    content:{
        padding: 12,
    },
    name: {
        fontSize: 18,
        fontWeight: '600',
        color: COLOR.white,
        marginBottom: 6,
        lineHeight: 20,
    }, 
    time: {
        fontSize: 12,
        color: COLOR.white,
        lineHeight: 16,
    },
})
