/*
 * @Author: Andy 桂义
 * @Date: 2024-07-17 19:08:15
 * @LastEditors: Andy 454846659@qq.com
 * @LastEditTime: 2024-09-04 11:05:45
 * @FilePath: /legado-harmony-server/src/main.ts
 * @Description:
 */
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

import { AppModule } from './app.module';
import { getIPAddress } from './common/ip.util';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors();

  const swaggerConfig = new DocumentBuilder()
    .setTitle('Legado-harmony Server')
    .setDescription('Legado-harmony Server Open Api Document')
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('/api', app, document, {
    swaggerOptions: {
      docExpansion: 'none'
    }
  });

  await app.listen(3333);
  console.log('[Wisdoms] 服务启动成功');
  console.log(`  > Local:    `, `http://localhost:${3333}`);
  console.log(`  > Network:  `, `http://${getIPAddress()}:${3333}`);
}
bootstrap();
