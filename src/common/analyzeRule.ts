import * as jp from 'jsonpath'; // 用于解析JSON路径
import {
  BookInfoRule,
  SearchBook,
  serachRuleData,
} from 'src/app.search.service';
import * as vm from 'vm'; // 用于执行JS表达式
class AnalyzeRule {
  async parseBooks(
    data: any,
    searchRule: serachRuleData,
  ): Promise<SearchBook[]> {
    let books: any;
    try {
      books = await this.getBookListRule(data, searchRule.bookList);
      if (!books) {
        return [];
      }
    } catch (error) {
      console.log(`解析书籍列表时出错: ${error}`);
      return [];
    }
    const bookList: SearchBook[] = [];
    for (const book of books) {
      // 如果 book 是一个数组，继续遍历其元素
      if (Array.isArray(book)) {
        for (const subBook of book) {
          const searchBook = new SearchBook();
          searchBook.author = await this.parseField(subBook, searchRule.author);
          searchBook.kind = await this.parseField(subBook, searchRule.kind);
          searchBook.bookUrl = await this.parseField(
            subBook,
            searchRule.bookUrl,
          );
          searchBook.coverUrl = await this.parseField(
            subBook,
            searchRule.coverUrl,
          );
          searchBook.intro = await this.parseField(subBook, searchRule.intro);
          searchBook.lastChapter = await this.parseField(
            subBook,
            searchRule.lastChapter,
          );
          searchBook.name = await this.parseField(subBook, searchRule.name);
          searchBook.wordCount = await this.parseField(
            subBook,
            searchRule.wordCount,
          );
          searchBook.updateTime = await this.parseField(
            subBook,
            searchRule.updateTime,
          );
          bookList.push(searchBook);
        }
      } else {
        // 如果 book 不是数组，直接处理
        const searchBook = new SearchBook();
        searchBook.author = await this.parseField(book, searchRule.author);
        searchBook.bookUrl = await this.parseField(book, searchRule.bookUrl);
        searchBook.coverUrl = await this.parseField(book, searchRule.coverUrl);
        searchBook.intro = await this.parseField(book, searchRule.intro);
        searchBook.kind = await this.parseField(book, searchRule.kind);
        searchBook.lastChapter = await this.parseField(
          book,
          searchRule.lastChapter,
        );
        searchBook.name = await this.parseField(book, searchRule.name);
        searchBook.wordCount = await this.parseField(
          book,
          searchRule.wordCount,
        );
        searchBook.updateTime = await this.parseField(
          book,
          searchRule.updateTime,
        );
        bookList.push(searchBook);
      }
    }
    return bookList;
  }

  async parseBookInfo(
    data: any,
    bookInfoRule: BookInfoRule,
  ): Promise<SearchBook[]> {
    let books: any;
    try {
      books = await this.getBookListRule(data, bookInfoRule.init);
      if (!books) {
        return [];
      }
    } catch (error) {
      console.log(`解析书籍列表时出错: ${error}`);
      return [];
    }
    const bookList: SearchBook[] = [];
    for (const book of books) {
      // 如果 book 是一个数组，继续遍历其元素
      if (Array.isArray(book)) {
        for (const subBook of book) {
          const searchBook = new SearchBook();
          searchBook.name = await this.parseField(subBook, bookInfoRule.name);
          searchBook.author = await this.parseField(
            subBook,
            bookInfoRule.author,
          );
          // searchBook.intro = await this.parseField(subBook, bookInfoRule.intro);
          // searchBook.kind = await this.parseField(subBook, bookInfoRule.kind);
          // searchBook.lastChapter = await this.parseField(subBook, bookInfoRule.lastChapter);
          searchBook.updateTime = await this.parseField(
            subBook,
            bookInfoRule.updateTime,
          );
          searchBook.coverUrl = await this.parseField(
            subBook,
            bookInfoRule.coverUrl,
          );
          searchBook.tocUrl = await this.parseField(
            subBook,
            bookInfoRule.coverUrl,
          );
          searchBook.wordCount = await this.parseField(
            subBook,
            bookInfoRule.wordCount,
          );
          searchBook.canReName = await this.parseField(
            subBook,
            bookInfoRule.canReName,
          );
          searchBook.downloadUrls = await this.parseField(
            subBook,
            bookInfoRule.downloadUrls,
          );
          bookList.push(searchBook);
        }
      } else {
        // 如果 book 不是数组，直接处理
        const searchBook = new SearchBook();
        searchBook.name = await this.parseField(book, bookInfoRule.name);
        searchBook.author = await this.parseField(book, bookInfoRule.author);
        // searchBook.intro = await this.parseField(book, bookInfoRule.intro);
        // searchBook.kind = await this.parseField(book, bookInfoRule.kind);
        // searchBook.lastChapter = await this.parseField(book, bookInfoRule.lastChapter);
        searchBook.updateTime = await this.parseField(
          book,
          bookInfoRule.updateTime,
        );
        searchBook.coverUrl = await this.parseField(
          book,
          bookInfoRule.coverUrl,
        );
        searchBook.tocUrl = await this.parseField(book, bookInfoRule.coverUrl);
        searchBook.wordCount = await this.parseField(
          book,
          bookInfoRule.wordCount,
        );
        searchBook.canReName = await this.parseField(
          book,
          bookInfoRule.canReName,
        );
        searchBook.downloadUrls = await this.parseField(
          book,
          bookInfoRule.downloadUrls,
        );
        bookList.push(searchBook);
      }
    }
    return bookList;
  }

