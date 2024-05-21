import { View, Text } from 'react-native'
import React from 'react'

import { Button } from 'react-native'
const Favorites = () => {
  return (
    <View>
      <Text>Favorites</Text>
      <Button onPress={() => console.log("Ok")} title="press">Pressed</Button>

    </View>
  )
}

export default Favorites