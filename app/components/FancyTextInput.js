import React, {
  Navigator,
  View, Text,
  TextInput,
  StyleSheet,
  Animated,
} from 'react-native';

const sharedStyles = StyleSheet.create({
  wrapper: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignSelf: 'center',
    alignItems: 'center',
  },
  fancyTextStyle: {
    width: 200,
    textAlign: 'center',
    fontSize: 20,
  },
  placeholderText: {
    position: 'absolute',
    left:0,
    right:0,
    top: 13,
    textAlign: 'center',
    fontSize: 20,
  },
});

// styles for when not selected
const nonSelectedStyles = StyleSheet.create({
  wrapper: {
    backgroundColor: '#aaaaEE',
  },
  fancyTextStyle: {
    color: '#222222',
  },
});

// styles for when selected
const selectedStyles = StyleSheet.create({
  wrapper: {
    backgroundColor: '#aaEEaa',
  },
  fancyTextStyle: {
    color: '#222222',
  },
});


let FancyTextInput = React.createClass({

  getInitialState() {
    return {
      value: null,
      selected: false,
      focusInterp: new Animated.Value(0),
    }
  },

  componentWillReceiveProps() {
    this.setState({disabled: false});
  },

  _submitEditing() {
    this.refs.textIn.blur();
    this.setState({disabled: true});
    if (this.props.onSubmitEditing) {
      this.props.onSubmitEditing(this.state.value);
    }
  },

  _onFocus() {
    this.setState({selected: true});
    Animated.timing(
      this.state.focusInterp,
      { toValue: 1 }).start();
  },
  
  _onBlur() {
    this.setState({selected: false});
    Animated.timing(
      this.state.focusInterp,
      { toValue: 0 }).start();
  },

  render() {
    let activeStyle = (this.state.selected
        ? selectedStyles
        : nonSelectedStyles);

    let fetchStyle = (name) => [sharedStyles[name], activeStyle[name]];

    return (
      <View style={[
          fetchStyle("wrapper"), 
          {opacity: (this.state.disabled || this.props.disabled) ? 0.3 : 1}
        ]}>
        <Animated.Text style={[
            fetchStyle("placeholderText"),
            { opacity: (this.state.value) 
                ? 0
                : this.state.focusInterp.interpolate({
                  inputRange: [0.0, 1.0],
                  outputRange: [1.0, 0.0]}),
              transform: [
                {scale: this.state.focusInterp.interpolate({
                  inputRange: [0.0, 1.0],
                  outputRange: [1.0, 0.0]
                })}],
            },
          ]}>
          [ placeholder ]
        </Animated.Text>

        <TextInput
          ref = "textIn"
          style={[
            activeStyle.fancyTextStyle,
            sharedStyles.fancyTextStyle,
            this.props.style,
            {color: this.props.error ? '#FF2222' : null}
          ]}
          multiline={false}
          onSubmitEditing={() => this._submitEditing(this.state.value)}

          onFocus={this._onFocus}
          onBlur={this._onBlur}

          onChangeText={(text) => this.setState({value: text})}
          value={(this.state.value == null)
            ? this.props.fixedValue
            : this.state.value}

          underlineColorAndroid={'rgba(0,0,0,0)'} />
      </View>
    );
  }
});

export default FancyTextInput;

