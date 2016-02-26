import React, {
  View, Text,
  StyleSheet,
} from 'react-native';
import Reflux from 'reflux';
import CommitHistoryStore from '../stores/CommitHistoryStore';

import CommitHistoryGraph from './CommitHistoryGraph';
import CommitHistoryText from './CommitHistoryText';

import { NetworkStates } from '../constants'
import GithubActions from '../actions/GithubActions'

const styles = StyleSheet.create({
  container: {
      flex: 1,
      flexDirection: 'column',
      padding: 16,
      paddingLeft: 32,
      paddingRight: 32,
      alignItems: 'stretch',
      justifyContent: 'space-around',
  },
});


let CommitHistoryView = React.createClass({
  mixins: [Reflux.connect(CommitHistoryStore, "githubCommits")],

  getInitialState() {
    return {optimisticNetworkStatus: null};
  },

  componentWillReceiveProps(nextProps) {
    if (nextProps.githubCommts != null &&
        nextProps.githubCommits.state != null) {
      this.setState({optimisticNetworkStatus: null});
    }
  },


  render() {
    networkStatus = this.state.optimisticNetworkStatus || this.state.githubCommits.state
    return (
      <View style={styles.container}>

        <CommitHistoryGraph 
          commits={this.state.githubCommits.commits}
          netStatus={networkStatus}
          style={styles.commitGraph}
          />

        <CommitHistoryText
          commits={this.state.githubCommits.commits}
          netStatus={networkStatus}
          onPress = {() => {
            this.setState({optimisticNetStatus: NetworkStates.Fetching});
            GithubActions.updateCommitGraph();
          }}
        />
    </View>


    );
  }

});

export default CommitHistoryView;

