import { token } from '../secrets';

function githubSVGToCommitArray(svg_string) {
  try {
    rects = svg_string.match(/<rect[^>]*\/>/g);
    for (var i=0; i<rects.length; i++) {
      rects[i] = rects[i].match(/data-count="[^"]+"/i);
      if (rects[i] != null) {
          rects[i] = rects[i].toString();
          rects[i] = parseInt(rects[i].substring(12, rects[i].length - 1));
      }
    }
    return rects
  } catch (e) {
    console.log(e);
    return null
  }
}

export function getCommitGraph(username) {
  let url = 'https://github.com/users/' + username + '/contributions';
  return new Promise((resolve, reject) => {
    console.log(url);
    fetch(url)
      .then((response) => response.text())
      .then((responseText) => {
        resolve(githubSVGToCommitArray(responseText));
      })
      .catch((error) => {
        reject(error);
      });
  });
}

export function getUserMetadata(username) {
  return new Promise((resolve, reject) => {
    console.log(token, username);

    var headers = new Headers({
      'Authorization': 'token ' + token
    });

    fetch(new Request(
          'https://api.github.com/users/' + username,
          {headers: headers}
      ))
      .then((response) => response.text())
      .then((responseText) => {
        console.log(responseText);
        let apiResponse = JSON.parse(responseText);
        if (apiResponse.login !== undefined) {
          resolve(apiResponse);
        } else {
          reject(apiResponse);
        }
      })
      .catch((error) => {
        reject(error);
      });
  });
}
