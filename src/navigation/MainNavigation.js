import { View, Text } from 'react-native'
import React from 'react'
import { createStackNavigator } from '@react-navigation/stack'
import { NavigationContainer } from '@react-navigation/native';
import Home from '../screens/Home';
import Picture from '../screens/Picture';
import VideoScreen from '../screens/Video';
import Favorites from '../screens/Favorites';
import { useContext } from 'react';
import MyContext from '../context/context';
import Assets from '../screens/Assets';
import { PaperProvider } from 'react-native-paper';

const MainNavigation = () => {
    const Stack = createStackNavigator();
    const {appTheme} = useContext(MyContext);

  return (
    <PaperProvider>
    <NavigationContainer>
        <Stack.Navigator
        initialRouteName='home'
        screenOptions={{
            headerStyle:{backgroundColor:appTheme},
            headerTintColor:'white'
        }}>
            <Stack.Screen
            name='home'
            component={Home}
            options={{
                title:'Gallery',  
            }}
            
            />
            <Stack.Screen 
            name='assets'
            component={Assets}
            />
            <Stack.Screen 
            name='picture'
            component={Picture}
            />
             <Stack.Screen 
            name='video'
            component={VideoScreen}
            />
            <Stack.Screen 
            name="favorites"
            component={Favorites}
            />
        </Stack.Navigator>
    </NavigationContainer>
    </PaperProvider>
  )
}

export default MainNavigation