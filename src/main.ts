import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { getIPAddress } from './common/ip.util';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors();
  await app.listen(3333);
  console.log('[Wisdoms] 服务启动成功');
  console.log(`  > Local:    `, `http://localhost:${3333}`);
  console.log(`  > Network:  `, `http://${getIPAddress()}:${3333}`);
}
bootstrap();
