import Reflux from 'reflux';
import GithubActions from '../actions/GithubActions';
import {getCommitGraph} from '../lib/github-interface';

let GithubStates = {
    Fetching: "Fetching",
    Failed: "Failed",
    Fetched: "Fetched",
    Uninitialized: "Uninitialized",
};

export { GithubStates as GithubStates };

let GithubStore = Reflux.createStore({
  listenables: GithubActions,
 
  user: 'adjective-object',
  commits: null,
  state: GithubStates.Uninitialized,

  getInitialState() {
    return {
      user: this.user,
      commits: this.commits,
      state: GithubStates.Uninitialized,
    };
  },

  onUpdateCommitGraph() {
    this.trigger({
      user: this.user,
      commits: null,
      state: GithubStates.Fetching
    });

    getCommitGraph(this.user, (updatedCommitGraph) => {
      this.commits = updatedCommitGraph;
      let exitstate = (updatedCommitGraph == null 
        ? GithubStates.Failed 
        : GithubStates.Fetched);

      this.trigger({
        user: this.user,
        commits: this.commits,
        state: exitstate,
      });

    });
  }

});


export default GithubStore;

