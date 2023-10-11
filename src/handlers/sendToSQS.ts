import { SQSClient, SendMessageCommand, SendMessageBatchCommand } from "@aws-sdk/client-sqs";

export const handler = async (event: any): Promise<any> => {
    const client = new SQSClient({ region: 'eu-west-1' })
    
    const msgBody = event
    // const command = await sendOneMessage(msgBody)
    const command = sendMessageBatch(msgBody)

    try {
        console.log('Sending msg to queue')
        const data = await client.send(command)
    } catch (error) {
        console.log('error', error)
    }
}

const sendOneMessage = (msgBody: any) => {
    const input = {
        QueueUrl: process.env.QUEUE_URL,
        MessageBody: JSON.stringify(msgBody)        
    }

    return new SendMessageCommand(input)
}

// Cap at 10 messages per batch
const sendMessageBatch = (msgBody: any[]) => {
    const input = {
        QueueUrl: process.env.QUEUE_URL,
        Entries: msgBody.map((msg, index) => {
            return {
                Id: index.toString(),
                MessageBody: JSON.stringify(msg),
            }
        })
    }

    return new SendMessageBatchCommand(input)
}