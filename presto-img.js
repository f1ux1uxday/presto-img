const express = require('express')
const cors = require('cors')
const mongoose = require('mongoose')
const bing = require('node-bing-api')({
  accKey: '3c4fc651-9bec-4934-9b5d-58433c870811',
})

const Keywords = require('./keywords')

const app = express()

app.use(cors())
mongoose.connect(
  process.env.MONGODB_URI || 'mongodb://localhost/keywords'
)

app.get('/', (request, response) => {
  response.send('to search, go to localhost:8080/img/your-keywords-here')
})

app.get('/img/:keyword', (request, response) => {
  let keyword = request.params.keyword
  // Request.query returns an object with query string as key
  // ?key=value format
  let query = request.query
  // Constructor uses schema from keywords.js
  let data = new Keywords({
    keywords: keyword,
    date: new Date(),
  })

  data.save(error => {
    if (error) {
      res.send('unable to save data to collection :(')
    }
  })

  response.json(data)
})

app.listen(process.env.PORT || 8080, () => {
  console.log('server is active.')
})
