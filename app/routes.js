const express = require('express')
const router = express.Router()

// Add your routes here - above the module.exports line

module.exports = router

function initialiseVariables(req) {
    /*
    Sets up variables for the session
    */
    // AO to be used
    req.session.data['ao'] = "Pearson"
    // T Levels
    req.session.data['tLevels'] = []
    req.session.data['ao-tLevels'] = []
    var fs = require('fs')
    var filename = 'app/views/1-0/AO/data/TLevels_v1.1.csv'
    fs.readFile(filename, function (err, buf) {
        data = buf.toString().split(/\r?\n/)
        for (idx = 0; idx < data.length; idx++) {
            line = data[idx].split('\t')
            req.session.data['tLevels'].push(line)
            if (line[5] == req.session.data['ao']) {
                req.session.data['ao-tLevels'].push(line)
            }
            req.session.save()
        }
    })

    // Specialisms
    req.session.data['specialisms'] = []
    var filename = 'app/views/1-0/AO/data/specialisms_v1.1.csv'
    fs.readFile(filename, function (err, buf) {
        data = buf.toString().split(/\r?\n/)
        var group = []
        for (idx = 0; idx < data.length; idx++) {
            line = data[idx].split('\t')
            req.session.data['specialisms'].push(line)
            req.session.save()
        }
    })

    // Providers
    req.session.data['providers'] = []
    var filename = 'app/views/1-0/AO/data/Providers_v1.1.csv'
    fs.readFile(filename, function (err, buf) {
        data = buf.toString().split(/\r?\n/)
        for (idx = 0; idx < data.length; idx++) {
            line = data[idx].split('\t')
            req.session.data['providers'].push(line)
            req.session.save()
        }
    })

    // Students
    req.session.data['students'] = []
    var filename = 'app/views/1-0/AO/data/Students_v1.0.csv'
    fs.readFile(filename, function (err, buf) {
        data = buf.toString().split(/\r?\n/)
        for (idx = 0; idx < data.length; idx++) {
            line = data[idx].split('\t')
            req.session.data['students'].push(line)
            req.session.save()
        }
    })
    req.session.data['activeFlag'] = true
    req.session.save()
    //console.log("T Level data = ", req.session.data['tLevels'].length, req.session.data['ao-specialisms'].length)
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
    res.send()
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

router.get('/1-0/AO/action-ao-views-provider', function (req, res) {
    /*
    Work out which provider has been selected and make it available to the page
    */
    var selectedProv = req.query.provider.toString()
    for (idx = 0; idx < req.session.data['providers'].length; idx++) {
        if (req.session.data['providers'][idx][0] === selectedProv) {
            req.session.data['prov'] = req.session.data['providers'][idx]
            break
        }
    }
    req.session.save()
    res.redirect('/1-0/AO/ao-views-provider')
})