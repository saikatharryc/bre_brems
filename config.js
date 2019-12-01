module.exports = {
  db: {
    MONGO_URL:
      "mongodb://<USERNAME>:<PASSWORD>@<HOST>:<PORT>/<DBNAME>",
    options: {
      reconnectTries: Number.MAX_VALUE,
      reconnectInterval: 500, // Reconnect every 500ms
      keepAlive: 120,
      autoReconnect: true,
      poolSize: 20
    }
  }
};
