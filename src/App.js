import { View, Text } from 'react-native'
import React from 'react'
import {MyContextProvider} from './context/context';
import { registerRootComponent } from 'expo';
import { StatusBar } from 'react-native';
import MainNavigation from './navigation/MainNavigation';

export default function App() {
  return (
    <>
   <MyContextProvider>
    <StatusBar />
    <MainNavigation />

   </MyContextProvider>

    </>
  
  )
}

registerRootComponent(App); // Registering the root component