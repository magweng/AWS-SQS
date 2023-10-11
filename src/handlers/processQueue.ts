import { deleteMessage } from "./utils"
import { SQSClient } from "@aws-sdk/client-sqs"


export const handler = async (event: any): Promise<any>  => {
    const client = new SQSClient({ region: 'eu-west-1' })
    event.Records.forEach(async (record:any) => {
        const { body } = record
        const message = JSON.parse(body)
        console.log('Processing queue message: %j', message)

        try {
            const deleteCommand = deleteMessage(message?.ReceiptHandle)
            const deleteData = await client.send(deleteCommand)
        } catch (error) {
            console.log('error', error)
        }
      })
  }