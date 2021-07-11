const path = require("path");
require("dotenv").config({ path: path.join(__dirname, ".env") });
const env = process.env;

/**
 * @desc Define defaults for the fields coming out of the env file
 * @constant {object}
 */
const CONSTS = {
  // Mongo DB conection credentials
  MONGO: {
    USERNAME: env.MONGO_USERNAME || "db_user",
    PASSWORD: env.MONGO_PASSWORD || "db_pass",
    CLUSTERNAME: env.MONGO_CLUSTERNAME || "db_cluster",
    DBNAME: env.MONGO_DBNAME || "db_name",
    URL: env.MONGO_URL || "db_url",
  },
  // Node environment
  NODE: {
    ENV: env.NODE_ENV || "development",
    PORT: env.NODE_PORT || 3000,
  },
  // Redis environment
  REDIS: {
    HOST: env.REDIS_HOST || "127.0.0.1",
    PORT: env.REDIS_PORT || 6379,
  },

  /**
   * @desc Formatter for the Redis URL used for queue creation
   * @returns {String}
   */
  getRedisUrl: () => {
    return `redis://${CONSTS.REDIS.HOST}:${CONSTS.REDIS.PORT}`;
  },

  /**
   * @desc Formatter for the MongoDb URL used in the Mongoose connection
   * @returns {String}
   */
  getMongoUrl: () => {
    return `mongodb+srv://${CONSTS.MONGO.USERNAME}:${CONSTS.MONGO.PASSWORD}@${CONSTS.MONGO.CLUSTERNAME}.${CONSTS.MONGO.URL}/${CONSTS.MONGO.DBNAME}?retryWrites=true&w=majority`;
  },
};

/**
 * @desc Central place for texts used throughout the app
 * @desc By using a "dictionary", it's easier to duplicate the same string
 * @example "createSession" can easily be mistyped if used in multiple places
 * @constant {object}
 */
const TEXTS = {
  QUEUE: {
    CREATE_SESSION: "createSession",
    EXISTING_JOB: "Job for this session is already in queue.",
    JOB_CREATED: "New session job created.",
  },
  MONGOOSE: {
    UPDATE_SESSION_FAIL: "Mongoose session create/update fail.",
  },
};

module.exports = { CONSTS, TEXTS };
