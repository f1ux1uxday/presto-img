const mongoose = require('mongoose')
const Schema = mongoose.Schema

const prestoSchema = new Schema({
  keywords: String,
  date: Date,
})

const Model = mongoose.model('keywordBank', prestoSchema)

module.exports = Model
