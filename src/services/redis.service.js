"use strict";

// const pexpire = promisify(redisClient.pexpire).bind(redisClient);
// const setnxAsync = promisify(redisClient.setnx).bind(redisClient);
const redisClient = require("../dbs/redis");
const Book = require("../models/BookModel");

const acquireLock = async (productid, quantity, session) => {
  const keyLock = "ORDER_KEY_" + productid;
  const client = redisClient.getClient();

  const retryTimes = 10;
  const expireTime = 3;

  for (let i = 0; i < retryTimes; i++) {
    const result = await client.set(keyLock, expireTime, {
      NX: true,
      EX: expireTime,
    });
    console.log(`result:::`, result);
    if (result) {
      const isReversation = await Book.updateOne(
        { _id: productid, quantity_available: { $gte: quantity } },
        {
          $inc: {
            quantity_available: -quantity,
          },
        },
        { upsert: false, new: true, session }
      );
      if (isReversation.modifiedCount) {
        releaseLock(keyLock);
        return keyLock;
      }
      return null;
    } else {
      await new Promise((resolve) => setTimeout(resolve, 50));
    }
  }
};

const releaseLock = async (keyLock) => {
  const client = redisClient.getClient();
  const result = await client.del(keyLock);
};

module.exports = {
  acquireLock,
  releaseLock,
};
