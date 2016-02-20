import React, {
  Navigator,
  View, Text,
  StyleSheet
} from 'react-native';
import Reflux from 'reflux';

import GithubActions from './actions/GithubActions';
import GithubStore, {GithubStates} from './stores/GithubStore';


const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
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
    fontFamily: "monospace",
  },
});


let app = React.createClass({
  mixins: [Reflux.connect(GithubStore, "github")],

  componentDidMount() {
    GithubActions.updateCommitGraph();
  },

  render() {
    console.log(JSON.stringify(this.state));

    // set the text if the commit array has been populated
    let githubTextElem = null;
    if (this.state.github.commits != null) {
      let numDays = this.state.github.commits.length;
      let numCommits = this.state.github.commits.reduce((a, b) => a + b, 0);
      let numCommitsToday = this.state.github.commits[this.state.github.commits.length - 1];

      githubTextElem = (
        <Text style={styles.linetext}>
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
      <Text style = {styles.statusText}
        color={statusColor}>
        {statusText} 
      </Text>);

    let textElem = (githubTextElem == null) ? statusTextElem : githubTextElem;

    return (
      <View style = {styles.container}>
        <Text style={styles.title}>
          {this.state.github.user}
        </Text>
        {textElem}
      </View>
    );
  }

});

export default app;

