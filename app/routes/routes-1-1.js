console.log('Found routes-1-1.js')
module.exports = function (router) {


    function initialiseVariables(req) {
        /*
        Sets up variables for the session
        */
        // AO to be used
        req.session.data['ao'] = "NCFE"
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
        var filename = 'app/views/1-0/AO/data/Students_v1.1.csv'
        fs.readFile(filename, function (err, buf) {
            data = buf.toString().split(/\r?\n/)
            for (idx = 0; idx < data.length; idx++) {
                line = data[idx].split('\t')
                req.session.data['students'].push(line)
                req.session.save()
            }
        })

        // Accounts
        req.session.data['accounts'] = []
        var filename = 'app/views/1-0/AO/data/Accounts_v1.1.csv'
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
        console.log('Checking if session vars are active')
        if (req.session.data['activeFlag'] == undefined || req.session.data['activeFlag'] == false) {
            initialiseVariables(req)
        }
        return
    }

    router.post('/1-1/AO/ao-my-services', function (req, res) {
        console.log("signed in 1-1")
        if (req.session.data['Signin-username'] === 'admin') {
            req.session.data['staff-role'] = 'admin'
        } else {
            req.session.data['staff-role'] = 'staff'
        }
        checkIfActive(req)
        res.redirect('/1-1/AO/ao-my-services')
    })




}
