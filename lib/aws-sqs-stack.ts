import * as cdk from 'aws-cdk-lib'
import { Construct } from 'constructs'
import * as sqs from 'aws-cdk-lib/aws-sqs'
import { NodejsFunction } from 'aws-cdk-lib/aws-lambda-nodejs'
import { Runtime } from 'aws-cdk-lib/aws-lambda'
import * as lambdaEventSources from 'aws-cdk-lib/aws-lambda-event-sources'

export class AwsSqsStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);
    
    const queue = new sqs.Queue(this, 'AwsSqsQueue',{
      encryption: sqs.QueueEncryption.KMS_MANAGED,
    })

    const sendFn = new NodejsFunction(this, 'SendFn', {
      runtime: Runtime.NODEJS_LATEST,
      handler: 'index.handler',
      entry: 'src/handlers/sendToSQS.ts',
      environment: {
        QUEUE_URL: queue.queueUrl
      }
    })

    const receiveFn = new NodejsFunction(this, 'ReceiveFn', {
      runtime: Runtime.NODEJS_LATEST,
      handler: 'index.handler',
      entry: 'src/handlers/receiveFromSQS.ts',
      environment: {
        QUEUE_URL: queue.queueUrl
      }
    })

    queue.grantSendMessages(sendFn)
    queue.grantConsumeMessages(receiveFn)
    
    //Creates processLambda that is triggered by sqs
    const processFn = new NodejsFunction(this, 'ProcessFn', {
      runtime: Runtime.NODEJS_LATEST,
      handler: 'index.handler',
      entry: 'src/handlers/processQueue.ts',
      environment: {
        QUEUE_URL: queue.queueUrl
      }
    })

    queue.grantConsumeMessages(processFn)

    const eventSource = new lambdaEventSources.SqsEventSource(queue)
    processFn.addEventSource(eventSource)


  }
}
