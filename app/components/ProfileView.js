import React, {
  Navigator,
  StyleSheet,
  Image,
  View, TextInput,
  TouchableNativeFeedback,
} from 'react-native';
import Reflux from 'reflux';

import GithubActions from '../actions/GithubActions';
import UserStore from '../stores/UserStore';
import FancyTextInput from './FancyTextInput';
import { NetworkStates } from '../constants';


const styles = StyleSheet.create({
  container: {
    flex: 1.8,
    flexDirection: 'column',
    justifyContent: 'flex-end',
  },
  imageStyle: {
    height: 250,
    width: 250,
    alignSelf: 'center',
    borderRadius: 125,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.2)',
  },
  userNameStyle: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
    borderWidth: 0,
  },
});

let ProfileView = React.createClass({
  mixins: [Reflux.connect(UserStore, "githubUser")],

  render() {
    let gh_user = this.state.githubUser;
    let userImageURL, userName, userNetworkStatus;

    if (gh_user.user === null) {
        userImageURL = require("../assets/no_user.png");
        userName = null;
        userNetworkStatus = NetworkStates.Uninitialized;
    } else {
        userImageURL = {uri: gh_user.user.avatar_url};
        userName = gh_user.userName;
        userNetworkStatus = gh_user.state;
    }

    console.log("netstat:", userNetworkStatus);

    return (
      <View style={styles.container}>
        <Image source={userImageURL} 
               style={styles.imageStyle}>
        </Image> 
        <FancyTextInput ref="fancyText"
                        fixedValue={userName} 
                        onSubmitEditing={(text) => {
                          console.log("submit", text);
                          GithubActions.changeUser(text);
                        }}
                        disabled={userNetworkStatus == NetworkStates.Fetching}
                        error={userNetworkStatus == NetworkStates.Failed}
                        />
      </View>
    );

  }
});

export default ProfileView;

