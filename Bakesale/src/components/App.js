import React, { Component } from 'react';
import {  StyleSheet,
          Text,
          SafeAreaView ,
          View,
          Dimensions,
          Animated,
          Easing} from 'react-native';

import ajax from '../ajax';
import DealList from './DealList'
import DealDetail from './DealDetail'
import SearchBar from './SearchBar'

class App extends Component {
  titleXPos = new Animated.Value(0)

  state = {
    deals: [],
    dealsFromSearch: [],
    currentDealId: null,
    activeSearchTerm: '',
  }

//Animation using Animated, Easing and dimensions.

  animateTitle = (direction = 1) => {
    const width = Dimensions.get('window').width-150
    Animated.timing(
      this.titleXPos,
      {
        toValue: direction * width/2,
        duration: 1000,
        easing: Easing.ease
      }
    ).start(({ finished }) => {
      if (finished){
        this.animateTitle(-1 * direction)
      }
    })
  }

  async componentDidMount() {
    this.animateTitle()
    const deals = await ajax.fetchInitialDeals()
    this.setState({ deals });
  }

  searchDeals = async (searchTerm) => {
    let dealsFromSearch = [];
    if (searchTerm) {
      dealsFromSearch = await ajax.fetchDealsSearchResults(searchTerm)
    }
    this.setState({ dealsFromSearch, activeSearchTerm: searchTerm })
  }

  setCurrentDeal = (dealId) => {
    this.setState({ currentDealId: dealId });
  }

  unsetCurrentDeal = () => {
    this.setState({ currentDealId: null });
  }

  currentDeal = () => {
    return this.state.deals.find(
      (deal) => deal.key === this.state.currentDealId
    )
  }

  render() {

    if (this.state.currentDealId) {
      return (
        <View>
          <DealDetail
            initialDealData={this.currentDeal()}
            onBack={this.unsetCurrentDeal} />
        </View>
      )
    }

    const dealsToDisplay =
      this.state.dealsFromSearch.length > 0
        ? this.state.dealsFromSearch
        : this.state.deals

    if (dealsToDisplay.length > 0) {
      return (
        <SafeAreaView>
          <SearchBar searchDeals={this.searchDeals} initialSearchTerm={this.state.activeSearchTerm}/>
          <View style={styles.container}>
            <DealList
              deals={dealsToDisplay}
              onItemPress={this.setCurrentDeal}
              style={styles.list}
              />
          </View>
        </SafeAreaView>
      )
    }

    return (
      <Animated.View style={[styles.container, { left: this.titleXPos }]}>
        <Text style={styles.header}> Bakesale </Text>
      </Animated.View>
    );
  }
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  header: {
    fontSize: 40,
  },
});


export default App;
