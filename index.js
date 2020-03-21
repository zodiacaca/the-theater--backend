
const path = require('path')
const fs = require('fs')

const express = require('express')
const app = express()

const bodyParser = require('body-parser')
const cheerio = require('cheerio')

app.use(bodyParser.json())

app.use(express.static(path.join(__dirname, '/static/_site')))
app.use(express.static(path.join(__dirname, '/cdn')))

app.get('/feed/titles', (req, res) => {
  const from = req.query.from
  const to = req.query.to

  fs.readFile(path.join(__dirname, '/titles.json'), (err, data) => {
    if (err) {
      throw err
    } else {
      const list = JSON.parse(data)

      return res.send(list)
    }
  })
})
app.get('/watch', (req, res) => {
  const id = req.query.id
  const s = req.query.s
  const e = req.query.e

  fs.readFile(path.join(__dirname, '/static/_site/watch.html'), 'utf8', (err, data) => {
    if (err) {
      throw err
    } else {
      const $ = cheerio.load(data)
      $('video').attr('id', id)
      s ? $('video').attr('s', s) : null
      e ? $('video').attr('e', e) : null

      res.type('text/html')
      return res.send($.html())
    }
  })
})
// app.post('/', (req, res) => {
//   return res.send('Received a POST HTTP method')
// })
app.put('/performance_analyse', (req, res) => {
  console.log(req.body)
  return res.send('Received a PUT HTTP method')
})
// app.delete('/', (req, res) => {
//   return res.send('Received a DELETE HTTP method')
// })

const port = 3000
app.listen(port, '0.0.0.0', () =>
  console.log(`App is listening on port ${port}.`)
)
