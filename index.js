
const path = require('path')
const CONFIG = {
  env: 'local',

  static: path.join(__dirname, '/static/_site'),
  cdn: path.join(__dirname, '/cdn'),
  page: {
    watch: path.join(__dirname, '/static/_site/watch.html'),
  },

  host: '0.0.0.0',
  port: 3000,
}

const fs = require('fs')

const express = require('express')
const app = express()

const bodyParser = require('body-parser')
const cheerio = require('cheerio')

app.use(bodyParser.json())

if (CONFIG.env == 'local') {
  app.use(express.static(CONFIG.static))
  app.use(express.static(CONFIG.cdn))
}

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

  fs.readFile(CONFIG.page.watch, 'utf8', (err, data) => {
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
app.get('/checkMediaFile', (req, res) => {
  const path = req.body
  fs.readFile(path, (err, data) => {
    if (err) {

    } else {
      return res.send('Exist.')
    }
  })
})
// app.post('/', (req, res) => {
//   return res.send('Received a POST HTTP method')
// })
app.put('/performance_analyse', async (req, res) => {
  const dir = '/analyse_data/browser_usage'
  const currentTime = new Date().getTime()

  // write new
  const data = JSON.stringify(req.body)
  await writeFile(`${dir}/${currentTime}.txt`, data)

  // delete oldest
  const limit = 2
  const period  = 3600 * 24 * 7 * 1000

  const files = await readDir(dir)
  if (files.length >= limit) {
    files.forEach((filename) => {
      const filePath = path.join(dir, filename)
      const fileStat = await readFileStat(filePath)
      const creationTime = new Date(fileStat.ctime).getTime()

      if (currentTime - creationTime >= period ) {
        await deleteFile(filePath)
      }
    })
  }

  return res.send('Received.')
})
// app.delete('/', (req, res) => {
//   return res.send('Received a DELETE HTTP method')
// })

const port = 3000
app.listen(CONFIG.port, CONFIG.host, () =>
  console.log(`App is listening on port ${port}.`)
)
