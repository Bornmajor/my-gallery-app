// MyContext.js
import React, { createContext, useContext, useState,useEffect } from 'react';
import * as MediaLibrary from 'expo-media-library';
import { Share,Alert,ToastAndroid } from 'react-native';

const MyContext = createContext();

export const MyContextProvider = (props) => {
  const [appTheme, setAppTheme] = useState('#640C95');
  const [textTheme,setTextTheme] = useState("black");
  const [mediaPermit,setMediaPermit] = useState(false);
  const [permissionResponse, requestPermission] = MediaLibrary.usePermissions();
  const [isLoading,setIsLoading] = useState(true);
  const [permitStatus,setPermitStatus] = useState(true);

  const checkPermission = async() =>{
    const permissions = await MediaLibrary.getPermissionsAsync();
      const permissionStatus = permissions.status;
      console.log(permissionStatus);
      if(permissionStatus !== 'granted'){
        // await requestPermission();
        setIsLoading(true);
        setPermitStatus(false)
        return false;

      }
      return true;
      // await getAlbums();
      }

    //   useEffect(()=>{
    //  checkPermission();
    //   },[])
    
    const formatDate = (timestamp) => {
      const date = new Date(timestamp);
    
      const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
      const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    
      const day = days[date.getDay()];
      const month = months[date.getMonth()];
      const dayOfMonth = date.getDate();
      const year = date.getFullYear();
    
      let hours = date.getHours();
      const minutes = date.getMinutes().toString().padStart(2, '0');
      const period = hours >= 12 ? ' PM' : ' AM';
    
      hours = hours % 12;
      hours = hours ? hours : 12; // the hour '0' should be '12'
    
      const formattedTime = `${hours}:${minutes}${period}`;
      return `${day} ${month} ${dayOfMonth} ${year} ${formattedTime}`;
    };

    const onShare = async (message,url) => {
      try {
        const result = await Share.share({
          message: message,
          url: url,
        });
        if (result.action === Share.sharedAction) {
          if (result.activityType) {
            console.log('Shared with activity type: ' + result.activityType);
          } else {
            console.log('Shared');
          }
        } else if (result.action === Share.dismissedAction) {
          console.log('Dismissed');
        }
      } catch (error) {
        console.error(error.message);
      }
    };

    const infoAlert = (msg) =>
      Alert.alert('Media info', msg, [
        {text: 'OK', onPress: () => console.log('OK Pressed')},   
      ],
      {
        cancelable: true,
      },);

      const showFeedback = (msg) =>{
        ToastAndroid.showWithGravity(
            msg,
            ToastAndroid.LONG,
            ToastAndroid.BOTTOM,
        );
    }



        // Function to show a confirmation dialog
  const confirmDelete = (assetId) => {
    return new Promise((resolve, reject) => {
      Alert.alert(
        'Delete Confirmation',
        'Are you sure you want to delete this item?',
        [
          {
            text: 'Cancel',
            onPress: () => {
              console.log('Cancel Pressed');
              resolve(false); // Resolve the promise with false if Cancel is pressed
            },
            style: 'cancel',
          },
          {
            text: 'Delete',
            onPress: () => {
              
              handleDelete(assetId);
           
              resolve(true); // Resolve the promise with true if Delete is pressed
            },
            style: 'destructive',
          },
        ],
        { cancelable: true }
      );
    });
  };

    
      const handleDelete = async(assetId) => {
        if(checkPermission){
        
        // Perform the delete action here
        console.log('Deleting resource');
        try {
          const deleteResult = await MediaLibrary.deleteAssetsAsync(assetId);
          console.log(deleteResult)
          console.log(assetId);
          showFeedback('Deleted');
          console.log('Item deleted');
         
          // Alert.alert('Success', 'The item has been deleted successfully.');
        } catch (error) {
          console.error('Error deleting asset:', error);
          // Alert.alert('Error', 'Failed to delete the item.');
        }

        }
      };
    



  return (
    <MyContext.Provider
      value={{
        appTheme,
        setAppTheme,
        textTheme,
        setTextTheme,
        checkPermission,
        isLoading,setIsLoading,
        permitStatus,setPermitStatus,
        infoAlert,
        formatDate,
        onShare,
        showFeedback,
        confirmDelete

      }}
    >
      {props.children}
    </MyContext.Provider>
  );
};

export default MyContext;
