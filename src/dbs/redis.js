// const redis = require("redis");

// const statusConnectRedis = {
//   CONNECT: "connect",
//   END: "end",
//   RECONNECT: "reconnecting", // Sửa lại từ "reconecting" thành "reconnecting"
//   ERROR: "error",
// };

// const handleEventConnect = ({ connectionRedis }) => {
//   connectionRedis.on(statusConnectRedis.CONNECT, () => {
//     console.log("connectionRedis - connection status: connected");
//   });
//   connectionRedis.on(statusConnectRedis.END, () => {
//     console.log("connectionRedis - connection status: end");
//   });
//   connectionRedis.on(statusConnectRedis.RECONNECT, () => {
//     console.log("connectionRedis - connection status: reconnecting");
//   });
//   connectionRedis.on(statusConnectRedis.ERROR, (err) => {
//     console.log(`connectionRedis - connection status: ${err}`);
//   });
// };

// let client = {};

// const initRedis = async () => {
//   const instanceRedis = redis.createClient();
//   client.instanceRedis = instanceRedis;
//   await instanceRedis.connect();
//   await instanceRedis.set("key", "value");
//   const value = await instanceRedis.get("key");
//   console.log("value", value);
//   await instanceRedis.disconnect();
// };

// const getRedis = () => client;

// const closeRedis = () => {
//   if (client.instanceRedis) {
//     client.instanceRedis.quit(); // Gọi phương thức quit() để đóng kết nối Redis
//     console.log("Redis connection closed.");
//   } else {
//     console.log("No Redis connection to close.");
//   }
// };

// module.exports = { initRedis, getRedis, closeRedis };
// initRedis.js
const redis = require("redis");

class RedisClient {
  constructor() {
    this.client = null;
  }

  async connect() {
    try {
      this.client = redis.createClient({
        url: process.env.REDIS_URL || "redis://localhost:6379",
        socket: {
          reconnectStrategy: (retries) => {
            if (retries > 10) {
              return new Error("Max retries reached");
            }
            return Math.min(retries * 100, 2000);
          },
        },
      });

      this.client.on("error", (err) => {
        console.error("Redis Client Error:", err);
      });

      this.client.on("connect", () => {
        console.log("Connected to Redis");
      });

      await this.client.connect();
      return this.client;
    } catch (error) {
      console.error("Redis connection failed:", error);
      throw error;
    }
  }

  getClient() {
    if (!this.client) {
      throw new Error("Redis client not initialized");
    }
    return this.client;
  }

  async disconnect() {
    if (this.client) {
      await this.client.quit();
      this.client = null;
    }
  }
}

module.exports = new RedisClient();
