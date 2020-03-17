import React, {Component} from 'react';
import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  Image,
  TouchableHighlight,
  ScrollView,
  TouchableWithoutFeedback,
} from 'react-native';
import Voice from '@react-native-community/voice';
import {EventRegister} from 'react-native-event-listeners';
import voice from './microphone.png';

class App extends Component {
  state = {
    pitch: '',
    error: '',
    end: '',
    started: '',
    results: [],
    partialResults: [],
    setWave: 0,
  };

  constructor(props) {
    super(props);
    //Setting callbacks for the process status
    Voice.onSpeechStart = this.onSpeechStart;
    //Voice.onSpeechEnd = this.onSpeechEnd;
    Voice.onSpeechError = this.onSpeechError;
    Voice.onSpeechResults = this.onSpeechResults;
    Voice.onSpeechPartialResults = this.onSpeechPartialResults;
    Voice.onSpeechVolumeChanged = this.onSpeechVolumeChanged;
  }

  componentDidMount() {
    this._startRecognizing();
  }

  componentWillMount() {
    this.listener = EventRegister.addEventListener('myCustomEvent', data => {
      console.log('Results', this.state.results);
      // this._startRecognizing();
    });
  }

  componentWillUnmount() {
    //destroy the process after switching the screen
    Voice.destroy().then(Voice.removeAllListeners);
    //EventRegister.emit('myCustomEvent', 'it works!!!');
  }
  onStartButtonPress(e){
    Voice.start('en-US');
    this.setState(({
      setWave:1
    }))
  }

  onEndButtonpress(e){
    Voice.stop();
    this.setState(({
      setWave:0
    }))
  }
  onSpeechStart = e => {
    //Invoked when .start() is called without error
    console.log('onSpeechStart: ', e);
    this.setState({
      started: '√',
    });
  };

  onSpeechEnd = e => {
    //Invoked when SpeechRecognizer stops recognition
    console.log('onSpeechEnd: ', e);
    this.setState({
      end: '√',
    });
    Voice.stop();
  };

  onSpeechError = e => {
    //Invoked when an error occurs.
    console.log('onSpeechError: ', e);
    this.setState({
      error: JSON.stringify(e.error),
    });
  };

  onSpeechResults = e => {
    //Invoked when SpeechRecognizer is finished recognizing
    console.log('onSpeechResults: ', e);
    this.setState({
      results: e.value,
    });
  };

  onSpeechPartialResults = e => {
    //Invoked when any results are computed
    Voice.onSpeechEnd = this.onSpeechEnd;
    console.log('onSpeechPartialResults: ', e);
    this.setState({
      partialResults: e.value,
    });
  };

  onSpeechVolumeChanged = e => {
    //Invoked when pitch that is recognized changed
    try {
      console.log('onSpeechVolumeChanged: ', e);
      this.setState({
        pitch: e.value,
      });
    } catch (err) {
      console.log('Error onSpeechVolumeChanged', err);
    }
  };

  _startRecognizing = async () => {
    //Starts listening for speech for a specific locale
    this.setState({
      pitch: '',
      error: '',
      started: '',
      results: [],
      partialResults: [],
      end: '',
    });

    try {
      await Voice.start('en-US');
    } catch (e) {
      //eslint-disable-next-line
      console.error(e);
    }
  };

  _stopRecognizing = async () => {
    //Stops listening for speech
    try {
      await Voice.stop();
    } catch (e) {
      //eslint-disable-next-line
      console.error(e);
    }
  };

  _cancelRecognizing = async () => {
    //Cancels the speech recognition
    try {
      await Voice.cancel();
    } catch (e) {
      //eslint-disable-next-line
      console.error(e);
    }
  };

  _destroyRecognizer = async () => {
    //Destroys the current SpeechRecognizer instance
    try {
      await Voice.destroy();
    } catch (e) {
      //eslint-disable-next-line
      console.error(e);
    }
    this.setState({
      pitch: '',
      error: '',
      started: '',
      results: [],
      partialResults: [],
      end: '',
    });
  };

  render() {
    return (
      <View style={{flex: 1, justifyContent: 'center'}}>
        {this.state.setWave == 0 ? null : (
          <Image
            source={require('./wave2.gif')}
            style={{
              width: '100%',
              height: 100,
              alignSelf: 'center',
              margin: 20,
            }}
          />
        )}

        <View>
          <TouchableWithoutFeedback
            onPressIn={() => this.onStartButtonPress()}
            onPressOut={() => this.onEndButtonpress()}>
            <Image
              source={voice}
              style={{width: 50, height: 50, alignSelf: 'center'}}
            />
          </TouchableWithoutFeedback>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  button: {
    width: 50,
    height: 50,
  },
  container: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  action: {
    width: '100%',
    textAlign: 'center',
    color: 'white',
    paddingVertical: 8,
    marginVertical: 5,
    fontWeight: 'bold',
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
  stat: {
    textAlign: 'center',
    color: '#B0171F',
    marginBottom: 1,
    marginTop: 30,
  },
});
export default App;
