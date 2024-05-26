import { View, Text ,StyleSheet } from 'react-native'
import React,{useState,useEffect, useContext,useCallback} from 'react'
import * as MediaLibrary from 'expo-media-library';
import AlbumCard from '../components/AlbumCard';
import { ScrollView } from 'react-native';
import { Button } from 'react-native-paper';
import Loader from '../components/Loader';
import MyContext from '../context/context';
import { useFocusEffect } from '@react-navigation/native';

const Home = () => {
    const [albums, setAlbums] = useState([]);
    const [permissionResponse, requestPermission] = MediaLibrary.usePermissions();
    // const [n,setN] = useState("");
    const {checkPermission,isLoading,setIsLoading,permitStatus} = useContext(MyContext);

  //   const checkPermission = async() =>{
  // const permissions = await MediaLibrary.getPermissionsAsync();
  //   const permissionStatus = permissions.status;
  //   console.log(permissionStatus);
  //   if(permissionStatus !== 'granted'){
  //     await requestPermission();
  //     return false;
  //   }
  //   return true;
  //   // await getAlbums();
  //   }

  useFocusEffect(
    useCallback(() => {
      
      setIsLoading(true);
      const result = checkPermission();
    

      if(result){
        console.log(`True`);
       getAlbums();  
      }

      console.log('focused home')
    

      return () => {
        console.log('Cleanup or cancel operations if needed');
      };
    }, [permitStatus]));

   async function getAlbums() {
    
    const allAlbums  = await MediaLibrary.getAlbumsAsync({
    includeSmartAlbums: true,
    }); 

    const filteredAlbums = [];

    for (const album of allAlbums) {
      const { assets } = await MediaLibrary.getAssetsAsync({
        album: album.id,
        mediaType: ['photo', 'video'],
        first: 1, // We only need to check if there's at least one asset of the desired types
      });
      if (assets.length > 0) {
        filteredAlbums.push(album);
      }
    }

    setAlbums(filteredAlbums);

    console.log(filteredAlbums);
    setIsLoading(false);
   
    }
    useEffect(()=>{
    //   setIsLoading(true);
    // const result = checkPermission();
    // if(result){
    //  getAlbums();  
    // }
    },[])  
    
  
  return (
    
    <>
      <ScrollView contentContainerStyle={styles.container}>

   { isLoading ?
   
   //loader
  //  albums.length !== 0 &&
      <ScrollView contentContainerStyle={styles.loaderContainer}>
        <Loader  />
      </ScrollView>
      :  
     
 albums.map((item,index) =>{
        return( 
          
            <AlbumCard key={index} album_id={`${item.id}`} noOfItems={item.assetCount} title={item.title} />          
        )
        })

        }
    </ScrollView>
    </>
  
  )
}

const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        padding: 10,
      },
      loaderContainer:{
        flex:1,
        alignItems:'center',
        justifyContent:'center'
      }
})
export default Home;