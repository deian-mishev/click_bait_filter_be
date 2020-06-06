const fs = require('fs');
const util = require('util');
const log_file = fs.createWriteStream(__dirname + '/../debug.log', { flags: 'a' });
const log_stdout = process.stdout;

module.exports.config = () => {
    console.log = function (d) {
        if (!d.errno || d.errno !== -2) {
            log_file.write(util.format(d) + '\n');
            log_stdout.write(util.format(d) + '\n');
        }
    };
}