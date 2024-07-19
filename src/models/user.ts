import mongoose from 'mongoose'
const Schema = mongoose.Schema

export interface UserType {
  id: string;
  openid: string;
  phoneNumber: string;
  remark: string;
  createTime: string;
}

const userSchema = new Schema<UserType>({
  id: {
    type: String,
    require: true
  },
  openid: {
    type: String,
    require: true
  },
  phoneNumber: {
    type: String,
    require: true
  },
  remark: {
    type: String,
    require: false,
  },
  // Date时间戳
  createTime: {
    type: String,
    require: true,
  },
})

export default mongoose.model<UserType>('wx_user', userSchema)