
const path = require('path')
const fs = require('fs')

const express = require('express')
const app = express()

const bodyParser = require('body-parser')

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
