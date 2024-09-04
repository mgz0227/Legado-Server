/*
 * @Author: Andy 桂义
 * @Date: 2024-09-04 10:25:08
 * @LastEditors: Andy 454846659@qq.com
 * @LastEditTime: 2024-09-04 12:51:47
 * @FilePath: /legado-harmony-server/src/modules/search/search.controller.ts
 * @Description:
 */
import { Body, Controller, Post } from '@nestjs/common';
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

import { dataRule, SearchBook } from './search.dao';
import { SearchService } from './search.service';

@ApiTags('搜索解析规则')
@Controller('search')
export class SearchController {
  constructor(private readonly searchService: SearchService) {}

  @ApiOperation({ summary: '解析HTML规则' })
  @ApiBody({ type: dataRule })
  @ApiResponse({
    status: 200,
    description: '解析HTML规则',
    type: [SearchBook]
  })
  @Post('analysisHtml')
  async analysisHtml(@Body() data: dataRule): Promise<SearchBook[]> {
    return await this.searchService.analysisHtml(data);
  }

  @ApiOperation({ summary: '解析书籍详情' })
  @ApiBody({ type: dataRule })
  @ApiResponse({
    status: 200,
    description: '解析书籍详情',
    type: [SearchBook]
  })
  @Post('analysisBook')
  async analysisBook(@Body() data: dataRule): Promise<SearchBook[]> {
    return await this.searchService.analysisBook(data);
  }

  @ApiOperation({ summary: '列表书籍信息解析及目录解析' })
  @ApiBody({ type: dataRule })
  @ApiResponse({
    status: 200,
    description: '列表书籍信息解析及目录解析',
    type: [SearchBook]
  })
  @Post('analysisTest')
  async analysisTest(@Body() data: dataRule): Promise<SearchBook[]> {
    return await this.searchService.analysisTest(data);
  }
}
