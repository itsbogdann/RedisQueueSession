const express = require("express");
const router = express.Router();
const scheduler = require("../services/scheduler");

// POST route which needs to contain the funnel data in its body
router.post("/create", async function (req, res) {
  const data = req.body;
  try {
    // Note: this needs better field check
    if (!data.properties) {
      res.status(400).send("Insufficient data.");
    } else {
      // Try to add the job to the queue and get the return message
      const response = await scheduler.addJobToQueue(data);

      // Set the browser cookie with the persistent Id from request body
      res
        .cookie("clientPersistentId", data.properties.clientPersistentId)
        .status(200)
        .send(response);
    }
  } catch (error) {
    // Return code 403 if adding to the queue fails
    res.status(403).send(error.message);
  }
});

module.exports = router;
