const yargs = require('yargs') //parses command line arguements
const meta = require('./metawrite')

//writes metadata to file named "last-meta"

// get meta data
yargs.command('get [pn]', 'downloads packages metadata (if it exists)', (yargs) => {
        yargs.positional('pn', {
            describe: 'package name',
            default: 'chalk',
        })
    }, (argv) => {
        meta.getMeta(argv.pn)
}).argv

//get dependecies graph
yargs.command('bd', 'builds graph of dependencies based of the last loaded metadata file', () => {
    
})


