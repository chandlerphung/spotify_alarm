function createBasicAuthHeader(clientId, clientSecret) {
  return (
    "Basic " + Buffer.from(clientId + ":" + clientSecret).toString("base64")
  );
}

function getTokenExpiration(expiresInSeconds) {
  return new Date(Date.now() + expiresInSeconds * 1000);
}

module.exports = {
  createBasicAuthHeader,
  getTokenExpiration,
};
