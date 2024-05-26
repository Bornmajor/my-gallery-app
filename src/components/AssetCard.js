import { StyleSheet, Text, View,Dimensions } from 'react-native'
import React,{useContext, useState,useEffect} from 'react'
import { Image,Pressable } from 'react-native'
import { Entypo } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import CheckBox from '@react-native-community/checkbox';
import MyContext from '../context/context';




    const numColumns = 3;
    const screenWidth = Dimensions.get('window').width;

const AssetCard = ({mediaType,coverImg,id}) => {
  const navigation = useNavigation();
  const [checked, setChecked] = useState(false);
  const [toggleCheckBox, setToggleCheckBox] = useState(false)
  const{appTheme,isdeleteActive,setIsDeleteActive,selectedIds, setSelectedIds} = useContext(MyContext);



  const handleCheckboxChange = (id) => {
    setSelectedIds((prevSelectedIds) => {
      let newSelectedIds;
      if (prevSelectedIds.includes(id)) {
        // Remove the ID if it is already in the array
        newSelectedIds = prevSelectedIds.filter((selectedId) => selectedId !== id);
      } else {
        // Add the ID if it is not in the array
        newSelectedIds = [...prevSelectedIds, id];
      }
     
      return newSelectedIds;
    });
  };
  
  


 

  return (
    <Pressable style={styles.card} 
    onPress={() =>  {!isdeleteActive &&
      (
     mediaType === 'photo' ? navigation.navigate('picture',{id:id,}) :
    navigation.navigate('video',{id:id}) 
      ) 
    }}
    onLongPress={() => setIsDeleteActive(!isdeleteActive)}
    >
      {isdeleteActive && 
      
        <>
      <View style={styles.overlay} />
        <CheckBox
        tintColors={{ true: '#BF40BF', false: '' }}
        boxType="circle"
        style={styles.checkBox}
        disabled={false}
        value={selectedIds.includes(id)}
        onValueChange={() => handleCheckboxChange(id)}
      />
      </> 
      }
   
      
  

         {mediaType === 'video' &&
         <>
          <View style={styles.overlay} />
          <Entypo style={styles.icon_video} name="folder-video" size={20} color="white" /> 
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
  top:5,
  left:10,
  zIndex:4,

}
})