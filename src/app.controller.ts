/*
 * @Author: Andy
 * @Date: 2024-07-17 19:08:15
 * @LastEditors: Andy andy.gui@gempoll.com
 * @LastEditTime: 2024-07-18 11:53:17
 * @FilePath: /server/src/app.controller.ts
 * @Description:
 */
import { Body, Controller, Get, Post } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Post('analysisRules')
  async postAnalysisRules(@Body() data: Record<string, any>) {
    return await this.appService.analysisRules(data);
  }
}
