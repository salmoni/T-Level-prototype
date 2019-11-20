module.exports = function (router) {


    router.get('/1-2/AO/action-reload-data', function (req, res) {
        // Reloads the fake data and returns to the source page
        sourcePage = req.headers.referer
        req.session.data['staff-role'] = 'admin'
        checkIfActive(req)
        res.redirect(sourcePage)
    })

    router.post('/1-2/AO/ao-my-services', function (req, res) {
        if (req.session.data['Signin-username'] === 'admin') {
            req.session.data['staff-role'] = 'admin'
        } else {
            req.session.data['staff-role'] = 'staff'
        }
        //checkIfActive(req)
        res.redirect('/1-2/AO/hub')
    })

    router.get('/1-2/AO/action-ao-verify-tLevels', function (req, res) {
        req.session.data['req_tLevel'] = []
        req.session.data['requested_tLevel'] = req.query.tl
        for (tlevel of req.session.data['tLevels-ao']) {
            if (tlevel[7] === req.session.data['requested_tLevel']) {
                req.session.data['req_tLevel'] = tlevel
            }
        }
        res.redirect('/1-2/AO/ao-verify-tLevels')
    })

    router.get('/1-2/AO/action-verify-single-tLevel', function (req, res) {
        for (idx = 0; idx < req.session.data['tLevels-ao'].length; idx++) {
            if (req.session.data['tLevels-ao'][idx][7] === req.session.data['requested_tLevel']) {
                req.session.data['tLevels-ao'][idx][6] = "Verified"
            }
        }
        res.redirect('/1-2/AO/ao-t-levels')
    })

    router.get('/1-2/AO/action-ao-providers', function (req, res) {
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

        res.redirect('/1-2/AO/ao-providers')
    })

    router.get('/1-2/AO/action-search-providers', function (req, res) {
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

        res.redirect('/1-2/AO/ao-providers')
    })

    router.get('/1-2/AO/action-ao-views-provider', function (req, res) {
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
        res.redirect('/1-2/AO/ao-views-provider')
    })

    router.post('/1-2/AO/action-import-providers-single', function (req, res) {
        /*
        Takes the single entered record from user preview and brings it into the main catalogue.
        */
        // First check variables are initialised
        //checkIfActive(req)
        res.redirect('/1-2/AO/ao-providers')
    })

    router.post('/1-2/AO/action-edit-providers-single', function (req, res) {
        /* 
        Accepts edits to a provider's details
        */
        // First check variables are initialised
        //checkIfActive(req)
        res.redirect('/1-2/AO/ao-providers')
    })

    router.post('/1-2/AO/action-ao-add-providers-bulk', function (req, res) {
        /*
        Adds students in bulk
        */
        console.log(req.session.data['providers-added'])

        req.session.data['providers'] = req.session.data['providers'].concat(req.session.data['providers-added'])
        req.session.data['providers-tmp'] = req.session.data['providers']

        res.redirect('/1-2/AO/action-ao-providers')
    })


    router.post('/1-2/AO/action-add-student-single-02', function (req, res) {
        /*
        User has entered ULN and UKPRN. User now has to specify the year a T Level starts and then the T Level
        */
        // For now, this just shunts onto page 2
        //checkIfActive(req)
        res.redirect('/1-2/AO/ao-add-student-single-02')
    })

    router.post('/1-2/AO/action-add-student-single-03', function (req, res) {
        /*
        User has entered ULN and UKPRN and year. User now has to specify the T Level from a list 
        of T Levels this AO is running in the right year
        */
        // For now, this just shunts onto page 4 (check your answers)
        // data['ao-tLevels-tmp']
        //checkIfActive(req)
        year = req.session.data['provider-year']
        req.session.data['ao-tLevels-tmp'] = []
        for (tls in req.session.data['ao-tLevels']) {
            if (tls[2] === year.slice(0, 4)) {
                req.session.data['ao-tLevels-tmp'].push(tls)
            }
        }
        req.session.save()
        res.redirect('/1-2/AO/ao-add-student-single-03')
    })

    router.post('/1-2/AO/action-ao-add-students-bulk', function (req, res) {
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
        res.redirect('/1-2/AO/action-ao-view-students')
    })

    router.post('/1-2/AO/action-add-student-single-confirm', function (req, res) {
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
            req.session.data['provider-year'],
            '',
            '',
            '']
        req.session.data['students-ao'].unshift(line)
        res.redirect('/1-2/AO/ao-view-students')
    })

    router.post('/1-2/AO/action-import-providers-single', function (req, res) {
        /*
        Takes the single entered record from user preview and brings it into the main catalogue.
        */
        // First check variables are initialised
        //checkIfActive(req)
        res.redirect('/1-2/AO/hub')
    })

    router.get('/1-2/AO/action-ao-view-students', function (req, res) {
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
        res.redirect('/1-2/AO/ao-view-students?pageNumber=' + queryString)
    })

    router.get('/1-2/AO/action-ao-views-student', function (req, res) {
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
        res.redirect('/1-2/AO/ao-views-student')
    })

    router.get('/1-2/AO/action-search-students', function (req, res) {
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
        res.redirect('/1-2/AO/ao-view-students?pageNumber=' + queryString)

    })

    router.get('/1-2/AO/action-clear-students-search', function (req, res) {
        req.session.data['search-phrase'] = ''
        req.session.data['search-tLevel'] = undefined
        req.session.data['search-provider'] = undefined
        req.session.data['search-start-date'] = undefined
        req.session.data['search-status'] = undefined
        req.session.data['students-ao-tmp'] = req.session.data['students-ao']
        res.redirect('/1-2/AO/action-ao-view-students')
    })

    router.get('/1-2/AO/action-clear-providers-search', function (req, res) {
        req.session.data['search-phrase-pr'] = ''
        req.session.data['providers-tmp'] = req.session.data['providers']
        req.session.data['currentPage'] = 1
        res.redirect('/1-2/AO/action-ao-providers')
    })

    router.get('/1-2/AO/action-upload-assessments', function (req, res) {

        res.redirect('/1-2/AO/ao-add-assessments')
    })
}
