import { StyleSheet, Text, View,Dimensions } from 'react-native'
import React,{useState} from 'react'
import { Image,Pressable } from 'react-native'
import { Entypo } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { Checkbox } from 'react-native-paper';



    const numColumns = 3;
    const screenWidth = Dimensions.get('window').width;

const AssetCard = ({mediaType,coverImg,id}) => {
  const navigation = useNavigation();
  const [checked, setChecked] = useState(false);

  return (
    <Pressable style={styles.card} 
    onPress={() =>  {mediaType === 'photo' ? navigation.navigate('picture',{id:id,}) :
    navigation.navigate('video',{id:id})
    }}>

         {mediaType === 'video' &&
         <>
          <View style={styles.overlay} />
          <Entypo style={styles.icon_video} name="folder-video" size={24} color="white" /> 
         </>
         }
      <Image style={styles.img} source={{uri:coverImg}} />
    </Pressable>
  )
}

export default AssetCard

const styles = StyleSheet.create({
card:{
position:'relative',

// flexBasis: (screenWidth - 30) / numColumns,
},
overlay:{
zIndex:2,
position: 'absolute',
top: 0,
left: 0,
width: '100%',
height: '100%',
backgroundColor: 'rgba(0, 0, 0, 0.2)', // Adjust alpha for darkness level
},
img:{
 width:120,
 height:100, 

},

icon_video:{
position:'absolute',
bottom:10,
left:10,
zIndex:3
},
checkBox:{
  position:'absolute',
  top:10,
  left:10,
  zIndex:4 
}
})