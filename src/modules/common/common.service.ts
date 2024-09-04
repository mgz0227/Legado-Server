/*
 * @Author: Andy
 * @Date: 2024-07-17 19:08:15
 * @LastEditors: Andy 454846659@qq.com
 * @LastEditTime: 2024-09-04 12:39:54
 * @FilePath: /legado-harmony-server/src/modules/common/common.service.ts
 * @Description:
 */
import { Injectable } from '@nestjs/common';
import * as cheerio from 'cheerio';

import { analysisRules } from '../../common/utils';

@Injectable()
export class CommonService {
  getHello(): string {
    return '服务端解析接口!';
  }

  async analysisRules(data: Record<string, any>): Promise<Record<string, any>[]> {
    console.log('入参数内容：', data);
    if (!data) return [];
    const { url, bookList, pageSize = 10, ...ruleParams } = data;
    const resp = await fetch(url);

    if ([404, 500, 501, 502, 503].includes(resp.status)) {
      throw new Error('请求失败');
    }
    if (resp.status === 401) {
      throw new Error('权限不足');
    }
    const htmlString = await resp.text();

    const $ = cheerio.load(htmlString);
    const bookListDom = analysisRules($, bookList) as cheerio.Cheerio<cheerio.Element>;
    const domLength = (bookListDom?.length ?? 0) > pageSize ? pageSize : (bookListDom?.length ?? 0);
    const dataList = [];
    for (let i = 0; i < domLength; i++) {
      const book = bookListDom[i];
      // 循环ruleParams字段内容将其解析然后push到dataList
      const dataMap: Record<string, any> = {};
      for (const key in ruleParams) {
        const value = ruleParams[key];
        const result = analysisRules($, value, book);
        dataMap[key] = result ?? '';
      }
      dataList.push(dataMap);
    }
    console.log(JSON.stringify(dataList));
    return dataList;
  }
}
