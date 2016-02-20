
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

export function getCommitGraph(username, callback) {
  fetch('https://github.com/users/' + username + '/contributions')
    .then((response) => response.text())
    .then((responseText) => {
      callback(githubSVGToCommitArray(responseText));
    })
    .catch((error) => {
      console.log(error);
      callback(null)
    });
}

