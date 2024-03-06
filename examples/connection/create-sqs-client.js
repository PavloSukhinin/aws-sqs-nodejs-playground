import { SQSClient } from "@aws-sdk/client-sqs";
import { fromEnv } from "@aws-sdk/credential-providers";

const { AWS_REGION = "eu-central-1", LOCALSTACK_ENDPOINT } = process.env;

const createSqsClient = () => {
  return new SQSClient({
    credentials: fromEnv(),
    region: AWS_REGION,
    ...(LOCALSTACK_ENDPOINT && { endpoint: "http://localhost:4566" }),
  });
};
export { createSqsClient };
