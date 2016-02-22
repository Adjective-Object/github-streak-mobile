import {AsyncStorage} from 'react-native';
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
    // load 'commits' and 'userName' from AsyncStorage
    AsyncStorage.getItem('commitHistory')
      .then((commitHistory) => {
        if (commitHistory) {
          commitHistory = JSON.parse(commitHistory);
          this.commits = commitHistory.commits;
          this.userName = commitHistory.userName;
          this.trigger({
            commits: this.commits,
            state: NetworkStates.Fetched,
          });
        }
      })
      .catch((error) => {
        console.log("error fetching commitHistory from asyncStorage");
        console.log(error);
      });

    return {
      commits: null,
      state: NetworkStates.Uninitialized,
    };
  },

  onUpdateCommitGraph(userName=null, invalidateCache=false) {
    console.log("updaing commit graph");
    if(userName != null) {
      this.userName = userName
    }

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
    getCommitGraph(this.userName)
      .then((updatedCommitGraph) => {
        console.log("new commit graph:", updatedCommitGraph);
        this.commits = updatedCommitGraph;

        AsyncStorage.setItem("commitHistory", JSON.stringify({
          userName: this.userName,
          commits: this.commits,
        }));

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

