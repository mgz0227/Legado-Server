import { Body, Controller, Post } from '@nestjs/common';
import { ApiBody, ApiOperation, ApiTags } from '@nestjs/swagger';

import { CommonQueryDto } from './common.dao';
import { CommonService } from './common.service';

@ApiTags('通用解析规则')
@Controller('common')
export class CommonController {
  constructor(private readonly commonService: CommonService) {}

  @ApiOperation({ summary: '通用解析规则' })
  @ApiBody({ type: CommonQueryDto })
  @Post('analysisRules')
  async postAnalysisRules(@Body() data: CommonQueryDto) {
    return await this.commonService.analysisRules(data);
  }
}
