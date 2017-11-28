const apiLoadRemoteDeck = remoteUri => new Promise((resolve, reject) => {
  fetch(remoteUri, {
      mode: "same-origin"
    })
    .then(res => {
      if (res.ok) {
        res
          .text()
          .then(resolve);
      } else {
        reject(res);
      }
    });
});

export default apiLoadRemoteDeck;
