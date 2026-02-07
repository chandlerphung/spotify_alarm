function createBasicAuthHeader(clientId, clientSecret) {
  return (
    "Basic " + Buffer.from(clientId + ":" + clientSecret).toString("base64")
  );
}

module.exports = {
  createBasicAuthHeader,
};
