import mongoose from 'mongoose'
const Schema = mongoose.Schema

const userSchema = new Schema({
  openid: {
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

export default mongoose.model('wx_user', userSchema)