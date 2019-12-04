module.exports = function (router) {

    router.get('/1-3/AO/action-reload-data', function (req, res) {
        // Reloads the fake data and returns to the source page
        sourcePage = req.headers.referer
        req.session.data['staff-role'] = 'admin'
        checkIfActive(req)
        res.redirect(sourcePage)
    })

    router.post('/1-3/AO/ao-my-services', function (req, res) {
        if (req.session.data['Signin-username'] === 'admin') {
            req.session.data['staff-role'] = 'admin'
        } else {
            req.session.data['staff-role'] = 'staff'
        }
        //checkIfActive(req)
        res.redirect('/1-3/AO/hub')
    })

    router.get('/1-3/AO/action-ao-verify-tLevels', function (req, res) {
        req.session.data['req_tLevel'] = []
        req.session.data['requested_tLevel'] = req.query.tl
        for (tlevel of req.session.data['tLevels-ao']) {
            if (tlevel[7] === req.session.data['requested_tLevel']) {
                req.session.data['req_tLevel'] = tlevel
            }
        }
        res.redirect('/1-3/AO/ao-verify-tLevels?tl=' + req.session.data['requested_tLevel'])
    })

    router.get('/1-3/AO/action-verify-single-tLevel', function (req, res) {
        var tlCode = req.session.data['requested_tLevel']
        var acceptance = req.session.data['tLevel-verified']

        for (idx = 0; idx < req.session.data['tLevels-ao'].length; idx++) {
            if (req.session.data['tLevels-ao'][idx][7] === req.session.data['requested_tLevel']) {
                break
            }
        }

        if (acceptance === 'no') {
            // Not accepted
            req.session.data['tLevels-ao'][idx][6] = "Rejected"
            res.redirect('/1-3/AO/ao-inform-ifate')
        } else if (acceptance === 'yes') {
            // Accepted
            req.session.data['tLevels-ao'][idx][6] = "Verified"
            res.redirect('/1-3/AO/ao-t-levels')
        } else {
            res.redirect('/1-3/AO/ao-verify-tLevels')
        }
    })

    router.get('/1-3/AO/action-ao-providers', function (req, res) {
        if (req.query.pageNumberProv === undefined) {
            req.session.data['currentPage'] = 1
        } else {
            req.session.data['currentPage'] = req.query.pageNumberProv
        }
        req.session.data['minItem'] = 1
        req.session.data['maxItem'] = req.session.data['providers-tmp'].length
        req.session.data['minPage'] = 1
        req.session.data['maxPage'] = (req.session.data['maxItem'] / 10)
        req.session.data['currentMax'] = (req.session.data['currentPage'] * 10)
        req.session.data['currentMin'] = req.session.data['currentMax'] - 9
        if (req.session.data['currentMax'] > req.session.data['maxItem']) {
            req.session.data['currentMax'] = req.session.data['maxItem']
        }

        res.redirect('/1-3/AO/ao-providers')
    })

    router.get('/1-3/AO/action-search-providers', function (req, res) {
        // get search phrase and instantiate variables
        searchPhrase = req.session.data['search-phrase-pr']
        // Construct empty set to store results
        req.session.data['providers-tmp'] = []

        // Filter through students to get results
        req.session.data['providers'].forEach(function (row, idx) {
            req.session.data['providers-tmp2'] = row.slice(0, 1)
            elementFlag = false
            if (row[0].toLowerCase().includes(searchPhrase) || row[1].toLowerCase().includes(searchPhrase)) {
                elementFlag = true
            }
            if (elementFlag === true) {
                req.session.data['providers-tmp'].push(row)
            }
            elementFlag = false
        })

        // Set pagination variables
        if (req.query.pageNumberProv === undefined) {
            req.session.data['currentPage'] = 1
        } else {
            req.session.data['currentPage'] = req.query.pageNumberProv
        }
        req.session.data['minItem'] = 1
        req.session.data['maxItem'] = req.session.data['providers-tmp'].length
        req.session.data['minPage'] = 1
        req.session.data['maxPage'] = (req.session.data['maxItem'] / 10)
        req.session.data['currentMax'] = (req.session.data['currentPage'] * 10)
        req.session.data['currentMin'] = req.session.data['currentMax'] - 9
        if (req.session.data['currentMax'] > req.session.data['maxItem']) {
            req.session.data['currentMax'] = req.session.data['maxItem']
        }

        res.redirect('/1-3/AO/ao-providers')
    })

    router.get('/1-3/AO/action-ao-views-provider', function (req, res) {
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
        res.redirect('/1-3/AO/ao-views-provider')
    })

    router.post('/1-3/AO/action-import-providers-single', function (req, res) {
        /*
        Takes the single entered record from user preview and brings it into the main catalogue.
        */
        // First check variables are initialised
        //checkIfActive(req)
        res.redirect('/1-3/AO/ao-providers')
    })

    router.post('/1-3/AO/action-edit-providers-single', function (req, res) {
        /* 
        Accepts edits to a provider's details
        */
        // First check variables are initialised
        //checkIfActive(req)
        res.redirect('/1-3/AO/ao-providers')
    })

    router.post('/1-3/AO/action-ao-add-providers-bulk', function (req, res) {
        /*
        Adds students in bulk
        */

        req.session.data['providers'] = req.session.data['providers'].concat(req.session.data['providers-added'])
        req.session.data['providers-tmp'] = req.session.data['providers']

        res.redirect('/1-3/AO/action-ao-providers')
    })

    // NEW ADD SINGLE PROVIDER PROCESS

    router.get('/1-3/AO/action-centres-question-next', function (req, res) {
        req.session.data['errors'] = []
        var answer = req.session.data['centre-question']
        if (answer === 'add-one') {
            res.redirect('ao-new-provider-add-01')
        } else if (answer === 'add-lots') {
            res.redirect('ao-view-providers') // page is a stub
        } else if (answer === 'edit') {
            res.redirect('ao-view-providers') // page is a stub
        } else if (answer === 'delete') {
            res.redirect('ao-view-providers') // page is a stub
        } else {
            // Errors! No T Level selected
            req.session.data['errors'] = []
            error = ['#01', 'Tell us what you need to do']
            req.session.data['errors'].push(error)
            res.redirect('/1-3/AO/ao-view-providers')
        }


        res.redirect
    })


    router.post('/1-3/AO/action-add-centre-single-01', function (req, res) {
        // Searches...
        search = req.session.data['provider-search'].toLowerCase()
        req.session.data['search-matches'] = []
        // Does search phrase only contain digits
        var isnum = /^\d+$/.test(search)
        if (isnum === true) {
            // Check if a clean UKPRN. If so, identify single return and jump to page 3
            if (search.length === 10) {
                // Is clean UKPRN, see if it matches
                for (var idx = 0; idx < req.session.data['providers'].length; idx++) {
                    row = req.session.data['providers'][idx]
                    if (row[0] === search) {
                        // We have a match
                    }
                }
            } else {
                // If digits only, search UKPRNs and build a list. Jump to page 3 if a single match
                // Not a clean UKPRN, might be 0 - n returns
                for (var idx = 0; idx < req.session.data['providers'].length; idx++) {
                    row = req.session.data['providers'][idx]
                    if (row[0].includes(search)) {
                        req.session.data['search-matches'].push(row)
                    }
                }
            }
        } else {
            // Is not just digits so treat as name
            // If not all digits, search names of providers too
            for (var idx = 0; idx < req.session.data['providers'].length; idx++) {
                row = req.session.data['providers'][idx]
                if (row[0].toLowerCase().includes(search) === true || row[1].toLowerCase().includes(search) === true) {
                    req.session.data['search-matches'].push(row)
                }
            }
        }

        res.redirect('/1-3/AO/ao-new-provider-add-02')
    })

    router.get('/1-3/AO/action-add-centre-single-02', function (req, res) {
        // Get index of selected provider
        var idx = req.query['index']
        req.session.data['add-ao-selected'] = req.session.data['search-matches'][idx]
        console.log('Processing 2', req.session.data['add-ao-selected'])
        res.redirect('/1-3/AO/ao-new-provider-add-03')
    })

    router.post('/1-3/AO/action-add-centre-single-03', function (req, res) {
        // Gather selected T Levels from checklist into a list
        console.log("T Levels = ", req.session.data['select-tLevel'])
        res.redirect('/1-3/AO/ao-new-provider-add-04')
    })


    // ADD STUDENTS PROCESSES

    router.post('/1-3/AO/action-students-question-next', function (req, res) {
        req.session.data['errors'] = []
        var answer = req.session.data['learner-question']
        if (answer === 'add-one') {
            res.redirect('ao-add-student-single-01')
        } else if (answer === 'add-lots') {
            res.redirect('ao-view-students') // page is a stub
        } else if (answer === 'edit') {
            res.redirect('ao-view-student') // page is a stub
        } else if (answer === 'delete') {
            res.redirect('ao-view-students') // page is a stub
        } else {
            // Errors! No T Level selected
            req.session.data['errors'] = []
            error = ['#01', 'Tell us what you need to do']
            req.session.data['errors'].push(error)
            res.redirect('/1-3/AO/ao-view-students')
        }
    })

    router.post('/1-3/AO/action-add-student-single-01', function (req, res) {
        /*
        User first selects the T Level the learner is doing
        */
        res.redirect('/1-3/AO/ao-add-student-single-02')
    })

    router.post('/1-3/AO/action-add-student-single-02', function (req, res) {
        /*
        First, check for errors (has a radio button been clicked). If so, go onto next, else error
        */
        req.session.data['errors'] = []
        var tlevel = req.session.data['student-tlevel']
        if (tlevel === undefined) {
            // Errors! No T Level selected
            error = ['#01', 'Select a T Level']
            req.session.data['errors'].push(error)
            res.redirect('/1-3/AO/ao-add-student-single-01')
        } else {
            res.redirect('/1-3/AO/ao-add-student-single-02')
        }
    })

    router.post('/1-3/AO/action-add-student-single-03', function (req, res) {
        /*
        Check that a date radio button has been selected. If so, go onto next, else error
        */
        // For now, this just shunts onto page 2
        //checkIfActive(req)
        req.session.data['errors'] = []
        var year = req.session.data['student-year']
        if (year === undefined) {
            // Errors! No year selected
            error = ['#01', 'Select a year the learner will start their course']
            req.session.data['errors'].push(error)
            res.redirect('/1-3/AO/ao-add-student-single-02')
        } else {
            res.redirect('/1-3/AO/ao-add-student-single-03')
        }
    })

    router.post('/1-3/AO/action-add-student-single-04', function (req, res) {
        /*
        Check ULN is valid, if so go onto final page
        */
        // For now, this just shunts onto page 4 (check your answers)
        // data['ao-tLevels-tmp']
        //checkIfActive(req)
        req.session.data['errors'] = []
        var uln = req.session.data['student-uln']
        if (uln.length < 10) {
            error = ['#01', 'The ULN you provided is not of a correct format']
            req.session.data['errors'].push(error)
            res.redirect('/1-3/AO/ao-add-student-single-03')
        } else {
            res.redirect('/1-3/AO/ao-add-student-single-04')
        }
    })

    router.post('/1-3/AO/action-add-student-single-check', function (req, res) {
        req.session.data['errors'] = []
        var ukprn = req.session.data['provider-ukprn']
        if (ukprn.length < 8) {
            error = ['#01', 'The UKPRN you provided is not of a correct format']
            req.session.data['errors'].push(error)
            res.redirect('/1-3/AO/ao-add-student-single-04')
        }
        res.redirect('/1-3/AO/ao-add-student-single-check')
    })

    router.post('/1-3/AO/action-view-students-details', function (req, res) {
        // Accepts a ULN ('uln-view') and returns all the details
        req.session.data['errors'] = []
        var uln = req.session.data['uln-view']
        if (uln.length < 10) {
            // Error routine - this is very basic validation
            error = ['#01', 'The ULN you provided is not of a correct format']
            req.session.data['errors'].push(error)
            res.redirect('/1-3/AO//ao-view-student')
        } else {
            // Find record with uln
            for (idx in req.session.data['students-ao-tmp']) {
                if (req.session.data['students-ao-tmp'][idx][0] == uln) {
                    line = req.session.data['students-ao-tmp'][idx].slice(0, req.session.data['students-ao-tmp'][idx].length)
                    break
                }
            }
            // Save record as appropriate session variable
            req.session.data['student'] = line
            // Call appropriate page with those data
            res.redirect('/1-3/AO/ao-views-student')
        }
    })

    router.post('/1-3/AO/action-ao-add-students-bulk', function (req, res) {
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


            req.session.data['students-ao'].unshift(line)
        }
        req.session.data['students-ao-tmp'] = req.session.data['students-ao']
        res.redirect('/1-3/AO/action-ao-view-students')
    })

    router.post('/1-3/AO/action-add-student-single-confirm', function (req, res) {
        /*
        Takes the new student's details entered by the user and adds it.
        */
        // Currently just returns to the ??? page
        //checkIfActive(req)
        var tl = req.session.data['tLevels-ao'][req.session.data['student-tlevel']]
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
            req.session.data['student-year'],
            '',
            '',
            '']
        req.session.data['students-ao'].unshift(line)
        //res.redirect('/1-3/AO/ao-add-student-single-confirm')
        req.session.data['added'] = true
        res.render('1-3/AO/ao-view-students', { 'added': true })
        req.session.data['errors'] = []
        req.session.data['learner-question'] = []
        req.session.data['student-tlevel'] = []
        req.session.data['student-year'] = []
        req.session.data['student-uln'] = []
        req.session.data['provider-ukprn'] = []
    })

    router.post('/1-3/AO/action-import-providers-single', function (req, res) {
        /*
        Takes the single entered record from user preview and brings it into the main catalogue.
        */
        // First check variables are initialised
        //checkIfActive(req)
        res.redirect('/1-3/AO/hub')
    })

    router.get('/1-3/AO/action-ao-view-students', function (req, res) {
        /*
        Pagination!
        */
        //checkIfActive(req)
        if (req.query.pageNumber === undefined) {
            req.session.data['reqPageNumber'] = 1
        } else {
            req.session.data['reqPageNumber'] = req.query.pageNumber
        }
        req.session.data['highestPage'] = parseInt(req.session.data['students-ao-tmp'].length / 10) + 1
        if (req.session.data['students-ao-tmp'].length % 10 === 0) {
            req.session.data['highestPage'] = parseInt(req.session.data['students-ao-tmp'].length / 10) + 1
        } else {
            req.session.data['highestPage'] = parseInt(req.session.data['students-ao-tmp'].length / 10) + 2
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
        res.redirect('/1-3/AO/ao-view-students')
    })

    router.get('/1-3/AO/action-ao-views-student', function (req, res) {
        /*
        Views a single student's account (and possibly allows editing/deletion?)
        */
        //checkIfActive(req)
        uln = req.query.uln
        if (req.session.data['students-ao'] === undefined) {
            initialiseVariables(req)
        }
        // Get student record from ULN
        for (idx in req.session.data['students-ao-tmp']) {
            if (req.session.data['students-ao-tmp'][idx][0] == uln) {
                line = req.session.data['students-ao-tmp'][idx].slice(0, req.session.data['students-ao-tmp'][idx].length)
                break
            }
        }
        // Populate session variable ('student')
        req.session.data['student'] = line
        res.redirect('/1-3/AO/ao-views-student')
    })

    router.get('/1-3/AO/action-search-students', function (req, res) {
        /*
        Searches through the list of students and spits out the results page
        */
        // Get search variables
        var searchPhrase = req.session.data['search-phrase'].toLowerCase()
        var tLevel = req.session.data['search-tLevel']
        var providerName = req.session.data['search-provider']
        var startDate = req.session.data['search-start-date']
        var studentStatus = req.session.data['search-status']

        // Construct empty set to store results
        req.session.data['students-ao-tmp'] = []

        // Filter through students to get results
        req.session.data['students-ao'].forEach(function (row, idx) {
            req.session.data['students-ao-tmp2'] = row.slice(0, 11)
            elementFlag = false
            req.session.data['students-ao-tmp2'].forEach(function (element, idy) {
                if (element.toLowerCase().includes(searchPhrase)) {
                    elementFlag = true
                } /* else if (tLevel != undefined) {
                    if (tLevel.includes(req.session.data['students-ao'][idx][14]) || tLevel.includes(req.session.data['students-ao'][idx][15])) {
                        req.session.data['students-ao-tmp'].push(req.session.data['students-ao'][idx])
                        break
                    }
                } else if (providerName != undefined) {
                    if (req.session.data['students-ao'][idx][10].includes(providerName) || req.session.data['students-ao'][idx][11].includes(providerName)) {
                        req.session.data['students-ao-tmp'].push(req.session.data['students-ao'][idx])
                        break
                    }
                } else if (startDate != undefined) {
                    if (req.session.data['students-ao'][idx][16].includes(startDate)) {
                        req.session.data['students-ao-tmp'].push(req.session.data['students-ao'][idx])
                        break
                    }
                } else if (studentStatus != undefined) {
                    if (req.session.data['students-ao'][idx][12].includes(studentStatus)) {
                        req.session.data['students-ao-tmp'].push(req.session.data['students-ao'][idx])
                        break
                    }
                } */
            })
            if (elementFlag === true) {
                req.session.data['students-ao-tmp'].push(row)
            }
            elementFlag = false
        })

        // Reconstruct page, pagination first
        if (req.query.pageNumber === undefined) {
            req.session.data['reqPageNumber'] = 1
        } else {
            req.session.data['reqPageNumber'] = req.query.pageNumber
        }
        req.session.data['highestPage'] = parseInt(req.session.data['students-ao-tmp'].length / 10) + 1
        if (req.session.data['students-ao-tmp'].length % 10 === 0) {
            req.session.data['highestPage'] = parseInt(req.session.data['students-ao-tmp'].length / 10) + 1
        } else {
            req.session.data['highestPage'] = parseInt(req.session.data['students-ao-tmp'].length / 10) + 2
        }
        req.session.data['maximumPage'] = req.session.data['reqPageNumber'] * 10
        req.session.data['minimumPage'] = req.session.data['maximumPage'] - 10
        req.session.data['pagesAvailable'] = []
        for (idx = req.session.data['reqPageNumber'] - 2; idx < parseInt(req.session.data['reqPageNumber']) + 3; idx++) {
            if (idx > 0 && idx < req.session.data['highestPage']) {
                req.session.data['pagesAvailable'].push(idx)
            }
        }

        //req.session.data['students-ao-tmp'] = req.session.data['students-ao']
        res.redirect('/1-3/AO/ao-view-students?pageNumber=' + queryString)

    })

    router.get('/1-3/AO/action-clear-students-search', function (req, res) {
        req.session.data['search-phrase'] = ''
        req.session.data['search-tLevel'] = undefined
        req.session.data['search-provider'] = undefined
        req.session.data['search-start-date'] = undefined
        req.session.data['search-status'] = undefined
        req.session.data['students-ao-tmp'] = req.session.data['students-ao']
        res.redirect('/1-3/AO/action-ao-view-students')
    })

    router.get('/1-3/AO/action-clear-providers-search', function (req, res) {
        req.session.data['search-phrase-pr'] = ''
        req.session.data['providers-tmp'] = req.session.data['providers']
        req.session.data['currentPage'] = 1
        res.redirect('/1-3/AO/action-ao-providers')
    })

    router.get('/1-3/AO/action-upload-assessments', function (req, res) {

        res.redirect('/1-3/AO/ao-add-assessments')
    })
}
