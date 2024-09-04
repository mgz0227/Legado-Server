import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AppSearchController } from './app.search.controller';
import { AppSearchService } from './app.search.service';

@Module({
  imports: [],
  controllers: [AppController, AppSearchController],
  providers: [AppService, AppSearchService],
})
export class AppModule {}
