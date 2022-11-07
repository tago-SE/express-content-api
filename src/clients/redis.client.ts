import * as redis from "redis";

const url = "redis://default:redispw@localhost:49153";
const password = "redispw";
const name = "RedisClient";

const redisClient = redis.createClient({
  url,
});

redisClient.connect();

class RedisCache {
  readonly redisClient = redis.createClient({
    url,
  });
}

redisClient.on("connect", function () {
  console.info(name + ": connecting...");
});

redisClient.on("ready", function () {
  console.info(name + ": ready!");
});

redisClient.on("reconnecting", function () {
  console.info(name + ": reconnecting...");
});

redisClient.on("error", (error) => {
  console.error(name + ": " + error.toString());
});

redisClient.on("end", function () {
  console.info(name + ": end");
});

process.on("SIGINT", function () {
  console.info(name + ": quit");
  redisClient.quit();
});

export { redisClient };
