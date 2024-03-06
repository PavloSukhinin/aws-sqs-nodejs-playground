# AWS SQS playground

Prerequisites:
- Node.js version 20.x
- npm version 10.x
- Docker version 20.10+
- Docker compose version 1.29+

Install packages 
  - `npm i`
- Make a copy of a `.env.example` file and name it `.env`. 
- Start AWS Services emulator - Localstack
  - `docker-compose up -d`

To stop and remove docker containers run `docker-compose down`.
[Useful client documentation](https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/client/sqs/)
There is no out-of-the-box listener mechanism in the official client. This example uses [sqs-consumer package](https://www.npmjs.com/package/sqs-consumer), which uses timeouts for long polling.
The polling interval can be distinct for each example. It's defined in `listen.js` files and defaults to 5 seconds.

### Hello world

[example source](./examples/01-hello-world/)

- start consumer
  - `npm run 01:listen`
  - you can start several consumers running this command in different shell instances to see how messages are distributed between them.
- open another shell/terminal and send message with
  - `npm run 01:send`
  - you can run this command several times to send new messages

AWS SQS is just a queue service, not a message broker. The consumer must delete the message from the queue after receiving and processing it. 

[More about how it works](https://docs.aws.amazon.com/AWSSimpleQueueService/latest/SQSDeveloperGuide/sqs-visibility-timeout.html)

[This example uses a FIFO queue](https://docs.aws.amazon.com/AWSSimpleQueueService/latest/SQSDeveloperGuide/sqs-fifo-queues.html)

Note: All FIFO queue names must have a `.fifo` suffix.

### Send messages with delay

[example source](./examples/02-delayed-messages/)

- start consumer
  - `npm run 02:listen`
- open another shell/terminal and send message with
  - `npm run 02:send`
  - you can run this command several times to send new messages

This example uses an AWS SQS Standard queue. You can define default delay on queue level ([see this file](./examples/queues/assert-delay-queue.js)) and override it in SendMessageCommand.

See [SendMessageCommand documentation](https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/client/sqs/command/SendMessageCommand/)

Note: Maximum delay - 15 minutes.

### The mix of delayed and instant messages

[example source](./examples/amqp/03-mixed-delayed-and-not/)

- start consumer
  - `npm run 03:listen`
- open another shell/terminal and send message with
  - `npm run 03:send`
  - you can run this command several times to send new messages

Extends the previous example and sends two messages - delayed and instant.

### Message deduplication

[example source]('./examples/amqp/04-messages-deduplication/)

- start consumer
  - `npm run 04:listen`
- open another shell/terminal and send message with
  - `npm run 04:send`
  - you can run this command several times to send new messages

This example uses the ContentBasedDeduplication queue property. [Defined here](./examples/queues/assert-deduplication-queue.js). This enables content-based deduplication. By default, every message must have a unique `MessageDeduplicationId`. But with enabled ContentBasedDeduplication, the queue will use a SHA-256 hash to generate the MessageDeduplicationId using the body of the message (but not the attributes of the message).
