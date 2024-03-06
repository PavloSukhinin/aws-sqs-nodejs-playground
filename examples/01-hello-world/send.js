import { createSqsClient } from "../connection/connection.js";
import { assertHelloWorldQueue, sendMessage } from "../queues/queues.js";

const client = createSqsClient();

const { QueueUrl } = await assertHelloWorldQueue(client);

const message = `Hello, World! ${new Date().toISOString()}`;
await sendMessage({
  client,
  queueUrl: QueueUrl,
  message,
  messageGroupId: Math.random().toString(36),
});

console.log(` [x] Sent '${message}'`);

client.destroy();
