import { View, Text ,Dimensions} from 'react-native'
import React, { useContext, useState,useCallback } from 'react'
import { useEffect } from 'react';
import { useNavigation,useFocusEffect } from '@react-navigation/native';
import * as MediaLibrary from 'expo-media-library';
import { ScrollView } from 'react-native';
import { StyleSheet } from 'react-native';
import { FlatList } from 'react-native';
import { Image } from 'react-native';
import AssetCard from '../components/AssetCard';
import MyContext from '../context/context';
import Loader from '../components/Loader';

const Assets = ({route}) => {
  const navigation = useNavigation();
  const {album_id,title,noOfItems} = route.params;
  const [assetList,setAssetList] = useState([]);
  // const [n,setN] = useState("");
  const {checkPermission,isLoading,setIsLoading} = useContext(MyContext);

  const numColumns = Math.floor(Dimensions.get('window').width / 100); // Calculate the number of columns based on the screen width


  const getAssetsByAlbumId = async (albumId) => {
    const options = {
      album: albumId,
       // Include these media types
    mediaType: ['photo','video'],
    first:noOfItems
    };


  
    const assets = await MediaLibrary.getAssetsAsync(options);
    setAssetList(assets.assets);
    console.log(assets.assets);
    // console.log(assetList.length);
    // setN("Ok");
    setIsLoading(false);
    // assets will be an array of Asset objects containing information about the media files
  };

  useEffect(() =>{
    setIsLoading(true);
    const result = checkPermission();
    if(result){
    getAssetsByAlbumId(album_id);  
    }
    
  },[album_id],[isLoading]);



  
  useFocusEffect(
    useCallback(() => {
      // setIsLoading(true);
      const result = checkPermission();
      if(result){
      getAssetsByAlbumId(album_id);  
      }
      console.log('focus');

      return () => {
        console.log('Cleanup or cancel operations if needed');
      };
    },[album_id]));

  useEffect(()=>{
  navigation.setOptions({ title:title
    //0.filename 1.albumId
  })
  },[navigation]);

  useEffect(()=>{
 console.log(numColumns);
  },[numColumns])



  return (
    <>
         {isLoading ? 
              <ScrollView contentContainerStyle={styles.loaderContainer}>
              <Loader  />
            </ScrollView>
         :
         <FlatList contentContainerStyle={styles.container}
         initialNumToRender={10}
         keyExtractor={item => item.id}
         data={assetList}
         numColumns={numColumns}
         renderItem={({item}) =>{
          return(
           <AssetCard coverImg={item.uri} id={item.id}  mediaType={item.mediaType} />   
          )
         }}
         maxToRenderPerBatch={10} // Number of items to render in each batch
         windowSize={21} // Number of items to keep in memory (higher number = more memory usage but smoother scrolling)
         updateCellsBatchingPeriod={50} // Time (in ms) between batch renders
       
         /> 
         }
        
    
    </>

  )
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    // justifyContent: 'space-around',
    padding: 0,
    },
    loaderContainer:{
      flex:1,
      alignItems:'center',
      justifyContent:'center'
    }
})

export default Assets;