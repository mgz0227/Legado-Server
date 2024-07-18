/*
 * @Author: Andy
 * @Date: 2024-07-18 10:03:45
 * @LastEditors: Andy andy.gui@gempoll.com
 * @LastEditTime: 2024-07-18 11:52:51
 * @FilePath: /server/src/common/utils.ts
 * @Description:
 */
import * as cheerio from 'cheerio';

const parseRule = (
  $: cheerio.CheerioAPI,
  rule: string,
  book?: cheerio.Element,
): string | undefined => {
  const parts = rule.split('@');
  const selectorPart = parts[0];
  const attrPart = parts[1];

  let selector = '';
  let index = -1;

  if (selectorPart.includes('.')) {
    selector = selectorPart;
    if (selectorPart.includes('.')) {
      const indexStr = selectorPart.split('.').pop();
      if (indexStr && !isNaN(Number(indexStr))) {
        index = Number(indexStr);
      }
      selector = selector.replace(/\.\d+$/, '');
    }
  } else {
    selector = selectorPart;
  }

  let result = $(book).find(selector);

  if (index >= 0) {
    result = result.eq(index);
  }

  if (attrPart === 'text') {
    // 正则去除\n和空格符
    return result
      .text()
      .replaceAll(/[\n\s]/g, '')
      .trim();
  } else {
    return result.attr(attrPart)?.trim();
  }
};
const stringToRegex = (pattern: string): RegExp => {
  const regexPattern = new RegExp(pattern.replace(/\\\\/g, '\\'), '');
  return regexPattern;
};
export const removeDomain = (url: string) => {
  const urlObj = new URL(url);
  return urlObj.pathname;
};
export const getDomain = (url: string) => {
  const urlObj = new URL(url);
  return urlObj.hostname;
};
// 判断是否是正常的链接地址
export const isValidUrl = (url: string) => {
  try {
    new URL(url);
    return true;
  } catch (error) {
    return false;
  }
};
// 解析规则
export const analysisRules = (
  $: cheerio.CheerioAPI,
  rules: string,
  book?: cheerio.Element,
) => {
  if (!rules) {
    return undefined;
  }

  const [rule, ...reg] = rules.split('##');
  if (!book) {
    const [startParts, endParts] = rule.split('@');
    if (endParts) {
      return $(startParts).find(endParts);
    }
    return $(startParts);
  }
  // rule有以下规则，转化为=> 后面格式
  // .item@text' => $(book).find('.item').text()
  // p.0@text' => $(book).find('p').eq(0).text()
  // .item.0@text => $(book).find('.item').eq(0).text()
  // a@href => $(book).find('a').attr('href')
  // img@src => $(book).find('img').attr('src')
  // a@text => $(book).find('a').text()
  if (reg.length === 0 || reg[0] === '') {
    return parseRule($, rule, book);
  }
  // 若是存在匹配规则，则去掉匹配规则中的内容
  if (reg.length === 1) {
    return parseRule($, rule, book)
      ?.replace(reg[0], '')
      ?.replace(reg[0].replace('.', ':'), '')
      ?.replace(reg[0].replace('.', '：'), '')
      .trim();
  }
  // 解析以下规则
  // 'a@href##.+\\D((\\d+)\\d{3})\\D##http://img.bayizww.com/$2/$1/$1s.jpg###'
  if (reg.length >= 2) {
    const [regRule, regContent] = reg;
    const href = parseRule($, rule, book);
    const regex = stringToRegex(regRule);
    const match = removeDomain(href ?? '').match(regex);
    let newUrl = '';
    if (match?.length) {
      newUrl = regContent.replace(
        /\$(\d+)/g,
        (_, groupIndex) => match[groupIndex],
      );
    }
    return newUrl;
  }
  return undefined;
};
