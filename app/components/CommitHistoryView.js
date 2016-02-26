import React, {
  View, Text,
  StyleSheet,
} from 'react-native';
import Reflux from 'reflux';
import CommitHistoryStore from '../stores/CommitHistoryStore';

import CommitHistoryGraph from './CommitHistoryGraph';
import CommitHistoryText from './CommitHistoryText';

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

  render() {
    return (
      <View style={styles.container}>

        <CommitHistoryGraph 
          commits={this.state.githubCommits.commits}
          netStatus={this.state.githubCommits.state}
          style={styles.commitGraph}
          />

        <CommitHistoryText
          commits={this.state.githubCommits.commits}
          netStatus={this.state.githubCommits.state}
        />
    </View>


    );
  }

});

export default CommitHistoryView;

