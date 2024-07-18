import mongoose from 'mongoose'
const Schema = mongoose.Schema

const wxTokenSchema = new Schema({
    access_token: {
        type: String,
        require: true
    },
    // 时间搓（秒）
    createTime: {
        type: String,
        require: true
    },
    expires_in: {
      type: Number,
      require: true,
  },

})

export default  mongoose.model('wx_token', wxTokenSchema)