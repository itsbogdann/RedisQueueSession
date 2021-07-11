const Queue = require("bull");
const { CONSTS, TEXTS } = require("../config");
const SessionCollection = require("../models/Session");
const redisUrl = CONSTS.getRedisUrl();

// Session queue creation
const sessionQueue = new Queue(TEXTS.QUEUE.CREATE_SESSION, redisUrl);

const scheduler = {
  addJobToQueue: async (jobData) => {
    const inputSessionId = jobData.properties.clientSessionId;
    const existingJobs = await sessionQueue.getJobs(["active"]);

    return new Promise(async (resolve, reject) => {
      // Check if same job exists in the queue for a specific session
      try {
        const isExistingJob = existingJobs.find(
          (job) => job && job.data.properties.clientSessionId === inputSessionId
        );

        // If job already in the queue, return 403 to the frontend
        if (!!isExistingJob) {
          return reject(new Error(TEXTS.QUEUE.EXISTING_JOB));
        }

        // If this kind of job doesn't exist in the queue, create one
        sessionQueue.add(TEXTS.QUEUE.CREATE_SESSION, jobData, {
          removeOnComplete: true,
        });

        resolve(TEXTS.QUEUE.JOB_CREATED);
      } catch (error) {
        return reject(new Error(error.message));
      }
    });
  },

  closeSessionQueue: async () => {
    await sessionQueue.close();
    process.exit(1);
  },
};

sessionQueue.process(TEXTS.QUEUE.CREATE_SESSION, async ({ data }) => {
  // Shorthand for accessibility
  const prop = data.properties;

  // Only get the needed values to be saved in MongoDB
  const profile = prop.optIns.map(({ fieldName, value }) => ({
    fieldName,
    value,
  }));

  // Object with data in the Schema format
  const formattedData = {
    // Client Ids
    localId: prop.clientSessionId,
    globalId: prop.clientPersistentId,
    // Profile field list
    profile,
    // Dates
    createdAt: data.timestamp,
    lastSeenAt: data.sentAt,
    convertedAt: Date.now(),
    // Funnel Ids
    companyId: prop.companyId,
    workspaceId: prop.pageId,
    campaignId: prop.campaignId,
    campaignVersionId: prop.versionId,
  };

  try {
    // Attempt to create or update the Session document
    // The where clause uses the `globalId` field
    await SessionCollection.findOneAndUpdate(
      {
        globalId: prop.clientPersistentId,
      },
      formattedData,
      // Replace fields if document found
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );
  } catch (error) {
    return Promise.reject(
      new Error(`${TEXTS.MONGOOSE.UPDATE_SESSION_FAIL}: ${error.message}`)
    );
  }
  return Promise.resolve(true);
});

// Kill handler
process.on("SIGINT", () => scheduler.closeSessionQueue());

// Crash handler
process.on("uncaughtException", () => scheduler.closeSessionQueue());

module.exports = scheduler;
