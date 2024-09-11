import { IsNotEmpty, IsString, Length } from "class-validator"

export class SigninUserDto{
  @IsString()
  @IsNotEmpty()
  @Length(5,20,{
    // $value 当前用户传过来的值
    // $property 当前属性名
    // $target 当前类
    // $constraint1 第一个参数
    // $constraint2第二个 参数
    message:`用户名长度为$constraint1 $constraint2`
  })
  username:string
  @IsString()
  @IsNotEmpty()
  @Length(5,20)
  password:string
}