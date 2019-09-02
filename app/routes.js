const express = require('express')
const router = express.Router()

// Add your routes here - above the module.exports line

module.exports = router

router.post('/1-0/AO/action-signin', function (req, res) {
    /* 
    If user signs in with "admin" as user name, they get administrative rights and accesses. 
    Else they do not. 
    */
    if (req.session.data['Signin-username'] === 'admin') {
        req.session.data['staff-role'] = 'admin'
    } else {
        req.session.data['staff-role'] = 'staff'
    }
    res.redirect('/1-0/AO/hub')
})

router.post('/1-0/AO/upload-provider-bulk', function (req, res) {
    /* 
    Takes a form uploaded by the user and converts them into new providers.
    */

    res.redirect('/1-0/AO/preview-bulk-records')
})

router.post('/1-0/AO/action-import-providers-bulk', function (req, res) {
    /*
    Takes the bulk-imported records from user preview and brings them into the main catalogue.
    */
    res.redirect('/1-0/AO/hub')
})

router.post('/1-0/AO/action-import-providers-single', function (req, res) {
    /*
    Takes the single entered record from user preview and brings it into the main catalogue.
    */
    res.redirect('/1-0/AO/hub')
})

router.post('/1-0/AO/action-edit-providers-single', function (req, res) {
    /* 
    Accepts edits to a provider's details
    */
    res.redirect('/1-0/AO/ao-providers')
})