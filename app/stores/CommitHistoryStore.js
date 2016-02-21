import Reflux from 'reflux';

import GithubActions from '../actions/GithubActions';
import UserStore from '../stores/UserStore.js';

import {NetworkStates} from '../constants.js';
import {getCommitGraph} from '../lib/github-interface';


let CommitHistoryStore = Reflux.createStore({
  listenables: GithubActions,
 
  commits: null,
  userName: null,

  getInitialState() {
    //TODO load from Async Storage
    return {
      commits: this.commits,
      state: NetworkStates.Uninitialized,
    };
  },

  onUpdateCommitGraph(userName, invalidateCache=false) {
    console.log("updaing commit graph");
    this.userName = userName

    // Clear the cache when no longer valid
    // (for example, when the username has changed)
    if (invalidateCache) {
      console.log("invalidating cache");
      this.commits = null;
    }

    // trigger self as requesting an update.
    this.trigger({
      commits: this.commits,
      state: NetworkStates.Fetching
    });

    console.log("updating commit history to user", UserStore.userName);
    getCommitGraph(userName)
      .then((updatedCommitGraph) => {
        console.log("new commit graph:", updatedCommitGraph);
        this.commits = updatedCommitGraph;
        this.trigger({
          commits: this.commits,
          state: NetworkStates.Fetched,
        });
      })
      .catch((error) => {
        console.log("error fetching commit graph");
        console.log(error);
        this.trigger({
          commits: this.commits,
          state: NetworkStates.Failed,
        });
      });
  }

});

export default CommitHistoryStore;

