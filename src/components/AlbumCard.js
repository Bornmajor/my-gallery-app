import { View, Text,StyleSheet } from 'react-native'
import React, { useEffect, useState } from 'react'
import { Image } from 'react-native'
import { Pressable } from 'react-native'
import { useNavigation } from '@react-navigation/native'
import * as MediaLibrary from 'expo-media-library';

const AlbumCard = ({title,noOfItems,album_id}) => {
    const navigation = useNavigation();
    const [n,setN] = useState("");
    const [coverImg,setCoverImg] = useState("");
    const [fallBackImg,setFallBackImg] = useState(`require('../../assets/images/album_placeholder.png'`)

  const getCoverImage = async(albumId) =>{
    const options = {
      album: albumId,
       // Include these media types
    mediaType: ['photo'],
    first:1,
    sortBy: [[MediaLibrary.SortBy.creationTime, false]], // Sort by creation time in descending order
    };
  
    const coverImage = await MediaLibrary.getAssetsAsync(options);
    setCoverImg(coverImage.assets[0].uri);
    // console.log(coverImage.assets[0].uri);
    // console.log(assetList.length);
  }

  useEffect(()=>{
  getCoverImage(album_id);
  },[n])
    
  return (

    <Pressable
    key={album_id}
     onPress={() => {
      navigation.navigate('assets',{album_id:album_id,title:title,noOfItems:noOfItems})
      console.log('pressed')}} style={styles.albumCard}>
        {coverImg ?   <Image  style={styles.albumImg} source={{uri:coverImg}}
     /> : <Image  style={styles.albumImg} source={require('../../assets/images/album_placeholder.png')} />
    }
   
     <View  style={styles.albumTitle}>
     <Text numberOfLines={1} style={{fontWeight:'600',width:100,marginTop:5}} ellipsizeMode='tail'>{title}</Text>   
     <Text >({noOfItems})</Text>
     {/* <Text>{id}</Text> */}
     </View>     
    </Pressable>

  )
}

const styles = StyleSheet.create({
   albumImg:{
    width:150,
    height:130,
    borderRadius:15
   },
   albumCard:{
    margin:10,
    
   },
   albumTitle:{
    marginLeft:10
   },
   
  });
  

export default AlbumCard