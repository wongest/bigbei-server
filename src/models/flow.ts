import mongoose from 'mongoose'
const Schema = mongoose.Schema

const flowSchema = new Schema({
  creater: {
    type: String,
    require: true
  },
  reviewer: {
    type: String,
    require: true,
  },
  // Date时间戳
  createTime: {
    type: String,
    require: true,
  },
  // Date时间戳
  reviewTime: {
    type: String,
    require: false,
  },
  title: {
    type: String,
    require: true,
  },
  description: {
    type: String,
    require: true,
  },
})

export default mongoose.model('flow', flowSchema)