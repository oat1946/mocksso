const app = require('express')()
app.set('trust proxy', 1)

app.use(require('../index.js')()) // mocksso

const fs=require('fs')
const css = fs.readFileSync('views/main.css', 'utf8')
app.get('/', (req, res)=>{
  const message = `Hello, ${req.session.userID}!`
  res.render('message.hbs', {message, css})
})

app.use('/app1', require('./app1'))

const port = process.env.PORT | 3333
app.listen(port, ()=>console.log(`http://localhost:${port}`))