const express = require('express')
const cors = require('cors')
const mongoose = require('mongoose')
const Bing = require('node-bing-api')({
  accKey: '0821445330bc4608a05b8cfb5fe4b5cc',
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

app.get('/recent', (request, response) => {
  Keywords.find({}, (error, data) => {
    if (error) {
      response.send('unable to return data :(')
    } else {
      response.json(data)
    }
  })
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
      response.send('unable to save data to collection :(')
    }
  })

  Bing.images(keyword, {
    count: 10,
  }, (err, res, body) => {
    if (err) {
      console.log(err.message)
    } else {
      response.json(body)
    }
  })
  // Response.json(data)
})

app.listen(process.env.PORT || 8080, () => {
  console.log('server is active.')
})
