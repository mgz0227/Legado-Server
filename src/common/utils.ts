/*
 * @Author: Andy
 * @Date: 2024-07-18 10:03:45
 * @LastEditors: Andy andy.gui@gempoll.com
 * @LastEditTime: 2024-07-21 04:11:07
 * @FilePath: /legado-harmony-server/src/common/utils.ts
 * @Description:
 */
import * as cheerio from 'cheerio';

const getSelectorIndex = (
  selectorPart: string,
): [string, number | number[]] => {
  let selector = '';
  let index;
  if (selectorPart.includes('.')) {
    selector = selectorPart;
    if (selectorPart.includes('.')) {
      const indexStr = selectorPart.split('.').pop();
      if (indexStr && !isNaN(Number(indexStr))) {
        index = Number(indexStr);
      } else if (indexStr?.includes(':')) {
        index = indexStr.split(':').map((item) => Number(item));
      }
      selector = selector.replace(/(\.?)([a-zA-Z]+)\.\d+(?::\d+)?$/, '$1$2');
    }
  } else {
    selector = selectorPart;
  }
  if (index === undefined) {
    index = -1;
  }
  return [selector, index];
};
const parseRule = (
  $: cheerio.CheerioAPI,
  rule: string,
  book?: cheerio.Element,
): string | undefined => {
  const rules = rule.split('&&');
  if (rules.length > 1) {
    return rules.map((rule) => parseRule($, rule, book)).join('');
  }

  const parts = rule.split('@');
  const selectorPart = parts[0];
  const attrPart = parts.at(-1);
  const [selector, index] = getSelectorIndex(selectorPart);

  let result = $(book).find(selector);

  let indexArr: number[] = [];
  if (typeof index === 'number' && index >= 0) {
    result = result.eq(index);
  } else if (Array.isArray(index)) {
    indexArr = index;
  }

  if (parts.length > 2) {
    const otherPart = parts[1];
    const [selector, index] = getSelectorIndex(otherPart);
    result = result.find(selector);
    if (typeof index === 'number' && index >= 0) {
      result = result.eq(index);
    } else if (Array.isArray(index)) {
      indexArr = index;
    }
  }
  const selectorArr = selector.split(',');

  if (selectorArr.length > 1) {
    return selectorArr
      .map((selector) => parseRule($, `${selector}@${attrPart}`, book))
      .join(',');
  }

  if (['text', 'textNodes'].includes(attrPart || '')) {
    if (indexArr.length > 0) {
      return indexArr.map((index) => result.eq(index).text()).join(',');
    }
    // 正则去除\n和空格符
    return result
      .text()
      .replaceAll(/[\n\s]/g, '')
      .trim();
  } else if (attrPart === 'html') {
    return result.html() || '';
  } else {
    return result.attr(attrPart ?? '')?.trim();
  }
};
const stringToRegex = (pattern: string): RegExp => {
  const regexPattern = new RegExp(pattern.replace(/\\\\/g, '\\'), '');
  return regexPattern;
};
export const removeDomain = (url: string) => {
  if (!isValidUrl(url)) {
    return url;
  }
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
    const startArr = rule.split('||');
    if (startArr.length > 1) {
      let result: cheerio.Cheerio<cheerio.Element> | undefined;
      for (let i = 0; i < startArr.length; i++) {
        const resultInfo = analysisRules(
          $,
          startArr[i],
        ) as cheerio.Cheerio<cheerio.Element>;
        if (resultInfo.length > 0) {
          result = resultInfo;
          break;
        }
      }
      return result;
    }
    const [startParts, endParts] = rule.split('@');
    if (endParts) {
      return $(startParts).find(endParts);
    }
    return $(startParts.replace('id.', '#'));
  }
  // rule有以下规则，转化为=> 后面格式
  // .item@text' => $(book).find('.item').text()
  // p.0@text' => $(book).find('p').eq(0).text()
  // .item.0@text => $(book).find('.item').eq(0).text()
  // a@href => $(book).find('a').attr('href')
  // img@src => $(book).find('img').attr('src')
  // a@text => $(book).find('a').text()
  const ruleArr: string[] = rule.split('||');

  if (ruleArr.length >= 2) {
    return ruleArr.map((rule) => parseRule($, rule, book)).join('');
  }

  if (reg.length === 0 || reg[0] === '') {
    return parseRule($, rule, book);
  }
  // 若是存在匹配规则，则去掉匹配规则中的内容
  if (reg.length === 1) {
    return parseRule($, rule, book)
      ?.replace(new RegExp(reg[0], 'g'), '')
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
