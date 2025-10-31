import { Handler } from 'aws-lambda';
import { createApp } from './main';
import * as serverlessExpressModule from '@vendia/serverless-express';
const serverlessExpress = serverlessExpressModule as any;

let server: Handler;

async function bootstrap() {
  if (!server) {
    const app = await createApp();
    await app.init();
    const expressApp = app.getHttpAdapter().getInstance();
    server = serverlessExpress({ app: expressApp });
  }
  return server;
}

export const handler: Handler = async (event, context) => {
  const server = await bootstrap();
  return server(event, context);
};
