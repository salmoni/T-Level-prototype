module.exports = function (router) {



    function initialiseVariables(req) {
        /*
        Sets up variables for the session
        */
        // AO to be used
        req.session.data['ao-long'] = "Pearson (10022490)"
        //req.session.data['ao-long'] = "NCFE (10022731)"
        req.session.data['ao'] = req.session.data['ao-long'].split(' ')[0]

        // T Levels
        req.session.data['tLevels'] = []
        req.session.data['ao-tLevels'] = []
        var fs = require('fs')
        var filename = 'app/views/1-1/AO/data/TLevels_v1.1.csv'
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
        var filename = 'app/views/1-1/AO/data/specialisms_v1.1.csv'
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
            console.log(req.session.data['providers'])
            req.session.save()
        })

        // Students - enrolled
        req.session.data['students'] = []
        var filename = 'app/views/1-1/AO/data/Students_v1.1.csv'
        fs.readFile(filename, function (err, buf) {
            data = buf.toString().split(/\r?\n/)
            for (idx = 0; idx < data.length; idx++) {
                line = data[idx].split('\t')
                req.session.data['students'].push(line)
                req.session.save()
            }
        })

        // Students - to be added
        req.session.data['students-added'] = []
        var filename = 'app/views/1-1/AO/data/Students_added_v1.1.csv'
        fs.readFile(filename, function (err, buf) {
            data = buf.toString().split(/\r?\n/)
            for (idx = 0; idx < data.length; idx++) {
                line = data[idx].split('\t')
                req.session.data['students-added'].push(line)
                req.session.save()
            }
        })

        // Accounts
        req.session.data['accounts'] = []
        var filename = 'app/views/1-1/AO/data/Accounts_v1.1.csv'
        fs.readFile(filename, function (err, buf) {
            data = buf.toString().split(/\r?\n/)
            for (idx = 0; idx < data.length; idx++) {
                line = data[idx].split('\t')
                if (line[0] === req.session.data['ao']) {
                    req.session.data['accounts'].push(line)
                    req.session.save()
                }
            }
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

    router.post('/1-0/AO/ao-my-services', function (req, res) {
        console.log("signed in 1-0")
        if (req.session.data['Signin-username'] === 'admin') {
            req.session.data['staff-role'] = 'admin'
        } else {
            req.session.data['staff-role'] = 'staff'
        }
        checkIfActive(req)
        res.redirect('/1-0/AO/ao-my-services')
    })

    router.post('/1-0/AO/hub', function (req, res) {
        /* 
        Performs check to ensure sessions variables are initialised
        */
        checkIfActive(req)
        req.session.save()
        res.redirect('/1-0/AO/hub')
    })

    router.get('/1-0/AO/hub', function (req, res) {
        /* 
        Performs check to ensure sessions variables are initialised
        */
        checkIfActive(req)
        req.session.save()
        res.render('1-0/AO/hub')
    })

    router.get('/1-0/AO/action-signin', function (req, res) {
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
        req.session.save()
        res.redirect('/1-0/AO/hub')
    })

    router.post('/1-0/AO/upload-provider-bulk', function (req, res) {
        /* 
        Takes a form uploaded by the user and converts them into new providers.
        */

        res.redirect('/1-0/AO/ao-preview-provider-bulk-records')
    })

    router.post('/1-0/AO/action-import-providers-bulk', function (req, res) {
        /*
        Takes the bulk-imported records from user preview and brings them into the main catalogue.
        */
        // First check variables are initialised
        checkIfActive(req)
        req.session.save()
        res.redirect('/1-0/AO/hub')
    })

    router.post('/1-0/AO/action-add-student-single-02', function (req, res) {
        /*
        User has entered ULN and UKPRN. User now has to specify the year a T Level starts and then the T Level
        */
        // For now, this just shunts onto page 2
        res.redirect('/1-0/AO/ao-add-student-single-02')
    })

    router.post('/1-0/AO/action-add-student-single-03', function (req, res) {
        /*
        User has entered ULN and UKPRN and year. User now has to specify the T Level from a list 
        of T Levels this AO is running in the right year
        */
        // For now, this just shunts onto page 4 (check your answers)
        // data['ao-tLevels-tmp']
        year = req.session.data['provider-year']
        req.session.data['ao-tLevels-tmp'] = []
        for (tls in req.session.data['ao-tLevels']) {
            if (tls[2] === year.slice(0, 4)) {
                req.session.data['ao-tLevels-tmp'].push(tls)
            }
        }
        req.session.save()
        res.redirect('/1-0/AO/ao-add-student-single-03')
    })

    router.post('/1-0/AO/action-add-student-single-confirm', function (req, res) {
        /*
        Takes the new student's details entered by the user and adds it.
        */
        // Currently just returns to the ??? page
        var line = ['Steve', 'Smith', '', '', '', '', '', '', '', req.session.data['student-uln'], req.session.data['provider-ukprn'],
            'Studying', req.session.data['student-tlevel'], req.session.data['student-tlevel'], '', req.session.data['provider-year'],
            '', '', '', '']
        req.session.data['students'].push(line)
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

    router.get('/1-0/AO/action-ao-views-student', function (req, res) {
        /*
        Views a single student's account (and possibly allows editing/deletion?)
        */
        res.redirect('/1-0/AO/ao-views-student')
    })

    router.get('/1-0/AO/action-ao-views-account', function (req, res) {
        /*
        Views a single AO account and allows editing and deletion
        */
        var selectedAccount = req.query.accountID.toString()
        res.redirect('/1-0/AO/ao-views-account')
    })
}
