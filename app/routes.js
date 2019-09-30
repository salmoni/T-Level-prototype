const express = require('express')
const router = express.Router()

// Add your routes here - above the module.exports line


router.get('/1-0/AO/sign-in', function (req, res) {
    require('./routes/routes-1-0.js')(router)
    res.render('1-0/AO/sign-in')
})

router.get('/1-1/AO/sign-in', function (req, res) {
    require('./routes/routes-1-1.js')(router)
    res.render('1-1/AO/sign-in')
})

module.exports = router
//checkIfActive(router.req)

