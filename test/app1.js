const router = require('express').Router()

router.get('/', (req, res) => {
  if (!req.session.userID) {
    res.send('Not login')
  } else {
    res.send(`app1: Hello ${req.session.userID}!`)
  }
})

module.exports = router