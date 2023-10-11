import { SQSClient, ReceiveMessageCommand, ReceiveMessageResult } from "@aws-sdk/client-sqs"
import { deleteMessage } from "./utils"


export const handler = async (event: any): Promise<any> => {
    const client = new SQSClient({ region: 'eu-west-1' })

    const input = {
        QueueUrl: process.env.QUEUE_URL,
        AttributeNames: [
            "All"
        ],
        MaxNumberOfMessages: Number(1),
        WaitTimeSeconds: Number(2),
    }

    const command = new ReceiveMessageCommand(input)

    try {
        const data = await client.send(command) as ReceiveMessageResult
        const message = data?.Messages && data.Messages.length > 0 ? data.Messages[0] : {}
        console.log(`Message received: ${message?.Body}`)        
        if (message?.ReceiptHandle) {
            const deleteCommand = deleteMessage(message?.ReceiptHandle)
            const deleteData = await client.send(deleteCommand)
        }
    } catch (error) {
        console.log('error', error)
    }
}