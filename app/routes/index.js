console.log('Found index.js')
var fs = require('fs');

module.exports = function(router){
    console.log('Acting on index.js')

    fs.readdirSync(__dirname).forEach(function(file) {
        if (file == "index.js") return;
        var name = file.substr(0, file.indexOf('.'));
        require('./' + name)(router);
    });
}
