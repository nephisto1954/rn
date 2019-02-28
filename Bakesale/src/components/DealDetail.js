import React, { Component } from 'react';

import {  StyleSheet,
          View,
          ScrollView,
          SafeAreaView,
          Text,
          Image,
          Button,
          TouchableOpacity,
          Animated,
          PanResponder,
          Dimensions,
          Linking } from 'react-native';
import PropTypes from 'prop-types';

import { priceDisplay } from '../util';
import ajax from '../ajax';

class DealDetail extends Component {

  imageXPos = new Animated.Value(0)

  imagePanResponder = PanResponder.create({
    onStartShouldSetPanResponder: () => true,
    onPanResponderMove: (evt, gs) => {
      this.imageXPos.setValue(gs.dx)
    },
    onPanResponderRelease: (evt, gs) => {
      this.width = Dimensions.get('window').width
      if (Math.abs(gs.dx) > this.width * 0.4){
        const direction = Math.sign(gs.dx)
        // -1 for swipe left. 1 for swipe right
        Animated.timing(this.imageXPos, {
          toValue: direction * this.width,
          duration: 250,
        }).start(() => this.handleSwipe(-1 * direction))
      } else {
        Animated.spring(this.imageXPos, {
          toValue: 0
        }).start()
      }
    }
  })

  handleSwipe = (indexDirection) => {
    // guard from going out of bound of data
    if (!this.state.deal.media[this.state.imageIndex + indexDirection]){
      Animated.spring(this.imageXPos, {
        toValue: 0
      }).start()
      return
    }
    this.setState((prevState) => ({
      imageIndex: prevState.imageIndex + indexDirection
    }), () => {
      // next image Animation
      this.imageXPos.setValue(indexDirection * this.width)
      Animated.spring(this.imageXPos, {
        toValue: 0
      }).start()
    })
  }

  static propTypes = {
    initialDealData: PropTypes.object.isRequired,
    onBack: PropTypes.func.isRequired
  };

  state = {
    deal: this.props.initialDealData,
    imageIndex: 0,
  }

  async componentDidMount() {
    const fullDeal = await ajax.fetchDealDetail(this.state.deal.key)
    this.setState({ deal: fullDeal });
  }

  openDealUrl = () => {
    Linking.openURL(this.state.deal.url)
  }

  render() {

    const { deal } = this.state;

    return (
      <SafeAreaView>
        <ScrollView>
          <TouchableOpacity onPress={this.props.onBack}>
            <Text style={styles.backLink}>Back</Text>
          </TouchableOpacity>
          <View style={styles.container}>
            <Animated.Image
            {...this.imagePanResponder.panHandlers}
            source={{ uri: deal.media[this.state.imageIndex] }}
            style={[styles.image, { left: this.imageXPos }]} />
            <View style={styles.detail}>
              <View>
                <Text style={styles.title}>{deal.title}</Text>
              </View>
              <View style={styles.footer}>
                <View style={styles.info}>
                  <Text style={styles.cause}>{deal.cause.name}</Text>
                  <Text style={styles.price}>{priceDisplay(deal.price)}</Text>
                  {deal.user && (
                    <View>
                    <Image source={{ uri: deal.user.avatar }} style={styles.avatar} />
                    <Text>{deal.user.name}</Text>
                    </View>
                  )}
                  <View>
                  <Text>{deal.description}</Text>
                  </View>
                </View>
              </View>
              <Button title="Buy this deal"
                      onPress={this.openDealUrl} />
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5FCFF',
    marginBottom: 20,
  },
  image: {
    width: '100%',
    height: 150,
    backgroundColor: '#ccc',
    marginTop: 20,
  },
  backLink: {
    marginBottom: 5,
    color: '#22f',
    marginLeft: 10,
  },
  info: {
    fontSize: 16,
    padding: 10,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
    backgroundColor: 'rgba(237,149, 45, 0.4)',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    marginTop: 15,
  },
  cause: {
    flex: 2,
  },
  price: {
    flex: 1,
    textAlign: 'right'
  },
  avatar: {
    width: 60,
    height: 60,
  }
})

export default DealDetail;
