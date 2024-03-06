import { createSqsClient } from "../connection/connection.js";
import {
  assertDelayHelloWorldQueue,
  sendDelayedMessage,
} from "../queues/queues.js";

const client = createSqsClient();

const { QueueUrl } = await assertDelayHelloWorldQueue(client);

const delayedMessage = `This message is delayed. ${new Date().toISOString()}`;
await sendDelayedMessage({
  client,
  queueUrl: QueueUrl,
  message: delayedMessage,
  delaySeconds: 10,
});
console.log(` [x] Sent '${delayedMessage}'`);

const instantMessage = `This message is instant. ${new Date().toISOString()}`;
await sendDelayedMessage({
  client,
  queueUrl: QueueUrl,
  message: instantMessage,
  delaySeconds: 0,
});
console.log(` [x] Sent '${instantMessage}'`);

client.destroy();