  private async getBookListRule(data: any, rule: string): Promise<any> {
    let ruleData = rule;
    if (!rule) return;
    if (ruleData.includes('@js:')) {
      // return this.processAndRunJS(rule);
    }
    if (ruleData.includes('@JSon') || ruleData.includes('@json')) {
      ruleData = JSON.parse(rule.replace('@JSON:', '').replace('@json:', ''));
    }
    if (ruleData.includes('&&')) {
      ruleData = ruleData.split('&&')[1];
    }
    return jp.query(data, ruleData);
  }

  private replaceMustacheTemplate(rule: string, data: any): string {
    return rule.replace(/{{\s*([^}]+)\s*}}/g, (_, match) => {
      const value = jp.value(data, match.trim());
      return value !== undefined && value !== null ? value : '';
    });
  }

  private async parseField(data: any, rule: string): Promise<string> {
    let result = '';
    if (!rule) {
      return result;
    }
    // 如果 rule 包含 Mustache 模板表达式
    if (rule.includes('{{') && rule.includes('}}')) {
      rule = this.replaceMustacheTemplate(rule, data);
      if (rule.includes('@js:')) {
        return this.processAndRunJS(rule);
      }
      return rule;
    }

    // 如果 rule 包含 '##'，处理正则表达式
    if (rule.includes('##')) {
      const [path, regex] = rule.split('##');
      result = jp.value(data, path.trim());
      if (regex && typeof result === 'string') {
        const regExp = new RegExp(regex);
        result = result.replace(regExp, '');
      }
      return result || '';
    }

    // 如果 rule 包含 '@JSON:' 或 '@json:', 处理 JSONPath 表达式
    if (rule.includes('@JSON:') || rule.includes('@json:')) {
      const path = rule.replace('@JSON:', '').replace('@json:', '').trim();
      result = jp.query({ result: data }, path)[0]; // 注意这里只取第一个结果
      return JSON.stringify(result) || '';
    }

    // 如果 rule 包含 '@js:', 处理 JavaScript 代码
    if (rule.includes('@js:')) {
      const value = await this.jsAnalyzeRule(data, rule);
      return value;
    }

    // 默认处理 JSONPath 表达式
    return jp.value(data, rule.trim()) || '';
  }

  private processAndRunJS(data: string): string {
    const parts = data.split('@js:');
    if (parts.length !== 2) {
      throw new Error('输入格式错误');
    }

    const result = parts[0];
    const script = parts[1];

    // 创建一个新的上下文
    const context = { result };

    try {
      // 编译脚本
      const jsScript = new vm.Script(script);

      // 创建一个沙箱环境
      const sandbox = { ...context }; // 只需复制需要的变量到沙箱

      // 在沙箱环境中执行代码
      const output = jsScript.runInNewContext(sandbox); // 使用jsScript实例执行

      return output; // 返回处理后的字符串
    } catch (error) {
      console.error('执行脚本时发生错误:', error);
      return ''; // 返回空字符串或抛出异常取决于您的需求
    }
  }

  async jsAnalyzeRule(data: any, rule: string): Promise<any> {
    const jsCode = rule.replace('@js:', '').trim();
    let result = jp.value(data, rule.split('@js:')[0].trim());
    // 确保 result 是字符串，如果不是则初始化为空字符串
    result = typeof result === 'string' ? result : JSON.stringify(result);
    const modifiedJsCode = jsCode.replace(
      rule.split('@js:')[0].trim(),
      `${result}`,
    );
    const sandbox = {
      result: result,
      java: {
        ajax: async (url: string) => {
          try {
            url = url;
            const response = await fetch(url);
            let jsonData: any;
            const contentType = response.headers.get('content-type');
            if (contentType && contentType.includes('application/json')) {
              jsonData = await response.json();
            }
            return jsonData;
          } catch (error) {
            console.error('Error fetching data:', error);
          }
        },
        timeFormat: (time: number) => new Date(time).toLocaleString(),
      },
    };

    try {
      vm.createContext(sandbox);
      return vm.runInContext(modifiedJsCode, sandbox) || '';
    } catch (error) {
      return '';
    }
  }
}
const analyzeRule = new AnalyzeRule();
export default analyzeRule;
