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

router.post('/1-1/Verification/action-verify-code', function (req, res) {
    if (req.session.data['verification-code'] != '9191') {
        // Mark up errors
        res.redirect('/1-1/Verification/verify-confirm-email')
    } else {
        res.redirect('/1-1/Verification/create-password')
    }
})

module.exports = router
//checkIfActive(router.req)

