import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as apigateway from 'aws-cdk-lib/aws-apigateway';
import * as path from 'path';
import { DatabaseInstance } from "aws-cdk-lib/aws-rds";
import { Secret } from "aws-cdk-lib/aws-secretsmanager";
import { SecurityGroup } from "aws-cdk-lib/aws-ec2";

interface CartStackProps extends cdk.StackProps {
  dbInstance: DatabaseInstance;
  dbSecret: Secret;
  dbSecurityGroup: SecurityGroup;
}

export class CartStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props: CartStackProps) {
    super(scope, id, props);

    const nestLambda = new lambda.Function(this, "NestAppLambda", {
      runtime: lambda.Runtime.NODEJS_18_X,
      handler: "lambda.handler",
      code: lambda.Code.fromAsset(
        path.join(__dirname, "../../cart-api/dist-lambda")
      ),
      memorySize: 512,
      timeout: cdk.Duration.seconds(10),
      vpc: props.dbInstance.vpc,
      securityGroups: [props.dbSecurityGroup],
      environment: {
        DB_HOST: props.dbInstance.instanceEndpoint.hostname,
        DB_PORT: "5432",
        DB_NAME: "cartdb",
        DB_SECRET_NAME: props.dbSecret.secretName,
      },
    });

    props.dbSecret.grantRead(nestLambda);

    const api = new apigateway.LambdaRestApi(this, "NestApiGateway", {
      handler: nestLambda,
      proxy: true,
    });

    new cdk.CfnOutput(this, "ApiUrl", { value: api.url ?? "no url" });
  }
}
