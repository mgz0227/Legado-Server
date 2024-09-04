/*
 * @Author: Andy
 * @Date: 2024-07-17 19:08:15
 * @LastEditors: Andy 454846659@qq.com
 * @LastEditTime: 2024-09-04 11:03:22
 * @FilePath: /legado-harmony-server/src/app.controller.ts
 * @Description:
 */
import { Controller, Get } from '@nestjs/common';

import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }
}
