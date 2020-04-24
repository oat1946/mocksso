const fs = require('fs')
const router = require('express').Router()
const session = require('express-session')
const FileStore = require('session-file-store')(session)
const bodyParser = require('body-parser')
 
const fileStoreOptions = {logFn: _=>{}}

let users

module.exports = x => {
  users = x || [
    'requestor@hiqfood.org',
    'approver@hiqfood.org',
    'accountants@hiqfood.org',
    'treasurers@hiqfood.org'
  ]
  return router
}

const css = fs.readFileSync(`${__dirname}/views/main.css`, 'utf8')

router.use(session({
  store: new FileStore(fileStoreOptions),
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: false,
  cookie: {
    path: '/',
    httpOnly: true,
    secure: false,
    maxAge: 31536000000
  }
}))

router.use(bodyParser.urlencoded({ extended: true }))
router.use(bodyParser.json())
 
router.get('/login', (_, res)=>{
  res.render(`${__dirname}/views/login.hbs`, {users, css})
})

router.post('/login', (req, res)=>{
  req.session.userID = req.body.userID
  res.redirect(req.body.originalUrl)
})

router.get('/logout', (req, res)=>{
  const user = req.session.userID
  if (user)
    res.render(`${__dirname}/views/logout.hbs`, {user, css})
  else {
    const message = 'You are not logged-in.'
    res.render(`${__dirname}/views/message.hbs`, {message, css})
  }
})

router.post('/logout', (req, res)=>{
  req.session.destroy(err=>{
    if (err) res.status(500).send('Error logging out.')
    else {
      const message = 'You have sucessfully logged-out.'
      res.render(`${__dirname}/views/message.hbs`, {message, css})
    }
  })  
})

router.use((req, res, next) => {
  if (req.session.userID) next()
  else {
    res.redirect(`login?originalUrl=${req.originalUrl}`)
  }
})
