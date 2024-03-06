import { Consumer } from "sqs-consumer";
import { DeleteMessageCommand } from "@aws-sdk/client-sqs";

import { createSqsClient } from "../connection/connection.js";
import { assertHelloWorldQueue } from "../queues/queues.js";

// To reduce costs, we will poll for messages every 5 seconds.
// https://docs.aws.amazon.com/AWSSimpleQueueService/latest/SQSDeveloperGuide/sqs-short-and-long-polling.html#sqs-long-polling
const MESSAGES_POLLING_DELAY = 5000;

const client = createSqsClient();
const { QueueUrl } = await assertHelloWorldQueue(client);
const consumer = new Consumer({
  sqs: client,
  queueUrl: QueueUrl,
  pollingWaitTimeMs: MESSAGES_POLLING_DELAY,
  shouldDeleteMessages: false,
  visibilityTimeout: 10,
  handleMessage: async (message) => {
    console.log(
      ` [x] Received message: '${
        message.Body
      }'. Now ${new Date().toISOString()}`
    );
    if (Math.random() < 0.5) {
      const deleteCommand = new DeleteMessageCommand({
        QueueUrl,
        ReceiptHandle: message.ReceiptHandle,
      });
      await client.send(deleteCommand);
      console.log(
        ` [x] Acknowledged message: '${
          message.Body
        }'. Now ${new Date().toISOString()}`
      );
    } else {
      console.log(` [x] Not acknowledging message: '${message.Body}'`);
    }
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
