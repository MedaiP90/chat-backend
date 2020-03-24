import { AppModule } from './app.module';
import { Express } from 'express';
import { ExpressAdapter } from '@nestjs/platform-express';
import { INestApplication } from '@nestjs/common';
import { Logger } from 'pino';
import { NestFactory } from '@nestjs/core';
import { useContainer } from 'class-validator';
import { WsAdapter } from '@nestjs/platform-ws';
import * as connectTimeout from 'connect-timeout';
import * as cors from 'cors';
import * as express from 'express';
import * as http from 'http';
import * as pino from 'pino';

const bootstrap: () => void = async (): Promise<void> => {
  // Init Pino for logging purpose
  const l: Logger = pino();
  l.info('app bootstrap - started');

  const appPort: number = 3000;
  const server: Express = express();
  const timeoutMillis: string = '15000';

  // Add Express settings
  server.set('trust proxy', true);
  server.use(cors());
  server.use(connectTimeout(timeoutMillis));

  // Crate the nest app
  const app: INestApplication = await NestFactory.create(
    AppModule, new ExpressAdapter(server),
  );
  useContainer(app.select(AppModule), { fallbackOnErrors: true });

  // Use web sockets
  app.useWebSocketAdapter(new WsAdapter(app.getHttpServer()));
  // Set the base url of the app to '/api'
  app.setGlobalPrefix('api');

  // Await for the app to initialize
  await app.init();
  l.info('app bootstrap - init NestJS');

  // Expose service
  http.createServer(server).listen(appPort);

  l.info('app bootstrap - completed');
}

bootstrap();
