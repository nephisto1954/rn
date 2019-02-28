import React from 'react'
import { StyleSheet, SafeAreaView, View, Button, Text } from 'react-native'
import PropTypes from 'prop-types'

import RandomNumber from './RandomNumber'
import shuffle from 'lodash.shuffle'

class Game extends React.Component {
  static propTypes = {
    randomNumberCount: PropTypes.number.isRequired,
    initialSeconds: PropTypes.number.isRequired,
    onPlayAgain: PropTypes.func.isRequired
  }

  state = {
    selectedIds: [],
    remainingSeconds: this.props.initialSeconds,
  }

  gameStatus = "PLAYING"

  isNumberSelected = (numberIndex) => {
    return this.state.selectedIds.indexOf(numberIndex) >= 0
  }

  randomNumbers =
    Array.from({ length: this.props.randomNumberCount }).map(() => 1 + Math.floor(10 * Math.random()))

  target = this.randomNumbers
    .slice(0, this.props.randomNumberCount - 2)
    .reduce((acc, curr) => acc + curr, 0)

  shuffledRandomNumbers = shuffle(this.randomNumbers)

  componentDidMount() {
    this.intervalId = setInterval(() => {
      this.setState((prevState) => {
        return { remainingSeconds: prevState.remainingSeconds - 1}
      }, () => {
          if (this.state.remainingSeconds === 0) {
            clearInterval(this.intervalId)
        }
      })
    }, 1000)
  }

  componentWillUpdate(nextProps, nextState) {
    if (nextState.selectedIds !== this.state.selectedIds || nextState.remainingSeconds === 0) {
      this.gameStatus = this.calcGameStatus(nextState)
      if (this.gameStatus !== "PLAYING") {
        clearInterval(this.intervalId)
      }
    }
  }

  componentWillUnmount() {
    clearInterval(this.intervalId)
  }

  selectNumber = (numberIndex) => {
    this.setState((prevState) => ({selectedIds: [...prevState.selectedIds, numberIndex]
      }))
    }

  calcGameStatus = (nextState) => {
    const sumSelected = nextState.selectedIds.reduce((acc, curr) => {
      return acc + this.shuffledRandomNumbers[curr]
    }, 0)

    if (nextState.remainingSeconds === 0) {
      return "LOST"
    }

    if (sumSelected < this.target) {
      return "PLAYING"
    }
    if (sumSelected === this.target) {
      return "WON"
    }
    if (sumSelected > this.target) {
      return "LOST"
    }
  }

  render(){
    const gameStatus = this.gameStatus
    return(
      <SafeAreaView style={styles.container}>
        <Text style={[styles.target, styles[`STATUS_${gameStatus}`]]}>
          {this.target}
        </Text>
        <View style={styles.randomContainer}>
          {this.shuffledRandomNumbers.map((randomNumber, index) =>
            <RandomNumber
            key={index}
            id={index}
            number={randomNumber}
            isDisabled={this.isNumberSelected(index) || gameStatus !== 'PLAYING'}
            onPress={this.selectNumber}
            />
          )}
        </View>
        {this.gameStatus !== "PLAYING" && (
          <Button
            title="Play Again"
            onPress={this.props.onPlayAgain}
          />
        )}
        <Text>{this.state.remainingSeconds}</Text>
      </SafeAreaView>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'beige',
    flex: 1,
    paddingTop: 30,
  },
  target: {
    fontSize: 40,
    marginHorizontal: 50,
    textAlign: 'center'
  },
  randomContainer: {
    backgroundColor: 'teal',
    flex: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-around'
  },

  STATUS_PLAYING: {
    backgroundColor: '#aaa'
  },
  STATUS_WON: {
    backgroundColor: 'green'
  },
  STATUS_LOST: {
    backgroundColor: 'red'
  }
})

export default Game
