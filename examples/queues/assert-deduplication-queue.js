import { CreateQueueCommand } from "@aws-sdk/client-sqs";

// Creates a new FIFO queue with Deduplication turned on.
const assertDeduplicationQueue = (client) => {
  const createQueueCommand = new CreateQueueCommand({
    QueueName: "deduplication-queue.fifo",
    Attributes: {
      FifoQueue: "true",
      ContentBasedDeduplication: "true",
    },
  });

  return client.send(createQueueCommand);
};

export { assertDeduplicationQueue };
