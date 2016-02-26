import React, {
  View, Text,
  TouchableWithoutFeedback,
  StyleSheet,
} from 'react-native';
import Reflux from 'reflux';
import { NetworkStates } from '../constants';

const styles = StyleSheet.create({
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

  render() {
    let commits = this.props.commits
    let commitStatus = this.props.netStatus

    let numCommitsToday = null;
    let streakLength = null;
  
    // calculate the length of the streak & num commits today
    // if the commit graph is defined
    if (commits != null && commits.length > 0) {
      numCommitsToday = commits[commits.length - 1];
      streakLength = 0;
      for (let i = commits.length-1; i>=0; i--) {
        if (i == 0) { break; }
        streakLength++;
      }

    }

    // style the commits item based on the network status
    let numCommitsItem;
    let colorStyle = (numCommitsToday == 0) ? {color: '#FF0000'} : {};
    switch(commitStatus){
      case NetworkStates.Failed:
        numCommitsItem = (
          <Text style={styles.commitTime, {color: '#FF0000'}}>
            ?
          </Text>);
        break;
      case NetworkStates.Fetching:
        numCommitsItem = (
          <Text style={[styles.commitTime, colorStyle, {opacity: 0.5}]}>
            ...
          </Text>);
        break;
      case NetworkStates.Fetched:
      default:
        numCommitsItem = (
          <Text style={[styles.commitTime, colorStyle]}>
            {numCommitsToday}
          </Text>);
        break;
    }

    return (
      <View style={styles.commitTextWrap}>
        <Text style={styles.commitTimeLabel}>
          Commits Today:
        </Text>
        <TouchableWithoutFeedback onPress={this.props.onPress}>
          {numCommitsItem}
        </TouchableWithoutFeedback>
      </View>
      );
  }

});

export default CommitHistoryView;

