import { Injectable } from '@nestjs/common';
import * as cheerio from 'cheerio';
import { analysisRules, isValidUrl } from './common/utils';
import { log } from 'console';
import * as jp from 'jsonpath';
// 定义一个用于存储搜索书籍信息的类
export class SearchBook {
  author: string;
  bookUrl: string;
  coverUrl: string;
  intro: string;
  kind: string;
  lastChapter: string;
  name: string;
  wordCount: string;
  updateTime: string;

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
  }
}

class serachRuleData {
  checkKeyWord: string
  bookList: string
  name: string
  author: string
  intro: string
  kind: string
  lastChapter: string
  updateTime: string
  bookUrl: string
  coverUrl: string
  wordCount: string
}
export class dataRule {
  body: string
  rule: serachRuleData
  searchUrl: string
}
@Injectable()
export class AppSearchService {

  async analysisHtml(data: dataRule): Promise<SearchBook[]> {
    // const $ = cheerio.load(data.body);
    const resp = await fetch(data.searchUrl);
    const htmlString = await resp.text();
    const $ = cheerio.load(htmlString);
    const bookListDom = analysisRules(
      $,
      data.rule.bookList,
    ) as cheerio.Cheerio<cheerio.Element>;
    const books: SearchBook[] = [];

    bookListDom.each((index, element) => {
      const book = new SearchBook();
      book.name = analysisRules($, data.rule.name, element) as string;
      console.log(book.name)
      book.author = analysisRules($, data.rule.author, element) as string;
      book.intro = analysisRules($, data.rule.intro, element) as string;
      book.kind = analysisRules($, data.rule.kind, element) as string;
      book.lastChapter = analysisRules($, data.rule.lastChapter, element) as string;
      book.updateTime = analysisRules($, data.rule.updateTime, element) as string;
      book.bookUrl = analysisRules($, data.rule.bookUrl, element) as string;
      book.coverUrl = analysisRules($, data.rule.coverUrl, element) as string;
      book.wordCount = analysisRules($, data.rule.wordCount, element) as string;
      books.push(book);
    });
    console.log('解析结果：', books);
    return books;
  }

  async analysisBook(data: dataRule): Promise<SearchBook[]> {
    const books: SearchBook[] = [];
    let isJson = false;
    let resp: any
    let jsonData: any;
    try {
      resp = await fetch(data.searchUrl);
    } catch (error) {
      return books
    }
    const contentType = resp.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
      isJson = true;
    } else if (contentType && contentType.includes('text/html')) {
      isJson = false;
    } else {
      // 如果 Content-Type 不明确，尝试解析为 JSON
      try {
        jsonData = await resp.json();
        isJson = true;
      } catch (error) {
        isJson = false;
      }
    }
    if (isJson) {
      jsonData = await resp.json();
      //解析Json的代码请在这里添加
      const bookList = jp.query(jsonData, data.rule.bookList);
      bookList.forEach((item: any) => {
        const book: SearchBook = {
          name: this.cleanValue(jp.query(item, data.rule.name)?.[0]),
          author: this.cleanValue(jp.query(item, data.rule.author)?.[0], data.rule.author),
          intro: this.cleanValue(jp.query(item, data.rule.intro)?.[0], data.rule.intro),
          kind: this.formatKind(jp.query(item, data.rule.kind)?.[0]),
          lastChapter: this.cleanValue(jp.query(item, data.rule.lastChapter)?.[0], data.rule.lastChapter),
          updateTime: jp.query(item, data.rule.kind.split("&&")[2])?.[0] || '',
          bookUrl: jp.query(item, data.rule.bookUrl)?.[0] || '',
          coverUrl: jp.query(item, data.rule.coverUrl)?.[0] || '',
          wordCount: jp.query(item, data.rule.wordCount)?.[0] || ''
        };
        books.push(book);
      });
      console.log('解析结果：', books);
    } else {
      const htmlString = await resp.text();
      const $ = cheerio.load(htmlString);
      const bookListDom = analysisRules(
        $,
        data.rule.bookList,
      ) as cheerio.Cheerio<cheerio.Element>;
      bookListDom.each((index, element) => {
        const book = new SearchBook();
        book.name = analysisRules($, data.rule.name, element) as string;
        book.author = analysisRules($, data.rule.author, element) as string;
        book.intro = analysisRules($, data.rule.intro, element) as string;
        book.kind = analysisRules($, data.rule.kind, element) as string;
        book.lastChapter = analysisRules($, data.rule.lastChapter, element) as string;
        book.updateTime = analysisRules($, data.rule.updateTime, element) as string;
        book.bookUrl = analysisRules($, data.rule.bookUrl, element) as string;
        book.coverUrl = analysisRules($, data.rule.coverUrl, element) as string;
        book.wordCount = analysisRules($, data.rule.wordCount, element) as string;
        books.push(book);
      });
    }
    return books;
  }

  private cleanValue(value: string | undefined, rule?: string){
    if (!value || !rule) return value || '';

    const [_, regExp, replacement] = rule.split('##');
    if (regExp && replacement) {
      const regex = new RegExp(regExp, 'g');
      value = value.replace(regex, replacement);
    }
    
    return value;
  }

  private formatKind(value: string | undefined){
    if (!value) return '';

    const parts = value.split('&&');
    const [cateName, statusStr] = parts;
    return `${cateName}小说（${statusStr}）`;
  }
}