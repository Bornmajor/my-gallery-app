import { StyleSheet, Text, View,Image,Dimensions,Pressable} from 'react-native'
import React, { useContext, useEffect,useState} from 'react'
import * as MediaLibrary from 'expo-media-library';
import MyContext from '../context/context';
import Loader from '../components/Loader';
import { ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Entypo } from '@expo/vector-icons';
import { Menu,PaperProvider,Button,Divider } from 'react-native-paper';
import { GestureHandlerRootView,PanGestureHandler } from 'react-native-gesture-handler';

const { width, height } = Dimensions.get('window');

const Picture = ({route}) => {
    const {id} = route.params;
    const [imgUri,setImgUri] = useState('');
    const [title,setTitle] = useState('');
    const {checkPermission,setIsLoading,isLoading,infoAlert,
      formatDate,onShare,confirmDelete} = useContext(MyContext);
    const [asset,setAsset] = useState({});
    const navigation = useNavigation();

    const [visible, setVisible] = useState(true);
    const openMenu = () => setVisible(true);
    const closeMenu = () => setVisible(false);

    const message = `
   Filename: ${asset.filename},
   Dimensions: ${asset.height}px X ${asset.width}px  ,
   Media type: ${asset.mediaType},
   Modification time: ${formatDate(asset.modificationTime)}
  `;

  const handleDeleteMedia = async(id) =>{
    const shouldDelete = await confirmDelete(id); // Wait for the user's response from the confirmation dialog
    if(shouldDelete){
      navigation.goBack();
    }
  }

  // const directDelete = async(assetId) =>{
  //   const deleteResult = await MediaLibrary.deleteAssetsAsync(assetId);
  //   console.log(deleteResult);
  // }
  
    const getAssetById = async (id) => {
      try {
        const asset = await MediaLibrary.getAssetInfoAsync(id);
        console.log(asset);
        setImgUri(asset.localUri);
        setTitle(asset.filename)
        setAsset(asset);
        //localUri

      } catch (error) {
        console.error('Error fetching asset:', error);
        return null;
      }
    };

    useEffect(()=>{
      setIsLoading(true);
      const result = checkPermission();
      if(result){
        getAssetById(id);
        setIsLoading(false);
      }
    },[id])

    useEffect(()=>{
    navigation.setOptions({
      title:title,   
      headerRight:()=>(
        <>
      
        <Pressable style={{margin:10}} onPress={() => openMenu()}>
          <Entypo name="dots-three-vertical" size={24} color="white" />
        </Pressable>
        </>
        
     )
    })
    },[title])

  return (
    <View style={styles.container}>
      
      {isLoading ?
       <ScrollView contentContainerStyle={styles.loaderContainer}>
       <Loader  />
     </ScrollView>
       :
       <>
           <View
        style={{
          paddingTop: 8,
          flexDirection: 'row',
          justifyContent: 'center',
          position:'absolute',right:10,top:0
        }}>
        <Menu
        style={{}}
          visible={visible}
          onDismiss={closeMenu}
          anchor={<Button style={{}}></Button>}
          >
          <Menu.Item onPress={() => infoAlert(message)} title="Info" trailingIcon="information-variant" />
          <Menu.Item onPress={() => onShare(`${asset.filename}`,`${asset.uri}`)} title="Share" trailingIcon="share-variant-outline" />
          <Divider />
           <Menu.Item onPress={() => handleDeleteMedia(id) } title="Delete" trailingIcon="delete" />
         
        </Menu>
      </View>

        {imgUri &&
       <Image  source={{uri:imgUri}} style={styles.fullscreenImage}/>   
        }
        
     
     

       </>
       
      }
     
    </View>
  )
}

export default Picture

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
    justifyContent: 'center',
    alignItems: 'center',
  },
  fullscreenImage: {
    width: width,
    height: height,
    resizeMode: 'contain',
  },
  loaderContainer:{
    flex:1,
    alignItems:'center',
    justifyContent:'center'
  }
})