import { IsNotEmpty, MaxLength } from "class-validator";

export class CreateMeetingRoomDto {
  @IsNotEmpty({
    message:'会议室名称不能为空'
  })
  @MaxLength(10,{
    message:'最长名称为10个字'
  })
  name:string
  @IsNotEmpty({
    message:'容量不能为空'
  })
  capacity:number
  @IsNotEmpty({
    message:'位置不能为空'
  })
  @MaxLength(50,{
    message:'位置最长为50字符'
  })
  location:string

  @IsNotEmpty({
    message:'设备不能为空'
  })
  @MaxLength(50,{
    message:'最长50个字符'
  })
  equipment:string
  @IsNotEmpty({
    message:'描述不为空'
  })
  description:string
}
