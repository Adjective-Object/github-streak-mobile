import React, {
  Navigator,
  View, Text,
  StyleSheet,
  TouchableNativeFeedback,
} from 'react-native';
import Reflux from 'reflux';

import GithubActions from './actions/GithubActions';

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
      <View style={styles.profileView} >
        <ProfileView ref='profileView' />
        <CommitHistoryView />
      </View>
    );
  }

});

export default app;

