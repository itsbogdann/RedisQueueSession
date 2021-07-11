# RedisQueueSession

## Table of contents
* [General info](#general-info)
* [Performance](#performance-metrics)
* [Technologies](#technologies-used)
* [Setup](#setup-and-running)

## General Info
Idempotent NodeJS App which creates/updates a MongoDb Session from Redis Queue job/s.
<br/> <br/>
### How it works
- Browser makes >= 1 requests to the `/session/create` route which gets the data and generates Redis workers that create or update a Session document stored inside MongoDb.
<br/> <br/>
### Idempotency implementation
- Redis Queue gets the jobs and checks for existing jobs handling the same **session creation task** before attempting to work on the database, which means that requests made simultaneously will not create multiple Session documents inside the database, and updating is done only if there are no active jobs modifying the same Session.

## Performance metrics
Sending 10 requests consecutively with 0 delay using Postman Runner results in response codes of 200 only when there are no jobs running for the same Session.
<br/>

![Performace metrics](./session_creation_performance.png?raw=true "Performance Metrics")

	
## Technologies used
Project is created with:
* **NodeJS** version: 12.4.0
* **MongoDb** version: 4.4.2
* **Bull** version: 3.20.1
* **Redis** version: 3.1.2
* **Mongoose** version: 5.13.2
* **Express** version: 4.17.1
	
## Setup and running
To run this project, install it locally using npm:

```
$ npm install
$ npm run dev
```
