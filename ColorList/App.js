
import React, { Component } from 'react'

import {
  SafeAreaView
} from 'react-native'

import {
  createStackNavigator,
  createAppContainer} from 'react-navigation'

import ColorList from './components/ColorList'
import ColorInfo from './components/ColorInfo'
import WebPage from './components/WebPage'

const MainNavigator = createStackNavigator({
  Home: { screen: ColorList },
  Details: { screen: ColorInfo },
  Web: { screen: WebPage }
})

const App = createAppContainer(MainNavigator)

export default App
