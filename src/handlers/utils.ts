import { DeleteMessageCommand } from "@aws-sdk/client-sqs";

export const deleteMessage = (receiptHandle: string) => {
    const input = {
        QueueUrl: process.env.QUEUE_URL,
        ReceiptHandle: receiptHandle
    }
    console.log('Deleting message from sqs')
    return new DeleteMessageCommand(input)
}