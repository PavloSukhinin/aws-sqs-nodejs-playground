import { CreateQueueCommand } from "@aws-sdk/client-sqs";

// Creates a new Standard queue. Delay are not supported in FIFO queues.
const assertDelayHelloWorldQueue = async (client) => {
  const createQueueCommand = new CreateQueueCommand({
    QueueName: "delayed-hello-world",
    Attributes: {
      DelaySeconds: "10",
    },
  });

  return client.send(createQueueCommand);
};

export { assertDelayHelloWorldQueue };
