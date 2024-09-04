import { Module } from '@nestjs/common';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CommonModule } from './modules/common/common.module';
import { SearchModule } from './modules/search/search.module';

@Module({
  imports: [SearchModule, CommonModule],
  controllers: [AppController],
  providers: [AppService]
})
export class AppModule {}
