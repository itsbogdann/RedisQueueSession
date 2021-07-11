const express = require("express");
const redis = require("redis");
const mongoose = require("mongoose");
const funnelRoutes = require("./routes/session");
const { CONSTS } = require("./config");
const app = express();

// Parse request body in JSON format
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Create Redis Client
const redisClient = redis.createClient(CONSTS.REDIS.PORT, CONSTS.REDIS.HOST);

redisClient.on("error", function (error) {
  console.error(error);
});

// Create mongoose connection with MongoDB
const mongoUrl = CONSTS.getMongoUrl();
mongoose
  .connect(mongoUrl, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false, // Applied globally for findOneAndUpdate
  })
  .then(() => console.log("Connected to MongoDB."))
  .catch((error) => console.error(error));

// Define routes
app.use("/session", funnelRoutes);

// Start node app
app.listen(CONSTS.NODE.PORT, () => {
  console.log(`👌 Node instance running on port ${CONSTS.NODE.PORT}.`);
});
