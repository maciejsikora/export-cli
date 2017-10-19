const path = require('path')
const fs = require('fs')
const fsX = require('fs-extra')
const klawSync = require('klaw-sync')
const archiver = require('archiver')

const projectTipicalFiles = ['package.json']
const ignoredDirs = {
  node_modules: 'node_modules',
  git: '.git'
}
const ignoredDirsRegexp = {
  node_modules: new RegExp(/^node_modules$/),
  git: new RegExp(/^\.git$/)
}

/** PUBLIC */

function exportProjects (srcDirectory, targetDirectory = getExportDirectoryPath(srcDirectory)) {
  copyToTarget(srcDirectory, targetDirectory)
}

function archiveProjects (srcDirectory, targetArchivePath = null) {
  const targetDirectory = getExportDirectoryPath(srcDirectory)
  targetArchivePath = targetArchivePath ? targetArchivePath + '.zip' : targetDirectory + '.zip'
  copyToTarget(srcDirectory, targetDirectory)
  zip(targetDirectory, targetArchivePath, () => cleanTarget(targetDirectory))
}

/** PUBLIC */

function getExportDirectoryPath (srcDirectory) {
  return srcDirectory + '-export-' + (new Date()).getTime()
}

function zip (directory, zipFile, closeCallback) {
  const output = fs.createWriteStream(zipFile)
  const archive = archiver('zip', {
    zlib: { level: 9 } // Sets the compression level.
  })

  output.on('close', closeCallback)

  archive.on('error', function (err) {
    throw err
  })

  archive.pipe(output)
  archive.directory(directory, '')
  archive.finalize()
}

function findProjects (directory) {
  const filter = item => item.path.indexOf(ignoredDirs.node_modules) < 0 && item.path.indexOf(ignoredDirs.git) < 0
  const dirs = klawSync(directory, { nofile: true, filter, noRecurseOnFailedFilter: true })
  return dirs.filter((dir) => isDirProject(dir.path))
}

function isDirProject (directory) {
  return fs.readdirSync(directory).findIndex(file => projectTipicalFiles.findIndex(element => element === file) !== -1) !== -1
}

function getDirectoryNameFromPath (path) {
  let separator = '/'
  if (path.indexOf(separator) === -1) {
    separator = '\\'
  }
  return path.split(separator).pop()
}

function copyManyProjectsToTarget (srcDirectory, targetDirectory) {
  findProjects(srcDirectory).forEach((dir) => {
    copySingleToTarget(dir.path, path.join(targetDirectory, getDirectoryNameFromPath(dir.path)))
  })
}

function copySingleToTarget (srcDirectory, targetDirectory) {
  fsX.copySync(srcDirectory, targetDirectory, {
    filter: (fileOrDir) => !getDirectoryNameFromPath(fileOrDir).match(ignoredDirsRegexp.node_modules) &&
    !getDirectoryNameFromPath(fileOrDir).match(ignoredDirsRegexp.git)
  })
}

function copyToTarget (srcDirectory, targetDirectory) {
  isDirProject(srcDirectory) ? copySingleToTarget(srcDirectory, targetDirectory) : copyManyProjectsToTarget(srcDirectory, targetDirectory)
}

function cleanTarget (targetDirectory) {
  fsX.removeSync(targetDirectory)
}

module.exports = {
  exportProjects,
  archiveProjects
}
