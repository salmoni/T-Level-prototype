module.exports = function (router) {


    function initialiseVariables(req) {
        /*
        Sets up variables for the session
        */
        // AO to be used
        req.session.data['ao-long'] = "Pearson (10022490)"
        req.session.data['ao-long'] = "NCFE (10022731)"
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

    router.post('/1-1/AO/ao-my-services', function (req, res) {
        if (req.session.data['Signin-username'] === 'admin') {
            req.session.data['staff-role'] = 'admin'
        } else {
            req.session.data['staff-role'] = 'staff'
        }
        checkIfActive(req)
        res.redirect('/1-1/AO/ao-my-services')
    })

    router.get('/1-1/AO/action-ao-views-provider', function (req, res) {
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




}
