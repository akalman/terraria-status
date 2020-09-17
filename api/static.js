const fs = require('fs');

exports.index = () => fs.readFileSync('index.html', 'utf-8');
