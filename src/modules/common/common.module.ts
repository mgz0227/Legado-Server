/*
 * @Author: Andy 桂义
 * @Date: 2024-09-04 10:57:45
 * @LastEditors: Andy 454846659@qq.com
 * @LastEditTime: 2024-09-04 11:00:58
 * @FilePath: /legado-harmony-server/src/modules/common/common.module.ts
 * @Description: 通用解析模块
 */
import { Module } from '@nestjs/common';

import { CommonController } from './common.controller';
import { CommonService } from './common.service';

@Module({
  imports: [],
  providers: [CommonService],
  controllers: [CommonController]
})
export class CommonModule {}
