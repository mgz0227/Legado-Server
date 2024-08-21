import { Body, Controller, Get, Post } from '@nestjs/common';
import { AppSearchService, SearchBook, dataRule } from './app.search.service';


@Controller()
export class AppSearchController {
    constructor(private readonly appSearchService: AppSearchService) {}

    @Post('analysisHtml')
    async analysisHtml(@Body() data:dataRule): Promise<SearchBook[]> {
      return await this.appSearchService.analysisHtml(data);
    }
    @Post('analysisBook')
    async analysisBook(@Body() data:dataRule): Promise<SearchBook[]> {
      return await this.appSearchService.analysisBook(data);
    }
}