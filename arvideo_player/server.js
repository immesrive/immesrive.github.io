const express = require('express')
const path = require('path')
const app = express()
const port = 8080

app.set('/', 'html')
app.use(express.static(path.join(__dirname, '/')))
app.use(express.json())
app.use(express.urlencoded({extended: false}))

app.get('/', (req, res) => {
  res.send('index')
})

app.listen(port, () => {
  console.log(`Listening on http://localhost:${port}`)
})