import React, {
  Navigator,
  View, Text,
  StyleSheet,
} from 'react-native';
import Reflux from 'reflux';

import GithubActions from './actions/GithubActions';
import GithubStore, {GithubStates} from './stores/GithubStore';


const styles = StyleSheet.create({
  appWrapper: {
    backgroundColor: '#F5FCFF',
    flex: 1,
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  linetext: {
    textAlign: 'left',
    color: '#333333',
    marginBottom: 5,
    fontFamily: "Menlo",
  },
});


let app = React.createClass({
  mixins: [Reflux.connect(GithubStore, "github")],

  componentDidMount() {
    GithubActions.updateCommitGraph();
  },

  render() {
    // set the text if the commit array has been populated
    let githubTextElem = null;
    if (this.state.github.commits != null) {
      let numDays = this.state.github.commits.length;
      let numCommits = this.state.github.commits.reduce((a, b) => a + b, 0);
      let numCommitsToday = this.state.github.commits[this.state.github.commits.length - 1];
      let commitStyle = ((numCommitsToday == 0)
          ? [styles.linetext, {color: '#E23333'}]
          : [styles.linetext]);

      githubTextElem = (
        <Text style={commitStyle}>
          Commits in last {numDays} days: {numCommits} {"\n"}
          Commits today: {numCommitsToday}
        </Text>
      );
    }

    // display the state text
    let statusText = null, statusColor = null;
    switch (this.state.github.state) {
      case GithubStates.Fetching:
        statusText = "Fetching status from github"
        break;
      case GithubStates.Failed:
        statusText = "Failed fetching status from github";
        statusColor = "#E23333";
        break;
      case GithubStates.Fetched:
        break;
      case GithubStates.Uninitialized:
        statusText = "Uninitialized";
        break;
      default:
        statusText = "Warning: Unknown Status";
        statusColor = "#ffa500";
        break; 
    }

    let statusTextElem = (
      <Text style = {[
          styles.statusText,
          {color: statusColor}]}>
        {statusText} 
      </Text>);

    let textElem = (
      githubTextElem == null
        ? statusTextElem
        : githubTextElem);

    return (
      <View style={styles.appWrapper}>
          <View style={styles.container}>
            <Text style={styles.title}>
              {this.state.github.user}
            </Text>
            {textElem}
          </View>

      </View>
    );
  }

});

export default app;

