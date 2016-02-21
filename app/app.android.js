import React, {
  Navigator,
  View, Text,
  StyleSheet,
  TouchableNativeFeedback,
} from 'react-native';
import Reflux from 'reflux';

import GithubActions from './actions/GithubActions';
import UIActions from './actions/UIActions';

import ProfileView from './components/ProfileView';
import CommitHistoryView from './components/CommitHistoryView';

const styles = StyleSheet.create({
  profileView: {
    backgroundColor: '#F5FCFF',
    flex: 1,
  },
});


let app = React.createClass({
  componentDidMount() {
  },

  render() {
    return (
      <TouchableNativeFeedback onPress={UIActions.blur()}>
      <View style={styles.profileView} >
        <ProfileView ref='profileView' />
        <CommitHistoryView />
      </View>
      </TouchableNativeFeedback>
    );
  }

});

export default app;

