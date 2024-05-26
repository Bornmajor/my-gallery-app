import { StyleSheet, Text, View, } from 'react-native'
import React,{useEffect, useRef,useState} from 'react'
import { Video, ResizeMode } from 'expo-av';
import * as MediaLibrary from 'expo-media-library';
import { useContext } from 'react';
import MyContext from '../context/context';
import { ScrollView } from 'react-native';
import Loader from '../components/Loader';
import { useNavigation } from '@react-navigation/native';

const VideoScreen = ({route}) => {
  const {id} = route.params;
  const video = useRef(null); 
  const [status, setStatus] = useState({});
  const {checkPermission,setIsLoading,isLoading} = useContext(MyContext);
  const [videoUri,setVideoUri] = useState('');
  const [title,setTitle] = useState('');
  const navigation = useNavigation();

  const getAssetById = async (id) => {
    try {
      const asset = await MediaLibrary.getAssetInfoAsync(id);
      console.log(asset.uri);
      setVideoUri(asset.uri)
      setTitle(asset.filename);
      //localUri

    } catch (error) {
      console.error('Error fetching asset:', error);
      return null;
    }
  };

  useEffect(()=>{
    setIsLoading(true);
    const result =checkPermission();
    if(result){
    getAssetById(id); 
    setIsLoading(false);
    }
    
  },[id]);
  useEffect(()=>{
  navigation.setOptions({
    title:title
  })
  },[title])

  return (
    <View style={styles.container}>

      {isLoading ? 
       <ScrollView contentContainerStyle={styles.loaderContainer}>
       <Loader  />
     </ScrollView>
      :
       <Video 
      ref={video}
      onPlaybackStatusUpdate={status => setStatus(() => status)}
      style={{width:'100%',height:200}}
      source={{
        uri: videoUri
      }} 
      useNativeControls
     resizeMode={ResizeMode.CONTAIN}
     isLooping
     shouldPlay={true}  
      /> 
    }

       

    </View>
  )
}

export default VideoScreen

const styles = StyleSheet.create({
container:{
  flex: 1,
  backgroundColor: 'black',
  justifyContent: 'center',
  alignItems: 'center',
},
loaderContainer:{
  flex:1,
  alignItems:'center',
  justifyContent:'center'
}
})