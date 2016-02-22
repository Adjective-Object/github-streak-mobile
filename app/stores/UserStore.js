import {AsyncStorage} from 'react-native';
import Reflux from 'reflux';
import GithubActions from '../actions/GithubActions';
import {NetworkStates} from '../constants.js';

import {getUserMetadata} from '../lib/github-interface';


let UserStore = Reflux.createStore({
  listenables: [GithubActions],

  user: null,
  userName: null,

  getInitialState() {
    // load 'commits' and 'userName' from AsyncStorage
    AsyncStorage.getItem('userInfo')
      .then((userInfo) => {
        if (userInfo) {
          userInfo = JSON.parse(userInfo);
          this.userName = userInfo.userName;
          this.user = userInfo.user;
          this.trigger({
            user: userInfo.user,
            userName: userInfo.userName,
            state: NetworkStates.Fetched,
          });
        }
      })
      .catch((error) => {
        console.log("error fetching userInfo from asyncStorage");
        console.log(error);
      });

    return {
      user: this.user,
      userName: this.userName,
      state: NetworkStates.Uninitialized,
    };
  },

  onChangeUser(newUserName) {
    console.log("changing username to", newUserName);

    // trigger self as requesting an update
    this.trigger({
      user: this.user,
      userName: this.userName,
      state: NetworkStates.Fetching
    });

    getUserMetadata(newUserName)
      .then((user) => {
        // Set the user on network success
        console.log("fetched user", newUserName);
        this.userName = newUserName;
        this.user = user;

        AsyncStorage.setItem("userInfo", JSON.stringify({
          userName: this.userName,
          user: this.user,
        }));

        this.trigger({
          user: this.user,
          userName: this.userName,
          state: NetworkStates.Fetched,
        });

        // Invalidate the commit graph's cache when
        // the user changes
        GithubActions.updateCommitGraph(this.userName, true);
      })
      .catch((error) => {
        // on failure, do not chang the information, 
        // but announce that the transaction failed
        console.log("failed fetching user");
        console.log(error);
        this.trigger({
          user: this.user,
          userName: this.userName,
          state: NetworkStates.Failed,
        });
      });
  }

});


export default UserStore;

