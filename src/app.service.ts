/*
 * @Author: Andy
 * @Date: 2024-07-17 19:08:15
 * @LastEditors: Andy 454846659@qq.com
 * @LastEditTime: 2024-09-04 11:04:24
 * @FilePath: /legado-harmony-server/src/app.service.ts
 * @Description:
 */
import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): string {
    return '服务端解析接口!';
  }
}
