const express = require('express')
const router = express.Router()

// Add your routes here - above the module.exports line

module.exports = router

function initialiseVariables(req) {
    /*
    Sets up variables for the session
    */
    req.session.data['tLevels'] = []
    const csv = require('csv-parser')
    var fs = require('fs')
    var filename = 'app/views/1-0/AO/data/TLevels_v1.0.csv'
    fs.createReadStream('app/views/1-0/AO/data/TLevels_v1.0.csv')
        .pipe(csv())
        .on('data', (row) => {
            req.session.data['tLevels'].push(row)
            //console.log(row)
        })
    console.log("T Level data = ",req.session.data['tLevels'])
    req.session.data['providers'] = {}
    req.session.data['students'] = {}
    req.session.data['ao'] = "NCFE"
    req.session.data['activeFlag'] = true
}

function checkIfActive(req) {
    if (req.session.data['activeFlag'] == undefined) {
        initialiseVariables(req)
    }
}

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
    initialiseVariables(req)
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
    // First check variables are initialised
    checkIfActive(req)
    res.redirect('/1-0/AO/hub')
})

router.post('/1-0/AO/action-import-providers-single', function (req, res) {
    /*
    Takes the single entered record from user preview and brings it into the main catalogue.
    */
    // First check variables are initialised
    checkIfActive(req)
    res.redirect('/1-0/AO/hub')
})

router.post('/1-0/AO/action-edit-providers-single', function (req, res) {
    /* 
    Accepts edits to a provider's details
    */
    // First check variables are initialised
    checkIfActive(req)
    res.redirect('/1-0/AO/ao-providers')
})