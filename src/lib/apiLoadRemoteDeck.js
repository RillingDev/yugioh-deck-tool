const fetchOptions = {
  mode: "same-origin"
};

const apiLoadRemoteDeck = remoteUri => new Promise((resolve, reject) => {
  fetch(remoteUri, fetchOptions)
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
