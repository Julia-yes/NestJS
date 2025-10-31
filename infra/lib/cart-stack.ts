import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as apigateway from 'aws-cdk-lib/aws-apigateway';
import * as path from 'path';

export class CartStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const nestLambda = new lambda.Function(this, 'NestAppLambda', {
      runtime: lambda.Runtime.NODEJS_18_X,
      handler: 'lambda.handler', 
      code: lambda.Code.fromAsset(path.join(__dirname, '../../cart-api/dist-lambda')),
      memorySize: 512,
      timeout: cdk.Duration.seconds(10),
    });

    const api = new apigateway.LambdaRestApi(this, 'NestApiGateway', {
      handler: nestLambda,
      proxy: true,
    });

    new cdk.CfnOutput(this, 'ApiUrl', { value: api.url ?? 'no url' });
  }
}
