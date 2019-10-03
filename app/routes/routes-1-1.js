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
        req.session.data['tLevels-ao'] = []
        var fs = require('fs')
        var filename = 'app/views/1-1/AO/data/TLevels_v1.2.csv'
        fs.readFile(filename, function (err, buf) {
            data = buf.toString().split(/\r?\n/)
            for (idx = 0; idx < data.length; idx++) {
                line = data[idx].split('\t')
                req.session.data['tLevels'].push(line)
                if (line[5] == req.session.data['ao']) {
                    req.session.data['tLevels-ao'].push(line)
                }
            }
            req.session.save()
        })

        // Specialisms
        req.session.data['specialisms'] = []
        req.session.data['specialisms-ao'] = []
        var filename = 'app/views/1-1/AO/data/specialisms_v1.1.csv'
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
        var filename = 'app/views/1-1/AO/data/Students_v1.2.csv'
        fs.readFile(filename, function (err, buf) {
            data = buf.toString().split(/\r?\n/)
            for (idx = 0; idx < data.length; idx++) {
                line = data[idx].split('\t')
                req.session.data['students'].push(line)
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
        var filename = 'app/views/1-1/AO/data/Accounts_v1.1.csv'
        fs.readFile(filename, function (err, buf) {
            data = buf.toString().split(/\r?\n/)
            for (idx = 0; idx < data.length; idx++) {
                line = data[idx].split('\t')
                if (line[0] === req.session.data['ao']) {
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

    router.get('/1-1/AO/action-reload-data', function (req, res) {
        // Reloads the fake data and returns to the source page
        sourcePage = req.headers.referer
        req.session.data['staff-role'] = 'admin'
        checkIfActive(req)
        res.redirect(sourcePage)
    })

    router.post('/1-1/AO/ao-my-services', function (req, res) {
        if (req.session.data['Signin-username'] === 'admin') {
            req.session.data['staff-role'] = 'admin'
        } else {
            req.session.data['staff-role'] = 'staff'
        }
        checkIfActive(req)
        res.redirect('/1-1/AO/ao-my-services')
    })

    router.get('/1-1/AO/action-ao-verify-tLevels', function (req, res) {
        req.session.data['req_tLevel'] = ['0', '0', '0', '0']
        req.session.data['requested_tLevel'] = req.query.tl
        for (tlevel of req.session.data['tLevels-ao']) {
            if (tlevel[0] === req.session.data['requested_tLevel']) {
                req.session.data['req_tLevel'] = tlevel
            }
        }
        res.redirect('/1-1/AO/ao-verify-tLevels')
    })

    router.get('/1-1/AO/action-verify-single-tLevel', function (req, res) {
        for (idx = 0; idx < req.session.data['tLevels-ao'].length; idx++) {
            if (req.session.data['tLevels-ao'][idx][0] === req.session.data['requested_tLevel']) {
                req.session.data['tLevels-ao'][idx][6] = "Verified"
            }
        }
        res.redirect('/1-1/AO/ao-t-levels')
    })

    router.get('/1-1/AO/action-ao-views-provider', function (req, res) {
        /*
        Work out which provider has been selected and make it available to the page
        */
        checkIfActive(req)
        var selectedProv = req.query.provider.toString()
        for (idx = 0; idx < req.session.data['providers'].length; idx++) {
            if (req.session.data['providers'][idx][0] === selectedProv) {
                req.session.data['prov'] = req.session.data['providers'][idx]
                break
            }
        }
        req.session.save()
        res.redirect('/1-1/AO/ao-views-provider')
    })

    router.post('/1-1/AO/action-import-providers-single', function (req, res) {
        /*
        Takes the single entered record from user preview and brings it into the main catalogue.
        */
        // First check variables are initialised
        checkIfActive(req)
        res.redirect('/1-1/AO/ao-providers')
    })

    router.post('/1-1/AO/action-edit-providers-single', function (req, res) {
        /* 
        Accepts edits to a provider's details
        */
        // First check variables are initialised
        checkIfActive(req)
        res.redirect('/1-1/AO/ao-providers')
    })

    router.post('/1-1/AO/action-add-student-single-02', function (req, res) {
        /*
        User has entered ULN and UKPRN. User now has to specify the year a T Level starts and then the T Level
        */
        // For now, this just shunts onto page 2
        checkIfActive(req)
        res.redirect('/1-1/AO/ao-add-student-single-02')
    })

    router.post('/1-1/AO/action-add-student-single-03', function (req, res) {
        /*
        User has entered ULN and UKPRN and year. User now has to specify the T Level from a list 
        of T Levels this AO is running in the right year
        */
        // For now, this just shunts onto page 4 (check your answers)
        // data['ao-tLevels-tmp']
        checkIfActive(req)
        year = req.session.data['provider-year']
        req.session.data['ao-tLevels-tmp'] = []
        for (tls in req.session.data['ao-tLevels']) {
            if (tls[2] === year.slice(0, 4)) {
                req.session.data['ao-tLevels-tmp'].push(tls)
            }
        }
        req.session.save()
        res.redirect('/1-1/AO/ao-add-student-single-03')
    })

    router.post('/1-1/AO/action-ao-add-students-bulk', function (req, res) {
        /*
        Adds students in bulk
        */
        for (idx in req.session.data['students-added']) {
            var line = [
                req.session.data['students-added'][idx][0],
                req.session.data['students-added'][idx][1],
                req.session.data['students-added'][idx][2],
                '',
                '',
                '',
                '',
                '',
                '',
                '',
                req.session.data['students-added'][idx][10],
                req.session.data['students-added'][idx][11],
                '',
                req.session.data['students-added'][idx][13],
                req.session.data['students-added'][idx][14],
                '',
                req.session.data['students-added'][idx][16],
                '',
                '',
                '']


            req.session.data['students'].unshift(line)
        }
        res.redirect('/1-1/AO/ao-view-students')
    })

    router.post('/1-1/AO/action-add-student-single-confirm', function (req, res) {
        /*
        Takes the new student's details entered by the user and adds it.
        */
        // Currently just returns to the ??? page
        checkIfActive(req)
        var tl = req.session.data['tLevels-ao'][req.session.data['student-tlevel']]
        console.log(req.session.data['student-tlevel'].length)
        console.log("T Level = ", typeof (tl))
        var line = [
            req.session.data['student-uln'],
            'Steve',
            'Smith',
            '',
            '',
            '',
            '',
            '',
            '',
            '',
            req.session.data['provider-ukprn'],
            'Barnsley College',
            '',
            tl[0],
            tl[1],
            '',
            req.session.data['provider-year'],
            '',
            '',
            '']
        req.session.data['students'].unshift(line)
        res.redirect('/1-1/AO/ao-view-students')
    })

    router.post('/1-1/AO/action-import-providers-single', function (req, res) {
        /*
        Takes the single entered record from user preview and brings it into the main catalogue.
        */
        // First check variables are initialised
        checkIfActive(req)
        res.redirect('/1-1/AO/hub')
    })

    router.get('/1-1/AO/action-ao-view-students', function (req, res) {
        /*
        Pagination!
        */
        checkIfActive(req)
        if (req.session.data['reqPageNumber'] === undefined) {
            req.session.data['reqPageNumber'] = 1
        } else {
            req.session.data['reqPageNumber'] = req.query.pageNumber
        }
        req.session.data['highestPage'] = parseInt(req.session.data['students'].length / 10) + 1
        if (req.session.data['students'].length % 10 === 0) {
            req.session.data['highestPage'] = parseInt(req.session.data['students'].length / 10) + 1
        } else {
            req.session.data['highestPage'] = parseInt(req.session.data['students'].length / 10) + 2
        }
        req.session.data['maximumPage'] = req.session.data['reqPageNumber'] * 10
        req.session.data['minimumPage'] = req.session.data['maximumPage'] - 10
        req.session.data['pagesAvailable'] = []
        for (idx = req.session.data['reqPageNumber'] - 2; idx < parseInt(req.session.data['reqPageNumber']) + 3; idx++) {
            if (idx > 0 && idx < req.session.data['highestPage']) {
                req.session.data['pagesAvailable'].push(idx)
            }
        }
        queryString = encodeURIComponent(req.query.pageNumber);
        res.redirect('/1-1/AO/ao-view-students?pageNumber=' + queryString)
    })

    router.get('/1-1/AO/action-ao-views-student', function (req, res) {
        /*
        Views a single student's account (and possibly allows editing/deletion?)
        */
        checkIfActive(req)
        uln = req.query.uln
        // Get student record from ULN
        for (idx in req.session.data['students']) {
            if (req.session.data['students'][idx][0] == uln) {
                line = req.session.data['students'][idx]
                break
            }
        }
        // Populate session variable ('student')
        req.session.data['student'] = line
        res.redirect('/1-1/AO/ao-views-student')
    })




}
