const redis = require("redis");

const statusConnectRedis = {
  CONNECT: "connect",
  END: "end",
  RECONNECT: "reconecting",
  ERROR: "error",
};
const handleEventConnect = ({ connectionRedis }) => {
  connectionRedis.on(statusConnectRedis.CONNECT, () => {
    console.log("connectionRedis - connection status: connected");
  });
  connectionRedis.on(statusConnectRedis.END, () => {
    console.log("connectionRedis - connection status: end");
  });
  connectionRedis.on(statusConnectRedis.RECONNECT, () => {
    console.log("connectionRedis - connection status: reconnecting");
  });
  connectionRedis.on(statusConnectRedis.ERROR, (err) => {
    console.log(`connectionRedis - connection status: ${err}`);
  });
};
const initRedis = async () => {
  const client = await redis
    .createClient()
    .on("error", (err) => console.log("Redis Client Error", err))
    .connect(() => {
      console.log("connect success");
    });
  await client.set("key", "valuee");
  const value = await client.get("key");
  console.log("value", value);
};
const getRedis = () => client;
module.exports = { initRedis };
