
const path = require('path')
const fs = require('fs')

const express = require('express')
const app = express()

const bodyParser = require('body-parser')

app.use(bodyParser.json())

app.use(express.static(path.join(__dirname, '/static/_site')))
app.use(express.static(path.join(__dirname, '/cdn')))

app.get('/feed/titles', async function(req, res) {
  const from = req.query.from
  const to = req.query.to

  const raw = await fs.readFile('/titles.json')
  const cooked = JSON.parse(raw)

  return res.send(cooked)
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
