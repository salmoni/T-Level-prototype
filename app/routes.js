const express = require('express')
const router = express.Router()

// Add your routes here - above the module.exports line

function initialiseVariables(req) {
    /*
    Sets up variables for the session
    */
    // AO to be used
    req.session.data['ao-long'] = "Pearson (10022490)"
    req.session.data['ao-long'] = "NCFE (10022731)"
    //req.session.data['ao-long'] = "City and Guilds (10000878)"


    req.session.data['ao'] = req.session.data['ao-long'].split(' (')[0]

    // T Levels
    req.session.data['tLevels'] = []
    req.session.data['tLevels-ao'] = []
    req.session.data['tLevels-list'] = []
    var fs = require('fs')
    var filename = 'app/views/1-1/AO/data/TLevels_v1.3.csv'
    fs.readFile(filename, function (err, buf) {
        data = buf.toString().split(/\r?\n/)
        for (idx = 0; idx < data.length; idx++) {
            line = data[idx].split('\t')
            req.session.data['tLevels'].push(line)
            if (line[5] == req.session.data['ao']) {
                req.session.data['tLevels-ao'].push(line)
                req.session.data['tLevels-list'].push(line[7])
            }
        }
        req.session.save()
    })

    // Specialisms
    req.session.data['specialisms'] = []
    req.session.data['specialisms-ao'] = []
    var filename = 'app/views/1-1/AO/data/specialisms_v1.3.csv'
    fs.readFile(filename, function (err, buf) {
        data = buf.toString().split(/\r?\n/)
        var group = []
        for (idx = 0; idx < data.length; idx++) {
            line = data[idx].split('\t')
            req.session.data['specialisms'].push(line)
            if (line[6] == req.session.data['ao']) {
                req.session.data['specialisms-ao'].push(line)
            }
        }
        req.session.save()
    })

    // Providers
    req.session.data['providers'] = []
    var filename = 'app/views/1-1/AO/data/Providers_v1.1.csv'
    fs.readFile(filename, function (err, buf) {
        data = buf.toString().split(/\r?\n/)
        for (idx = 0; idx < data.length; idx++) {
            line = data[idx].split('\t')
            if (line[2] == 'X' || line[3] == 'X') {
                if (req.session.data['ao'] == 'Pearson') {
                    req.session.data['providers'].push(line)
                }
            }
            if (line[4] == 'X' && req.session.data['ao'] == 'NCFE') {
                req.session.data['providers'].push(line)
            }
        }
        req.session.save()
    })

    // Students - enrolled
    req.session.data['students'] = []
    req.session.data['students-ao'] = []
    var filename = 'app/views/1-1/AO/data/Students_v1.3.csv'
    fs.readFile(filename, function (err, buf) {
        data = buf.toString().split(/\r?\n/)
        for (idx = 0; idx < data.length; idx++) {
            line = data[idx].split('\t')
            req.session.data['students'].push(line)
            if (req.session.data['tLevels-list'].indexOf(line[13]) != -1) {
                req.session.data['students-ao'].push(line)
            }
        }
        req.session.save()
    })

    // Students - to be added
    req.session.data['students-added'] = []
    var filename = 'app/views/1-1/AO/data/Students_added_v1.2.csv'
    fs.readFile(filename, function (err, buf) {
        data = buf.toString().split(/\r?\n/)
        for (idx = 0; idx < data.length; idx++) {
            // Add check to record if the T level specialism matches 'specialisms'. Also get provider from this
            line = data[idx].split('\t')
            req.session.data['students-added'].push(line)
        }
        req.session.save()
    })

    // Accounts
    req.session.data['accounts'] = []
    var filename = 'app/views/1-1/AO/data/Accounts_v1.4.csv'
    fs.readFile(filename, function (err, buf) {
        data = buf.toString().split(/\r?\n/)
        for (idx = 0; idx < data.length; idx++) {
            line = data[idx].split('\t')
            if (line[1] === req.session.data['ao']) {
                req.session.data['accounts'].push(line)
            }
        }
        req.session.save()
    })

    req.session.data['activeFlag'] = true
    req.session.save()
    return
}

function checkIfActive(req) {
    if (req.session.data['activeFlag'] == undefined || req.session.data['activeFlag'] == false) {
        initialiseVariables(req)
    }
    return
}


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

router.post('/1-1/Verification/my-services', function (req, res) {
    console.log("got here")
    if (req.session.data['Signin-username'] === 'admin') {
        req.session.data['staff-role'] = 'admin'
    } else {
        req.session.data['staff-role'] = 'staff'
    }
    checkIfActive(req)
    res.redirect('/1-1/Verification/my-services')
})

router.get('/1-1/Verification/action-view-account', function (req, res) {
    id = req.query.id
    // Ensure service removal panel isn't show
    req.session.data['show-removal-confirm'] = false
    req.session.data['delete-service'] = ""
    // Ensure service addition panel isn't show
    req.session.data['show-addition-confirm'] = false
    req.session.data['add-service'] = ""
    for (account in req.session.data['accounts']) {
        if (req.session.data['accounts'][account][0] === id) {
            req.session.data['accountHolder'] = req.session.data['accounts'][account]
        }
    }
    res.redirect('/1-1/Verification/view-account')
})

router.post('/1-1/Verification/action-view-account', function (req, res) {
    id = req.query.id
    
    if (req.session.data['delete-service'] == "delete") {
        req.session.data['delete-service'] = ""
        req.session.data['show-removal-confirm'] = true
        req.session.data['show-addition-confirm'] = false
    } else {
        req.session.data['show-removal-confirm'] = false
        req.session.data['delete-service'] = ""
    }

    if (req.session.data['add-service'] == "add") {
        req.session.data['add-service'] = ""
        req.session.data['show-addition-confirm'] = true
        req.session.data['show-removal-confirm'] = false
    } else {
        req.session.data['show-addition-confirm'] = false
        req.session.data['add-service'] = ""
    }

    for (account in req.session.data['accounts']) {
        if (req.session.data['accounts'][account][0] === id) {
            req.session.data['accountHolder'] = req.session.data['accounts'][account]
        }
    }
    res.redirect('/1-1/Verification/view-account')
})


module.exports = router
//checkIfActive(router.req)

