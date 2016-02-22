import React, {
  View, Text,
  TouchableWithoutFeedback,
  StyleSheet,
} from 'react-native';
import Reflux from 'reflux';
import CommitHistoryStore from '../stores/CommitHistoryStore';
import GithubActions from '../actions/GithubActions'
import { NetworkStates } from '../constants';

import CommitHistoryGraph from './CommitHistoryGraph';

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
  commitGraph: {
    flex: 1.5,
  },
  commitTextWrap: {
  flex: 1,
  flexDirection: 'row',
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
        <CommitHistoryGraph 
          commits={commits}
          style={styles.commitGraph}
          />

        <View style={styles.commitTextWrap}>
          <Text style={styles.commitTimeLabel}>
            Commits Today:
          </Text>
          <TouchableWithoutFeedback
            onPress={() => GithubActions.updateCommitGraph()}>
            <Text style={styles.commitTime}>
              {numCommitsItem}
            </Text>
          </TouchableWithoutFeedback>
        </View>
      </View>
    );
  }

});

export default CommitHistoryView;

