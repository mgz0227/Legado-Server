/*
 * @Author: Andy 桂义
 * @Date: 2024-09-04 10:58:27
 * @LastEditors: Andy 454846659@qq.com
 * @LastEditTime: 2024-09-04 13:00:32
 * @FilePath: /legado-harmony-server/src/modules/search/search.dao.ts
 * @Description: 实体类
 */
import { ApiProperty } from '@nestjs/swagger';

// 定义一个用于存储搜索书籍信息的类
export class SearchBook {
  @ApiProperty({ description: '书籍作者' })
  author: string;
  @ApiProperty({ description: '书籍详情URL' })
  bookUrl: string;
  @ApiProperty({ description: '书籍图片' })
  coverUrl: string;
  @ApiProperty({ description: '书籍简介' })
  intro: string;
  @ApiProperty({ description: '书籍分类' })
  kind: string;
  @ApiProperty({ description: '最新章节标题' })
  lastChapter: string;
  @ApiProperty({ description: '书籍名称' })
  name: string;
  @ApiProperty({ description: '书籍字数' })
  wordCount: string;
  @ApiProperty({ description: '更新时间' })
  updateTime: string;
  @ApiProperty({ required: false, description: '目录地址' })
  tocUrl: string;
  canReName: string;
  @ApiProperty({ required: false, description: '下载地址' })
  downloadUrls: string;

  constructor() {
    this.author = '';
    this.bookUrl = '';
    this.coverUrl = '';
    this.intro = '';
    this.kind = '';
    this.lastChapter = '';
    this.name = '';
    this.wordCount = '';
    this.updateTime = '';
    this.tocUrl = '';
    this.canReName = '';
    this.downloadUrls = '';
  }
}

export class serachRuleData {
  @ApiProperty({ required: false, description: '关键词检查' })
  checkKeyWord: string;
  @ApiProperty({ description: '解析书籍列表' })
  bookList: string;
  @ApiProperty({ required: false, description: '书籍名称' })
  name: string;
  @ApiProperty({ required: false, description: '书籍作者' })
  author: string;
  @ApiProperty({ required: false, description: '书籍简介' })
  intro: string;
  @ApiProperty({ required: false, description: '书籍分类' })
  kind: string;
  @ApiProperty({ required: false, description: '最新章节标题' })
  lastChapter: string;
  @ApiProperty({ required: false, description: '更新时间' })
  updateTime: string;
  @ApiProperty({ required: false, description: '书籍详情URL' })
  bookUrl: string;
  @ApiProperty({ required: false, description: '书籍图片' })
  coverUrl: string;
  @ApiProperty({ required: false, description: '书籍字数' })
  wordCount: string;
}
//书籍信息规则
export class BookInfoRule {
  init: string;
  @ApiProperty({ required: false, description: '书籍名称' })
  name: string;
  @ApiProperty({ required: false, description: '书籍作者' })
  author: string;
  @ApiProperty({ required: false, description: '书籍简介' })
  intro: string;
  @ApiProperty({ required: false, description: '书籍分类' })
  kind: string;
  @ApiProperty({ required: false, description: '最新章节标题' })
  lastChapter: string;
  @ApiProperty({ required: false, description: '更新时间' })
  updateTime: string;
  @ApiProperty({ required: false, description: '书籍图片' })
  coverUrl: string;
  @ApiProperty({ required: false, description: '目录地址' })
  tocUrl: string;
  @ApiProperty({ required: false, description: '书籍字数' })
  wordCount: string;
  canReName: string;
  @ApiProperty({ required: false, description: '下载地址' })
  downloadUrls: string;
}
//目录规则
class TocRule {
  preUpdateJs?: string;
  @ApiProperty({ required: false, description: '章节列表' })
  chapterList?: string;
  @ApiProperty({ required: false, description: '章节名称' })
  chapterName?: string;
  @ApiProperty({ required: false, description: '章节地址' })
  chapterUrl?: string;
  formatJs?: string;
  isVolume?: string;
  @ApiProperty({ required: false, description: '是否vip' })
  isVip?: string;
  @ApiProperty({ required: false, description: '是否需要购买' })
  isPay?: string;
  @ApiProperty({ required: false, description: '更新时间' })
  updateTime?: string;
  @ApiProperty({ required: false, description: '下一页' })
  nextTocUrl?: string;
}

export class dataRule {
  body: string;
  @ApiProperty({ required: false, description: '搜索列表规则' })
  rule: serachRuleData;
  @ApiProperty({ description: '解析URL地址' })
  searchUrl: string;
  @ApiProperty({ required: false, description: '书籍详情解析规则' })
  bookInfoRule: BookInfoRule;
  @ApiProperty({ required: false, description: '目录解析规则' })
  tocRule: TocRule;
}
