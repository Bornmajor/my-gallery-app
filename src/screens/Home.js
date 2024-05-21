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
       getAlbums();  
      }

      console.log('focused home')
    

      return () => {
        console.log('Cleanup or cancel operations if needed');
      };
    }, [permitStatus]));

   async function getAlbums() {
    
    const fetchedAlbums = await MediaLibrary.getAlbumsAsync({
    includeSmartAlbums: true,
    mediaType: ['photo','video'],
    }); 

    
    // Filter out albums where the title contains any numeric characters
    const validAlbums = fetchedAlbums.filter(album => 
      album && album.id && album.title && /^[^\d]+$/.test(album.title)
    );
    setAlbums(validAlbums);
    console.log(validAlbums);
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