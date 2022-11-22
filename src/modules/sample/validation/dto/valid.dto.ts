import { IsNotEmpty, IsNumber, MinLength } from 'class-validator';

export class ValidDto {
  /**
   * number type은 0으로 초기화 되기 때문에 IsNotEmpty 적용이 되지 않음.
   * 이와 관련해서는 아래 메소드의 주석 참조
   *
   * @see ClsTransformer#plainToClass
   */
  @IsNotEmpty()
  @IsNumber({}, { message: '아이디는 숫자만 입력 가능합니다.' })
  id: number;

  @IsNotEmpty({ message: '이름을 입력해 주세요.' })
  @MinLength(10, { message: '10자 이상 입력해 주세요.' })
  name: string;
}
