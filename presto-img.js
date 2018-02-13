const express = require('express')
const cors = require('cors')
const mongoose = require('mongoose')
const Bing = require('bingsearch7-api')({
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

// This route returns recent search keywords
app.get('/recent', (request, response) => {
  Keywords.find({}, (error, data) => {
    if (error) {
      response.send('unable to return data :(')
    } else {
      response.json(data)
    }
  })
})

// This route runs search using given keyword
app.get('/img/:keyword', (request, response) => {
  let keyword = request.params.keyword
  // Request.query returns an object with query string as key
  // ?key=value format
  let offset = request.query.offset
  // Constructor uses schema from keywords.js
  let data = new Keywords({
    keywords: keyword,
    date: new Date(),
  })

  // Save data to Mongo collection
  data.save(error => {
    if (error) {
      response.send('unable to save data to collection :(')
    }
  })

  // Make call using bingsearch7 API
  Bing.images(keyword, {
    count: 10,
    offset: offset,
  }, (err, res, body) => {
    let resultsArray = []

    for (let i = 0; i < 10; i++) {
      resultsArray.push({
        searchUrl: body.value[i].webSearchUrl,
        caption: body.value[i].name,
        thumbnailUrl: body.value[i].thumbnailUrl,
        contentUrl: body.value[i].contentUrl,
      })
    }

    if (err) {
      console.log(err.message)
    } else {
      response.json(resultsArray)
    }
  })
})

app.listen(process.env.PORT || 8080, () => {
  console.log('server is active.')
})
