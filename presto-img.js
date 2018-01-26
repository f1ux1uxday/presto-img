const express = require('express')
const cors = require('cors')
const mongoose = require('mongoose')
const bing = require('node-bing-api')({
  accKey: '3c4fc651-9bec-4934-9b5d-58433c870811',
})

const app = express()

app.use(cors())

app.get('/', (request, response) => {
  response.send('to search, go to localhost:8080/img/your-keywords-here')
})

app.get('/img/:keywords', (request, response) => {
  let keywords = request.params.keywords
  // request.query returns an object with query string as key
  // ?key=value format
  let query = request.query
  response.json({
    1: keywords,
    2: query,
    3: 'under construction',
  })
})

app.listen(process.env.PORT || 8080, () => {
  console.log('server is active.')
})
