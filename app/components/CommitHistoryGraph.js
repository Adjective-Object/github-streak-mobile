import  React, {
  ScrollView, View, Text,
  StyleSheet,
} from 'react-native';

const styles = StyleSheet.create({
  wrap: {
    borderColor: '#332288',
    paddingBottom: 12,
  },
  wrapContentContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'stretch',
    justifyContent: 'space-around',
  },
  barWrap: {
    width: 16,
    marginLeft: 4,
    marginRight: 4,
    alignItems: 'flex-end',
  },
  barComplement: {
    width: 16,
    flexDirection: 'column',
    justifyContent: 'flex-end',
    alignItems: 'stretch',
    paddingBottom: 6,
  },
  barComplementText: {
    fontSize: 10,
    textAlign: 'center',
    alignSelf: 'stretch',
  },
  bar: {
    width: 16,
    borderRadius: 8,
    backgroundColor: '#de553e',
  },
  loadingView: {
    flexDirection: 'column',
    alignItems: 'stretch',
    justifyContent: 'center',
    paddingBottom: 12,
  },
  loadingText: {
    alignSelf:'center',
    textAlign: 'center',
  },
});

function createBar(index, numCommits, maxCommits) {
  let percent = numCommits / maxCommits;
  if (numCommits > 0) {
    return (
      <View 
        key={index}
        style={styles.barWrap}>

        <View style={[styles.barComplement, {flex: 1 - percent}]}>
          <Text style={styles.barComplementText}>{numCommits}</Text>
        </View>
        <View style={[
          styles.bar,
          {flex: percent},
        ]} />

      </View>
    );
  } else {
    return (<View 
        key={index}
        style={styles.barWrap} />);
  }
}


let CommitHistoryGraph = React.createClass({
  render() {
    if (this.props.commits != null) {
      var numCommitDays = this.props.commits.reduce(
          (a, b) => b > 0 ? a + 1 : a, 0)
      var avgCommitDay = this.props.commits.reduce((a, b) => a + b) / numCommitDays
      let maxCommits = Math.max(10, 3.5 * avgCommitDay );

      console.log(avgCommitDay);
      console.log(maxCommits);
        
      let bars = this.props.commits.map(
          (commits, index) => createBar(index, commits, maxCommits))

      return (
        <ScrollView
          style={[styles.wrap, this.props.style]}
          contentContainerStyle={styles.wrapContentContainer}
          horizontal={true} >
          {bars}
        </ScrollView>
      );

    } else {
      return (
        <View
          style={[styles.loadingView, this.props.style]}
          horizontal={true} >
          <Text style={styles.loadingText}>loading commit history..</Text>
        </View>
      );

    }
  }
});

export default CommitHistoryGraph;

