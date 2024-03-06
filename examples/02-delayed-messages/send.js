import { createSqsClient } from "../connection/connection.js";
import {
  assertDelayHelloWorldQueue,
  sendDelayedMessage,
} from "../queues/queues.js";

const client = createSqsClient();

const { QueueUrl } = await assertDelayHelloWorldQueue(client);

const message = `This message is delayed. ${new Date().toISOString()}`;
await sendDelayedMessage({
  client,
  queueUrl: QueueUrl,
  message,
  delaySeconds: 15,
});

console.log(` [x] Sent '${message}'`);

client.destroy();
