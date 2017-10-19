#! /usr/bin/env node
const yargs = require('yargs')
const path = require('path')
const { exportProjects, archiveProjects } = require('./exporter')

const COMMAND = {
  ARCHIVE: 'archive',
  EXPORT: 'export'
}

const argv = yargs.command({
  command: '* <srcDirectory> [targetDirectory]',
  desc: 'Exports projects from <srcDirectory> to [targetDirectory]',
  builder: (yargs) => yargs.default('command', COMMAND.EXPORT)
}).command({
  command: COMMAND.EXPORT + ' <srcDirectory> [targetDirectory]',
  desc: 'Exports projects from <srcDirectory> to [targetDirectory]',
  builder: (yargs) => yargs.default('command', COMMAND.EXPORT)
}).command({
  command: COMMAND.ARCHIVE + ' <srcDirectory> [targetArchive]',
  desc: 'Archives projects from <srcDirectory> to [targetArchive].zip',
  builder: (yargs) => yargs.default('command', COMMAND.ARCHIVE)
})
.help()
.argv

if (!argv.command || (argv.command !== COMMAND.ARCHIVE && argv.command !== COMMAND.EXPORT)) {
  console.log('Please provide a valid command')
  process.exit()
}

if (argv.srcDirectory === '.' || argv.srcDirectory === '..') {
  console.log('Please provide valid directory name')
  process.exit()
}

const srcDirectory = path.join(process.cwd(), argv.srcDirectory)

if (argv.command === COMMAND.EXPORT) {
  console.log('Export in progress ...')
  argv.targetDirectory ? exportProjects(srcDirectory, path.join(process.cwd(), argv.targetDirectory)) : exportProjects(srcDirectory)
}

if (argv.command === COMMAND.ARCHIVE) {
  console.log('Archiving in progress ...')
  argv.targetArchive ? archiveProjects(srcDirectory, path.join(process.cwd(), argv.targetArchive)) : archiveProjects(srcDirectory)
}

console.log('Job has been finished')
