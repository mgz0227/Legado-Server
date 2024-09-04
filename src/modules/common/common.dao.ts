/*
 * @Author: Andy 桂义
 * @Date: 2024-09-04 10:58:27
 * @LastEditors: Andy 454846659@qq.com
 * @LastEditTime: 2024-09-04 12:23:27
 * @FilePath: /legado-harmony-server/src/modules/common/common.dao.ts
 * @Description:
 */
import { ApiProperty } from '@nestjs/swagger';
export class CommonQueryDto {
  @ApiProperty({ description: '解析URL地址' })
  'url': string;

  @ApiProperty({ description: '解析书籍列表' })
  'bookList': string;

  @ApiProperty({ required: false, description: '每页数量', default: 10 })
  'pageSize': number;

  @ApiProperty({
    required: false,
    description:
      '[key]可以是任意解析需要解析的字段，内容传入解析规则，解析后会将所有的[key]解析内容返回，例如：title,author,coverUrl,intro,kind,lastChapter,wordCount等'
  })
  '[key]': string;
}
