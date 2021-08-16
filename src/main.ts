import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as cookieParser from 'cookie-parser';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    // TODO: refine CORS urls after production
    origin: [
      'https://localhost:2231',
      'http://localhost:3000',
      'http://localhost:3001',
      'http://localhost:3002',
      'https://inpo.poapper.com',
      'https://admin.inpo.poapper.com',
      'https://store.inpo.poapper.com',
    ],
    credentials: true,
  });
  app.use(cookieParser());

  const swaggerConfig = new DocumentBuilder()
    .setTitle('Inpostack API')
    .setDescription('PoApper, Inpostack API description')
    .setVersion('0.1')
    .build();
  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('api', app, document, {
    swaggerOptions: { defaultModelsExpandDepth: -1 },
  });

  await app.listen(4000);
}
bootstrap();
