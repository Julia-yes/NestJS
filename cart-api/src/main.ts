import { NestFactory } from '@nestjs/core';
import helmet from 'helmet';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';

export async function createApp() {
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: (req, callback) => callback(null, true),
  });
  app.use(helmet());

  return app;
}

async function bootstrap() {
  const app = await createApp();
  const configService = app.get(ConfigService);
  const port = configService.get('APP_PORT') || 4000;

  await app.listen(port, () => {
    console.log('App is running on %s port', port);
  });
}

if (!process.env.LAMBDA_TASK_ROOT) {
  bootstrap();
}
