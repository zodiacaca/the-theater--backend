
const env = process.argv[2] ? process.argv[2] : 'local'

const path = require('path')
const CONFIG = {
  static: undefined,
  CDN: undefined,
  page: {
    watch: undefined,
  },

  host: '0.0.0.0',
  // host: '127.0.0.1',
  port: 3000,
}

if (env === 'public') {
  CONFIG.static = '/var/www/theater.nite-bite.gq'
  CONFIG.CDN = '/var/local'
  CONFIG.page.watch = '/var/www/theater.nite-bite.gq/watch.html'
} else {
  CONFIG.static = path.join(__dirname, '/static/_site')
  CONFIG.CDN = path.join(__dirname, '/cdn')
  CONFIG.page.watch = path.join(__dirname, '/static/_site/watch.html')
}

const fs = require('fs')

const express = require('express')
const app = express()

const bodyParser = require('body-parser')
const cheerio = require('cheerio')

const fsp = require('./modules/fsp.js')

app.use(bodyParser.json())

app.use(express.static(CONFIG.static))
if (CONFIG.CDN) {
  app.use(express.static(CONFIG.CDN))
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
  const file = path.join(CONFIG.CDN, 'videos', req.query.id, req.query.s, req.query.e, 'stream.mpd')

  fs.readFile(file, (err, data) => {
    if (err) {
      return res.sendStatus(404)
    } else {
      return res.sendStatus(202)
    }
  })
})
// app.post('/', (req, res) => {
//   return res.send('Received a POST HTTP method')
// })
app.put('/performance_analyse', async (req, res) => {
  const dir = path.join(__dirname, '/analyse_data/browser_usage')
  const currentTime = new Date().getTime()

  // write new
  const data = JSON.stringify(req.body)
  await fsp.writeFile(`${dir}/${currentTime}.json`, data)

  // delete oldest
  const limit = 20
  const period  = 3600 * 24 * 7 * 1000

  const files = await fsp.readDir(dir)
  if (files.length >= limit) {
    files.forEach(async (filename) => {
      const filePath = path.join(dir, filename)
      const fileStat = await fsp.readFileStat(filePath)
      const creationTime = new Date(fileStat.ctime).getTime()

      if (currentTime - creationTime >= period ) {
        await fsp.deleteFile(filePath)
      }
    })
  }

  return res.send('Received.')
})
// app.delete('/', (req, res) => {
//   return res.send('Received a DELETE HTTP method')
// })

app.listen(CONFIG.port, CONFIG.host, () =>
  console.log(`App is listening on port ${CONFIG.port}.`)
)
