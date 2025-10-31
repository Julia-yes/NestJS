
import * as cdk from 'aws-cdk-lib';
import { CartStack } from '../lib/cart-stack';
import { DatabasePGRStack } from "../lib/database-stack";

const app = new cdk.App();
const dbStack = new DatabasePGRStack(app, "DatabasePGRStack");

new CartStack(app, "CartStack", {
  dbInstance: dbStack.dbInstance,
  dbSecret: dbStack.dbCredentialsSecret,
  dbSecurityGroup: dbStack.dbSecurityGroup,
});