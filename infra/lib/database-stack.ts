import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as rds from 'aws-cdk-lib/aws-rds';
import * as ec2 from 'aws-cdk-lib/aws-ec2';
import * as secretsmanager from 'aws-cdk-lib/aws-secretsmanager';

export class DatabasePGRStack extends cdk.Stack {
  public readonly dbInstance: rds.DatabaseInstance;
  public readonly dbCredentialsSecret: secretsmanager.Secret;
  public readonly dbSecurityGroup: ec2.SecurityGroup;

  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const vpc = new ec2.Vpc(this, 'DbVPC', {
      maxAzs: 2,
      subnetConfiguration: [
        { name: 'Public', subnetType: ec2.SubnetType.PUBLIC },
        { name: 'Private', subnetType: ec2.SubnetType.PRIVATE_WITH_EGRESS },
      ],
    });

    this.dbCredentialsSecret = new secretsmanager.Secret(this, 'MyDBSecret', {
      secretName: 'MyDBCredsName',
      generateSecretString: {
        secretStringTemplate: JSON.stringify({ username: 'postgresadmin' }),
        excludePunctuation: true,
        generateStringKey: 'password',
      },
    });

    this.dbSecurityGroup = new ec2.SecurityGroup(this, 'DbSG', {
      vpc,
      description: 'Allow Lambda access to PostgreSQL',
      allowAllOutbound: true,
    });

    this.dbInstance = new rds.DatabaseInstance(this, 'PostgresInstance', {
      engine: rds.DatabaseInstanceEngine.postgres({
        version: rds.PostgresEngineVersion.VER_16, 
      }),
      vpc,
      vpcSubnets: { subnetType: ec2.SubnetType.PRIVATE_WITH_EGRESS },
      credentials: rds.Credentials.fromSecret(this.dbCredentialsSecret),
      securityGroups: [this.dbSecurityGroup],
      databaseName: 'cartdb',
      allocatedStorage: 20,
      instanceType: ec2.InstanceType.of(ec2.InstanceClass.T3, ec2.InstanceSize.MICRO),
      removalPolicy: cdk.RemovalPolicy.DESTROY,
    });

    new cdk.CfnOutput(this, 'DatabaseEndpoint', {
      value: this.dbInstance.instanceEndpoint.hostname,
    });
  }
}
