import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { useContext } from 'react'
import MyContext from '../context/context'
import { ActivityIndicator } from 'react-native-paper'
import { Button } from 'react-native-paper'
import * as MediaLibrary from 'expo-media-library';
import { useNavigation } from '@react-navigation/native'


const Loader = ({msg}) => {
    const {appTheme,permitStatus,setPermitStatus} = useContext(MyContext);
    const [permissionResponse, requestPermission] = MediaLibrary.usePermissions();
    const navigation = useNavigation();

    const requestMediaPermit = async() =>{
      await requestPermission();
      setPermitStatus(true);
      navigation.navigate('home');
      
    }

  return (
    <View style={styles.container}>
     <ActivityIndicator animating={true} color={appTheme} size={50}/>
        {msg && <Text>{msg}</Text>} 
        {!permitStatus && 
        <Button textColor={appTheme}onPress={() => requestMediaPermit()}>Allow permission</Button>
        }
     
    </View>
  )
}

export default Loader

const styles = StyleSheet.create({
container:{
flex:1,
alignItems:'center',
justifyContent:'center',
alignSelf:'center',
}
})