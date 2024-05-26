import { View, Text ,Dimensions,Pressable, TouchableOpacity,Alert} from 'react-native'
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
import { MaterialIcons } from '@expo/vector-icons';
import { AntDesign } from '@expo/vector-icons';
import { MaterialCommunityIcons } from '@expo/vector-icons';



const Assets = ({route}) => {
  const navigation = useNavigation();
  const {album_id,title,noOfItems} = route.params;
  const [assetList,setAssetList] = useState([]);
  // const [n,setN] = useState("");
  const {checkPermission,isLoading,setIsLoading,isdeleteActive,setIsDeleteActive,
    selectedIds,setSelectedIds,showFeedback
  } = useContext(MyContext);

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
      setIsDeleteActive(false);
      console.log('focus');


      return () => {
        console.log('Cleanup or cancel operations if needed in Assets');
        uncheckAll();
      };
    },[album_id]));

  useEffect(()=>{
  navigation.setOptions({ 
    title:title,

   
  })
  },[navigation]);

  useEffect(()=>{
  navigation.setOptions({
    headerRight:()=>(
      <>
      {isdeleteActive && 
      <>
      <View style={{flexDirection:'row',padding:5}}>
        <Text style={{fontSize:18,color:'white',paddingRight:5}} >({selectedIds.length})</Text>
      <Pressable  style={{marginRight:20}} onPress={() => confirmMultipleDelete()}>
      <MaterialIcons name="delete" size={24} color="white" />
      </Pressable>
      <TouchableOpacity style={styles.opacityContainer} 
      onPress={()=> {
       setIsDeleteActive(!isdeleteActive)  
       uncheckAll()
      }
       
        }>
          <Text style={styles.cancel}>Cancel</Text></TouchableOpacity>
          
      </View>
      
      </>
      }

      {!isdeleteActive && 
      <View style={{marginRight:5}}>
      <Pressable onPress={() => getAssetsByAlbumId(album_id)}>
      <MaterialCommunityIcons name="reload" size={24} color="white" />
      </Pressable>
      </View>
      
      }
      </>
      
   )
  })
  },[selectedIds],[isdeleteActive])

  useEffect(()=>{
 console.log(numColumns);
  },[numColumns])

  const uncheckAll = () => {
    setSelectedIds([]);
  };

  const confirmMultipleDelete = () => {
    Alert.alert(
      "Confirm Deletion",
      "Are you sure you want to delete the selected assets?",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Delete",
          onPress: deleteSelectedAssets,
        },
      ],
      { cancelable: true }
    );
  };

  const deleteSelectedAssets = async () => {
    if (selectedIds.length === 0) {
      console.log('No assets selected for deletion');
      showFeedback("No assets selected for deletion")
      return;
    }
    showFeedback('Deleting assets');
    try {
      await MediaLibrary.deleteAssetsAsync(selectedIds);
      console.log('Deleted assets:', selectedIds);
      showFeedback(`Deleted ${selectedIds.length} assets`);
      setSelectedIds([]);
      getAssetsByAlbumId(album_id); 
    } catch (error) {
      console.error('Failed to delete assets:', error);
    }
  };


  return (
    <>
         {isLoading ? 
              <ScrollView contentContainerStyle={styles.loaderContainer}>
              <Loader  />
            </ScrollView>
         :
         <>
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
         </>
         }
        
    
    </>

  )
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'column',
    // flexWrap: 'wrap',
    // justifyContent: 'space-around',
    padding: 0,
    },
    loaderContainer:{
      flex:1,
      alignItems:'center',
      justifyContent:'center'
    },
    cancel:{
      color:'white',
      fontWeight:'600',
      fontSize:18
    },
    rightBtn:{
      margin:10
    },
    opacityContainer:{
      alignItems:'center',
      justifyContent:'center',
      paddingRight:10
    }
})

export default Assets;