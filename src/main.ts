import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { apiReference } from '@scalar/nestjs-api-reference';
import { ValidationPipe } from '@nestjs/common';
import cookieSession from 'cookie-session';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  app.use(cookieSession({
    keys:['asdfasd']
  }))
  
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
    }),
  );

  
  const config = new DocumentBuilder()
    .setTitle('Cats example')
    .setDescription('The cats API description')
    .setVersion('1.0')
    .addTag('cats')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  /* ... */
  const OpenApiSpecification =
    /* … */
    app.use(
      '/reference',
      apiReference({
        content: document,
      }),
    );

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
