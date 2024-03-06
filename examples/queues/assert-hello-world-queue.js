import { CreateQueueCommand } from "@aws-sdk/client-sqs";

// Creates a new FIFO queue.
const assertHelloWorldQueue = (client) => {
  const createQueueCommand = new CreateQueueCommand({
    QueueName: "hello-world.fifo",
    Attributes: {
      FifoQueue: "true",
    },
  });

  return client.send(createQueueCommand);
};

export { assertHelloWorldQueue };
