import { SendMessageCommand } from "@aws-sdk/client-sqs";

const sendMessage = ({ client, queueUrl, message, messageGroupId }) => {
  const command = new SendMessageCommand({
    QueueUrl: queueUrl,
    MessageBody: message,
    MessageDeduplicationId: messageGroupId,
    MessageGroupId: messageGroupId,
  });

  return client.send(command);
};

const sendMessageToContentBasedDeduplicationQueue = ({
  client,
  queueUrl,
  message,
  messageGroupId,
}) => {
  const command = new SendMessageCommand({
    QueueUrl: queueUrl,
    MessageBody: message,
    MessageGroupId: messageGroupId,
  });

  return client.send(command);
};

const sendDelayedMessage = ({
  client,
  queueUrl,
  message,
  delaySeconds = 0,
}) => {
  const command = new SendMessageCommand({
    QueueUrl: queueUrl,
    MessageBody: message,
    DelaySeconds: delaySeconds,
  });

  return client.send(command);
};

export {
  sendMessage,
  sendDelayedMessage,
  sendMessageToContentBasedDeduplicationQueue,
};
