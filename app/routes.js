const express = require('express')
const router = express.Router()

// Add your routes here - above the module.exports line

//require('./routes/routes-1-2.js')(router)

function initialiseVariables(req) {
    /*
    Sets up variables for the session
    */
    // AO to be used
    // req.session.data['ao-long'] = "Pearson (10022490)"
    req.session.data['ao-long'] = "NCFE (10022731)"
    //req.session.data['ao-long'] = "City and Guilds (10000878)"


    req.session.data['ao'] = req.session.data['ao-long'].split(' (')[0]
    console.log("AO = ",req.session.data['ao'])

    // T Levels
    req.session.data['tLevels'] = []
    req.session.data['tLevels-ao'] = []
    req.session.data['tLevels-list'] = []
    var fs = require('fs')
    var filename = 'app/views/1-2/AO/data/TLevels_v1.3.csv'
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
    var filename = 'app/views/1-2/AO/data/specialisms_v1.3.csv'
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
    var filename = 'app/views/1-2/AO/data/Providers_v1.5.csv'
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
        req.session.data['providers-tmp'] = req.session.data['providers']
        req.session.save()
    })

    // Providers - to be added
    req.session.data['providers-added'] = []
    var filename = 'app/views/1-2/AO/data/providers-added.csv'
    fs.readFile(filename, function (err, buf) {
        data = buf.toString().split(/\r?\n/)
        for (idx = 0; idx < data.length; idx++) {
            line = data[idx].split('\t')
            req.session.data['providers-added'].push(line)
        }
        req.session.save()
    })

    // Students - enrolled
    req.session.data['students'] = []
    req.session.data['students-ao'] = []
    var filename = 'app/views/1-2/AO/data/Students_v1.5.csv'
    fs.readFile(filename, function (err, buf) {
        data = buf.toString().split(/\r?\n/)
        for (idx = 0; idx < data.length; idx++) {
            line = data[idx].split('\t')
            req.session.data['students'].push(line)
            if (req.session.data['tLevels-list'].indexOf(line[13]) != -1) {
                req.session.data['students-ao'].push(line)
            }
        }
        req.session.data['students-ao-tmp'] = req.session.data['students-ao']
        req.session.save()
    })

    // Students - to be added
    req.session.data['students-added'] = []
    var filename = 'app/views/1-2/AO/data/Students_added_v1.2.csv'
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
    var filename = 'app/views/1-2/AO/data/Accounts_v1.5.csv'
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


router.get('/1-0/Verification/sign-in', function (req, res) {
    require('./routes/routes-1-0.js')(router)
    res.render('1-0/Verification/sign-in')
})

router.get('/1-1/Verification/sign-in', function (req, res) {
    require('./routes/routes-1-1.js')(router)
    res.render('1-1/Verification/sign-in')
})

router.get('/1-2/Verification/sign-in', function (req, res) {
    require('./routes/routes-1-2.js')(router)
    res.render('1-2/Verification/sign-in')
})

router.get('/1-3/Verification/sign-in', function (req, res) {
    require('./routes/routes-1-3.js')(router)
    res.render('1-3/Verification/sign-in')
})

router.post('/1-2/Verification/action-verify-code', function (req, res) {
    if (req.session.data['verification-code'] != '9191') {
        // Mark up errors
        res.redirect('/1-2/Verification/verify-confirm-email')
    } else {
        res.redirect('/1-2/Verification/create-password')
    }
})

router.post('/1-2/AO/hub', function (req, res) {
    if (req.session.data['Signin-username'] === 'admin') {
        req.session.data['staff-role'] = 'admin'
    } else {
        req.session.data['staff-role'] = 'staff'
    }
    checkIfActive(req)
    res.redirect('/1-2/AO/hub')
})

router.post('/1-3/AO/hub', function (req, res) {
    if (req.session.data['Signin-username'] === 'admin') {
        req.session.data['staff-role'] = 'admin'
    } else {
        req.session.data['staff-role'] = 'staff'
    }
    checkIfActive(req)
    res.redirect('/1-3/AO/hub')
})

router.get('/1-2/Verification/action-view-account', function (req, res) {
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
    res.redirect('/1-2/Verification/view-account')
})

router.post('/1-2/Verification/action-view-account', function (req, res) {
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
    req.session.data['first-name'] = undefined
    req.session.data['last-name'] = undefined
    req.session.data['email-address'] = undefined
    res.redirect('/1-2/Verification/view-account')
})

router.get('/1-2/Verification/my-profile', function (req, res) {
    req.session.data['profile-details-flag'] = false
    req.session.data['profile-email-flag'] = false
    req.session.data['profile-password-flag'] = false
    res.render('1-2/Verification/my-profile')
})

router.post('/1-2/Verification/my-profile', function (req, res) {
    req.session.data['profile-details-flag'] = false
    req.session.data['profile-email-flag'] = false
    req.session.data['profile-password-flag'] = false
    res.render('1-2/Verification/my-profile')
})

router.post('/1-2/Verification/action-my-profile', function (req, res) {
    if (req.session.data['profile-details'] == 'change') {
        req.session.data['profile-details'] = ""
        req.session.data['profile-email'] = ""
        req.session.data['profile-password'] = ""
        req.session.data['profile-details-flag'] = true
    } else {
        req.session.data['profile-details'] = ""
        req.session.data['profile-details-flag'] = false
    }

    if (req.session.data['profile-email'] == 'change') {
        req.session.data['profile-details'] = ""
        req.session.data['profile-email'] = ""
        req.session.data['profile-password'] = ""
        req.session.data['profile-email-flag'] = true
    } else {
        req.session.data['profile-email'] = ""
        req.session.data['profile-email-flag'] = false
    }

    if (req.session.data['profile-password'] == 'change') {
        req.session.data['profile-details'] = ""
        req.session.data['profile-email'] = ""
        req.session.data['profile-password'] = ""
        req.session.data['profile-password-flag'] = true
    } else {
        req.session.data['profile-password'] = ""
        req.session.data['profile-password-flag'] = false
    }

    res.redirect('/1-2/Verification/my-profile')
})

module.exports = router
//checkIfActive(router.req)

