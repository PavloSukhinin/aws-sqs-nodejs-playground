import { createSqsClient } from "../connection/connection.js";
import {
  assertDeduplicationQueue,
  sendMessageToContentBasedDeduplicationQueue,
} from "../queues/queues.js";

const MESSAGES_NUMBER = 4;

const client = createSqsClient();

const { QueueUrl } = await assertDeduplicationQueue(client);

const message = `This message has ${MESSAGES_NUMBER} duplicates. ${new Date().toISOString()}`;
const messageGroupId = Math.random().toString(36);

const sendMessages = new Array(MESSAGES_NUMBER).fill(null).map(async () => {
  const response = await sendMessageToContentBasedDeduplicationQueue({
    client,
    queueUrl: QueueUrl,
    message,
    messageGroupId,
  });

  console.log(` [x] Sent '${message}'`);
  return response;
});

const uniqueMessage = `This message has no duplicates. ${new Date().toISOString()}`;

await Promise.allSettled([
  ...sendMessages,
  sendMessageToContentBasedDeduplicationQueue({
    client,
    queueUrl: QueueUrl,
    message: uniqueMessage,
    messageGroupId,
  }).then(() => console.log(` [x] Sent '${uniqueMessage}'`)),
]);

client.destroy();
