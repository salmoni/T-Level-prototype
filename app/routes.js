const express = require('express')
const router = express.Router()

// Add your routes here - above the module.exports line

module.exports = router

router.post('/1-0/AO/action-signin', function (req, res) {
    if (req.session.data['Signin-username'] === 'admin') {
        req.session.data['staff-role'] = 'admin'
    } else {
        req.session.data['staff-role'] = 'staff'
    }
    res.redirect('/1-0/AO/hub')
})

