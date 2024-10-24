import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";
import { User } from "../../user/entities/user.entity";
import { MeetingRoom } from "../../meeting-room/entities/meeting-room.entity";

@Entity()
export class Booking {
  @PrimaryGeneratedColumn()
  id:number
  @Column({
    comment:'会议开始时间'
  })
  startTime:Date
  @Column({
    comment:'会议结束时间'
  })
  endTime:Date
  @Column({
    length:20,
    comment:'状态（申请中，审批通过，审批驳回），已拒绝'
  })
  status:string
  note:string
  user:User
  room:MeetingRoom
}
