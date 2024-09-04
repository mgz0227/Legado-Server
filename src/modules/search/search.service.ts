import { Injectable } from '@nestjs/common';
import * as cheerio from 'cheerio';

import analyzeRule from '../../common/analyzeRule';
import { analysisRules } from '../../common/utils';
import { dataRule, SearchBook } from './search.dao';
@Injectable()
export class SearchService {
  async analysisHtml(data: dataRule): Promise<SearchBook[]> {
    // const $ = cheerio.load(data.body);
    const resp = await fetch(data.searchUrl);
    const htmlString = await resp.text();
    const $ = cheerio.load(htmlString);
    const bookListDom = analysisRules($, data.rule.bookList) as cheerio.Cheerio<cheerio.Element>;
    const books: SearchBook[] = [];

    bookListDom.each((index, element) => {
      const book = new SearchBook();
      book.name = analysisRules($, data.rule.name, element) as string;
      console.log(book.name);
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
    let resp: any;
    let jsonData: any;
    let htmlData: string = '';
    try {
      resp = await fetch(data.searchUrl);
    } catch (error) {
      return books;
    }
    const contentType = resp.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
      isJson = true;
      jsonData = await resp.json();
    } else if (contentType && contentType.includes('text/html')) {
      isJson = false;
      htmlData = await resp.text();
    } else {
      try {
        jsonData = await resp.json();
        isJson = true;
      } catch (error) {
        htmlData = await resp.text();
        isJson = false;
      }
    }

    if (isJson) {
      const res = await analyzeRule.parseBooks(jsonData, data.rule);
      books.push(...res);
    } else {
      const $ = cheerio.load(htmlData);
      try {
        const bookListDom = analysisRules($, data.rule.bookList) as cheerio.Cheerio<cheerio.Element>;
        if (bookListDom.length > 0) {
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
      } catch (error) {
        return books;
      }
    }
    return books;
  }

  //列表书籍信息解析及目录解析
  async analysisTest(data: dataRule): Promise<SearchBook[]> {
    let isJson = false;
    const books: SearchBook[] = [];
    let resp: any;
    let jsonData: any;
    let htmlData: string = '';
    try {
      resp = await fetch(data.searchUrl);
    } catch (error) {
      return books;
    }
    const contentType = resp.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
      isJson = true;
      jsonData = await resp.json();
    } else if (contentType && contentType.includes('text/html')) {
      isJson = false;
      htmlData = await resp.text();
    } else {
      try {
        jsonData = await resp.json();
        isJson = true;
      } catch (error) {
        htmlData = await resp.text();
        isJson = false;
      }
    }
    if (isJson) {
      const res = await analyzeRule.parseBookInfo(jsonData, data.bookInfoRule);
      books.push(...res);
    } else {
      const $ = cheerio.load(htmlData);
      try {
        const bookListDom = analysisRules($, data.bookInfoRule.init) as cheerio.Cheerio<cheerio.Element>;
        if (bookListDom.length > 0) {
          bookListDom.each((index, element) => {
            const book = new SearchBook();
            book.name = analysisRules($, data.bookInfoRule.name, element) as string;
            book.author = analysisRules($, data.bookInfoRule.author, element) as string;
            book.intro = analysisRules($, data.bookInfoRule.intro, element) as string;
            book.kind = analysisRules($, data.bookInfoRule.kind, element) as string;
            book.lastChapter = analysisRules($, data.bookInfoRule.lastChapter, element) as string;
            book.updateTime = analysisRules($, data.bookInfoRule.updateTime, element) as string;
            book.coverUrl = analysisRules($, data.bookInfoRule.tocUrl, element) as string;
            book.wordCount = analysisRules($, data.bookInfoRule.wordCount, element) as string;
            books.push(book);
          });
        }
      } catch (error) {
        return books;
      }
    }
    return books;
  }

  private cleanValue(value: string | undefined, rule?: string) {
    if (!value || !rule) return value || '';

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [_, regExp, replacement] = rule.split('##');
    if (regExp && replacement) {
      const regex = new RegExp(regExp, 'g');
      value = value.replace(regex, replacement);
    }

    return value;
  }

  private formatKind(value: string | undefined) {
    if (!value) return '';

    const parts = value.split('&&');
    const [cateName, statusStr] = parts;
    return `${cateName}小说（${statusStr}）`;
  }
}
