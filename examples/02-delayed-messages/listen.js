import { Consumer } from "sqs-consumer";

import { createSqsClient } from "../connection/connection.js";
import { assertDelayHelloWorldQueue } from "../queues/queues.js";

// To reduce costs, we will poll for messages every 5 seconds.
// https://docs.aws.amazon.com/AWSSimpleQueueService/latest/SQSDeveloperGuide/sqs-short-and-long-polling.html#sqs-long-polling
const MESSAGES_POLLING_DELAY = 5000;

const client = createSqsClient();
const { QueueUrl } = await assertDelayHelloWorldQueue(client);
const consumer = new Consumer({
  sqs: client,
  queueUrl: QueueUrl,
  pollingWaitTimeMs: MESSAGES_POLLING_DELAY,
  handleMessage: (message) => {
    console.log(
      ` [x] Received message: '${
        message.Body
      }'. Now ${new Date().toISOString()}`
    );
  },
});

consumer.start();

process.on("SIGINT", () => {
  console.log("Stopping consumer...");
  consumer.stop();
  console.log("Destroying client...");
  client.destroy();
  process.exit(0);
});

console.log(" [x] Listening for messages... Press CTRL+C to exit.");
