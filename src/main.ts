import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as cookieParser from "cookie-parser";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    origin: [
      "http://localhost:3000", "http://localhost:3001", "http://localhost:3002",
      "http://158.247.211.82", "http://158.247.211.82:3000",
      "http://158.247.211.82:3001", "http://158.247.211.82:3002"
    ],
    credentials: true
  });
  app.use(cookieParser());

  await app.listen(4000);
}
bootstrap();
