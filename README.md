# Amazon Simple Queue Service

This a small project to test and learn how to use AWS SQS with CDK.

It contains examples on how to: 
* Create a queue
* Lambda function that sends messages(both single and in batch) to the queue
* Lambda function to reveive messages from the queue
* Lambda function that is triggered by the queue

Both the lambda that receives and processes deleted the messages from the queue after it has processed them.

After deploying i used the AWS GUI to start the SendFn with test data.



## Useful commands

* `npm run build`   compile typescript to js
* `npm run watch`   watch for changes and compile
* `npm run test`    perform the jest unit tests
* `cdk deploy`      deploy this stack to your default AWS account/region
* `cdk diff`        compare deployed stack with current state
* `cdk synth`       emits the synthesized CloudFormation template
