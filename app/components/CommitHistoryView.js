import React, {
  Navigator,
  View, Text,
  StyleSheet,
  TouchableNativeFeedback,
} from 'react-native';
import Reflux from 'reflux';
import CommitHistoryStore from '../stores/CommitHistoryStore';
import { NetworkStates } from '../constants';

const styles = StyleSheet.create({
  container: {
  flex: 1,
  flexDirection: 'column',
  padding: 16,
  alignItems: 'stretch',
  justifyContent: 'space-around',
  backgroundColor: '#FFFF00'
  },
  commitGraph: {
  flex: 1.5,
  backgroundColor: '#FF22aa',
  },
  commitTextWrap: {
  flex: 1,
  flexDirection: 'row',
  backgroundColor: '#FF44FF',
  },
  commitTimeLabel: {
  alignSelf: 'center',
  textAlign: 'center',
  fontSize: 18,
  flex: 0.65,
  },
  commitTime: {
  alignSelf: 'center',
  textAlign: 'center',
  fontSize: 30,
  flex: 0.35,
  backgroundColor: '#FFFFFF'
  },
});


let CommitHistoryView = React.createClass({
  mixins: [Reflux.connect(CommitHistoryStore, "githubCommits")],

  render() {
    let commits = this.state.githubCommits.commits;
    let commitStatus = this.state.githubCommits.state;


    let numCommitsToday;
    let numCommitsWeek;
    if (commits === null) {
      commitHistoryText = "??"
    } else if (commits.length > 7) {
      numCommitsToday = commits[commits.length - 1];
      numCommitsWeek = commits.slice(commits.length - 7).reduce(
        (a, b) => a + b, 0);
    }

    // style the commits item based on the network status
    let numCommitsItem;
    switch(commitStatus){
      case NetworkStates.Failed:
        numCommitsItem = (
          <Text style={styles.commitTime, {color: '#FF0000'}}>
            ?
          </Text>);
        break;
      case NetworkStates.Fetching:
        numCommitsItem = (
          <Text style={[styles.commitTime, {opacity: 0.5}]}>
            ...
          </Text>);
        break;
      case NetworkStates.Fetched:
      default:
        numCommitsItem = (
          <Text style={styles.commitTime}>
            {numCommitsToday}
          </Text>);
        break;
    }

    return (
      <View style={styles.container}>
        <View style={styles.commitGraph}>
        </View>

        <View style={styles.commitTextWrap}>
          <Text style={styles.commitTimeLabel}>
            Commits Today:
          </Text>
          <Text style={styles.commitTime}>
            {numCommitsItem}
          </Text>
        </View>
      </View>
    );
  }

});

export default CommitHistoryView;

