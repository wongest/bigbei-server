import mongoose from 'mongoose'
const Schema = mongoose.Schema;

export interface FlowType {
  id: string;
  createrId: string;
  title: string;
  description: string;
  createTime: string;
  reviewerId: string;
  reviewTime?: string;
  approved?: boolean;
  reason?: string;
  rate?: number;
}

const flowSchema = new Schema<FlowType>({
  id: {
    type: String,
    require: true,
  },
  createrId: {
    type: String,
    require: true,
  },
  reviewerId: {
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
  approved: {
    type: Boolean,
    require: false,
  },
  reason: {
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
  rate: {
    type: Number,
    require: false,
  },
})

export default mongoose.model<FlowType>('flow', flowSchema)