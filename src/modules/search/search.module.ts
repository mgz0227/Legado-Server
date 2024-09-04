import { Module } from '@nestjs/common';

import { SearchController } from './search.controller';
import { SearchService } from './search.service';

@Module({
  imports: [],
  providers: [SearchService],
  controllers: [SearchController]
})
export class SearchModule {}
