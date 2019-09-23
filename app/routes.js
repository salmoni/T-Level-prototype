const express = require('express')
const router = express.Router()

// Add your routes here - above the module.exports line



module.exports = router
require('./routes/routes-1-0.js')(router)
require('./routes/routes-1-1.js')(router)
//checkIfActive(router.req)
